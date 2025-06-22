// components/home/HealthMetricCard.jsx
import React, { useState, memo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { styles } from '../../styles/homescreen/HomeScreen.styles';

export const HealthMetricCard = memo(({ metric, index }) => {
  const [animatedValue] = useState(new Animated.Value(1));

  const getStatusColor = () => {
    switch(metric.status) {
      case 'normal': return '#4CAF50';
      case 'borderline': return '#FFC107';
      case 'high': return '#F44336';
      default: return '#4CAF50';
    }
  };

  const getMetricIcon = () => {
    const type = metric.type.toLowerCase();
    if (type.includes('heart')) return 'heart';
    if (type.includes('blood pressure')) return 'fitness';
    if (type.includes('blood sugar') || type.includes('glucose')) return 'water';
    if (type.includes('cholesterol')) return 'leaf';
    return 'pulse';
  };

  const getIconColor = () => {
    const type = metric.type.toLowerCase();
    if (type.includes('heart')) return '#FF6B6B';
    if (type.includes('blood pressure')) return '#4A90E2';
    if (type.includes('blood sugar') || type.includes('glucose')) return '#FFC107';
    if (type.includes('cholesterol')) return '#4CAF50';
    return '#38BFA7';
  };

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.healthMetricCard,
        index % 2 === 0 ? styles.leftMetricCard : styles.rightMetricCard,
        {
          transform: [{ scale: animatedValue }]
        }
      ]}
    >
      <TouchableOpacity
        onPress={() => router.push('/tabs/health')}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.metricCardContainer}
      >
        <LinearGradient
          colors={[`${getStatusColor()}20`, `${getStatusColor()}10`]}
          style={styles.metricCardGradient}
        >
          {/* Background Decorative Icon */}
          <View style={styles.metricBackgroundIcon}>
            <Ionicons 
              name={getMetricIcon()} 
              size={80} 
              color={`${getIconColor()}15`} 
            />
          </View>

          {/* Subtle Glow Effect */}
          <View style={[styles.metricGlowEffect, { backgroundColor: `${getStatusColor()}05` }]} />

          {/* Card Content */}
          <View style={styles.metricCardContent}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricStatusDot, { backgroundColor: getStatusColor() }]} />
              <Text style={styles.metricType}>{metric.type}</Text>
            </View>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricUnit}>{metric.unit}</Text>
            <Text style={styles.metricDate}>{metric.date}</Text>
          </View>

          {/* Status Indicator Glow */}
          {metric.status !== 'normal' && (
            <View style={[styles.statusGlow, { backgroundColor: `${getStatusColor()}20` }]} />
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
});