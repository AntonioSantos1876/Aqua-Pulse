// app/(app)/feeders/_layout.tsx
import { Stack } from 'expo-router';
import { Colors } from '../../../constants/theme';

export default function FeedersLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.backgroundSecondary },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ title: 'Fleet Overview', headerShown: false }} 
      />
      <Stack.Screen 
        name="[id]/index" 
        options={{ title: 'Feeder Detail' }} 
      />
      <Stack.Screen 
        name="[id]/controls" 
        options={{ title: 'Manual Controls', presentation: 'modal' }} 
      />
      <Stack.Screen 
        name="[id]/schedule" 
        options={{ title: 'Feeding Schedule', presentation: 'modal' }} 
      />
      <Stack.Screen 
        name="[id]/history" 
        options={{ title: 'Analytics History', presentation: 'modal' }} 
      />
    </Stack>
  );
}
