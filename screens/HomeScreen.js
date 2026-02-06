import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useGame } from '../context/GameContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const {
    count,
    setCount,
    clickBonus,
    cpsBonus,
  } = useGame();

  // Логика клика
  const handleClick = useCallback(() => {
    setCount(prev => prev + clickBonus);
  }, [clickBonus, setCount]);

  // Форматирование текста для оптимизации рендеров
  const energyText = useMemo(() => count.toLocaleString(), [count]);
  const cpsText = useMemo(() => `CPS: ${cpsBonus}`, [cpsBonus]);
  const clickPowerText = useMemo(() => `Click Power: ${clickBonus}`, [clickBonus]);

  return (
    <View style={styles.container}>
      {/* Навигация */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabActive}>
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('Shop')}
        >
          <Text style={styles.tabText}>Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.tabText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Основной контент */}
      <View style={styles.centerContainer}>
        <Text style={styles.energyLabel}>Energy</Text>
        <Text style={styles.energyValue}>{energyText}</Text>
        
        {/* Информационная панель (CPS и Сила клика) */}
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>{cpsText}</Text>
          <Text style={styles.statsSeparator}>|</Text>
          <Text style={styles.statsText}>{clickPowerText}</Text>
        </View>

        <TouchableOpacity 
          style={styles.circleButton} 
          onPress={handleClick}
          activeOpacity={0.7}
        >
          {/* Пустой круг */}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#cccccc',
    paddingTop: StatusBar.currentHeight || 40,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#aaaaaa',
  },
  tabText: {
    fontSize: 16,
    color: '#000000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  energyLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  energyValue: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  statsText: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
  statsSeparator: {
    marginHorizontal: 15,
    fontSize: 16,
    color: '#ccc',
  },
  circleButton: {
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: (width * 0.55) / 2,
    backgroundColor: '#999999',
    elevation: 5, // тень для Android
    shadowColor: '#000', // тень для iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});