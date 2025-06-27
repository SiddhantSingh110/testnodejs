import React from 'react';
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true, // Allow gestures within app flow
        contentStyle: { backgroundColor: '#091429' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="tabs" options={{ headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="policies" options={{ headerShown: false }} />
      {/* Stack screens for better navigation with gestures */}
      <Stack.Screen name="profile-edit" options={{ headerShown: false }} />
      <Stack.Screen name="report-upload" options={{ headerShown: false }} />
      <Stack.Screen name="report-detail" options={{ headerShown: false }} />
    </Stack>
  );
}
