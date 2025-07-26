// app/(app)/_layout.jsx
import React from 'react';
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true, // ✅ DEFAULT: Enable gestures for stack screens
        contentStyle: { backgroundColor: '#091429' },
        animation: 'fade',
      }}
    >
      {/* Main tab navigation - this is the root, so no back gesture needed */}
      <Stack.Screen 
        name="tabs" 
        options={{ 
          headerShown: false, 
          gestureEnabled: false // ❌ DISABLED: This is the root level, nowhere to go back
        }} 
      />
      
      {/* Policy screens - allow gestures (these are sub-pages) */}
      <Stack.Screen 
        name="policies" 
        options={{ 
          headerShown: false,
          gestureEnabled: true // ✅ ENABLED: Can go back to previous screen
        }} 
      />
      
      {/* Stack screens that should allow back gestures */}
      <Stack.Screen 
        name="profile-edit" 
        options={{ 
          headerShown: false,
          gestureEnabled: true, // ✅ ENABLED: Can go back to profile tab
          presentation: 'card' // Standard full-screen navigation
        }} 
      />
      
      <Stack.Screen 
        name="report-upload" 
        options={{ 
          headerShown: false,
          gestureEnabled: true, // ✅ ENABLED: Can go back to reports tab
          presentation: 'card' // Standard full-screen navigation
        }} 
      />
      
      <Stack.Screen 
        name="report-detail" 
        options={{ 
          headerShown: false,
          gestureEnabled: true, // ✅ ENABLED: Can go back to reports tab
          presentation: 'card' // Standard full-screen navigation
        }} 
      />
    </Stack>
  );
}