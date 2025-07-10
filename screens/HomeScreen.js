import React, { useEffect } from 'react';
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

  const handleClick = () => {
    setCount(prev => prev + clickBonus);
  };

  

  return (
    <View style={styles.container}>
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

      <View style={styles.centerContainer}>
        <Text style={styles.energyLabel}>Energy</Text>
        <Text style={styles.energyValue}>{count}</Text>
        <Text style={styles.cpsText}>CPS: {cpsBonus}</Text>

        <TouchableOpacity style={styles.circleButton} onPress={handleClick}>
          {/* Empty circle */}
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
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  cpsText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 32,
  },
  circleButton: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.5) / 2,
    backgroundColor: '#999999',
  },
});
