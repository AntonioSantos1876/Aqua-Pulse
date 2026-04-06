// components/ui/GradientCard.tsx
// Reusable glassmorphism card with gradient background

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Shadow } from '../../constants/theme';

interface GradientCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  colors?: readonly [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  noPadding?: boolean;
  strongShadow?: boolean;
}

export default function GradientCard({
  children,
  style,
  colors = Colors.gradientCard,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  noPadding = false,
  strongShadow = false,
}: GradientCardProps) {
  return (
    <View style={[styles.outer, strongShadow ? Shadow.cardStrong : Shadow.card, style]}>
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        style={[styles.gradient, noPadding && styles.noPadding]}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  gradient: {
    borderRadius: BorderRadius.lg,
    padding: 16,
    overflow: 'hidden',
  },
  noPadding: {
    padding: 0,
  },
});
