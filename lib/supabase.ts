import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// If we're missing keys, the app should still function via local simulation
export const hasSupabaseKeys = supabaseUrl !== '' && supabaseUrl !== 'your-supabase-url-here' && supabaseAnonKey !== '' && supabaseAnonKey !== 'your-supabase-anon-key-here';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    try {
      if (Platform.OS === 'web') return AsyncStorage.getItem(key);
      return SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Supabase Setup Error: SecureStore Get', error);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      if (Platform.OS === 'web') return AsyncStorage.setItem(key, value);
      SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Supabase Setup Error: SecureStore Set', error);
    }
  },
  removeItem: (key: string) => {
    try {
      if (Platform.OS === 'web') return AsyncStorage.removeItem(key);
      SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Supabase Setup Error: SecureStore Remove', error);
    }
  },
};

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
