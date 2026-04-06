// store/feederStore.ts
// Robust Simulation Engine & Zustand Store for Feeder Devices

import { create } from 'zustand';
import { FeederDevice, FeederState, FeederAlert } from '../types/feeder';
import { MOCK_FEEDERS } from '../mocks/feeders';
import { MOCK_ALERTS } from '../mocks/alerts';

/** Simple ID generator — avoids uuid ESM issues in React Native */
const genId = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

interface FeederStore {
  feeders: FeederDevice[];
  alerts: FeederAlert[];
  selectedFeederId: string | null;

  // Selection
  setSelectedFeeder: (id: string | null) => void;
  getFeederById: (id: string) => FeederDevice | undefined;

  // CRUD
  addFeeder: (feeder: FeederDevice) => void;
  updateFeeder: (id: string, partial: Partial<FeederDevice>) => void;
  removeFeeder: (id: string) => void;

  // Simulation Controls & Commands
  triggerManualFeed: (feederId: string) => void;
  clearFaults: (feederId: string) => void;
  triggerRemoteEstop: (feederId: string) => void;
  clearRemoteEstop: (feederId: string) => void;
  
  // Developer Demo Injections
  injectFault: (feederId: string, faultType: 'LID_OPEN' | 'LOW_BATTERY' | 'TILT_CRITICAL') => void;

  // Alerts
  addAlert: (alert: Omit<FeederAlert, 'id' | 'createdAt'>) => void;
  markAlertRead: (alertId: string) => void;

  // Stats
  getOnlineCount: () => number;
  getOfflineCount: () => number;
  getWarningCount: () => number;

  // Internal Tick
  tickSimulation: () => void;
}

const FEED_SEQUENCE: FeederState[] = ['PRECHECK', 'SPINUP', 'DISPENSE', 'CLEARING', 'COMPLETE', 'IDLE'];
const TICK_RATE_MS = 1500;

