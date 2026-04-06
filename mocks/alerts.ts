// mocks/alerts.ts
// Initial mock alert data — converted to FeederAlert type

import { FeederAlert } from '../types/feeder';
import { subHours, subDays } from 'date-fns';

const now = new Date();

export const MOCK_ALERTS: FeederAlert[] = [
  {
    id: 'alert-001',
    feederId: '22222222-2222-2222-2222-222222222222',
    title: 'Lid Open Detected',
    message: 'Safety lid was opened during active operation. System halted immediately.',
    severity: 'critical',
    type: 'hardware',
    isRead: false,
    createdAt: subHours(now, 1).toISOString(),
  },
  {
    id: 'alert-002',
    feederId: '22222222-2222-2222-2222-222222222223',
    title: 'Feeder Offline',
    message: 'Gamma Feeder has lost communication. Last seen 3 hours ago. Signal strength lost.',
    severity: 'warning',
    type: 'communication',
    isRead: false,
    createdAt: subHours(now, 2.5).toISOString(),
  },
  {
    id: 'alert-003',
    feederId: '22222222-2222-2222-2222-222222222223',
    title: 'Low Hopper Level',
    message: 'Gamma Feeder hopper at 12%. Schedule may be impacted. Refill required.',
    severity: 'warning',
    type: 'consumables',
    isRead: true,
    createdAt: subHours(now, 4).toISOString(),
  },
  {
    id: 'alert-004',
    feederId: '22222222-2222-2222-2222-222222222221',
    title: 'Feed Cycle Complete',
    message: 'Alpha Feeder completed scheduled feed cycle. 42nd successful cycle.',
    severity: 'info',
    type: 'system',
    isRead: true,
    createdAt: subHours(now, 2).toISOString(),
  },
  {
    id: 'alert-005',
    feederId: '22222222-2222-2222-2222-222222222222',
    title: 'Battery Low',
    message: 'Beta Feeder battery at 11.2V. Below warning threshold. Check solar charging.',
    severity: 'warning',
    type: 'battery',
    isRead: false,
    createdAt: subHours(now, 3).toISOString(),
  },
];
