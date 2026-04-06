// mocks/feeders.ts
// Realistic mock feeder data matching the FeederDevice Supabase schema

import { FeederDevice, FeederTelemetry } from '../types/feeder';
import { subHours, subMinutes, addHours } from 'date-fns';

const now = new Date();

// Helper for generating historical telemetry charts
export function makeTelemetryHistory(
  feederId: string,
  baseHopperPercent: number,
  baseBattery: number,
  points = 24
): FeederTelemetry[] {
  return Array.from({ length: points }, (_, i) => ({
    feederId,
    state: i === points - 1 ? 'IDLE' : 'IDLE',
    recordedAt: subHours(now, points - i).toISOString(),
    hopperPercent: Math.max(5, baseHopperPercent + i * 0.8 + (Math.random() - 0.5) * 2), // Simulate gradually going down
    batteryVoltage: Math.max(10.5, baseBattery - i * 0.05 + (Math.random() - 0.5) * 0.1),
    tiltAngleDeg: (Math.random() - 0.5) * 1.5,
  }));
}

// FEEDER 1 — Alpha (Healthy, Salmon, Online)
export const MOCK_FEEDER_ALPHA: FeederDevice = {
  id: '22222222-2222-2222-2222-222222222221',
  deviceId: 'FDR-001',
  name: 'Alpha Feeder',
  zoneId: '11111111-1111-1111-1111-111111111111',
  online: true,
  state: 'IDLE',
  batteryVoltage: 12.8,
  batteryStatus: 'OK',
  hopperPercent: 88,
  hopperStatus: 'OK',
  tiltAngleDeg: 1.2,
  tiltStatus: 'OK',
  lidClosed: true,
  estopActive: false,
  remoteEstopLatched: false,
  spreaderMaxLevel: 10,
  spreaderCurrentLevel: 0,
  spreaderRunning: false,
  spreaderStatus: 'OK',
  gateStatus: 'CLOSED',
  gatePositionSteps: 0,
  feedingActive: false,
  feedCycleCount: 42,
  lastFeedResult: 'SUCCESS',
  lastFaultMessage: '',
  signalStrength: -40,
  locationName: 'North Pen',
  lastUpdatedAt: subMinutes(now, 1).toISOString(),
  createdAt: subHours(now, 120).toISOString(),
  
  profile: {
    feederId: '22222222-2222-2222-2222-222222222221',
    fishType: 'Salmon',
    cageSize: '15m x 15m',
    fishAge: 'Smolt',
    stockCount: 5000,
    hopperWarningThreshold: 20,
    batteryWarningThreshold: 11.5,
    batteryCriticalThreshold: 10.8,
    tiltCriticalThreshold: 15,
  },
  telemetryHistory: makeTelemetryHistory('22222222-2222-2222-2222-222222222221', 40, 12.8),
  alerts: [],
};

// FEEDER 2 — Beta (Fault: Lid Open, Warning Battery)
export const MOCK_FEEDER_BETA: FeederDevice = {
  id: '22222222-2222-2222-2222-222222222222',
  deviceId: 'FDR-002',
  name: 'Beta Feeder',
  zoneId: '11111111-1111-1111-1111-111111111111',
  online: true,
  state: 'ESTOP', // ESTOP due to lid open
  batteryVoltage: 11.2,
  batteryStatus: 'LOW',
  hopperPercent: 45,
  hopperStatus: 'OK',
  tiltAngleDeg: 2.5,
  tiltStatus: 'OK',
  lidClosed: false,
  estopActive: true, // Hardware interlock triggered
  remoteEstopLatched: false,
  spreaderMaxLevel: 10,
  spreaderCurrentLevel: 0,
  spreaderRunning: false,
  spreaderStatus: 'OK',
  gateStatus: 'CLOSED',
  gatePositionSteps: 0,
  feedingActive: false,
  feedCycleCount: 134,
  lastFeedResult: 'INTERRUPTED',
  lastFaultMessage: 'Safety lid opened during operation',
  signalStrength: -72,
  locationName: 'North Pen',
  lastUpdatedAt: subMinutes(now, 5).toISOString(),
  createdAt: subHours(now, 300).toISOString(),
  
  profile: {
    feederId: '22222222-2222-2222-2222-222222222222',
    fishType: 'Salmon',
    cageSize: '20m x 20m',
    fishAge: 'Grow-out',
    stockCount: 8000,
    hopperWarningThreshold: 20,
    batteryWarningThreshold: 11.5,
    batteryCriticalThreshold: 10.8,
    tiltCriticalThreshold: 15,
  },
  telemetryHistory: makeTelemetryHistory('22222222-2222-2222-2222-222222222222', 45, 11.2),
  alerts: [
    {
      id: 'alert-1',
      feederId: '22222222-2222-2222-2222-222222222222',
      title: 'Lid Open',
      message: 'Hopper lid was opened. System halted.',
      severity: 'critical',
      type: 'hardware',
      isRead: false,
      createdAt: subMinutes(now, 5).toISOString(),
    }
  ],
};

// FEEDER 3 — Gamma (Offline, Low Hopper)
export const MOCK_FEEDER_GAMMA: FeederDevice = {
  id: '22222222-2222-2222-2222-222222222223',
  deviceId: 'FDR-003',
  name: 'Gamma Feeder',
  zoneId: '11111111-1111-1111-1111-111111111111',
  online: false,
  state: 'IDLE',
  batteryVoltage: 12.1,
  batteryStatus: 'OK',
  hopperPercent: 12,
  hopperStatus: 'LOW',
  tiltAngleDeg: -0.5,
  tiltStatus: 'OK',
  lidClosed: true,
  estopActive: false,
  remoteEstopLatched: false,
  spreaderMaxLevel: 10,
  spreaderCurrentLevel: 0,
  spreaderRunning: false,
  spreaderStatus: 'OK',
  gateStatus: 'CLOSED',
  gatePositionSteps: 0,
  feedingActive: false,
  feedCycleCount: 87,
  lastFeedResult: 'SUCCESS',
  lastFaultMessage: '',
  signalStrength: -105,
  locationName: 'South Pen',
  lastUpdatedAt: subHours(now, 3).toISOString(),
  createdAt: subHours(now, 800).toISOString(),
  
  profile: {
    feederId: '22222222-2222-2222-2222-222222222223',
    fishType: 'Salmon',
    cageSize: '15m x 15m',
    fishAge: 'Smolt',
    stockCount: 4500,
    hopperWarningThreshold: 20,
    batteryWarningThreshold: 11.5,
    batteryCriticalThreshold: 10.8,
    tiltCriticalThreshold: 15,
  },
  telemetryHistory: makeTelemetryHistory('22222222-2222-2222-2222-222222222223', 12, 12.1),
  alerts: [
    {
      id: 'alert-2',
      feederId: '22222222-2222-2222-2222-222222222223',
      title: 'Low Hopper',
      message: 'Feed level is below 20%. Refill required.',
      severity: 'warning',
      type: 'consumables',
      isRead: false,
      createdAt: subHours(now, 2).toISOString(),
    }
  ],
};

export const MOCK_FEEDERS: FeederDevice[] = [
  MOCK_FEEDER_ALPHA,
  MOCK_FEEDER_BETA,
  MOCK_FEEDER_GAMMA,
];
