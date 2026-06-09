import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar, FlatList, Platform,
} from 'react-native';
import { useGame, calculateCost, MODEL_LABELS } from '../context/GameContext';
import { TabBar } from './HomeScreen';

const CLICK_UPGRADES = [
  { id: '1',  name: 'Energy Condenser',     baseCost: 10,      bonus: 1 },
  { id: '2',  name: 'Quantum Fluctuator',   baseCost: 50,      bonus: 2 },
  { id: '3',  name: 'Particle Accelerator', baseCost: 200,     bonus: 4 },
  { id: '4',  name: 'Fusion Generator',     baseCost: 1000,    bonus: 10 },
  { id: '5',  name: 'Matter Synthesizer',   baseCost: 5000,    bonus: 25 },
  { id: '6',  name: 'Virus Breeder',        baseCost: 15000,   bonus: 40 },
  { id: '7',  name: 'DNA Compiler',         baseCost: 50000,   bonus: 60 },
  { id: '8',  name: 'Tissue Replicator',    baseCost: 150000,  bonus: 100 },
  { id: '9',  name: 'Orbital Satellite',    baseCost: 500000,  bonus: 200 },
  { id: '10', name: 'Dyson Sphere',         baseCost: 2000000, bonus: 500 },
];

const AUTO_UPGRADES = [
  { id: 'a1', name: 'Passive Emitter', baseCost: 100,   cps: 1 },
  { id: 'a2', name: 'Nanobot Swarm',   baseCost: 500,   cps: 5 },
  { id: 'a3', name: 'AI Factory',      baseCost: 2000,  cps: 10 },
  { id: 'a4', name: 'Quantum Reactor', baseCost: 10000, cps: 25 },
];

export default function ShopScreen({ navigation }) {
  const {
    count,
    upgradeCounts,
    progressionModel,
    lastShopTab, setLastShopTab,
    buyUpgrade,
  } = useGame();

  const activeTab = lastShopTab;

  const handleTabChange = (tab) => setLastShopTab(tab);

  const renderItem = ({ item }) => {
    const level     = upgradeCounts[item.id] || 0;
    const price     = calculateCost(item.baseCost, level, progressionModel);
    const canAfford = Math.floor(count) >= price;
    const isClick   = activeTab === 'click';

    return (
      <View style={styles.upgradeItem}>
        <View style={styles.upgradeInfo}>
          <Text style={styles.upgradeTitle}>
            {item.name}{level > 0 ? `  ×${level}` : ''}
          </Text>
          <Text style={styles.upgradeDesc}>
            +{isClick ? item.bonus : item.cps} {isClick ? 'per click' : 'per second'}
          </Text>
          <Text style={[styles.upgradeCost, !canAfford && styles.upgradeCostDisabled]}>
            Cost: {price.toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => buyUpgrade(item, progressionModel)}
          style={[styles.buyButton, !canAfford && styles.buyButtonDisabled]}
          disabled={!canAfford}
        >
          <Text style={styles.buyText}>Buy</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const currentUpgrades = activeTab === 'click' ? CLICK_UPGRADES : AUTO_UPGRADES;

  return (
    <View style={styles.container}>
      <TabBar navigation={navigation} active="Shop" />

      <View style={styles.modelBadge}>
        <Text style={styles.modelBadgeText}>Model: {MODEL_LABELS[progressionModel]}</Text>
      </View>

      <View style={styles.subTabs}>
        <TouchableOpacity
          style={[styles.subTab, activeTab === 'click' && styles.activeSubTab]}
          onPress={() => handleTabChange('click')}
        >
          <Text style={styles.tabText}>Click Upgrades</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subTab, activeTab === 'cps' && styles.activeSubTab]}
          onPress={() => handleTabChange('cps')}
        >
          <Text style={styles.tabText}>Auto Upgrades</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.counter}>Energy: {Math.floor(count).toLocaleString()}</Text>

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
  container: { flex: 1, backgroundColor: '#ffffff' },

  modelBadge: {
    backgroundColor: '#e8e8e8',
    paddingVertical: 6,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modelBadgeText: { fontSize: 13, color: '#555', fontStyle: 'italic' },

  subTabs:      { flexDirection: 'row', backgroundColor: '#dddddd' },
  subTab:       { flex: 1, paddingVertical: 10, alignItems: 'center' },
  activeSubTab: { backgroundColor: '#bbbbbb' },
  tabText:      { fontSize: 16, color: '#000' },

  counter: { fontSize: 18, textAlign: 'center', marginVertical: 12, color: '#000' },

  upgradeList:  { paddingHorizontal: 16 },
  upgradeItem: {
    backgroundColor: '#eeeeee',
    borderRadius: 6,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upgradeInfo:          { flex: 1 },
  upgradeTitle:         { fontSize: 17, fontWeight: 'bold', color: '#000' },
  upgradeDesc:          { fontSize: 13, color: '#333', marginTop: 2 },
  upgradeCost:          { fontSize: 13, color: '#666', marginTop: 2 },
  upgradeCostDisabled:  { color: '#cc4444' },
  buyButton:            { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6, backgroundColor: '#888888', marginLeft: 12 },
  buyButtonDisabled:    { backgroundColor: '#cccccc' },
  buyText:              { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
});
