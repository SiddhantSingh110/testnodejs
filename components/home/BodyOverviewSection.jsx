// components/home/BodyOverviewSection.jsx
import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { styles } from '../../styles/homescreen/HomeScreen.styles';

export const BodyOverviewSection = memo(({ healthOverview }) => {
  return (
    <View style={styles.bodySection}>
      <Image
        source={require('../../assets/images/humanoid-transparent.png')}
        style={styles.bodyModelImage}
      />
      <View style={styles.bodyContent}>
        <View style={styles.bodyTextSection}>
          <Text style={styles.bodyTitle}>
            <Text style={styles.bodyTitleLine1}>{healthOverview.title.split(' ')[0]} {healthOverview.title.split(' ')[1]}</Text>
            {'\n'}
            <Text style={styles.bodyTitleLine2}>{healthOverview.title.split(' ')[2]}</Text>
          </Text>
          
          {/* Dynamic Stats */}
          <View style={styles.bodyStats}>
            <View style={styles.bodyStat}>
              <Text style={styles.bodyStatNumber}>
                {String(healthOverview.reportsAnalyzed).padStart(2, '0')}
              </Text>
              <Text style={styles.bodyStatLabel}>Reports Analyzed</Text>
            </View>
            <View style={styles.bodyStat}>
              <Text style={styles.bodyStatNumber}>
                {String(healthOverview.healthInsights).padStart(2, '0')}
              </Text>
              <Text style={styles.bodyStatLabel}>Health Insights</Text>
            </View>
          </View>

          {/* Encouragement Text for New Users */}
          {healthOverview.isNewUser && healthOverview.encouragementText && (
            <View style={styles.encouragementContainer}>
              <Text style={styles.encouragementText}>{healthOverview.encouragementText}</Text>
              <TouchableOpacity 
                style={styles.getStartedButton}
                onPress={() => router.push('/tabs/upload')}
              >
                <Ionicons name="add-circle" size={16} color="#38BFA7" />
                <Text style={styles.getStartedButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
});