import React, { useEffect } from 'react';
import { Slot, useSegments, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { Provider as PaperProvider } from 'react-native-paper';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Authentication navigation handler
function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Don't do anything while loading
    
    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';
    
    console.log('🔍 Navigation Debug:', {
      isAuthenticated,
      loading,
      segments,
      inAuthGroup,
      inAppGroup
    });

    if (isAuthenticated && inAuthGroup) {
      // User is authenticated but on auth screen - redirect to app
      console.log('✅ Redirecting authenticated user to app');
      router.replace('/(app)/tabs/');
    } else if (!isAuthenticated && inAppGroup) {
      // User is not authenticated but trying to access app - redirect to auth
      console.log('🔒 Redirecting unauthenticated user to auth');
      router.replace('/(auth)/');
    }
  }, [isAuthenticated, loading, segments]);

  return <Slot />;
}

function LoadingScreen() {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#091429'
    }}>
      <ActivityIndicator size="large" color="#38BFA7" />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <PaperProvider>
          <RootLayoutNav />
        </PaperProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
