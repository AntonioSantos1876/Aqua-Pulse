// components/ui/StatusBadge.tsx
// Pill badge showing feeder state with appropriate color

import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors, BorderRadius, FontSize, FontWeight } from '../../constants/theme';

export type BadgeStatusType = 'IDLE' | 'PRECHECK' | 'SPINUP' | 'DISPENSE' | 'CLEARING' | 'COMPLETE' | 'FAULT' | 'ESTOP' | 'OFFLINE';

const STATUS_CONFIG: Record<BadgeStatusType, { label: string; color: string; bg: string }> = {
  IDLE:      { label: 'Standby',  color: '#FFB020', bg: 'rgba(255,176,32,0.15)' }, // yellow
  PRECHECK:  { label: 'Checking', color: Colors.statusSyncing, bg: 'rgba(0,212,255,0.15)' },
  SPINUP:    { label: 'Running',  color: Colors.statusOnline, bg: 'rgba(0,230,118,0.15)' }, // green
  DISPENSE:  { label: 'Feeding',  color: Colors.statusOnline, bg: 'rgba(0,230,118,0.15)' }, // green
  CLEARING:  { label: 'Clearing', color: Colors.statusOnline, bg: 'rgba(0,230,118,0.15)' }, // green
  COMPLETE:  { label: 'Done',     color: '#2196F3', bg: 'rgba(33,150,243,0.15)' }, // blue
  FAULT:     { label: 'Fault',    color: Colors.statusOffline, bg: 'rgba(255,77,106,0.15)' }, // red
  ESTOP:     { label: 'E-Stop',   color: '#D32F2F', bg: 'rgba(211,47,47,0.15)' }, // deeper red
  OFFLINE:   { label: 'Offline',  color: Colors.textMuted, bg: 'rgba(74,99,128,0.15)' },
};

interface StatusBadgeProps {
  status: BadgeStatusType | string;
  style?: ViewStyle;
  small?: boolean;
}

export default function StatusBadge({ status, style, small = false }: StatusBadgeProps) {
  const safeStatus = (STATUS_CONFIG[status as BadgeStatusType] ? status : 'OFFLINE') as BadgeStatusType;
  const cfg = STATUS_CONFIG[safeStatus];

  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }, small && styles.small, style]}>
      <View style={[styles.dot, { backgroundColor: cfg.color }]} />
      <Text style={[styles.label, { color: cfg.color }, small && styles.smallLabel]}>
        {cfg.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 5,
  },
  small: {
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.3,
  },
  smallLabel: {
    fontSize: 10,
  },
});
