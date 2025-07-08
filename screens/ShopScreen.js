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

const { width } = Dimensions.get('window');

export default function ShopScreen({ navigation }) {
  const [count, setCount] = useState(0);
  const [clickBonus, setClickBonus] = useState(1);

  const upgrades = [
    { id: '1', name: 'Quark', cost: 10, bonus: 1 },
    { id: '2', name: 'Proton', cost: 50, bonus: 2 },
    { id: '3', name: 'Atom', cost: 200, bonus: 3 },
  ];

  useEffect(() => {
    const loadData = async () => {
      const savedCount = await AsyncStorage.getItem('clickCount');
      const savedBonus = await AsyncStorage.getItem('clickBonus');
      if (savedCount !== null) setCount(parseInt(savedCount));
      if (savedBonus !== null) setClickBonus(parseInt(savedBonus));
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('clickBonus', clickBonus.toString());
  }, [clickBonus]);

  const buyUpgrade = (item) => {
    if (count >= item.cost) {
      const newCount = count - item.cost;
      const newBonus = clickBonus + item.bonus;

      setCount(newCount);
      setClickBonus(newBonus);

      AsyncStorage.setItem('clickCount', newCount.toString());
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
    backgroundColor: '#eee',
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
