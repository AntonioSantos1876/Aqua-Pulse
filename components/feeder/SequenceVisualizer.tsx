import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FeederState } from '../../types/feeder';
import { Colors, Spacing } from '../../constants/theme';

interface SequenceVisualizerProps {
  systemState: FeederState;
}

const PHASES: FeederState[] = ['IDLE', 'PRECHECK', 'SPINUP', 'DISPENSE', 'CLEARING', 'COMPLETE'];

export function SequenceVisualizer({ systemState }: SequenceVisualizerProps) {
  // If in FAULT/ESTOP, color the bar red
  const isFault = systemState === 'FAULT' || systemState === 'ESTOP';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Operation Sequence Tracker</Text>
      
      <View style={styles.track}>
        {PHASES.map((phase, index) => {
          const isActive = systemState === phase;
          const isPast = !isFault && PHASES.indexOf(systemState) > index && systemState !== 'IDLE';
          
          let bgColor = Colors.backgroundSecondary;
          let textColor = Colors.textMuted;
          let borderColor = 'transparent';

          if (isFault) {
            bgColor = Colors.backgroundSecondary;
            textColor = Colors.severityError;
            borderColor = Colors.severityError;
          } else if (isActive && systemState !== 'IDLE') {
            bgColor = 'rgba(0, 212, 255, 0.1)';
            textColor = Colors.accent;
            borderColor = Colors.accent;
          } else if (isPast) {
            bgColor = 'rgba(0, 230, 118, 0.1)';
            textColor = Colors.textSuccess;
          }

          return (
            <React.Fragment key={phase}>
              <View style={[styles.node, { backgroundColor: bgColor, borderColor, borderWidth: isActive ? 1 : 0 }]}>
                <Text style={[styles.nodeText, { color: textColor }]}>
                  {phase}
                </Text>
              </View>
              {index < PHASES.length - 1 && (
                <View style={[styles.connector, { backgroundColor: isPast ? Colors.textSuccess : Colors.border }]} />
              )}
            </React.Fragment>
          );
        })}
      </View>
      {isFault && <Text style={styles.faultText}>SEQUENCE HALTED: {systemState}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  node: {
    flex: 1,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  nodeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  connector: {
    width: 6,
    height: 2,
    marginHorizontal: 2,
  },
  faultText: {
    marginTop: Spacing.md,
    color: Colors.severityError,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
});
