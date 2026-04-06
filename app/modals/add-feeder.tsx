// app/modals/add-feeder.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';
import { MOCK_DISCOVERED_DEVICES } from '../../mocks/discoveredDevices';
import { useFeederStore } from '../../store/feederStore';
import { FISH_TYPES } from '../../constants/fishTypes';
import { calculateFeedRecommendation } from '../../lib/fishMath';

type WizardStep = 'scan' | 'list' | 'configName' | 'configCage' | 'configFish' | 'confirm';

export default function AddFeederWizard() {
  const [step, setStep] = useState<WizardStep>('scan');
  const [devices, setDevices] = useState<typeof MOCK_DISCOVERED_DEVICES>([]);
  const [selectedDevice, setSelectedDevice] = useState<typeof MOCK_DISCOVERED_DEVICES[0] | null>(null);
  
  // Step 1: Config Name
  const [name, setName] = useState('');
  const [zone, setZone] = useState('');

  // Step 2: Config Cage
  const [cageSize, setCageSize] = useState('15');
  const [stockCount, setStockCount] = useState('5000');
  const [fishAge, setFishAge] = useState<'Smolt' | 'Grow-out' | 'Harvest'>('Smolt');

  // Step 3: Config Fish
  const [fishType, setFishType] = useState('snapper');

  // Add function from store
  const addFeeder = useFeederStore(s => s.addFeeder);

  useEffect(() => {
    if (step === 'scan') {
      const timer = setTimeout(() => {
        setDevices(MOCK_DISCOVERED_DEVICES.filter(d => !d.isAlreadyPaired));
        setStep('list');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleFinish = () => {
    if (selectedDevice) {
      const recommendations = calculateFeedRecommendation({
        stockCount: parseInt(stockCount, 10) || 5000,
        fishAge,
        cageDiameter: parseFloat(cageSize) || 15,
        fishType
      });

      addFeeder({
        id: `feeder-new-${Date.now()}`,
        deviceId: selectedDevice.hardwareId,
        name: name || 'New Feeder',
        online: true,
        state: 'IDLE',
        batteryVoltage: 12.8,
        batteryStatus: 'OK',
        hopperPercent: 100,
        hopperStatus: 'OK',
        tiltAngleDeg: 0,
        tiltStatus: 'OK',
        lidClosed: true,
        estopActive: false,
        remoteEstopLatched: false,
        spreaderMaxLevel: recommendations.recommendedSpreaderLevel,
        spreaderCurrentLevel: 0,
        spreaderRunning: false,
        spreaderStatus: 'OK',
        gateStatus: 'CLOSED',
        gatePositionSteps: 0,
        feedingActive: false,
        feedCycleCount: 0,
        lastFeedResult: '',
        lastFaultMessage: '',
        signalStrength: selectedDevice.signalStrength,
        locationName: zone || 'Offshore Deployment',
        lastUpdatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        alerts: [],
        
        // Setup Profile and Saved Recommendations
        profile: {
          feederId: '',
          fishType,
          cageSize: `${cageSize}m`,
          fishAge,
          stockCount: parseInt(stockCount, 10) || 0,
          hopperWarningThreshold: 20,
          batteryWarningThreshold: 11.5,
          batteryCriticalThreshold: 10.8,
          tiltCriticalThreshold: 15,
        },
        recommendation: {
          feederId: '',
          estimatedBiomassKg: recommendations.estimatedBiomassKg,
          recommendedDailyFeedKg: recommendations.recommendedDailyFeedKg,
          recommendedFeedFrequencyPerDay: recommendations.recommendedFeedFrequencyPerDay,
          recommendedDispenseDurationSec: recommendations.recommendedDispenseDurationSec,
          recommendedSpreaderLevel: recommendations.recommendedSpreaderLevel,
        }
      });
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Feeder</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {step === 'scan' && (
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color={Colors.accent} style={{ marginBottom: Spacing.xl }} />
          <Text style={styles.scanTitle}>Scanning for Devices...</Text>
          <Text style={styles.scanDesc}>Make sure your feeder is powered on and flashing blue.</Text>
        </View>
      )}

      {step === 'list' && (
        <ScrollView style={styles.flex} contentContainerStyle={styles.padContent}>
          <Text style={styles.stepTitle}>Select a Device to Pair</Text>
          {devices.map(d => (
            <TouchableOpacity key={d.hardwareId} style={styles.card} onPress={() => { setSelectedDevice(d); setStep('configName'); }}>
              <Ionicons name="hardware-chip-outline" size={32} color={Colors.accent} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{d.hardwareId}</Text>
                <Text style={styles.cardSub}>Signal: {d.signalStrength} dBm</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {step === 'configName' && (
        <View style={[styles.flex, styles.padContent]}>
          <Text style={styles.stepTitle}>Feeder Basics</Text>

          <Text style={styles.label}>Feeder Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Bay 03" placeholderTextColor={Colors.textMuted} value={name} onChangeText={setName} autoFocus />

          <Text style={[styles.label, { marginTop: Spacing.lg }]}>Deployment Zone</Text>
          <TextInput style={styles.input} placeholder="e.g. Open Ocean Grid" placeholderTextColor={Colors.textMuted} value={zone} onChangeText={setZone} />

          <TouchableOpacity style={[styles.primaryBtn, { marginTop: 'auto' }]} onPress={() => setStep('configCage')} disabled={!name}>
            <Text style={styles.primaryBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'configCage' && (
        <View style={[styles.flex, styles.padContent]}>
          <Text style={styles.stepTitle}>Cage Parameters</Text>
          <Text style={styles.scanDesc}>These inputs inform the digital-twin biomass tracking system.</Text>

          <View style={{ flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Cage Diameter (m)</Text>
              <TextInput style={styles.input} value={cageSize} onChangeText={setCageSize} keyboardType="decimal-pad" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Stocking / Count</Text>
              <TextInput style={styles.input} value={stockCount} onChangeText={setStockCount} keyboardType="number-pad" />
            </View>
          </View>

          <Text style={[styles.label, { marginTop: Spacing.lg }]}>Fish Age Stage</Text>
          <View style={styles.ageSelector}>
             {['Smolt', 'Grow-out', 'Harvest'].map(age => (
                <TouchableOpacity 
                   key={age} 
                   style={[styles.ageBtn, fishAge === age && styles.ageBtnActive]}
                   onPress={() => setFishAge(age as any)}
                >
                   <Text style={[styles.ageText, fishAge === age && styles.ageTextActive]}>{age}</Text>
                </TouchableOpacity>
             ))}
          </View>
          
          <TouchableOpacity style={[styles.primaryBtn, { marginTop: 'auto' }]} onPress={() => setStep('configFish')}>
            <Text style={styles.primaryBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'configFish' && (
        <ScrollView style={styles.flex} contentContainerStyle={styles.padContent}>
          <Text style={styles.stepTitle}>Select Fish Type</Text>
          <Text style={styles.scanDesc}>The metabolic profile algorithm uses this for feed volume calculation.</Text>

          {FISH_TYPES.map(ft => (
            <TouchableOpacity 
              key={ft.id} 
              style={[styles.fishCard, fishType === ft.id && styles.fishCardActive, !ft.isAvailable && styles.fishCardDisabled]}
              onPress={() => ft.isAvailable && setFishType(ft.id)}
              disabled={!ft.isAvailable}
            >
              <Text style={styles.fishIcon}>{ft.icon}</Text>
              <View style={styles.fishInfo}>
                 <Text style={[styles.fishName, fishType === ft.id && { color: Colors.accent }]}>{ft.name}</Text>
                 {!ft.isAvailable && <Text style={styles.comingSoon}>Coming Soon</Text>}
              </View>
              {fishType === ft.id && <Ionicons name="checkmark-circle" size={24} color={Colors.accent} />}
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[styles.primaryBtn, { marginTop: Spacing.xl }]} onPress={() => setStep('confirm')}>
            <Text style={styles.primaryBtnText}>Review System Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {step === 'confirm' && (
        <View style={[styles.flex, styles.padContent]}>
           <Text style={styles.stepTitle}>Confirm Deployment</Text>
           
           <View style={styles.summaryBox}>
             {/* Display result of our calculations inline */}
             {(() => {
                const rec = calculateFeedRecommendation({
                  stockCount: parseInt(stockCount, 10) || 5000,
                  fishAge,
                  cageDiameter: parseFloat(cageSize) || 15,
                  fishType
                });

                return (
                   <>
                     <Text style={styles.summaryLabel}>Device</Text>
                     <Text style={styles.summaryVal}>{selectedDevice?.hardwareId} ({name})</Text>

                     <Text style={[styles.summaryLabel, { marginTop: Spacing.md }]}>Estimated Biomass</Text>
                     <Text style={styles.summaryVal}>{rec.estimatedBiomassKg.toFixed(2)} Kg</Text>
                     
                     <Text style={[styles.summaryLabel, { marginTop: Spacing.md }]}>Target Daily Feed</Text>
                     <Text style={styles.summaryVal}>{rec.recommendedDailyFeedKg.toFixed(2)} Kg/day</Text>
                     
                     <Text style={[styles.summaryLabel, { marginTop: Spacing.md }]}>Distribution</Text>
                     <Text style={styles.summaryVal}>{rec.recommendedFeedFrequencyPerDay} feeds of ~{rec.recommendedDispenseDurationSec} sec/each</Text>
                     
                     <Text style={[styles.summaryLabel, { marginTop: Spacing.md }]}>Initial Mode</Text>
                     <Text style={styles.summaryVal}>Algorithms applied</Text>
                   </>
                );
             })()}
           </View>

           <TouchableOpacity style={[styles.primaryBtn, { marginTop: 'auto' }]} onPress={handleFinish}>
            <Text style={styles.primaryBtnText}>Finish & Deploy Feeder</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: FontSize.lg, fontWeight: 'bold', color: Colors.textPrimary },
  closeBtn: { padding: 4 },
  flex: { flex: 1 },
  padContent: { padding: Spacing.lg, paddingBottom: 40 },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  scanTitle: { fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: Spacing.sm },
  scanDesc: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  stepTitle: { fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: Spacing.xl },
  
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.backgroundCard, padding: Spacing.lg, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md, gap: Spacing.md },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: FontSize.md, fontWeight: 'bold', color: Colors.textPrimary },
  cardSub: { fontSize: FontSize.sm, color: Colors.textMuted },
  
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: Colors.backgroundCard, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, padding: Spacing.md, color: Colors.textPrimary, fontSize: FontSize.md },
  
  ageSelector: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  ageBtn: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.backgroundCard },
  ageBtnActive: { borderColor: Colors.accent, backgroundColor: 'rgba(0, 212, 255, 0.1)' },
  ageText: { color: Colors.textSecondary, fontWeight: '600', fontSize: FontSize.sm },
  ageTextActive: { color: Colors.accent },

  fishCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, backgroundColor: Colors.backgroundCard, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, marginBottom: Spacing.sm, gap: Spacing.md },
  fishCardActive: { borderColor: Colors.accent, backgroundColor: 'rgba(0,212,255,0.05)' },
  fishCardDisabled: { opacity: 0.5 },
  fishIcon: { fontSize: 24 },
  fishInfo: { flex: 1 },
  fishName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  comingSoon: { fontSize: 10, color: Colors.textMuted, marginTop: 2, textTransform: 'uppercase', fontWeight: 'bold' },
  
  summaryBox: { backgroundColor: Colors.backgroundCard, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.lg, padding: Spacing.lg },
  summaryLabel: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: 4 },
  summaryVal: { fontSize: FontSize.lg, fontWeight: 'bold', color: Colors.textPrimary },

  primaryBtn: { backgroundColor: Colors.accent, padding: Spacing.lg, borderRadius: BorderRadius.full, alignItems: 'center' },
  primaryBtnText: { color: Colors.background, fontSize: FontSize.lg, fontWeight: 'bold' },
});
