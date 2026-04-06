// components/ui/ProgressBar.tsx
// Horizontal progress bar with gradient fill

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius } from '../../constants/theme';

interface ProgressBarProps {
  value: number;          // 0–100
  height?: number;
  colors?: readonly [string, string];
  trailColor?: string;
  style?: ViewStyle;
  rounded?: boolean;
}

export default function ProgressBar({
  value,
  height = 6,
  colors = Colors.gradientAccent,
  trailColor = 'rgba(0,212,255,0.1)',
  style,
  rounded = true,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  const br = rounded ? height : 0;

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: trailColor,
          borderRadius: br,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: `${pct}%`,
          height,
          borderRadius: br,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    width: '100%',
  },
});
