// app/(app)/alerts.tsx
import React from 'react';
import { StyleSheet, View, Text, SectionList, TouchableOpacity } from 'react-native';
import { useFeederStore } from '../../store/feederStore';
import AlertCard from '../../components/alerts/AlertCard';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';
import EmptyState from '../../components/ui/EmptyState';
import { isToday, isYesterday, isThisWeek } from 'date-fns';
import { FeederAlert } from '../../types/feeder';

export default function AlertsScreen() {
  // Combine store-level alerts (system) + feeder-embedded alerts
  const storeAlerts = useFeederStore(s => s.alerts);
  const feeders = useFeederStore(s => s.feeders);
  const markRead = useFeederStore(s => s.markAlertRead);

  // Merge feeder-level alerts with store-level alerts
  const allAlerts: FeederAlert[] = React.useMemo(() => {
    const feederAlerts = feeders.flatMap(f => f.alerts || []);
    // Deduplicate by id
    const seen = new Set<string>();
    const combined: FeederAlert[] = [];
    for (const a of [...storeAlerts, ...feederAlerts]) {
      if (!seen.has(a.id)) { seen.add(a.id); combined.push(a); }
    }
    return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [storeAlerts, feeders]);

  const unreadCount = allAlerts.filter(a => !a.isRead).length;

  // Group alerts by logical timeframes
  const groupedAlerts = React.useMemo(() => {
    const today: typeof allAlerts = [];
    const yesterday: typeof allAlerts = [];
    const thisWeek: typeof allAlerts = [];
    const older: typeof allAlerts = [];

    allAlerts.forEach(a => {
      const d = new Date(a.createdAt);
      if (isToday(d)) today.push(a);
      else if (isYesterday(d)) yesterday.push(a);
      else if (isThisWeek(d)) thisWeek.push(a);
      else older.push(a);
    });

    const sections = [];
    if (today.length) sections.push({ title: 'Today', data: today });
    if (yesterday.length) sections.push({ title: 'Yesterday', data: yesterday });
    if (thisWeek.length) sections.push({ title: 'This Week', data: thisWeek });
    if (older.length) sections.push({ title: 'Older', data: older });
    return sections;
  }, [allAlerts]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alerts</Text>
          {unreadCount > 0 && (
            <Text style={styles.subtitle}>{unreadCount} unread</Text>
          )}
        </View>
      </View>

      <SectionList
        sections={groupedAlerts}
        keyExtractor={a => a.id}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <AlertCard 
            alert={item} 
            onPress={() => markRead(item.id)} 
            style={styles.cardSpacing}
          />
        )}
        ListEmptyComponent={
          <EmptyState 
            icon="notifications-off-outline" 
            title="All Caught Up" 
            description="You have no alerts at this time. The system will notify you of any feeder events."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: '600',
    marginTop: 2,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    backgroundColor: Colors.background,
    paddingVertical: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardSpacing: {
    marginBottom: Spacing.sm,
  },
});
