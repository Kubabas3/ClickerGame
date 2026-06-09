import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { GameProvider } from './context/GameContext';
import HomeScreen     from './screens/HomeScreen';
import ShopScreen     from './screens/ShopScreen';
import StatsScreen    from './screens/StatsScreen';
import SettingsScreen from './screens/SettingsScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const nav = { navigate: setActiveTab };

  return (
    <GameProvider>
      <SafeAreaView style={styles.safeArea}>
        {Platform.OS === 'android' && <StatusBar backgroundColor="#cccccc" barStyle="dark-content" />}
        <View style={styles.root}>
          <View style={[styles.screen, activeTab !== 'Home'     && styles.hidden]}>
            <HomeScreen     navigation={nav} />
          </View>
          <View style={[styles.screen, activeTab !== 'Shop'     && styles.hidden]}>
            <ShopScreen     navigation={nav} />
          </View>
          <View style={[styles.screen, activeTab !== 'Stats'    && styles.hidden]}>
            <StatsScreen    navigation={nav} />
          </View>
          <View style={[styles.screen, activeTab !== 'Settings' && styles.hidden]}>
            <SettingsScreen navigation={nav} />
          </View>
        </View>
      </SafeAreaView>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#cccccc' }, // цвет таббара чтобы notch совпадал
  root:     { flex: 1, backgroundColor: '#ffffff' },
  screen:   { flex: 1 },
  hidden:   { display: 'none' },
});
