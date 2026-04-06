// components/ui/CircularGauge.tsx
// SVG circular progress gauge with animated fill

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, FontSize, FontWeight } from '../../constants/theme';

interface CircularGaugeProps {
  value: number;          // 0–100
  size?: number;          // diameter in px
  strokeWidth?: number;
  color?: string;
  trailColor?: string;
  label?: string;
  sublabel?: string;
  gradientColors?: [string, string];
  style?: ViewStyle;
}

export default function CircularGauge({
  value,
  size = 100,
  strokeWidth = 8,
  color = Colors.accent,
  trailColor = 'rgba(0,212,255,0.1)',
  label,
  sublabel,
  gradientColors,
  style,
}: CircularGaugeProps) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  // Non-animated for SVG (Animated doesn't work with SVG props directly)
  const clampedVal = Math.max(0, Math.min(100, value));
  const strokeDashoffset = circumference - (clampedVal / 100) * circumference;

  const gradId = 'gauge-grad';

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {gradientColors && (
          <Defs>
            <LinearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={gradientColors[0]} />
              <Stop offset="100%" stopColor={gradientColors[1]} />
            </LinearGradient>
          </Defs>
        )}
        {/* Trail */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={trailColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={gradientColors ? `url(#${gradId})` : color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${cx}, ${cy}`}
        />
      </Svg>
      <View style={styles.center}>
        {label !== undefined && (
          <Text style={[styles.value, { color }]}>{label}</Text>
        )}
        {sublabel && (
          <Text style={styles.sublabel}>{sublabel}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  sublabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
