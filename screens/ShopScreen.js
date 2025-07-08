import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function ShopScreen({ navigation }) {
  const [count, setCount] = useState(0);
  const [clickBonus, setClickBonus] = useState(1);

  const upgrades = [
    { id: '1', name: 'Energy Condenser', cost: 10, bonus: 1 },
    { id: '2', name: 'Quantum Fluctuator', cost: 50, bonus: 2 },
    { id: '3', name: 'Particle Accelerator', cost: 200, bonus: 4 },
    { id: '4', name: 'Fusion Generator', cost: 1000, bonus: 10 },
    { id: '5', name: 'Matter Synthesizer', cost: 5000, bonus: 25 },
    { id: '6', name: 'Virus Breeder', cost: 15000, bonus: 40 },
    { id: '7', name: 'DNA Compiler', cost: 50000, bonus: 60 },
    { id: '8', name: 'Tissue Replicator', cost: 150000, bonus: 100 },
    { id: '9', name: 'Orbital Satellite', cost: 500000, bonus: 200 },
    { id: '10', name: 'Dyson Sphere', cost: 2000000, bonus: 500 },
  ];

  useEffect(() => {
    const loadData = async () => {
      const savedCount = await AsyncStorage.getItem('clickCount');
      const savedBonus = await AsyncStorage.getItem('clickBonus');

      setCount(savedCount ? parseInt(savedCount) : 0);
      setClickBonus(savedBonus ? parseInt(savedBonus) : 1);
    };
    loadData();
  }, []);

  const buyUpgrade = async (item) => {
    // Перезагружаем последние данные
    const savedCount = await AsyncStorage.getItem('clickCount');
    const savedBonus = await AsyncStorage.getItem('clickBonus');

    let currentCount = savedCount ? parseInt(savedCount) : 0;
    let currentBonus = savedBonus ? parseInt(savedBonus) : 1;

    if (currentCount >= item.cost) {
      const newCount = currentCount - item.cost;
      const newBonus = currentBonus + item.bonus;

      setCount(newCount);
      setClickBonus(newBonus);

      await AsyncStorage.setItem('clickCount', newCount.toString());
      await AsyncStorage.setItem('clickBonus', newBonus.toString());
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.upgradeItem}>
      <View>
        <Text style={styles.upgradeTitle}>{item.name}</Text>
        <Text style={styles.upgradeDesc}>+{item.bonus} per click</Text>
        <Text style={styles.upgradeCost}>Cost: {item.cost}</Text>
      </View>
      <TouchableOpacity
        onPress={() => buyUpgrade(item)}
        style={styles.buyButton}
      >
        <Text style={styles.buyText}>Buy</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={styles.tabText}>Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.tabText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.counter}>Energy: {count}</Text>
      <FlatList
        data={upgrades}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.upgradeList}
      />
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
  activeTab: {
    backgroundColor: '#aaaaaa',
  },
  tabText: {
    fontSize: 16,
    color: '#000000',
  },
  counter: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 16,
    color: '#000',
  },
  upgradeList: {
    paddingHorizontal: 16,
  },
  upgradeItem: {
    backgroundColor: '#eeeeee',
    borderRadius: 6,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  upgradeDesc: {
    fontSize: 14,
    color: '#333',
  },
  upgradeCost: {
    fontSize: 14,
    color: '#666',
  },
  buyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#888888',
  },
  buyText: {
    color: '#ffffff',
    fontSize: 14,
  },
});
