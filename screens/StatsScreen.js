import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useGame, MODEL_LABELS } from '../context/GameContext';
import { TabBar } from './HomeScreen';

function totalUpgradesBought(upgradeCounts) {
  return Object.values(upgradeCounts).reduce((sum, n) => sum + n, 0);
}

function formatDuration(seconds) {
  if (seconds < 60)   return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function StatsScreen({ navigation }) {
  const {
    count, clickBonus, cpsBonus,
    upgradeCounts, progressionModel,
    totalClicks, totalEarned, totalSpent,
    sessionStart, getRecentIncome,
  } = useGame();

  const sessionSeconds = useMemo(
    () => Math.floor((Date.now() - sessionStart) / 1000),
    [count],
  );

  const upgradesBought  = totalUpgradesBought(upgradeCounts);
  // Скользящее окно — реальный доход за последние 2 сек, пересчитывается при каждом рендере
  const recentIncomeSec = getRecentIncome();

  const rows = [
    { label: 'Progression model',  value: MODEL_LABELS[progressionModel] },
    { label: 'Current energy',     value: Math.floor(count).toLocaleString() },
    { label: 'Click power',        value: `+${clickBonus} per click` },
    { label: 'Auto income (CPS)',  value: `+${cpsBonus} per second` },
    { label: 'Total clicks',       value: totalClicks.toLocaleString() },
    { label: 'Total earned',       value: Math.floor(totalEarned).toLocaleString() },
    { label: 'Total spent',        value: totalSpent.toLocaleString() },
    { label: 'Upgrades purchased', value: upgradesBought.toString() },
    { label: 'Session duration',   value: formatDuration(sessionSeconds) },
    { label: 'Income/sec (live)',  value: `${recentIncomeSec.toLocaleString()} energy/s` },
  ];

  return (
    <View style={styles.container}>
      <TabBar navigation={navigation} active="Stats" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Game Statistics</Text>
        <Text style={styles.subtitle}>Observable parameters for progression model analysis</Text>
        {rows.map(({ label, value }) => (
          <View key={label} style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content:   { padding: 20 },
  title:     { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  subtitle:  { fontSize: 13, color: '#777', marginBottom: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  rowLabel: { fontSize: 14, color: '#555', flex: 1 },
  rowValue: { fontSize: 14, fontWeight: 'bold', color: '#000', textAlign: 'right' },
});
