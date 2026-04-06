// app/_layout.tsx
// Root layout — restores auth session, guards routes

import { useEffect } from 'react';
import { Slot, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { startSimulationEngine, stopSimulationEngine } from '../services/simulationEngine';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { restoreSession, isAuthenticated, isLoading, hasCompletedOnboarding } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();

      if (!isAuthenticated) {
        router.replace('/(auth)/welcome');
      } else if (!hasCompletedOnboarding) {
        router.replace('/(auth)/welcome');
      } else {
        router.replace('/(app)');
      }
    }
  }, [isLoading, isAuthenticated, hasCompletedOnboarding]);

  // Start simulation engine when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      startSimulationEngine();
      return () => stopSimulationEngine();
    }
  }, [isAuthenticated]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" />
      <Slot />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
