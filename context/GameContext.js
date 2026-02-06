import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PROGRESSION_MODELS = {
  LINEAR: 'LINEAR',
  EXPONENTIAL: 'EXPONENTIAL',
};

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [clickBonus, setClickBonus] = useState(1);
  const [cpsBonus, setCpsBonus] = useState(0);
  const [upgradeCounts, setUpgradeCounts] = useState({});
  const [progressionModel, setProgressionModel] = useState(PROGRESSION_MODELS.LINEAR);

  const cpsRef = useRef(cpsBonus);
  const saveTimeout = useRef(null);

  // Загрузка
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedCount = await AsyncStorage.getItem('clickCount');
        const savedBonus = await AsyncStorage.getItem('clickBonus');
        const savedCps = await AsyncStorage.getItem('cpsBonus');
        const savedUpgrades = await AsyncStorage.getItem('upgradeCounts');
        const savedModel = await AsyncStorage.getItem('progressionModel');

        if (savedCount !== null) setCount(+savedCount);
        if (savedBonus !== null) setClickBonus(+savedBonus);
        if (savedCps !== null) setCpsBonus(+savedCps);
        if (savedUpgrades) setUpgradeCounts(JSON.parse(savedUpgrades));
        if (savedModel && PROGRESSION_MODELS[savedModel]) setProgressionModel(savedModel);
      } catch (e) {
        console.log('❌ Load error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => { cpsRef.current = cpsBonus; }, [cpsBonus]);

  // Автоклики
  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setCount((prev) => prev + cpsRef.current);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  // Автосохранение
  useEffect(() => {
    if (isLoading) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      try {
        const dataToSave = [
          ['clickCount', count.toString()],
          ['clickBonus', clickBonus.toString()],
          ['cpsBonus', cpsBonus.toString()],
          ['upgradeCounts', JSON.stringify(upgradeCounts)],
          ['progressionModel', progressionModel],
        ];
        await AsyncStorage.multiSet(dataToSave);
      } catch (e) { console.error('Save error:', e); }
    }, 2000);

    return () => clearTimeout(saveTimeout.current);
  }, [count, clickBonus, cpsBonus, upgradeCounts, progressionModel, isLoading]);

  // ФУНКЦИЯ ПОЛНОГО СБРОСА
  const resetAllData = async () => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current); // Останавливаем сохранения
    try {
      await AsyncStorage.clear(); // Чистим память устройства
      setCount(0);
      setClickBonus(1);
      setCpsBonus(0);
      setUpgradeCounts({});
      setProgressionModel(PROGRESSION_MODELS.LINEAR);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <GameContext.Provider
      value={{
        count, setCount,
        clickBonus, setClickBonus,
        cpsBonus, setCpsBonus,
        upgradeCounts, setUpgradeCounts,
        progressionModel,
        resetAllData, // Передаем функцию в приложение
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);