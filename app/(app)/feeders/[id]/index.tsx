// app/(app)/feeders/[id]/index.tsx
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFeederStore } from '../../../../store/feederStore';
import FeedLevelGauge from '../../../../components/feeder/FeedLevelGauge';
import SignalIndicator from '../../../../components/feeder/SignalIndicator';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../../../constants/theme';
import SectionHeader from '../../../../components/ui/SectionHeader';
import StatusBadge from '../../../../components/ui/StatusBadge';
import { format } from 'date-fns';
import { SequenceVisualizer } from '../../../../components/feeder/SequenceVisualizer';

function getSignalLevel(dbm: number): 'excellent' | 'good' | 'fair' | 'poor' | 'lost' {
  if (dbm >= -60) return 'excellent';
  if (dbm >= -70) return 'good';
  if (dbm >= -85) return 'fair';
  if (dbm >= -100) return 'poor';
  return 'lost';
}

export default function FeederDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const feeder = useFeederStore(s => s.getFeederById(id));

  if (!feeder) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Feeder not found</Text>
      </View>
    );
  }

  const isOffline = !feeder.online;
  const overallStatus: string = isOffline ? 'OFFLINE' : feeder.state;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.feederName}>{feeder.name}</Text>
          <Text style={styles.zoneName}>{feeder.locationName ?? 'Unknown Location'}</Text>
        </View>
        <StatusBadge status={overallStatus as any} />
      </View>

      {/* Feed Level Gauge */}
      <View style={styles.mainGauges}>
        <FeedLevelGauge levelPercent={feeder.hopperPercent} size={150} />
      </View>

      {/* Telemetry Grid */}
      <View style={styles.telemetryGrid}>
        {/* Battery */}
        <View style={styles.telemetryCard}>
          <Ionicons
            name="battery-half"
            size={24}
            color={feeder.batteryStatus === 'CRITICAL' ? Colors.severityError : feeder.batteryStatus === 'LOW' ? Colors.statusWarning : Colors.statusOnline}
          />
          <Text style={styles.telemetryVal}>{feeder.batteryVoltage.toFixed(1)}V</Text>
          <Text style={styles.telemetryLabel}>Battery</Text>
        </View>

        {/* Tilt */}
        <View style={styles.telemetryCard}>
          <Ionicons
            name="boat-outline"
            size={24}
            color={feeder.tiltStatus === 'CRITICAL' ? Colors.severityError : Colors.textMuted}
          />
          <Text style={styles.telemetryVal}>{feeder.tiltAngleDeg.toFixed(1)}°</Text>
          <Text style={styles.telemetryLabel}>Tilt</Text>
        </View>

        {/* Spreader */}
        <View style={styles.telemetryCard}>
          <Ionicons
            name="disc-outline"
            size={24}
            color={feeder.spreaderRunning ? Colors.accent : Colors.textMuted}
          />
          <Text style={styles.telemetryVal}>{feeder.spreaderRunning ? 'RUN' : 'STOP'}</Text>
          <Text style={styles.telemetryLabel}>Spreader</Text>
        </View>

        {/* Interlock */}
        <View style={[styles.telemetryCard, (feeder.estopActive || !feeder.lidClosed) && styles.faultCard]}>
          <Ionicons
            name="warning-outline"
            size={24}
            color={(feeder.estopActive || !feeder.lidClosed) ? Colors.severityError : Colors.statusOnline}
          />
          <Text style={[styles.telemetryVal, { fontSize: 13 }]}>
            {feeder.estopActive ? 'ESTOP' : (!feeder.lidClosed ? 'LID OPEN' : 'SAFE')}
          </Text>
          <Text style={styles.telemetryLabel}>Interlock</Text>
        </View>
      </View>

      {/* Signal & Cycles Row */}
      <View style={styles.infoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>LoRa Signal</Text>
          <SignalIndicator status={getSignalLevel(feeder.signalStrength)} showLabel size="md" />
          <Text style={styles.infoSub}>{feeder.signalStrength} dBm</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Feed Cycles</Text>
          <Text style={styles.infoValue}>{feeder.feedCycleCount}</Text>
          <Text style={styles.infoSub}>All-time</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Last Result</Text>
          <Text style={[styles.infoValue, { color: feeder.lastFeedResult === 'SUCCESS' ? Colors.statusOnline : Colors.statusWarning, fontSize: 11 }]}>
            {feeder.lastFeedResult || '—'}
          </Text>
          <Text style={styles.infoSub}>Feed status</Text>
        </View>
      </View>

      {/* Sequence Visualizer */}
      <SequenceVisualizer systemState={feeder.state} />

      {/* Schedule Info */}
      <SectionHeader title="Active Profile" />
      <View style={styles.scheduleBox}>
        <View style={styles.scheduleRow}>
          <Text style={styles.scheduleLabel}>Fish Type</Text>
          <Text style={styles.scheduleVal}>{feeder.profile?.fishType ?? '—'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.scheduleRow}>
          <Text style={styles.scheduleLabel}>Stock Count</Text>
          <Text style={styles.scheduleVal}>{feeder.profile?.stockCount?.toLocaleString() ?? '—'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.scheduleRow}>
          <Text style={styles.scheduleLabel}>Last Updated</Text>
          <Text style={styles.scheduleVal}>
            {feeder.lastUpdatedAt ? format(new Date(feeder.lastUpdatedAt), 'HH:mm (MMM d)') : '—'}
          </Text>
        </View>
        {feeder.lastFaultMessage ? (
          <>
            <View style={styles.divider} />
            <View style={styles.scheduleRow}>
              <Text style={[styles.scheduleLabel, { color: Colors.severityError }]}>Last Fault</Text>
              <Text style={[styles.scheduleVal, { color: Colors.severityError, flexShrink: 1, textAlign: 'right' }]}>{feeder.lastFaultMessage}</Text>
            </View>
          </>
        ) : null}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/(app)/feeders/${feeder.id}/controls`)}
          disabled={isOffline}
        >
          <View style={[styles.actionIconWrap, isOffline && styles.iconWrapDisabled]}>
            <Ionicons name="game-controller-outline" size={24} color={isOffline ? Colors.textMuted : Colors.accent} />
          </View>
          <Text style={[styles.actionText, isOffline && styles.textDisabled]}>Controls</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/(app)/feeders/${feeder.id}/schedule`)}>
          <View style={styles.actionIconWrap}>
            <Ionicons name="time-outline" size={24} color={Colors.accent} />
          </View>
          <Text style={styles.actionText}>Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(('/(app)/feeders/' + feeder.id + '/calibration') as any)}>
          <View style={styles.actionIconWrap}>
            <Ionicons name="options-outline" size={24} color={Colors.accent} />
          </View>
          <Text style={styles.actionText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/(app)/feeders/${feeder.id}/history`)}>
          <View style={styles.actionIconWrap}>
            <Ionicons name="bar-chart-outline" size={24} color={Colors.accent} />
          </View>
          <Text style={styles.actionText}>Telemetry</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  errorText: { color: Colors.statusOffline, fontSize: FontSize.lg },
  content: { padding: Spacing.lg, paddingBottom: 60, gap: Spacing.xl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  feederName: { fontSize: FontSize.xxl, fontWeight: 'bold', color: Colors.textPrimary },
  zoneName: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 4 },
  mainGauges: { alignItems: 'center', marginVertical: Spacing.md },
  telemetryGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm },
  telemetryCard: {
    flex: 1, backgroundColor: Colors.backgroundCard, padding: Spacing.md,
    borderRadius: BorderRadius.md, alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: Colors.border,
  },
  faultCard: { borderColor: Colors.severityError, backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  telemetryVal: { fontSize: FontSize.lg, fontWeight: 'bold', color: Colors.textPrimary },
  telemetryLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  infoRow: { flexDirection: 'row', gap: Spacing.sm },
  infoCard: {
    flex: 1, backgroundColor: Colors.backgroundCard, padding: Spacing.md,
    borderRadius: BorderRadius.md, alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  infoLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.3 },
  infoValue: { fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.textPrimary },
  infoSub: { fontSize: 10, color: Colors.textMuted },
  scheduleBox: {
    backgroundColor: Colors.backgroundSecondary, borderRadius: BorderRadius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  scheduleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4, gap: 8 },
  scheduleLabel: { color: Colors.textSecondary, fontSize: FontSize.sm },
  scheduleVal: { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: '600' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 6 },
  actionsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md, marginTop: Spacing.md },
  actionBtn: { flex: 1, alignItems: 'center', gap: 8 },
  actionIconWrap: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.accentMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  iconWrapDisabled: { backgroundColor: 'rgba(74,99,128,0.1)' },
  actionText: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '500' },
  textDisabled: { color: Colors.textMuted },
});
