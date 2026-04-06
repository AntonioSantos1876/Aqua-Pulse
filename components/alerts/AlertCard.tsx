// components/alerts/AlertCard.tsx
// Alert item card for the notifications screen

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeederAlert } from '../../types/feeder';
import {
  Colors,
  BorderRadius,
  FontSize,
  FontWeight,
  Spacing,
} from '../../constants/theme';
import { formatDistanceToNow } from 'date-fns';

type SeverityKey = FeederAlert['severity'];

const SEVERITY_CONFIG: Record<
  SeverityKey,
  { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }
> = {
  info:     { icon: 'information-circle', color: Colors.severityInfo,     bg: 'rgba(0,212,255,0.1)'  },
  warning:  { icon: 'warning',            color: Colors.severityWarning,  bg: 'rgba(255,176,32,0.1)' },
  critical: { icon: 'nuclear',            color: Colors.severityCritical, bg: 'rgba(255,23,68,0.1)'  },
};

interface AlertCardProps {
  alert: FeederAlert;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function AlertCard({ alert, onPress, style }: AlertCardProps) {
  const cfg = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG.info;
  const timeAgo = formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
      style={[
        styles.card,
        { borderLeftColor: cfg.color },
        !alert.isRead && styles.unread,
        style,
      ]}
    >
      {/* Unread dot */}
      {!alert.isRead && <View style={[styles.dot, { backgroundColor: cfg.color }]} />}

      <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
        <Ionicons name={cfg.icon} size={20} color={cfg.color} />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {alert.title}
          </Text>
          <Text style={styles.time}>{timeAgo}</Text>
        </View>
        <Text style={styles.feederName}>Feeder ID: {alert.feederId.slice(-6)}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {alert.message}
        </Text>
        <View style={[styles.typeBadge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.typeText, { color: cfg.color }]}>{alert.type.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  unread: {
    backgroundColor: Colors.backgroundCardAlt,
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    flexShrink: 0,
  },
  feederName: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  message: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  typeText: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.4,
  },
});
