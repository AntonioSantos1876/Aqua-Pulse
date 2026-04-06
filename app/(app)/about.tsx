// app/(app)/about.tsx
// System Architecture & About Screen for Aqua Pulse

import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/theme';

interface ArchBlock {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const ARCH_BLOCKS: ArchBlock[] = [
  { icon: 'phone-portrait-outline', title: 'Aqua Pulse App', description: 'React Native / Expo mobile application providing real-time dashboard, fleet management, telemetry charts, and remote command interfaces.', color: Colors.accent },
  { icon: 'wifi', title: 'LoRa / Offshore Comms', description: 'Long-range (LoRa) wireless protocol for offshore communication up to 5km. Ideal for environments without Wi-Fi infrastructure.', color: '#9C6FFF' },
  { icon: 'hardware-chip', title: 'ESP32 Control Unit', description: 'Embedded microcontroller running the feeder state machine: PRECHECK → SPINUP → DISPENSE → CLEARING → COMPLETE. Manages all safety logic locally.', color: '#FF8C42' },
  { icon: 'analytics-outline', title: 'Sensors', description: 'IMU (tilt detection), hopper load cell (feed level %), battery voltage ADC, lid magnetic switch, and motor current sense — all feeding the real-time telemetry dashboard.', color: Colors.statusOnline },
  { icon: 'cog-outline', title: 'Gate Actuator', description: 'Servo-driven gate controls feed dispensing. Step-position tracked and returned to home position after fault recovery.', color: Colors.statusWarning },
  { icon: 'ellipse-outline', title: 'Spreader Motor', description: 'Brushless DC motor driving the centrifugal spreader disc. Starts at max speed, decelerates during clearing, ensures even feed distribution across the cage surface.', color: Colors.teal },
  { icon: 'sunny-outline', title: 'Solar / Battery', description: 'Solar-charged sealed lead-acid or LiFePO4 battery bank powers the system. Battery voltage is monitored; critical levels block operation automatically.', color: '#FFB020' },
  { icon: 'shield-checkmark-outline', title: 'Safety System', description: 'E-Stop is active LOW. Local and remote E-Stop blocks all motor operation. Lid switch triggers immediate ESTOP. Tilt > 15° causes FAULT. All recoveries require explicit operator reset.', color: Colors.statusOffline },
  { icon: 'cloud-outline', title: 'Supabase Backend', description: 'Cloud Postgres database (via Supabase) persists feeder profiles, telemetry history, alerts, feed recommendations, and command logs for audit and reporting.', color: '#3ECF8E' },
];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Banner */}
      <LinearGradient
        colors={['#0a2a3a', '#003d5b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBanner}
      >
        <View style={styles.heroIcon}>
          <Ionicons name="water" size={32} color={Colors.accent} />
        </View>
        <View>
          <Text style={styles.heroTitle}>Aqua Pulse</Text>
          <Text style={styles.heroSubtitle}>Sea-Based Automatic Fish Farm Feeding System</Text>
          <Text style={styles.heroVersion}>v1.0 · Final Year Project · 2026</Text>
        </View>
      </LinearGradient>

      {/* Description */}
      <View style={styles.descBox}>
        <Text style={styles.descTitle}>About This System</Text>
        <Text style={styles.descText}>
          Aqua Pulse is the mobile monitoring and control interface for an autonomous offshore fish feeder designed during a Mechatronics Engineering final year project. The hardware system uses an ESP32 microcontroller, LoRa radio, and a suite of sensors to fully automate fish feeding from an offshore cage environment.{'\n\n'}
          This app acts as a digital twin — displaying live or simulated telemetry, allowing remote commands, and providing a complete historical and operational picture of each deployed feeder unit.
        </Text>
      </View>

      {/* Architecture Blocks */}
      <Text style={styles.sectionLabel}>SYSTEM ARCHITECTURE</Text>
      <View style={styles.archGrid}>
        {ARCH_BLOCKS.map((block) => (
          <View key={block.title} style={styles.archCard}>
            <View style={[styles.archIconWrap, { backgroundColor: `${block.color}20` }]}>
              <Ionicons name={block.icon as any} size={22} color={block.color} />
            </View>
            <View style={styles.archBody}>
              <Text style={styles.archTitle}>{block.title}</Text>
              <Text style={styles.archDesc}>{block.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* State Machine */}
      <Text style={styles.sectionLabel}>FEEDER STATE MACHINE</Text>
      <View style={styles.statesBox}>
        {['IDLE', 'PRECHECK', 'SPINUP', 'DISPENSE', 'CLEARING', 'COMPLETE'].map((s, i, arr) => (
          <React.Fragment key={s}>
            <View style={styles.stateChip}>
              <Text style={styles.stateText}>{s}</Text>
            </View>
            {i < arr.length - 1 && (
              <Ionicons name="arrow-forward" size={14} color={Colors.textMuted} />
            )}
          </React.Fragment>
        ))}
      </View>
      <View style={styles.faultRow}>
        <View style={[styles.stateChip, styles.faultChip]}>
          <Text style={[styles.stateText, { color: Colors.statusOffline }]}>FAULT</Text>
        </View>
        <Text style={styles.faultNote}>  ← Tilt | Critical Battery | Jam</Text>
      </View>
      <View style={styles.faultRow}>
        <View style={[styles.stateChip, styles.estopChip]}>
          <Text style={[styles.stateText, { color: '#D32F2F' }]}>ESTOP</Text>
        </View>
        <Text style={styles.faultNote}>  ← Lid Open | Remote Command</Text>
      </View>

      {/* Credits */}
      <View style={styles.credits}>
        <Text style={styles.creditsText}>Built as a Final Year Project · Mechatronics Engineering</Text>
        <Text style={styles.creditsText}>Aqua Pulse™ — All rights reserved</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.xxxl, gap: Spacing.xl },
  heroBanner: {
    borderRadius: BorderRadius.xl, padding: Spacing.xl, flexDirection: 'row', alignItems: 'center',
    gap: Spacing.lg, borderWidth: 1, borderColor: 'rgba(0,212,255,0.1)',
  },
  heroIcon: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.accentMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.white },
  heroSubtitle: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', marginTop: 2, maxWidth: 240 },
  heroVersion: { fontSize: FontSize.xs, color: Colors.accent, marginTop: 6, fontWeight: '600' },
  descBox: {
    backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border,
  },
  descTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  descText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
  sectionLabel: { fontSize: FontSize.xs, fontWeight: 'bold', color: Colors.textMuted, letterSpacing: 0.8, textTransform: 'uppercase' },
  archGrid: { gap: Spacing.sm },
  archCard: {
    flexDirection: 'row', gap: Spacing.md, backgroundColor: Colors.backgroundCard,
    padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border,
  },
  archIconWrap: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  archBody: { flex: 1, gap: 4 },
  archTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  archDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
  statesBox: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4 },
  stateChip: {
    backgroundColor: Colors.accentMuted, paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.border,
  },
  stateText: { fontSize: 10, fontWeight: 'bold', color: Colors.accent },
  faultRow: { flexDirection: 'row', alignItems: 'center' },
  faultChip: { backgroundColor: 'rgba(255,77,106,0.1)', borderColor: Colors.statusOffline },
  estopChip: { backgroundColor: 'rgba(211,47,47,0.1)', borderColor: '#D32F2F' },
  faultNote: { fontSize: FontSize.xs, color: Colors.textMuted },
  credits: { alignItems: 'center', gap: 4, paddingTop: Spacing.xl },
  creditsText: { fontSize: FontSize.xs, color: Colors.textMuted },
});
