// components/home/OrganHealthCard.jsx
import React, { useState } from 'react';
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

// Define formatting functions locally to avoid import issues
const formatHealthScore = (score) => {
  if (score === null || score === undefined) {
    return { display: 'N/A', color: '#999999' };
  }
  
  let color;
  let label;
  
  if (score >= 90) {
    color = '#4CAF50'; // Green
    label = 'Excellent';
  } else if (score >= 80) {
    color = '#8BC34A'; // Light Green
    label = 'Good';
  } else if (score >= 70) {
    color = '#FFC107'; // Yellow
    label = 'Fair';
  } else if (score >= 60) {
    color = '#FF9800'; // Orange
    label = 'Poor';
  } else {
    color = '#F44336'; // Red
    label = 'Critical';
  }
  
  return {
    display: score.toString(),
    label,
    color
  };
};

const getStatusColor = (status) => {
  const colorMap = {
    'normal': '#4CAF50',
    'borderline': '#FFC107',
    'high': '#F44336',
    'low': '#F44336'
  };
  return colorMap[status] || '#4CAF50';
};

const getMetricDisplayName = (metricType) => {
  const displayNames = {
    // Heart/Cholesterol
    'hdl': 'HDL Cholesterol',
    'ldl': 'LDL Cholesterol',
    'total_cholesterol': 'Total Cholesterol',
    'triglycerides': 'Triglycerides',
    'vldl': 'VLDL Cholesterol',
    'blood_pressure': 'Blood Pressure',
    
    // Blood
    'hemoglobin': 'Hemoglobin',
    'hematocrit': 'Hematocrit',
    'glucose_fasting': 'Fasting Glucose',
    'hba1c': 'HbA1c',
    'wbc_count': 'WBC Count',
    'rbc_count': 'RBC Count',
    'platelet_count': 'Platelets',
    
    // Kidney
    'creatinine': 'Creatinine',
    'egfr': 'eGFR',
    'blood_urea_nitrogen': 'BUN',
    'uric_acid': 'Uric Acid',
    
    // Liver
    'alt': 'ALT',
    'ast': 'AST',
    'alp': 'ALP',
    'bilirubin': 'Bilirubin',
    
    // Thyroid
    'tsh': 'TSH',
    't3': 'T3',
    't4': 'T4',
    'free_t3': 'Free T3',
    'free_t4': 'Free T4',
    
    // Vitamins
    'vitamin_d': 'Vitamin D',
    'vitamin_b12': 'Vitamin B12',
    'iron': 'Iron',
    'ferritin': 'Ferritin',
    'folate': 'Folate'
  };
  
  return displayNames[metricType] || metricType.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export const OrganHealthCard = ({ organKey, organData, index }) => {
  const [animatedValue] = useState(new Animated.Value(1));

  if (!organData || !organData.hasData) {
    return null;
  }

  const { system, score, status, primaryMetric, metrics } = organData;

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

  const handlePress = () => {
    // Navigate to detailed view with organ filter
    router.push({
      pathname: '/tabs/health',
      params: { 
        organ: organKey,
        organName: system.name 
      }
    });
  };

  const scoreData = formatHealthScore(score);
  const statusColor = getStatusColor(status);

  return (
    <Animated.View
      style={[
        styles.organHealthCard,
        index % 2 === 0 ? styles.leftMetricCard : styles.rightMetricCard,
        {
          transform: [{ scale: animatedValue }]
        }
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.organCardContainer}
      >
        <LinearGradient
          colors={[`${system.color}20`, `${system.color}10`]}
          style={styles.organCardGradient}
        >
          {/* Background Decorative Icon */}
          <View style={styles.organBackgroundIcon}>
            <Ionicons 
              name={system.icon} 
              size={80} 
              color={`${system.color}15`} 
            />
          </View>

          {/* Subtle Glow Effect */}
          <View style={[styles.organGlowEffect, { backgroundColor: `${statusColor}05` }]} />

          {/* Card Content */}
          <View style={styles.organCardContent}>
            {/* Header */}
            <View style={styles.organHeader}>
              <View style={styles.organIconContainer}>
                <Ionicons name={system.icon} size={20} color={system.color} />
              </View>
              <Text style={styles.organName} numberOfLines={1}>{system.name}</Text>
            </View>
            
            {/* Health Score */}
            <View style={styles.organScoreContainer}>
              <Text style={[styles.organHealthScore, { color: scoreData.color }]}>
                {scoreData.display}
              </Text>
              <Text style={styles.organScoreLabel}>/ 100</Text>
            </View>
            
            {/* Score Label */}
            <Text style={[styles.organScoreStatus, { color: scoreData.color }]}>
              {scoreData.label}
            </Text>
            
            {/* Primary Metric */}
            {primaryMetric && (
              <View style={styles.organPrimaryMetric}>
                <Text style={styles.organPrimaryMetricName} numberOfLines={1}>
                  {getMetricDisplayName(primaryMetric.type)}
                </Text>
                <Text style={styles.organPrimaryMetricValue}>
                  {primaryMetric.value} {primaryMetric.unit}
                </Text>
              </View>
            )}
            
            {/* Metric Count */}
            <Text style={styles.organMetricCount}>
              {metrics.length} metric{metrics.length > 1 ? 's' : ''} tracked
            </Text>
          </View>

          {/* Status Indicator */}
          {status !== 'normal' && (
            <View style={[styles.organStatusIndicator, { backgroundColor: statusColor }]} />
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};