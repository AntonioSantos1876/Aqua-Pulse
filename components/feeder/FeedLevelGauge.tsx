// components/feeder/FeedLevelGauge.tsx
import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CircularGauge from '../ui/CircularGauge';
import { Colors, FontSize, FontWeight } from '../../constants/theme';

interface FeedLevelGaugeProps {
  levelPercent: number;
  size?: number;
  style?: ViewStyle;
}

export default function FeedLevelGauge({ levelPercent, size = 120, style }: FeedLevelGaugeProps) {
  const isCritical = levelPercent <= 15;
  const isWarning = levelPercent <= 25 && levelPercent > 15;

  const gradientColors: [string, string] = isCritical
    ? [Colors.severityCritical, Colors.severityError]
    : isWarning
    ? [Colors.severityWarning, Colors.statusWarning]
    : [Colors.accent, Colors.teal];

  const color = isCritical ? Colors.severityCritical : isWarning ? Colors.severityWarning : Colors.accent;
  
  return (
    <View style={[styles.container, style]}>
      <CircularGauge
        value={levelPercent}
        size={size}
        gradientColors={gradientColors}
        color={color}
        label={`${Math.round(levelPercent)}%`}
        sublabel="Feed Level"
      />
      {isCritical && (
        <View style={styles.alertIcon}>
          <Ionicons name="warning" size={16} color={Colors.white} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  alertIcon: {
    position: 'absolute',
    bottom: 5,
    backgroundColor: Colors.severityCritical,
    borderRadius: 12,
    padding: 2,
    borderWidth: 2,
    borderColor: Colors.background,
  },
});
