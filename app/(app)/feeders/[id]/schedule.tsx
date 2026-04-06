// app/(app)/feeders/[id]/schedule.tsx
// Feed schedule based on the feeder's recommendation profile
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFeederStore } from '../../../../store/feederStore';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../../constants/theme';

export default function ScheduleModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const feeder = useFeederStore(s => s.getFeederById(id));

  if (!feeder) return null;

  const rec = feeder.recommendation;

  // Derive daily schedule from recommendation
  const scheduleItems = React.useMemo(() => {
    if (!rec) return [];
    const freq = rec.recommendedFeedFrequencyPerDay || 4;
    const startHour = 6;
    const interval = Math.floor(16 / freq); // Spread over 16 active hours
    return Array.from({ length: freq }, (_, i) => {
      const hour = (startHour + i * interval) % 24;
      return {
        id: `sched-${i}`,
        label: i === 0 ? 'Morning' : i === 1 ? 'Midday' : i === freq - 1 ? 'Evening' : 'Afternoon',
        hour,
        minute: 0,
        durationSec: rec.recommendedDispenseDurationSec,
        isEnabled: true,
      };
    });
  }, [rec]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Schedule</Text>
        <Text style={styles.subtitle}>{feeder.name}</Text>
      </View>

      {rec ? (
        <>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Biomass</Text>
              <Text style={styles.summaryVal}>{rec.estimatedBiomassKg.toFixed(0)} kg</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Daily Feed Target</Text>
              <Text style={styles.summaryVal}>{rec.recommendedDailyFeedKg.toFixed(2)} kg/day</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Feeds per Day</Text>
              <Text style={styles.summaryVal}>{rec.recommendedFeedFrequencyPerDay}x</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration per Cycle</Text>
              <Text style={styles.summaryVal}>{rec.recommendedDispenseDurationSec}s</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>DERIVED DAILY SCHEDULE</Text>
          <View style={styles.scheduleList}>
            {scheduleItems.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.timeWrap}>
                  <Text style={styles.timeText}>
                    {String(item.hour).padStart(2, '0')}:{String(item.minute).padStart(2, '0')}
                  </Text>
                  <Text style={styles.portionText}>{item.label} — {item.durationSec}s dispense</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: Colors.accentMuted }]}>
                  <Ionicons name="checkmark" size={12} color={Colors.accent} />
                  <Text style={styles.badgeText}>Active</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.emptyBox}>
          <Ionicons name="calendar-outline" size={40} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No Schedule Configured</Text>
          <Text style={styles.emptyDesc}>
            Complete feeder setup with fish type and cage info to generate a recommendation-based schedule.
          </Text>
        </View>
      )}

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
  summaryBox: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  summaryLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  summaryVal: { fontSize: FontSize.md, fontWeight: 'bold', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: 'bold',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  scheduleList: { gap: Spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundCard,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeWrap: { gap: 4 },
  timeText: { fontSize: FontSize.xxl, fontWeight: 'bold', color: Colors.textPrimary },
  portionText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  badgeText: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: '600' },
  emptyBox: { alignItems: 'center', padding: Spacing.xxl, gap: Spacing.md },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: 'bold', color: Colors.textSecondary },
  emptyDesc: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  closeBtn: { padding: Spacing.lg, alignItems: 'center', marginTop: Spacing.lg },
  closeBtnText: { color: Colors.textMuted, fontSize: FontSize.md, fontWeight: '500' },
});
