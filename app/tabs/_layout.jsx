// app/tabs/_layout.jsx
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Platform, BackHandler } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { BlurView } from 'expo-blur';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  // Handle Android back button to prevent going back to login
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Return true to prevent default back behavior
      return true;
    });
    
    return () => backHandler.remove();
  }, []);
  
  // Pre-load Ionicons to prevent arrow icons on first render
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync(Ionicons.font);
    }
    loadFonts();
  }, []);
  
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        headerTransparent: true,
        gestureEnabled: false, // Disable swipe gesture
        headerBackground: () => (
          <BlurView
            tint="dark"
            intensity={30}
            style={StyleSheet.absoluteFill}
          >
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(9, 20, 41, 0.7)' }]} />
          </BlurView>
        ),
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        tabBarActiveTintColor: '#38BFA7',
        tabBarInactiveTintColor: '#a0c0ff',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
          marginBottom: 4,
          fontWeight: '500',
        },
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={Platform.OS === 'ios' ? 80 : 140}
            style={StyleSheet.absoluteFill}
          >
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(9, 20, 41, 0.7)' }]} />
          </BlurView>
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          height: 75 + Math.max(insets.bottom, 10),
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 10),
          borderTopWidth: 0,
          // Add a subtle glow effect at top edge
          shadowColor: '#2C7BE5',
          shadowOpacity: 0.15,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 10,
        },
        tabBarButton: (props) => {
          const { children, onPress, accessibilityState } = props;
          const focused = accessibilityState?.selected;
          
          return (
            <Pressable
              {...props}
              android_ripple={{ color: 'rgba(56, 191, 167, 0.2)', borderless: true }}
              style={({ pressed }) => [
                {
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              {children}
            </Pressable>
          );
        },
      })}
    >
      {/* Only include the tabs we want to show, with Reports moved to second position */}
      <Tabs.Screen
        name="home/index"
        options={{
          // Tab bar settings
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name={focused ? "home" : "home-outline"}
              color={color}
              focused={focused}
            />
          ),
          // Header settings - set the visible title to "Dashboard"
          headerTitle: "Dashboard", // This is what appears in the header bar
          headerStyle: { backgroundColor: '#091429' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontSize: 18, fontWeight: '600' },
          // Override headerShown that you set earlier
          headerShown: false,
          // title affects things like screen reader and window title
          title: "WEBSHARK HEALTH"
        }}
      />
     <Tabs.Screen
      name="health/index"
      options={{
        title: "Health Metrics",
        tabBarIcon: ({ color, size, focused }) => (
          <TabIcon
            name={focused ? "pulse" : "pulse-outline"}
            color={color}
            focused={focused}
          />
        ),
        headerStyle: { backgroundColor: '#121212' },
        headerTintColor: '#fff',
      }}
    />

    <Tabs.Screen
      name="reports/index"
      options={{
        title: "Health Reports",
        tabBarIcon: ({ color, size, focused }) => (
          <TabIcon
            name={focused ? "document-text" : "document-text-outline"}
            color={color}
            focused={focused}
          />
        ),
        headerStyle: { backgroundColor: '#091429' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontSize: 18, fontWeight: '600' }
      }}
    />

    <Tabs.Screen
    name="profile/index"
    options={{
      title: "Your Profile",
      tabBarIcon: ({ color, size, focused }) => (
        <TabIcon
          name={focused ? "person" : "person-outline"}
          color={color}
          focused={focused}
        />
      ),
      headerStyle: { backgroundColor: '#091429' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontSize: 18, fontWeight: '600' }
    }}
  />
      
      {/* Hidden screens */}
      <Tabs.Screen name="profile/edit" options={{ href: null }} />
      <Tabs.Screen name="upload/index" options={{ href: null }} />
      <Tabs.Screen name="reports/[id]" options={{ href: null }} />
    </Tabs>
  );
}

function TabIcon({ name, color, focused }) {
  if (focused) {
    return (
      <View style={styles.iconWrapper}>
        <Ionicons name={name} size={24} color="#38BFA7" />
      </View>
    );
  }
  
  return (
    <View style={styles.iconWrapper}>
      <Ionicons name={name} size={20} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#38BFA7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  }
});