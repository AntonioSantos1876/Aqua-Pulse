// store/authStore.ts
// Mock authentication state with local persistence

import { create } from 'zustand';
import { UserProfile } from '../types/auth';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'aquapulse_session';

const MOCK_USER: UserProfile = {
  id: 'user-001',
  name: 'Alex Chen',
  email: 'alex.chen@aquafarm.com',
  role: 'admin',
  farmName: 'Coral Bay Aquafarm',
  avatarInitials: 'AC',
};

interface AuthStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  hasCompletedOnboarding: false,

  signIn: async (email: string, _password: string) => {
    // Mock: accept any non-empty credentials
    await new Promise((r) => setTimeout(r, 1200));
    const user = { ...MOCK_USER, email };
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify({ user, onboarded: true }));
    set({ user, isAuthenticated: true, hasCompletedOnboarding: true });
  },

  signOut: async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
    set({ user: null, isAuthenticated: false, hasCompletedOnboarding: false });
  },

  restoreSession: async () => {
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY);
      if (raw) {
        const { user, onboarded } = JSON.parse(raw);
        set({ user, isAuthenticated: true, hasCompletedOnboarding: onboarded });
      }
    } catch (_) {
      // ignore — fresh start
    } finally {
      set({ isLoading: false });
    }
  },

  completeOnboarding: async () => {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify({ ...existing, onboarded: true }));
    set({ hasCompletedOnboarding: true });
  },
}));
