// app/(app)/_layout.tsx
// Main tab navigator

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { useFeederStore } from '../../store/feederStore';
import { Colors, FontSize } from '../../constants/theme';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

function TabBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View style={badge.wrap}>
      <Text style={badge.text}>{count > 9 ? '9+' : count}</Text>
    </View>
  );
}

const badge = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.statusOffline,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  text: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
});

export default function AppLayout() {
  // Count unread from both store-level and feeder-embedded alerts
  const storeAlerts = useFeederStore((s) => s.alerts);
  const feeders = useFeederStore((s) => s.feeders);
  const feederAlerts = feeders.flatMap(f => f.alerts || []);
  const unreadCount = [...storeAlerts, ...feederAlerts].filter(a => !a.isRead).length;

  useEffect(() => {
    async function requestPermissions() {
      try {
        const { status: notifStatus } = await Notifications.getPermissionsAsync();
        if (notifStatus !== 'granted') {
          await Notifications.requestPermissionsAsync();
        }
        const { status: locStatus } = await Location.getForegroundPermissionsAsync();
        if (locStatus !== 'granted') {
          await Location.requestForegroundPermissionsAsync();
        }
      } catch (error) {
        console.warn("Permission request error:", error);
      }
    }
    requestPermissions();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.backgroundSecondary,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feeders"
        options={{
          title: 'Feeders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fish" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="notifications" size={size} color={color} />
              <TabBadge count={unreadCount} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="terms" options={{ href: null }} />
      <Tabs.Screen name="privacy" options={{ href: null }} />
      <Tabs.Screen name="about" options={{ href: null }} />
    </Tabs>
  );
}
