// components/feeder/SimulationPanel.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';
import { useFeederStore } from '../../store/feederStore';
import { Ionicons } from '@expo/vector-icons';

export default function SimulationPanel({ feederId }: { feederId: string }) {
  const injectFault = useFeederStore(s => s.injectFault);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="construct" size={18} color={Colors.accent} />
        <Text style={styles.title}>Demo Simulation Panel</Text>
      </View>
      <Text style={styles.desc}>
        Manually inject hardware states to demonstrate the remote monitoring UI reacting to physical Edge events.
      </Text>
      
      <View style={styles.btnGrid}>
        <TouchableOpacity style={styles.btn} onPress={() => injectFault(feederId, 'LID_OPEN')}>
           <Text style={styles.btnText}>Trigger Lid Open</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => injectFault(feederId, 'LOW_BATTERY')}>
           <Text style={styles.btnText}>Drop Battery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => injectFault(feederId, 'TILT_CRITICAL')}>
           <Text style={styles.btnText}>Tilt Cage (Storm)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  title: {
    color: Colors.accent,
    fontWeight: 'bold',
    fontSize: FontSize.md,
    textTransform: 'uppercase',
  },
  desc: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
  },
  btnGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  btn: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  btnText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  }
});
