import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { LocationProvider } from '@/Provider/LocationProvider';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <LocationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </LocationProvider>
  );
}
