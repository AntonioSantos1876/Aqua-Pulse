// components/feeder/FeederCard.tsx
// Summary card for the feeder list screen, updated for FeederDevice

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FeederDevice } from '../../types/feeder';
import StatusBadge from '../ui/StatusBadge';
import ProgressBar from '../ui/ProgressBar';
import {
  Colors,
  BorderRadius,
  FontSize,
  FontWeight,
  Shadow,
  Spacing,
} from '../../constants/theme';
import { format } from 'date-fns';

interface FeederCardProps {
  feeder: FeederDevice;
  onPress: () => void;
  style?: ViewStyle;
}

function getBatteryIcon(status: string): keyof typeof Ionicons.glyphMap {
  if (status === 'OK') return 'battery-full';
  if (status === 'LOW') return 'battery-half';
  return 'battery-dead';
}

function getBatteryColor(status: string): string {
  if (status === 'OK') return Colors.statusOnline;
  if (status === 'LOW') return Colors.statusWarning;
  return Colors.statusOffline;
}

export default function FeederCard({ feeder, onPress, style }: FeederCardProps) {
  const isOffline = !feeder.online;
  const feedLevelColor =
    feeder.hopperPercent > 50
      ? Colors.statusOnline
      : feeder.hopperPercent > 20
      ? Colors.statusWarning
      : Colors.statusOffline;

  // Use string union type for badge status which supports 'OFFLINE'
  const overallStatus: string = isOffline ? 'OFFLINE' : feeder.state;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[Shadow.card, styles.wrapper, style]}
    >
      <LinearGradient
        colors={Colors.gradientCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Header row */}
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <View style={[styles.iconWrap, isOffline && styles.iconWrapOffline]}>
              <Ionicons
                 name="water"
                size={18}
                color={isOffline ? Colors.textMuted : Colors.accent}
              />
            </View>
            <View>
              <Text style={styles.name}>{feeder.name}</Text>
              <Text style={styles.zone}>{feeder.locationName || 'Unknown Zone'}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <StatusBadge status={overallStatus as any} small />
            <Ionicons
              name="chevron-forward"
              size={16}
              color={Colors.textMuted}
              style={{ marginTop: 4 }}
            />
          </View>
        </View>

        {/* Feed Level */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.metaLabel}>Hopper Level</Text>
            <Text style={[styles.metaVal, { color: feedLevelColor }]}>
              {feeder.hopperPercent.toFixed(1)}%
            </Text>
          </View>
          <ProgressBar
            value={feeder.hopperPercent}
            height={5}
            colors={
              feeder.hopperPercent > 20
                ? Colors.gradientAccent
                : Colors.gradientDanger
            }
          />
        </View>

        {/* Footer row - Battery / Signal / Last Update */}
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Ionicons
              name={getBatteryIcon(feeder.batteryStatus)}
              size={14}
              color={getBatteryColor(feeder.batteryStatus)}
            />
            <Text style={[styles.footerText, { color: getBatteryColor(feeder.batteryStatus) }]}>
              {feeder.batteryVoltage.toFixed(1)}V
            </Text>
          </View>

          <View style={styles.footerItem}>
            <Ionicons
              name="wifi"
              size={14}
              color={feeder.signalStrength > -60 ? Colors.statusOnline : feeder.signalStrength > -85 ? Colors.statusWarning : Colors.statusOffline}
            />
            <Text style={styles.footerText}>{feeder.signalStrength} dBm</Text>
          </View>

          <View style={styles.footerItem}>
            <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.footerText}>
              {feeder.lastUpdatedAt
                ? format(new Date(feeder.lastUpdatedAt), 'HH:mm')
                : '—'}
            </Text>
          </View>

          {feeder.alerts && feeder.alerts.length > 0 && (
            <View style={styles.alertBadge}>
              <Ionicons name="warning" size={12} color={Colors.statusWarning} />
              <Text style={styles.alertCount}>{feeder.alerts.length}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapOffline: {
    backgroundColor: 'rgba(74,99,128,0.15)',
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  zone: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  section: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  metaVal: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 'auto',
    backgroundColor: 'rgba(255,176,32,0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  alertCount: {
    fontSize: 11,
    color: Colors.statusWarning,
    fontWeight: FontWeight.bold,
  },
});
