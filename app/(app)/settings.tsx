// app/(app)/settings.tsx
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, Alert as RNAlert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useFeederStore } from '../../store/feederStore';
import { MOCK_FEEDERS } from '../../mocks/feeders';
import { MOCK_ALERTS } from '../../mocks/alerts';
import { Colors, Spacing, FontSize, BorderRadius, FontWeight } from '../../constants/theme';

function SettingRow({ icon, label, value, onPress, danger }: { icon: string; label: string; value?: React.ReactNode; onPress?: () => void; danger?: boolean }) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingInfo}>
        <Ionicons name={icon as any} size={20} color={danger ? Colors.statusOffline : Colors.textPrimary} />
        <Text style={[styles.settingText, danger && { color: Colors.statusOffline }]}>{label}</Text>
      </View>
      {value ?? <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const [notifs, setNotifs] = React.useState(true);
  const { feeders, alerts } = useFeederStore();

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/welcome');
  };

  const handleReset = () => {
    RNAlert.alert(
      'Reset Demo Data',
      'This will restore all feeders to their initial mock states. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset', style: 'destructive',
          onPress: () => {
            useFeederStore.setState({ feeders: MOCK_FEEDERS, alerts: MOCK_ALERTS });
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      {user && (
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.avatarInitials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user.role?.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      )}

      <Text style={styles.sectionLabel}>FLEET</Text>
      <View style={styles.settingGroup}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="water-outline" size={20} color={Colors.textPrimary} />
            <Text style={styles.settingText}>Total Feeders</Text>
          </View>
          <Text style={styles.versionText}>{feeders.length} deployed</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications-outline" size={20} color={Colors.textPrimary} />
            <Text style={styles.settingText}>Unread Alerts</Text>
          </View>
          <Text style={styles.versionText}>{alerts.filter(a => !a.isRead).length}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>PREFERENCES</Text>
      <View style={styles.settingGroup}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications-outline" size={20} color={Colors.textPrimary} />
            <Text style={styles.settingText}>Push Notifications</Text>
          </View>
          <Switch value={notifs} onValueChange={setNotifs} trackColor={{ true: Colors.accent, false: Colors.backgroundSecondary }} thumbColor={Colors.white} />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon-outline" size={20} color={Colors.textPrimary} />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch value={true} onValueChange={() => {}} trackColor={{ true: Colors.accent, false: Colors.backgroundSecondary }} thumbColor={Colors.white} />
        </View>
      </View>

      <Text style={styles.sectionLabel}>SYSTEM</Text>
      <View style={styles.settingGroup}>
        <SettingRow icon="information-circle-outline" label="About Aqua Pulse" onPress={() => router.push('/(app)/about' as any)} />
        <View style={styles.divider} />
        <SettingRow icon="hardware-chip-outline" label="System Architecture" onPress={() => router.push('/(app)/about' as any)} />
        <View style={styles.divider} />
        <SettingRow
          icon="refresh-circle-outline"
          label="Reset Demo Data"
          onPress={handleReset}
        />
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="code-slash-outline" size={20} color={Colors.textPrimary} />
            <Text style={styles.settingText}>Version</Text>
          </View>
          <Text style={styles.versionText}>v1.0.0 (Demo)</Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Sign Out</Text>
        <Ionicons name="log-out-outline" size={18} color={Colors.statusOffline} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.xxxl },
  title: { fontSize: FontSize.xxl, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: Spacing.xl },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.backgroundCard,
    padding: Spacing.lg, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.xxl, gap: Spacing.lg,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.accentMuted,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  avatarText: { fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.accent },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontSize: FontSize.lg, fontWeight: 'bold', color: Colors.textPrimary },
  profileEmail: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 4 },
  roleBadge: { backgroundColor: 'rgba(74,99,128,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.sm, alignSelf: 'flex-start' },
  roleText: { fontSize: 10, fontWeight: 'bold', color: Colors.textMuted },
  sectionLabel: { fontSize: FontSize.xs, fontWeight: 'bold', color: Colors.textMuted, marginBottom: Spacing.sm, paddingHorizontal: Spacing.sm, letterSpacing: 0.5 },
  settingGroup: {
    backgroundColor: Colors.backgroundSecondary, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xxl, overflow: 'hidden',
  },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg },
  settingInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  settingText: { fontSize: FontSize.md, color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 50 },
  versionText: { fontSize: FontSize.sm, color: Colors.textMuted },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,77,106,0.1)', borderRadius: BorderRadius.md, paddingVertical: 14,
    borderWidth: 1, borderColor: 'rgba(255,77,106,0.2)', gap: Spacing.sm, marginTop: Spacing.lg,
  },
  logoutText: { fontSize: FontSize.md, fontWeight: 'bold', color: Colors.statusOffline },
});
