// types/notification.ts
// In-app notification center model (separate from OS push notifications)

export type NotificationType =
  | 'feed_complete'
  | 'feed_missed'
  | 'low_feed'
  | 'low_battery'
  | 'offline'
  | 'online'
  | 'maintenance'
  | 'system';

export interface AppNotification {
  id: string;
  feederId: string;
  feederName: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
  iconName: string; // @expo/vector-icons name
}
