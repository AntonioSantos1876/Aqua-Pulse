// app/(app)/feeders/[id]/history.tsx
import React from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFeederStore } from '../../../../store/feederStore';
import FeedHistoryChart from '../../../../components/charts/FeedHistoryChart';
import SectionHeader from '../../../../components/ui/SectionHeader';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../../constants/theme';
import { format } from 'date-fns';

export default function HistoryModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const feeder = useFeederStore(s => s.getFeederById(id));

  if (!feeder) return null;

  // Simple mock data for the 7-day chart
  const mockChartData = [2, 3, 2, 4, 3, 4, Math.max(1, feeder.feedCycleCount % 10)];
  const mockLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
         <Text style={styles.title}>Analytics</Text>
         <Text style={styles.subtitle}>{feeder.name} • 7 Days</Text>
      </View>

      <View style={styles.chartWrap}>
        <Text style={styles.chartTitle}>Daily Feeds (Cycles)</Text>
        <FeedHistoryChart data={mockChartData} labels={mockLabels} />
      </View>

      <SectionHeader title="Recent Telemetry" style={{ marginTop: Spacing.xl }} />

      <View style={styles.historyList}>
        {(feeder.telemetryHistory || []).slice(0, 10).map((event, i) => (
          <View key={i} style={styles.historyItem}>
            <View style={styles.iconWrap}>
              <Ionicons 
                name={'stats-chart'} 
                size={16} 
                color={Colors.accent} 
              />
            </View>
            <View style={styles.eventBody}>
              <Text style={styles.eventTitle}>
                Telemetry Snapshot
              </Text>
              <Text style={styles.eventTime}>{event.recordedAt ? format(new Date(event.recordedAt), 'MMM d, HH:mm') : 'Unknown'}</Text>
            </View>
            <View style={styles.eventRight}>
              <Text style={styles.eventAmount}>
                {Math.round(event.hopperPercent)}% <Text style={{ fontSize: 10, color: Colors.textMuted }}>Feed</Text>
              </Text>
              <Text style={[styles.eventStatus, { color: Colors.statusOnline }]}>{event.batteryVoltage.toFixed(1)}v</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  chartWrap: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: FontSize.md,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.lg,
  },
  historyList: {
    gap: Spacing.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventBody: {
    flex: 1,
  },
  eventTitle: {
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  eventTime: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  eventRight: {
    alignItems: 'flex-end',
  },
  eventAmount: {
    fontSize: FontSize.md,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  eventStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
});
