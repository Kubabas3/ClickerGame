import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  Alert, 
  Platform 
} from 'react-native';
import { useGame } from '../context/GameContext';

export default function SettingsScreen({ navigation }) {
  const { resetAllData } = useGame();

  const handleResetPress = () => {
    const title = 'Сброс игры';
    const message = 'Вы уверены, что хотите удалить весь прогресс?';

    
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`${title}\n\n${message}`);
      if (confirmed) {
        runReset();
      }
    } else {
      
      Alert.alert(title, message, [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: runReset },
      ]);
    }
  };

  
  const runReset = async () => {
    const success = await resetAllData();
    if (success) {
      if (Platform.OS === 'web') {
        window.alert('Все данные стерты');
      } else {
        Alert.alert('Успех', 'Все данные стерты');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Shop')}>
          <Text style={styles.tabText}>Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={styles.tabText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centerContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetPress}>
          <Text style={styles.resetText}>СБРОСИТЬ ПРОГРЕСС</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#cccccc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { backgroundColor: '#aaaaaa' },
  tabText: { fontSize: 16, color: '#000' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  resetButton: {
    backgroundColor: '#ff4444',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400, 
    alignItems: 'center'
  },
  resetText: { color: '#fff', fontWeight: 'bold' }
});