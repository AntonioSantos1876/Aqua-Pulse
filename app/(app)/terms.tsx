// app/(app)/terms.tsx
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize } from '../../constants/theme';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: May 15, 2026</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing and using the Aqua Pulse platform, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
        </Text>

        <Text style={styles.sectionTitle}>2. User Account Security</Text>
        <Text style={styles.paragraph}>
          You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
        </Text>

        <Text style={styles.sectionTitle}>3. Telemetry and Hardware Usage</Text>
        <Text style={styles.paragraph}>
          Aqua Pulse hardware devices rely on network connectivity to function accurately. You agree that we are not responsible for hardware or livestock losses due to network connectivity failures, miscalibration, or improper deployment configuration.
        </Text>

        <Text style={styles.sectionTitle}>4. Disclaimer</Text>
        <Text style={styles.paragraph}>
          The materials on Aqua Pulse's platform are provided on an 'as is' basis. Aqua Pulse makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.
        </Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  backButton: { padding: Spacing.xs },
  headerTitle: { fontSize: FontSize.lg, fontWeight: 'bold', color: Colors.textPrimary },
  scroll: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  lastUpdated: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSize.md, fontWeight: 'bold', color: Colors.textPrimary, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  paragraph: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22 },
});
