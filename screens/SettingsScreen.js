import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { useGame } from '../context/GameContext';

const { width } = Dimensions.get('window');

export default function SettingsScreen({ navigation }) {
  const {
    setCount,
    setClickBonus,
    setCpsBonus,
    setUpgradeCounts,
  } = useGame();

  const resetGame = () => {
    Alert.alert('Reset Game', 'Are you sure you want to reset everything?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          setCount(0);
          setClickBonus(1);
          setCpsBonus(0);
          setUpgradeCounts({});
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('Shop')}
        >
          <Text style={styles.tabText}>Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={styles.tabText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centerContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetText}>RESET ALL</Text>
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
  activeTab: {
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
  resetButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  resetText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
