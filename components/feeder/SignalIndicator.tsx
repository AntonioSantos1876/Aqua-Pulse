// components/feeder/SignalIndicator.tsx
// Visual bar indicator for LoRa signal strength

import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors, FontSize } from '../../constants/theme';

type CommunicationStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'lost';

const SIGNAL_CONFIG: Record<CommunicationStatus, { bars: number; color: string; label: string }> = {
  excellent: { bars: 5, color: Colors.signalExcellent, label: 'Excellent' },
  good:      { bars: 4, color: Colors.signalGood,      label: 'Good'      },
  fair:      { bars: 3, color: Colors.signalFair,      label: 'Fair'      },
  poor:      { bars: 2, color: Colors.signalPoor,      label: 'Poor'      },
  lost:      { bars: 0, color: Colors.signalLost,      label: 'Lost'      },
};

interface SignalIndicatorProps {
  status: CommunicationStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export default function SignalIndicator({
  status,
  showLabel = false,
  size = 'md',
  style,
}: SignalIndicatorProps) {
  const cfg = SIGNAL_CONFIG[status] ?? SIGNAL_CONFIG.lost;
  const totalBars = 5;
  const barWidth = size === 'sm' ? 3 : 4;
  const maxBarHeight = size === 'sm' ? 12 : 16;

  return (
    <View style={[styles.row, style]}>
      <View style={styles.bars}>
        {Array.from({ length: totalBars }).map((_, i) => {
          const barHeight = ((i + 1) / totalBars) * maxBarHeight;
          const active = i < cfg.bars;
          return (
            <View
              key={i}
              style={[
                styles.bar,
                {
                  width: barWidth,
                  height: barHeight,
                  backgroundColor: active ? cfg.color : 'rgba(74,99,128,0.3)',
                  borderRadius: barWidth / 2,
                },
              ]}
            />
          );
        })}
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bar: {},
  label: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
});
