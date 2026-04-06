// app/(app)/index.tsx
import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useFeederStore } from '../../store/feederStore';
import FeederCard from '../../components/feeder/FeederCard';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, TabletColumns } from '../../constants/theme';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

function StatCard({ label, value, icon, color }: { label: string; value: number | string; icon: string; color: string }) {
  return (
    <View style={[statStyles.card, { borderTopColor: color }]}>
      <Ionicons name={icon as any} size={18} color={color} />
      <Text style={[statStyles.val, { color }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 2,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    minWidth: 72,
  },
  val: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  label: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  const feeders = useFeederStore(s => s.feeders);
  const allAlerts = useFeederStore(s => s.alerts);
  const feederAlerts = feeders.flatMap(f => f.alerts || []);

  const onlineCount = feeders.filter(f => f.online).length;
  const offlineCount = feeders.filter(f => !f.online).length;
  const faultCount = feeders.filter(f => f.state === 'FAULT' || f.state === 'ESTOP').length;
  const lowHopperCount = feeders.filter(f => f.hopperStatus !== 'OK').length;
  const runningCount = feeders.filter(f => f.feedingActive).length;
  const totalAlerts = [...allAlerts, ...feederAlerts].filter(a => !a.isRead).length;

  // Priority feeders — faults first, then offline, then low hopper
  const priorityFeeders = useMemo(() => [...feeders].sort((a, b) => {
    const score = (f: typeof feeders[0]) =>
      (f.state === 'FAULT' || f.state === 'ESTOP') ? 4
      : !f.online ? 3
      : f.hopperStatus !== 'OK' ? 2
      : f.batteryStatus !== 'OK' ? 1
      : 0;
    return score(b) - score(a);
  }).slice(0, 3), [feeders]);

  // Recent unread alerts combined
  const recentAlerts = useMemo(() =>
    [...allAlerts, ...feederAlerts]
      .filter(a => !a.isRead)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3),
    [allAlerts, feederAlerts]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}, {user?.name.split(' ')[0]} 👋</Text>
          <Text style={styles.farmName}>{user?.farmName}</Text>
          <Text style={styles.timestamp}>{format(new Date(), "EEEE, d MMM yyyy")}</Text>
        </View>
        <TouchableOpacity 
          style={styles.avatar}
          onPress={() => router.push('/(app)/settings')}
        >
          <Text style={styles.avatarText}>{user?.avatarInitials}</Text>
        </TouchableOpacity>
      </View>

      {/* Fleet Hero Banner */}
      <LinearGradient
        colors={['#0a2a3a', '#003d5b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBanner}
      >
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroLabel}>FLEET STATUS</Text>
            <Text style={styles.heroTitle}>{feeders.length} Feeders Deployed</Text>
          </View>
          <View style={styles.heroPulse}>
            <View style={[styles.pulseDot, { backgroundColor: onlineCount > 0 ? Colors.statusOnline : Colors.textMuted }]} />
          </View>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.heroStats}
        >
          <StatCard label="Online" value={onlineCount} icon="wifi" color={Colors.statusOnline} />
          <StatCard label="Offline" value={offlineCount} icon="wifi-outline" color={Colors.textMuted} />
          <StatCard label="Fault" value={faultCount} icon="warning" color={Colors.statusOffline} />
          <StatCard label="Low Feed" value={lowHopperCount} icon="beaker" color={Colors.statusWarning} />
          <StatCard label="Feeding" value={runningCount} icon="water" color={Colors.accent} />
        </ScrollView>
      </LinearGradient>

      {/* Quick Actions Row */}
      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(app)/feeders')}>
          <Ionicons name="grid-outline" size={20} color={Colors.accent} />
          <Text style={styles.quickBtnText}>All Feeders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/modals/add-feeder' as any)}>
          <Ionicons name="add-circle-outline" size={20} color={Colors.accent} />
          <Text style={styles.quickBtnText}>Add Feeder</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickBtn, totalAlerts > 0 && styles.quickBtnAlert]} onPress={() => router.push('/(app)/alerts')}>
          <Ionicons name="notifications-outline" size={20} color={totalAlerts > 0 ? Colors.statusOffline : Colors.accent} />
          <Text style={[styles.quickBtnText, totalAlerts > 0 && { color: Colors.statusOffline }]}>
            Alerts {totalAlerts > 0 ? `(${totalAlerts})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Priority Feeders */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Priority Feeders</Text>
        <TouchableOpacity onPress={() => router.push('/(app)/feeders')}>
          <Text style={styles.sectionAction}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.feedersList}>
        {priorityFeeders.map(f => (
          <FeederCard 
            key={f.id} 
            feeder={f} 
            onPress={() => router.push(`/(app)/feeders/${f.id}`)} 
          />
        ))}
      </View>

      {/* Recent Alerts */}
      {recentAlerts.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/alerts')}>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.alertsList}>
            {recentAlerts.map(a => (
              <View key={a.id} style={[styles.alertRow, a.severity === 'critical' ? styles.alertCritical : a.severity === 'warning' ? styles.alertWarning : styles.alertInfo]}>
                <Ionicons 
                  name={a.severity === 'critical' ? 'nuclear' : a.severity === 'warning' ? 'warning' : 'information-circle'} 
                  size={16} 
                  color={a.severity === 'critical' ? Colors.severityCritical : a.severity === 'warning' ? Colors.severityWarning : Colors.severityInfo} 
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.alertTitle}>{a.title}</Text>
                  <Text style={styles.alertMessage} numberOfLines={1}>{a.message}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
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
    paddingTop: 64,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  farmName: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  timestamp: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.accentMuted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarText: {
    color: Colors.accent,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  heroBanner: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.1)',
    gap: Spacing.lg,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginTop: 2,
  },
  heroPulse: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,230,118,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  heroStats: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    gap: 4,
  },
  quickBtnAlert: {
    borderColor: 'rgba(255,77,106,0.3)',
    backgroundColor: 'rgba(255,77,106,0.05)',
  },
  quickBtnText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  sectionAction: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: '600',
  },
  feedersList: {
    gap: Spacing.md,
  },
  alertsList: {
    gap: Spacing.sm,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderLeftWidth: 3,
  },
  alertCritical: {
    backgroundColor: 'rgba(255,23,68,0.05)',
    borderColor: 'rgba(255,23,68,0.15)',
    borderLeftColor: Colors.severityCritical,
  },
  alertWarning: {
    backgroundColor: 'rgba(255,176,32,0.05)',
    borderColor: 'rgba(255,176,32,0.15)',
    borderLeftColor: Colors.severityWarning,
  },
  alertInfo: {
    backgroundColor: 'rgba(0,212,255,0.05)',
    borderColor: 'rgba(0,212,255,0.15)',
    borderLeftColor: Colors.severityInfo,
  },
  alertTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  alertMessage: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
