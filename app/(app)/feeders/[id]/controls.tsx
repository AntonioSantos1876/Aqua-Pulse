// app/(app)/feeders/[id]/controls.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFeederStore } from '../../../../store/feederStore';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../../constants/theme';
import StatusBadge from '../../../../components/ui/StatusBadge';
import SimulationPanel from '../../../../components/feeder/SimulationPanel';

export default function ControlsModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const feeder = useFeederStore(s => s.getFeederById(id));
  const { triggerManualFeed, clearFaults, triggerRemoteEstop, clearRemoteEstop } = useFeederStore();

  const [loading, setLoading] = useState(false);

  if (!feeder) return null;

  const isOffline = !feeder.online;

  const handleFeed = () => {
    triggerManualFeed(feeder.id);
  };

  const isExecuting = feeder.state !== 'IDLE' && feeder.state !== 'FAULT' && feeder.state !== 'ESTOP';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Manual Controls</Text>
        <StatusBadge status={isOffline ? 'OFFLINE' : feeder.state} />
      </View>

      <Text style={styles.description}>
        Issue direct commands to {feeder.name}. Ensure the deployment zone is clear before operating machinery remotely.
      </Text>

      {/* Main Action Area */}
      <View style={styles.actionArea}>
        <TouchableOpacity 
          onPress={handleFeed} 
          disabled={loading || isOffline || isExecuting || feeder.state === 'FAULT' || feeder.state === 'ESTOP'}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              (isOffline || feeder.state === 'FAULT' || feeder.state === 'ESTOP') ? ['#4A6380', '#2C3E50'] 
              : isExecuting ? Colors.gradientSuccess 
              : Colors.gradientAccent
            }
            style={styles.bigButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {isExecuting ? (
               <ActivityIndicator color={Colors.white} size="large" />
            ) : (
               <Ionicons name="water" size={48} color={Colors.white} />
            )}
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.btnLabel}>
          {isExecuting ? 'Feeding...' : 'Run Feed Cycle'}
        </Text>
      </View>

      {/* Secondary Controls */}
      <View style={styles.secondaryGrid}>
        <TouchableOpacity 
          style={[styles.secondaryBtn, styles.faultBtn]}
          onPress={() => clearFaults(feeder.id)}
          disabled={isOffline}
        >
          <Ionicons name="refresh-circle-outline" size={24} color={Colors.white} />
          <Text style={styles.secondaryBtnText}>Reset Fault</Text>
        </TouchableOpacity>

        {feeder.remoteEstopLatched ? (
           <TouchableOpacity 
             style={[styles.secondaryBtn, styles.warningBtn]}
             onPress={() => clearRemoteEstop(feeder.id)}
             disabled={isOffline}
           >
             <Ionicons name="lock-open-outline" size={24} color={Colors.white} />
             <Text style={styles.secondaryBtnText}>Clear E-Stop</Text>
           </TouchableOpacity>
        ) : (
           <TouchableOpacity 
             style={[styles.secondaryBtn, styles.dangerBtn]}
             onPress={() => triggerRemoteEstop(feeder.id)}
             disabled={isOffline}
           >
             <Ionicons name="warning" size={24} color={Colors.white} />
             <Text style={styles.secondaryBtnText}>Remote E-Stop</Text>
           </TouchableOpacity>
        )}
      </View>

      {/* Developer Demo Panel */}
      <View style={styles.simulationSection}>
         <SimulationPanel feederId={feeder.id} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.xxl,
  },
  actionArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  bigButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    marginBottom: Spacing.lg,
  },
  btnLabel: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  secondaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  faultBtn: {
    backgroundColor: '#3b82f6', // blue
  },
  dangerBtn: {
    backgroundColor: Colors.severityError,
  },
  warningBtn: {
    backgroundColor: Colors.statusWarning,
  },
  secondaryBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: FontSize.md,
  },
  simulationSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderColor: Colors.border,
  }
});
