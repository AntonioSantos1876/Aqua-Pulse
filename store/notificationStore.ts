// store/notificationStore.ts
// In-app notification center state

import { create } from 'zustand';
import { AppNotification } from '../types/notification';
import { MOCK_NOTIFICATIONS } from '../mocks/notifications';

interface NotificationStore {
  notifications: AppNotification[];
  unreadCount: number;

  addNotification: (n: AppNotification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length,

  addNotification: (n) =>
    set((state) => {
      const notifications = [n, ...state.notifications];
      return {
        notifications,
        unreadCount: notifications.filter((x) => !x.isRead).length,
      };
    }),

  markRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.isRead).length };
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
