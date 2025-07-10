import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  FlatList,
} from 'react-native';
import { useGame } from '../context/GameContext';

const { width } = Dimensions.get('window');

export default function ShopScreen({ navigation }) {
  const {
    count,
    setCount,
    upgradeCounts,
    setClickBonus,
    setCpsBonus,
    setUpgradeCounts,
  } = useGame();

  const [activeTab, setActiveTab] = useState('click');

  const clickUpgrades = [
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

  const autoUpgrades = [
    { id: 'a1', name: 'Passive Emitter', cost: 100, cps: 1 },
    { id: 'a2', name: 'Nanobot Swarm', cost: 500, cps: 5 },
    { id: 'a3', name: 'AI Factory', cost: 2000, cps: 10 },
    { id: 'a4', name: 'Quantum Reactor', cost: 10000, cps: 25 },
  ];

  const buyUpgrade = (item) => {
  if (count >= item.cost) {
    setCount(count - item.cost);

    // применяем бонус
    if (item.bonus) {
      setClickBonus(prev => prev + item.bonus);
    } else if (item.cps) {
      setCpsBonus(prev => prev + item.cps);
    }

    // увеличиваем количество покупок
    setUpgradeCounts(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  }
};


  const renderItem = ({ item }) => {
    const purchased = upgradeCounts[item.id] || 0;
    const isClick = activeTab === 'click';
    return (
      <View style={styles.upgradeItem}>
        <View>
          <Text style={styles.upgradeTitle}>
            {item.name} {purchased > 0 ? `(x${purchased})` : ''}
          </Text>
          <Text style={styles.upgradeDesc}>
            +{isClick ? item.bonus : item.cps} {isClick ? 'per click' : 'per second'}
          </Text>
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
  };

  const currentUpgrades = activeTab === 'click' ? clickUpgrades : autoUpgrades;

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={styles.tabText}>Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.tabText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subTabs}>
        <TouchableOpacity
          style={[styles.subTab, activeTab === 'click' && styles.activeSubTab]}
          onPress={() => setActiveTab('click')}
        >
          <Text style={styles.tabText}>Click Upgrades</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subTab, activeTab === 'cps' && styles.activeSubTab]}
          onPress={() => setActiveTab('cps')}
        >
          <Text style={styles.tabText}>Auto Upgrades</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.counter}>Energy: {count}</Text>
      <FlatList
        data={currentUpgrades}
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
  subTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#dddddd',
  },
  subTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeSubTab: {
    backgroundColor: '#bbbbbb',
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
