// app/(app)/feeders/[id]/calibration.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFeederStore } from '../../../../store/feederStore';
import SectionHeader from '../../../../components/ui/SectionHeader';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../../constants/theme';
import { format } from 'date-fns';

export default function CalibrationModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const feeder = useFeederStore(s => s.getFeederById(id));
  const updateFeeder = useFeederStore(s => s.updateFeeder);

  const [fishCount, setFishCount] = useState(feeder?.profile?.stockCount?.toString() || '0');
  const [cageSize, setCageSize] = useState(feeder?.profile?.cageSize || '');
  const [isCalibrating, setIsCalibrating] = useState(false);

  if (!feeder) return null;

  const handleRunCalibration = () => {
    setIsCalibrating(true);
    // Simulate updating fish target remotely
    setTimeout(() => {
      if (feeder.profile) {
        updateFeeder(feeder.id, {
          profile: {
            ...feeder.profile,
            stockCount: parseInt(fishCount) || 5000,
            cageSize
          }
        });
      }
      setIsCalibrating(false);
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Feeder Profile</Text>
        <Text style={styles.subtitle}>Adjust setup and calibration for {feeder.name}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Fish Type</Text>
          <Text style={styles.value}>
            {feeder.profile?.fishType || 'Unknown'}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Hardware ID</Text>
          <View style={styles.badge}>
            <Ionicons name="hardware-chip" size={16} color={Colors.accent} />
            <Text style={[styles.badgeText, { color: Colors.accent }]}>
              {feeder.deviceId}
            </Text>
          </View>
        </View>
      </View>

      <SectionHeader title="Digital Twin Parameters" style={{ marginTop: Spacing.xl }} />
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Stock Count (Estimated)</Text>
          <TextInput
            style={styles.input}
            value={fishCount}
            onChangeText={setFishCount}
            keyboardType="number-pad"
            placeholderTextColor={Colors.textMuted}
            editable={!isCalibrating}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Cage Size (m)</Text>
          <TextInput
            style={styles.input}
            value={cageSize}
            onChangeText={setCageSize}
            placeholderTextColor={Colors.textMuted}
            editable={!isCalibrating}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.testBtn, isCalibrating && styles.testBtnDisabled]} 
        onPress={handleRunCalibration}
        disabled={isCalibrating}
      >
        <Ionicons name={isCalibrating ? "sync" : "cloud-upload"} size={20} color={Colors.background} style={isCalibrating && { opacity: 0.7 }} />
        <Text style={styles.testBtnText}>
          {isCalibrating ? 'Syncing to Cloud...' : 'Update Variables'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Text style={styles.closeBtnText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  header: { marginBottom: Spacing.xl },
  title: { fontSize: FontSize.xxl, fontWeight: 'bold', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 4 },
  card: {
    backgroundColor: Colors.backgroundCard,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  label: { fontSize: FontSize.sm, color: Colors.textSecondary },
  value: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeText: { fontSize: FontSize.xs, fontWeight: 'bold' },
  form: { gap: Spacing.md },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
  },
  testBtn: {
    backgroundColor: Colors.accent,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.xxl,
  },
  testBtnDisabled: { opacity: 0.6 },
  testBtnText: { color: Colors.background, fontSize: FontSize.md, fontWeight: 'bold' },
  closeBtn: {
    padding: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  closeBtnText: { color: Colors.textMuted, fontSize: FontSize.md, fontWeight: '500' },
});
