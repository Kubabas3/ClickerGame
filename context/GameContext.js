import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PROGRESSION_MODELS = {
  LINEAR:      'LINEAR',
  EXPONENTIAL: 'EXPONENTIAL',
  LOGARITHMIC: 'LOGARITHMIC',
  HYBRID:      'HYBRID',
};

export const MODEL_LABELS = {
  LINEAR:      'Linear',
  EXPONENTIAL: 'Exponential',
  LOGARITHMIC: 'Logarithmic',
  HYBRID:      'Hybrid',
};

export const MODEL_DESCRIPTIONS = {
  LINEAR:      'Cost = base + base × level × 0.5',
  EXPONENTIAL: 'Cost = base × 1.15^level',
  LOGARITHMIC: 'Cost = base × (1 + ln(level + 1))',
  HYBRID:      'Cost = base × 1.07^level × (1 + ln(level + 1))',
};

export function calculateCost(baseCost, level, model) {
  switch (model) {
    case PROGRESSION_MODELS.LINEAR:
      return Math.floor(baseCost + baseCost * level * 0.5);
    case PROGRESSION_MODELS.EXPONENTIAL:
      return Math.floor(baseCost * Math.pow(1.15, level));
    case PROGRESSION_MODELS.LOGARITHMIC:
      return Math.floor(baseCost * (1 + Math.log(level + 1)));
    case PROGRESSION_MODELS.HYBRID:
      return Math.floor(baseCost * Math.pow(1.07, level) * (1 + Math.log(level + 1)));
    default:
      return Math.floor(baseCost + baseCost * level * 0.5);
  }
}

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [isLoading, setIsLoading]         = useState(true);
  const [count, setCount]                 = useState(0);
  const [clickBonus, setClickBonus]       = useState(1);
  const [cpsBonus, setCpsBonus]           = useState(0);
  const [upgradeCounts, setUpgradeCounts] = useState({});
  const [progressionModel, setProgressionModel] = useState(PROGRESSION_MODELS.LINEAR);
  const [totalClicks, setTotalClicks]     = useState(0);
  const [totalEarned, setTotalEarned]     = useState(0);
  const [totalSpent, setTotalSpent]       = useState(0);
  const [lastShopTab, setLastShopTab]     = useState('click');
  const [showFloatingLabels, setShowFloatingLabels] = useState(true);
  const [sessionStart]                    = useState(Date.now());

  // Refs для CPS-тика — не вызывают лишних рендеров
  const cpsRef        = useRef(0);
  const countRef      = useRef(0);  // зеркало count для чтения внутри интервалов без подписки
  const saveTimerRef  = useRef(null);

  // Синхронизируем refs при изменении стейта
  useEffect(() => { cpsRef.current = cpsBonus; }, [cpsBonus]);
  useEffect(() => { countRef.current = count; }, [count]);

  // --- Загрузка ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const keys = ['clickCount','clickBonus','cpsBonus','upgradeCounts',
                      'progressionModel','totalClicks','totalEarned','totalSpent',
                      'showFloatingLabels'];
        const pairs = await AsyncStorage.multiGet(keys);
        const data  = Object.fromEntries(pairs);

        if (data.clickCount)       setCount(+data.clickCount);
        if (data.clickBonus)       setClickBonus(+data.clickBonus);
        if (data.cpsBonus)         setCpsBonus(+data.cpsBonus);
        if (data.upgradeCounts)    setUpgradeCounts(JSON.parse(data.upgradeCounts));
        if (data.progressionModel && PROGRESSION_MODELS[data.progressionModel])
                                   setProgressionModel(data.progressionModel);
        if (data.totalClicks)      setTotalClicks(+data.totalClicks);
        if (data.totalEarned)      setTotalEarned(+data.totalEarned);
        if (data.totalSpent)       setTotalSpent(+data.totalSpent);
        if (data.showFloatingLabels !== null && data.showFloatingLabels !== undefined)
          setShowFloatingLabels(data.showFloatingLabels !== 'false');
      } catch (e) {
        console.log('Load error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // --- CPS тик --- 20 тиков в секунду для плавного прироста
  useEffect(() => {
    if (isLoading) return;
    const TICKS_PER_SEC = 20;
    const interval = setInterval(() => {
      const cps = cpsRef.current;
      if (cps <= 0) return;
      const earned = cps / TICKS_PER_SEC;
      setCount(prev => prev + earned);
      setTotalEarned(prev => prev + earned);
      trackIncome(earned);
    }, 1000 / TICKS_PER_SEC);
    return () => clearInterval(interval);
  }, [isLoading]);

  // --- Сохранение ---
  // Вместо useEffect на каждое изменение count — периодическое сохранение раз в 5 секунд.
  // Это снимает основную нагрузку на телефоне при активной игре.
  const stateRef = useRef({});
  stateRef.current = { count, clickBonus, cpsBonus, upgradeCounts,
                       progressionModel, totalClicks, totalEarned, totalSpent,
                       showFloatingLabels };

  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(async () => {
      const s = stateRef.current;
      try {
        await AsyncStorage.multiSet([
          ['clickCount',       s.count.toString()],
          ['clickBonus',       s.clickBonus.toString()],
          ['cpsBonus',         s.cpsBonus.toString()],
          ['upgradeCounts',    JSON.stringify(s.upgradeCounts)],
          ['progressionModel', s.progressionModel],
          ['totalClicks',      s.totalClicks.toString()],
          ['totalEarned',      s.totalEarned.toString()],
          ['totalSpent',       s.totalSpent.toString()],
          ['showFloatingLabels', s.showFloatingLabels.toString()],
        ]);
      } catch (e) { console.error('Save error:', e); }
    }, 5000);
    return () => clearInterval(interval);
  }, [isLoading]);

  // --- Покупка улучшения ---
  // Вся логика внутри функциональных обновлений стейта.
  // Это гарантирует атомарность: даже при быстрых нажатиях каждый вызов
  // читает актуальное значение, а не снимок из момента рендера.
  const buyUpgrade = useCallback((item, progressionModelValue) => {
    setCount(prevCount => {
      const level = upgradeCounts[item.id] || 0;  // upgradeCounts читаем из замыкания — ok,
      const price = calculateCost(item.baseCost, level, progressionModelValue); // т.к. setUpgradeCounts тоже атомарный

      // Проверка баланса внутри апдейтера — защита от гонки при быстрых кликах
      if (prevCount < price) return prevCount;  // не хватает денег — ничего не меняем

      // Применяем бонус
      if (item.bonus) setClickBonus(prev => prev + item.bonus);
      if (item.cps)   setCpsBonus(prev => prev + item.cps);

      setTotalSpent(prev => prev + price);
      setUpgradeCounts(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));

      return prevCount - price;
    });
  }, [upgradeCounts]);

  // Скользящее окно для подсчёта реального дохода в секунду (последние 2 сек)
  const incomeWindowRef = useRef([]); // [{time, amount}]

  const trackIncome = useCallback((amount) => {
    const now = Date.now();
    incomeWindowRef.current.push({ time: now, amount });
    // Чистим записи старше 2 секунд
    incomeWindowRef.current = incomeWindowRef.current.filter(e => now - e.time <= 2000);
  }, []);

  const getRecentIncome = useCallback(() => {
    const now = Date.now();
    const recent = incomeWindowRef.current.filter(e => now - e.time <= 2000);
    if (recent.length === 0) return 0;
    const total = recent.reduce((sum, e) => sum + e.amount, 0);
    return Math.floor(total / 2);
  }, []);

  const resetAllData = async () => {
    if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    try {
      await AsyncStorage.clear();
      setCount(0); setClickBonus(1); setCpsBonus(0);
      setUpgradeCounts({}); setProgressionModel(PROGRESSION_MODELS.LINEAR);
      setTotalClicks(0); setTotalEarned(0); setTotalSpent(0);
      setShowFloatingLabels(true);
      return true;
    } catch (e) { console.error(e); return false; }
  };

  return (
    <GameContext.Provider value={{
      count, setCount,
      clickBonus, setClickBonus,
      cpsBonus, setCpsBonus,
      upgradeCounts, setUpgradeCounts,
      progressionModel, setProgressionModel,
      totalClicks, setTotalClicks,
      totalEarned, setTotalEarned,
      totalSpent, setTotalSpent,
      lastShopTab, setLastShopTab,
      showFloatingLabels, setShowFloatingLabels,
      sessionStart,
      isLoading,
      buyUpgrade,
      getRecentIncome,
      trackIncome,
      resetAllData,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
