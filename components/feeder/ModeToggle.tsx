// components/feeder/ModeToggle.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { FeederMode } from '../../types/feeder';
import { Colors, BorderRadius, Spacing } from '../../constants/theme';

interface ModeToggleProps {
  mode: FeederMode;
  onModeChange: (mode: FeederMode) => void;
  style?: ViewStyle;
}

export default function ModeToggle({ mode, onModeChange, style }: ModeToggleProps) {
  const isAuto = mode === 'automatic';
  const isPaused = mode === 'paused';
  const isManual = mode === 'manual';
  const isOffline = mode === 'offline';

  if (isOffline) {
    return (
      <View style={[styles.container, styles.offline, style]}>
        <Text style={styles.offlineText}>Feeder Offline</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => onModeChange('automatic')}
        style={[styles.button, isAuto && styles.activeButton]}
      >
        <Text style={[styles.text, isAuto && styles.activeText]}>Auto</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => onModeChange('paused')}
        style={[styles.button, isPaused && styles.activeButton]}
      >
        <Text style={[styles.text, isPaused && styles.activeText]}>Pause</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 4,
  },
  offline: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
  },
  offlineText: {
    color: Colors.textMuted,
    fontWeight: '500',
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  activeButton: {
    backgroundColor: Colors.accentMuted,
  },
  text: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  activeText: {
    color: Colors.accent,
  },
});
