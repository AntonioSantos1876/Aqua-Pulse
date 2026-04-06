// mocks/schedules.ts
// Initial feeding schedules for each feeder

import { ScheduleEntry } from '../types/schedule';
import { addHours, setHours, setMinutes, startOfDay } from 'date-fns';

const today = startOfDay(new Date());

function nextOccurrence(hour: number, minute: number): Date {
  const now = new Date();
  const candidate = setMinutes(setHours(new Date(), hour), minute);
  if (candidate <= now) {
    return addHours(candidate, 24);
  }
  return candidate;
}

export const MOCK_SCHEDULES: ScheduleEntry[] = [
  // Bay 01 — 4x daily
  {
    id: 'sched-001-1',
    feederId: 'feeder-001',
    label: 'Morning Feed',
    hour: 6,
    minute: 0,
    portionGrams: 250,
    isEnabled: true,
    frequency: 'daily',
    nextTrigger: nextOccurrence(6, 0),
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 'sched-001-2',
    feederId: 'feeder-001',
    label: 'Midday Feed',
    hour: 12,
    minute: 0,
    portionGrams: 250,
    isEnabled: true,
    frequency: 'daily',
    nextTrigger: nextOccurrence(12, 0),
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 'sched-001-3',
    feederId: 'feeder-001',
    label: 'Afternoon Feed',
    hour: 17,
    minute: 30,
    portionGrams: 250,
    isEnabled: true,
    frequency: 'daily',
    nextTrigger: nextOccurrence(17, 30),
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 'sched-001-4',
    feederId: 'feeder-001',
    label: 'Evening Feed',
    hour: 21,
    minute: 0,
    portionGrams: 200,
    isEnabled: true,
    frequency: 'daily',
    nextTrigger: nextOccurrence(21, 0),
    createdAt: new Date('2025-01-10'),
  },
  // Bay 02 — 3x daily
  {
    id: 'sched-002-1',
    feederId: 'feeder-002',
    label: 'Morning Feed',
    hour: 7,
    minute: 0,
    portionGrams: 250,
    isEnabled: true,
    frequency: 'daily',
    nextTrigger: nextOccurrence(7, 0),
    createdAt: new Date('2025-02-01'),
  },
  {
    id: 'sched-002-2',
    feederId: 'feeder-002',
    label: 'Afternoon Feed',
    hour: 13,
    minute: 0,
    portionGrams: 250,
    isEnabled: true,
    frequency: 'daily',
    nextTrigger: nextOccurrence(13, 0),
    createdAt: new Date('2025-02-01'),
  },
  {
    id: 'sched-002-3',
    feederId: 'feeder-002',
    label: 'Evening Feed',
    hour: 19,
    minute: 0,
    portionGrams: 250,
    isEnabled: true,
    frequency: 'daily',
    nextTrigger: nextOccurrence(19, 0),
    createdAt: new Date('2025-02-01'),
  },
  // North Cage — 4x daily, larger portions
  {
    id: 'sched-004-1',
    feederId: 'feeder-004',
    label: 'Dawn Feed',
    hour: 5,
    minute: 30,
    portionGrams: 300,
    isEnabled: true,
    frequency: 'daily',
    nextTrigger: nextOccurrence(5, 30),
    createdAt: new Date('2025-03-05'),
  },
  {
    id: 'sched-004-2',
    feederId: 'feeder-004',
    label: 'Morning Feed',
    hour: 9,
    minute: 0,
    portionGrams: 300,
    isEnabled: true,
    frequency: 'daily',
    nextTrigger: nextOccurrence(9, 0),
    createdAt: new Date('2025-03-05'),
  },
  {
    id: 'sched-004-3',
    feederId: 'feeder-004',
    label: 'Afternoon Feed',
    hour: 14,
    minute: 0,
    portionGrams: 300,
    isEnabled: true,
    frequency: 'daily',
    nextTrigger: nextOccurrence(14, 0),
    createdAt: new Date('2025-03-05'),
  },
  {
    id: 'sched-004-4',
    feederId: 'feeder-004',
    label: 'Dusk Feed',
    hour: 18,
    minute: 30,
    portionGrams: 300,
    isEnabled: true,
    frequency: 'daily',
    nextTrigger: nextOccurrence(18, 30),
    createdAt: new Date('2025-03-05'),
  },
];
