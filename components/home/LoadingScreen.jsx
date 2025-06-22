// components/home/LoadingScreen.jsx
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../../styles/homescreen/HomeScreen.styles';

export const LoadingScreen = () => {
  return (
    <View style={styles.loadingContainer}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#091429', '#0F2248', '#162F65']}
        style={styles.background}
      />
      <ActivityIndicator size="large" color="#38BFA7" />
      <Text style={styles.loadingText}>Loading your dashboard...</Text>
    </View>
  );
};