export const useFeederStore = create<FeederStore>((set, get) => ({
  feeders: MOCK_FEEDERS,
  alerts: MOCK_ALERTS,
  selectedFeederId: '22222222-2222-2222-2222-222222222221',

  setSelectedFeeder: (id) => set({ selectedFeederId: id }),

  getFeederById: (id) => get().feeders.find((f) => f.id === id),

  addFeeder: (feeder) => set((state) => ({ feeders: [...state.feeders, feeder] })),

  updateFeeder: (id, partial) =>
    set((state) => ({
      feeders: state.feeders.map((f) =>
        f.id === id ? { ...f, ...partial, lastUpdatedAt: new Date().toISOString() } : f
      ),
    })),

  removeFeeder: (id) => set((state) => ({ feeders: state.feeders.filter((f) => f.id !== id) })),

  // ──────────────────────────────────────────────────────────────────────────
  // Commands
  // ──────────────────────────────────────────────────────────────────────────

  triggerManualFeed: (feederId) => {
    const feeder = get().getFeederById(feederId);
    if (!feeder) return;

    if (!feeder.lidClosed || feeder.estopActive || feeder.remoteEstopLatched) {
      get().addAlert({
        feederId,
        title: 'Feed Blocked',
        message: 'Cannot start feed sequence. Safety interlock active (Lid Open or E-Stop).',
        severity: 'critical',
        type: 'hardware',
        isRead: false,
      });
      return;
    }

    if (feeder.batteryStatus === 'CRITICAL' || feeder.hopperStatus === 'CRITICAL') {
      get().addAlert({
        feederId,
        title: 'Feed Blocked',
        message: 'Critical battery or hopper level. Feeding disabled.',
        severity: 'critical',
        type: 'consumables',
        isRead: false,
      });
      return;
    }

    if (feeder.state === 'IDLE') {
      get().updateFeeder(feederId, { state: 'PRECHECK', feedingActive: true, lastFaultMessage: '' });
    }
  },

  clearFaults: (feederId) => {
    const feeder = get().getFeederById(feederId);
    if (!feeder) return;

    const updates: Partial<FeederDevice> = {
      state: 'IDLE',
      lastFaultMessage: '',
      feedingActive: false,
      spreaderRunning: false,
      gateStatus: 'CLOSED',
      tiltStatus: 'OK',
    };

    if (!feeder.lidClosed) {
      updates.lidClosed = true;
      updates.estopActive = false;
    }

    if (!feeder.remoteEstopLatched) {
      get().updateFeeder(feederId, updates);
    }
  },

  triggerRemoteEstop: (feederId) => {
    get().updateFeeder(feederId, {
      remoteEstopLatched: true,
      state: 'ESTOP',
      lastFaultMessage: 'Remote E-Stop triggered by operator',
      feedingActive: false,
      spreaderRunning: false,
      gateStatus: 'CLOSED',
    });
    get().addAlert({
      feederId,
      title: 'Remote E-Stop Triggered',
      message: 'Manual Emergency Stop triggered from dashboard. System halted.',
      severity: 'critical',
      type: 'hardware',
      isRead: false,
    });
  },

  clearRemoteEstop: (feederId) => {
    const feeder = get().getFeederById(feederId);
    if (!feeder) return;

    if (!feeder.estopActive && feeder.lidClosed) {
      get().updateFeeder(feederId, { remoteEstopLatched: false, state: 'IDLE', lastFaultMessage: '' });
    } else {
      get().updateFeeder(feederId, { remoteEstopLatched: false });
    }
  },

  injectFault: (feederId, faultType) => {
    const feeder = get().getFeederById(feederId);
    if (!feeder) return;

    if (faultType === 'LID_OPEN') {
      get().updateFeeder(feederId, {
        lidClosed: false,
        estopActive: true,
        state: 'ESTOP',
        lastFaultMessage: 'Safety lid opened',
        feedingActive: false,
        spreaderRunning: false,
        gateStatus: 'CLOSED',
      });
      get().addAlert({
        feederId,
        title: 'Lid Open Fault',
        message: 'Hopper lid was opened unexpectedly. System halted.',
        severity: 'critical',
        type: 'hardware',
        isRead: false,
      });
    } else if (faultType === 'LOW_BATTERY') {
      get().updateFeeder(feederId, {
        batteryVoltage: 10.5,
        batteryStatus: 'CRITICAL',
        lastFaultMessage: feeder.state === 'IDLE' ? feeder.lastFaultMessage : 'Critical Battery Drop',
        state: feeder.state === 'IDLE' ? 'IDLE' : 'FAULT',
      });
      get().addAlert({
        feederId,
        title: 'Critical Battery',
        message: 'Battery has dropped to critical level. Feeding operations suspended.',
        severity: 'critical',
        type: 'battery',
        isRead: false,
      });
    } else if (faultType === 'TILT_CRITICAL') {
      get().updateFeeder(feederId, {
        tiltAngleDeg: 18.5,
        tiltStatus: 'CRITICAL',
        state: 'FAULT',
        lastFaultMessage: 'Excessive tilt angle detected',
        feedingActive: false,
      });
      get().addAlert({
        feederId,
        title: 'Tilt Fault',
        message: 'Excessive tilt angle detected (18.5°). Possible storm/wave interference.',
        severity: 'critical',
        type: 'mechanical',
        isRead: false,
      });
    }
  },

  addAlert: (alert) => {
    const newAlert: FeederAlert = {
      ...alert,
      id: genId(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ alerts: [newAlert, ...state.alerts] }));
  },

  markAlertRead: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, isRead: true } : a)),
    })),

  getOnlineCount: () => get().feeders.filter((f) => f.online).length,
  getOfflineCount: () => get().feeders.filter((f) => !f.online).length,
  getWarningCount: () =>
    get().feeders.filter(
      (f) => f.state === 'FAULT' || f.state === 'ESTOP' || f.batteryStatus !== 'OK' || f.hopperStatus !== 'OK'
    ).length,

  // ──────────────────────────────────────────────────────────────────────────
  // Simulation Loop Tick
  // ──────────────────────────────────────────────────────────────────────────
  tickSimulation: () => {
    set((state) => {
      const nextFeeders = state.feeders.map((feeder) => {
        if (!feeder.feedingActive || feeder.state === 'IDLE' || feeder.state === 'FAULT' || feeder.state === 'ESTOP') {
          return feeder;
        }

        const currentIndex = FEED_SEQUENCE.indexOf(feeder.state);
        if (currentIndex === -1 || currentIndex === FEED_SEQUENCE.length - 1) {
          return feeder;
        }

        const nextState = FEED_SEQUENCE[currentIndex + 1];
        const updates: Partial<FeederDevice> = { state: nextState };

        if (nextState === 'SPINUP') {
          updates.spreaderRunning = true;
          updates.spreaderCurrentLevel = feeder.spreaderMaxLevel;
        }
        if (nextState === 'DISPENSE') {
          updates.gateStatus = 'OPEN';
          updates.gatePositionSteps = 100;
        }
        if (nextState === 'CLEARING') {
          updates.gateStatus = 'CLOSED';
          updates.gatePositionSteps = 0;
          updates.spreaderCurrentLevel = Math.max(1, feeder.spreaderCurrentLevel - 3);
          const newHopper = Math.max(0, feeder.hopperPercent - 1.5);
          updates.hopperPercent = newHopper;
          updates.hopperStatus = newHopper < 5 ? 'CRITICAL' : newHopper < 20 ? 'LOW' : 'OK';
        }
        if (nextState === 'COMPLETE') {
          updates.spreaderRunning = false;
          updates.spreaderCurrentLevel = 0;
          updates.feedCycleCount = feeder.feedCycleCount + 1;
          updates.lastFeedResult = 'SUCCESS';
        }
        if (nextState === 'IDLE') {
          updates.feedingActive = false;
        }

        return { ...feeder, ...updates, lastUpdatedAt: new Date().toISOString() };
      });

      return { feeders: nextFeeders };
    });
  },
}));

// Automatically run the simulation tick in the background
setInterval(() => {
  useFeederStore.getState().tickSimulation();
}, TICK_RATE_MS);
