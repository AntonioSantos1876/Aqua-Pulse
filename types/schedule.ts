// types/schedule.ts

export type ScheduleFrequency = 'once' | 'daily' | 'custom';

export interface ScheduleEntry {
  id: string;
  feederId: string;
  label: string;
  hour: number;   // 0–23
  minute: number; // 0–59
  portionGrams: number;
  isEnabled: boolean;
  frequency: ScheduleFrequency;
  daysOfWeek?: number[]; // 0=Sun..6=Sat for custom
  lastTriggered?: Date;
  nextTrigger: Date;
  createdAt: Date;
}
