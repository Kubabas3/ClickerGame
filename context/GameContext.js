import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [clickBonus, setClickBonus] = useState(1);
  const [cpsBonus, setCpsBonus] = useState(0);
  const [upgradeCounts, setUpgradeCounts] = useState({});

  // Загрузка сохранённых данных
  useEffect(() => {
  const loadData = async () => {
    try {
      const savedCount = await AsyncStorage.getItem('clickCount');
      const savedBonus = await AsyncStorage.getItem('clickBonus');
      const savedCps = await AsyncStorage.getItem('cpsBonus');
      const savedUpgrades = await AsyncStorage.getItem('upgradeCounts');

      setCount(savedCount !== null && !isNaN(+savedCount) ? +savedCount : 0);
      setClickBonus(savedBonus !== null && !isNaN(+savedBonus) ? +savedBonus : 1);
      setCpsBonus(savedCps !== null && !isNaN(+savedCps) ? +savedCps : 0);
      setUpgradeCounts(savedUpgrades ? JSON.parse(savedUpgrades) : {});
    } catch (e) {
      console.log('❌ Failed to load data:', e);
      setCount(0);
      setClickBonus(1);
      setCpsBonus(0);
      setUpgradeCounts({});
    } finally {
      setIsLoading(false); // <-- теперь данные точно загружены
    }
  };

  loadData();
}, []);


  // Сохраняем данные
 useEffect(() => {
  if (!isLoading) {
    AsyncStorage.setItem('clickCount', count.toString());
  }
}, [count, isLoading]);

useEffect(() => {
  if (!isLoading) {
    AsyncStorage.setItem('clickBonus', clickBonus.toString());
  }
}, [clickBonus, isLoading]);

useEffect(() => {
  if (!isLoading) {
    AsyncStorage.setItem('cpsBonus', cpsBonus.toString());
  }
}, [cpsBonus, isLoading]);

useEffect(() => {
  if (!isLoading) {
    AsyncStorage.setItem('upgradeCounts', JSON.stringify(upgradeCounts));
  }
}, [upgradeCounts, isLoading]);

  // Автоклики каждую секунду
  useEffect(() => {
  if (!isLoading) {
    const interval = setInterval(() => {
      setCount((prev) => prev + cpsBonus);
    }, 1000);
    return () => clearInterval(interval);
  }
}, [cpsBonus, isLoading]);


  return (
    <GameContext.Provider
      value={{
        count,
        setCount,
        clickBonus,
        setClickBonus,
        cpsBonus,
        setCpsBonus,
        upgradeCounts,
        setUpgradeCounts,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
