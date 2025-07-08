import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [count, setCount] = useState(0);
  const [clickBonus, setClickBonus] = useState(1);

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
    AsyncStorage.setItem('clickCount', count.toString());
  }, [count]);

  const handleClick = () => {
    const newCount = count + clickBonus;
    setCount(newCount);
  };

  const buttonSize = width * 0.5;

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
  <TouchableOpacity style={[styles.tab, styles.activeTab]}>
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


      <View style={styles.center}>
        <Text style={styles.counter}>Clicks: {count}</Text>

        <TouchableOpacity
          style={[
            styles.circleButton,
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
            },
          ]}
          onPress={handleClick}
        >
          <Text style={styles.buttonText}>CLICK!</Text>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    fontSize: 22,
    marginBottom: 24,
    color: '#000000',
  },
  circleButton: {
    backgroundColor: '#888888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
