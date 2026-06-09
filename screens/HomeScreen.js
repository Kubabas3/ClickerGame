import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  useWindowDimensions, StatusBar, Platform, Animated,
} from 'react-native';
import { useGame } from '../context/GameContext';

function FloatingLabel({ value, x, y, onDone }) {
  const anim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(onDone);
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -70] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 1, 0] });

  return (
    <Animated.Text
      style={[styles.floatingLabel, {
        left: x - 20,
        top:  y - 20,
        opacity,
        transform: [{ translateY }],
      }]}
    >
      +{Math.floor(value)}
    </Animated.Text>
  );
}

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const btnSize = Math.min(width * 0.55, 300);

  const {
    count, setCount,
    clickBonus, cpsBonus,
    setTotalClicks, setTotalEarned,
    showFloatingLabels,
    trackIncome,
  } = useGame();

  const [labels, setLabels] = useState([]);
  const nextId = useRef(0);

  const handleClick = useCallback((evt) => {
    setCount(prev => prev + clickBonus);
    setTotalClicks(prev => prev + 1);
    setTotalEarned(prev => prev + clickBonus);
    trackIncome(clickBonus);

    if (!showFloatingLabels) return;

    const id = nextId.current++;
    // Случайная точка внутри кнопки
    const angle = Math.random() * 2 * Math.PI;
    const r = Math.random() * (btnSize / 2);
    setLabels(prev => [...prev, {
      id,
      value: clickBonus,
      x: btnSize / 2 + r * Math.cos(angle),
      y: btnSize / 2 + r * Math.sin(angle),
    }]);
  }, [clickBonus, btnSize, showFloatingLabels, setCount, setTotalClicks, setTotalEarned]);

  const removeLabel = useCallback((id) => {
    setLabels(prev => prev.filter(l => l.id !== id));
  }, []);

  const energyText     = useMemo(() => Math.floor(count).toLocaleString(), [count]);
  const cpsText        = useMemo(() => `CPS: ${cpsBonus}`, [cpsBonus]);
  const clickPowerText = useMemo(() => `Click: +${clickBonus}`, [clickBonus]);

  return (
    <View style={styles.container}>
      <TabBar navigation={navigation} active="Home" />
      {/* position:relative чтобы FloatingLabel позиционировались относительно этого View */}
      <View style={styles.centerContainer}>
        <Text style={styles.energyLabel}>Energy</Text>
        <Text style={styles.energyValue}>{energyText}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>{cpsText}</Text>
          <Text style={styles.statsSeparator}>|</Text>
          <Text style={styles.statsText}>{clickPowerText}</Text>
        </View>

        <View style={{ position: 'relative', width: btnSize, height: btnSize }}>
          <TouchableOpacity
            style={[styles.circleButton, {
              width: btnSize, height: btnSize, borderRadius: btnSize / 2,
            }]}
            onPress={handleClick}
            activeOpacity={0.7}
          />
          {labels.map(l => (
            <FloatingLabel
              key={l.id}
              value={l.value}
              x={l.x}
              y={l.y}
              onDone={() => removeLabel(l.id)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export function TabBar({ navigation, active }) {
  const tabs = ['Home', 'Shop', 'Stats', 'Settings'];
  const topPad = Platform.OS === 'android'
    ? (StatusBar.currentHeight || 0)
    : Platform.OS === 'ios' ? 44 : 0;

  return (
    <View style={[tabStyles.bar, { paddingTop: topPad }]}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab}
          style={[tabStyles.tab, active === tab && tabStyles.activeTab]}
          onPress={() => navigation.navigate(tab)}
        >
          <Text style={tabStyles.tabText}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export const tabStyles = StyleSheet.create({
  bar:       { flexDirection: 'row', backgroundColor: '#cccccc' },
  tab:       { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { backgroundColor: '#aaaaaa' },
  tabText:   { fontSize: 14, color: '#000000' },
});

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#ffffff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  energyLabel:     { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  energyValue:     { fontSize: 44, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  statsRow:        { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  statsText:       { fontSize: 16, color: '#444', fontWeight: '500' },
  statsSeparator:  { marginHorizontal: 15, fontSize: 16, color: '#ccc' },
  circleButton: {
    backgroundColor: '#999999',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  floatingLabel: {
    position: 'absolute',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    pointerEvents: 'none',
  },
});
