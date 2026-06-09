import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, Platform, ScrollView,
} from 'react-native';
import {
  useGame, PROGRESSION_MODELS, MODEL_LABELS, MODEL_DESCRIPTIONS,
} from '../context/GameContext';
import { TabBar } from './HomeScreen';

export default function SettingsScreen({ navigation }) {
  const { progressionModel, setProgressionModel, resetAllData,
          showFloatingLabels, setShowFloatingLabels } = useGame();

  const handleResetPress = () => {
    const title   = 'Reset game';
    const message = 'Delete all progress?';
    if (Platform.OS === 'web') {
      if (window.confirm(`${title}\n\n${message}`)) runReset();
    } else {
      Alert.alert(title, message, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: runReset },
      ]);
    }
  };

  const runReset = async () => {
    const success = await resetAllData();
    if (success) {
      if (Platform.OS === 'web') window.alert('All data cleared');
      else Alert.alert('Done', 'All data cleared');
    }
  };

  return (
    <View style={styles.container}>
      <TabBar navigation={navigation} active="Settings" />
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.sectionTitle}>Progression Model</Text>
        <Text style={styles.sectionSubtitle}>
          Affects how upgrade costs scale with each purchase
        </Text>

        {Object.values(PROGRESSION_MODELS).map((model) => {
          const isActive = progressionModel === model;
          return (
            <TouchableOpacity
              key={model}
              style={[styles.modelCard, isActive && styles.modelCardActive]}
              onPress={() => setProgressionModel(model)}
            >
              <View style={styles.modelCardHeader}>
                <Text style={[styles.modelName, isActive && styles.modelNameActive]}>
                  {MODEL_LABELS[model]}
                </Text>
                {isActive && <Text style={styles.activeBadge}>ACTIVE</Text>}
              </View>
              <Text style={[styles.modelFormula, isActive && styles.modelFormulaActive]}>
                {MODEL_DESCRIPTIONS[model]}
              </Text>
            </TouchableOpacity>
          );
        })}

        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Visual</Text>

        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setShowFloatingLabels(prev => !prev)}
        >
          <Text style={styles.toggleLabel}>Click animations (+N)</Text>
          <View style={[styles.toggleTrack, showFloatingLabels && styles.toggleTrackOn]}>
            <View style={[styles.toggleThumb, showFloatingLabels && styles.toggleThumbOn]} />
          </View>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Data</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetPress}>
          <Text style={styles.resetText}>RESET PROGRESS</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content:   { padding: 20 },

  sectionTitle:    { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#777', marginBottom: 16 },

  modelCard: {
    borderWidth: 2, borderColor: '#cccccc', borderRadius: 10,
    padding: 16, marginBottom: 12, backgroundColor: '#f5f5f5',
  },
  modelCardActive:  { borderColor: '#555555', backgroundColor: '#e0e0e0' },
  modelCardHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  modelName:        { fontSize: 16, fontWeight: 'bold', color: '#333' },
  modelNameActive:  { color: '#000' },
  activeBadge: {
    fontSize: 11, fontWeight: 'bold', color: '#fff',
    backgroundColor: '#555', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4,
  },
  modelFormula:       { fontSize: 12, color: '#888', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  modelFormulaActive: { color: '#555' },

  resetButton: {
    backgroundColor: '#ff4444', padding: 18,
    borderRadius: 10, alignItems: 'center', marginTop: 8,
  },
  resetText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  toggleLabel:    { fontSize: 15, color: '#333' },
  toggleTrack:    { width: 46, height: 26, borderRadius: 13, backgroundColor: '#ccc', padding: 2 },
  toggleTrackOn:  { backgroundColor: '#555' },
  toggleThumb:    { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },
  toggleThumbOn:  { transform: [{ translateX: 20 }] },
});
