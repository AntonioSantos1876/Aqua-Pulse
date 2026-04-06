// types/alert.ts

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  feederId: string;
  feederName?: string; // Optional helper for UI
  title: string;
  message: string;
  severity: AlertSeverity;
  type: string;
  isRead: boolean;
  createdAt: string;
}
