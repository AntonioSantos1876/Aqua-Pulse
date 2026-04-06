// mocks/notifications.ts
// Initial in-app notification history

import { AppNotification } from '../types/notification';
import { subHours, subMinutes } from 'date-fns';

const now = new Date();

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-001',
    feederId: 'feeder-001',
    feederName: 'Bay 01',
    type: 'feed_complete',
    title: 'Feed Complete',
    body: 'Bay 01 completed scheduled feed. 250g dispensed successfully.',
    timestamp: subHours(now, 2),
    isRead: false,
    iconName: 'checkmark-circle',
  },
  {
    id: 'notif-002',
    feederId: 'feeder-002',
    feederName: 'Bay 02',
    type: 'low_feed',
    title: 'Low Feed Level',
    body: 'Bay 02 feed level is at 18%. Please refill soon.',
    timestamp: subHours(now, 1),
    isRead: false,
    iconName: 'warning',
  },
  {
    id: 'notif-003',
    feederId: 'feeder-003',
    feederName: 'East Dock',
    type: 'offline',
    title: 'Feeder Offline',
    body: 'East Dock feeder went offline. LoRa link lost.',
    timestamp: subHours(now, 2.5),
    isRead: false,
    iconName: 'wifi-off',
  },
  {
    id: 'notif-004',
    feederId: 'feeder-003',
    feederName: 'East Dock',
    type: 'feed_missed',
    title: 'Scheduled Feed Missed',
    body: 'East Dock missed the 06:00 scheduled feed due to being offline.',
    timestamp: subHours(now, 4),
    isRead: true,
    iconName: 'alert-circle',
  },
  {
    id: 'notif-005',
    feederId: 'feeder-004',
    feederName: 'North Cage',
    type: 'feed_complete',
    title: 'Feed Complete',
    body: 'North Cage dawn feed completed. 300g dispensed.',
    timestamp: subHours(now, 5),
    isRead: true,
    iconName: 'checkmark-circle',
  },
  {
    id: 'notif-006',
    feederId: 'feeder-003',
    feederName: 'East Dock',
    type: 'low_battery',
    title: 'Low Battery',
    body: 'East Dock battery level at 31%. Solar panel may need inspection.',
    timestamp: subHours(now, 3),
    isRead: true,
    iconName: 'battery-dead',
  },
];
