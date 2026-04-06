// types/feeder.ts
// Core data models for the Aqua Pulse feeder fleet, mirroring the Supabase schema and real system logic.

export type FeederState = 'IDLE' | 'PRECHECK' | 'SPINUP' | 'DISPENSE' | 'CLEARING' | 'COMPLETE' | 'FAULT' | 'ESTOP';
export type HopperStatus = 'OK' | 'LOW' | 'CRITICAL';
export type BatteryStatus = 'OK' | 'LOW' | 'CRITICAL';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface DeploymentZone {
  id: string;
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

export interface FeederTelemetry {
  id?: string;
  feederId: string;
  state: FeederState;
  batteryVoltage: number;
  hopperPercent: number;
  tiltAngleDeg: number;
  recordedAt?: string;
}

export interface FeederProfile {
  id?: string;
  feederId: string;
  fishType: string;
  cageSize: string;
  fishAge: string;
  stockCount: number;
  averageFishMassKg?: number;
  
  hopperWarningThreshold: number;
  batteryWarningThreshold: number;
  batteryCriticalThreshold: number;
  tiltCriticalThreshold: number;
  
  notes?: string;
}

export interface FeedRecommendation {
  id?: string;
  feederId: string;
  estimatedBiomassKg: number;
  recommendedDailyFeedKg: number;
  recommendedFeedFrequencyPerDay: number;
  recommendedDispenseDurationSec: number;
  recommendedSpreaderLevel: number;
}

export interface FeederAlert {
  id: string;
  feederId: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface FeederDevice {
  id: string;
  deviceId: string;
  name: string;
  zoneId?: string;
  
  // Current Status Cache
  online: boolean;
  state: FeederState;
  
  // Telemetry Cache
  batteryVoltage: number;
  batteryStatus: BatteryStatus;
  hopperPercent: number;
  hopperStatus: HopperStatus;
  tiltAngleDeg: number;
  tiltStatus: string;
  
  // Mechanical Safety
  lidClosed: boolean;
  estopActive: boolean;
  remoteEstopLatched: boolean;
  
  // Spreader and Gate Info
  spreaderMaxLevel: number;
  spreaderCurrentLevel: number;
  spreaderRunning: boolean;
  spreaderStatus: string;
  
  gateStatus: string;
  gatePositionSteps: number;
  feedingActive: boolean;
  
  // Operational Logs
  feedCycleCount: number;
  lastFeedResult?: string;
  lastFaultMessage?: string;
  signalStrength: number;
  locationName?: string;
  
  lastUpdatedAt: string;
  createdAt: string;

  // Attached Relations for App Convenience
  profile?: FeederProfile;
  recommendation?: FeedRecommendation;
  telemetryHistory?: FeederTelemetry[];
  alerts?: FeederAlert[];
}

// Legacy compatibility types
export type FeederMode = 'automatic' | 'manual' | 'paused' | 'offline';

export interface DiscoveredDevice {
  hardwareId: string;
  signalStrength: number;
  loraDeviceEUI: string;
  firmwareVersion: string;
  isAlreadyPaired: boolean;
}
