// components/home/DashboardScreen.jsx
import React, { memo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  RefreshControl,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { styles } from '../../styles/homescreen/HomeScreen.styles';
import { HealthMetricCard } from './HealthMetricCard';
import { OrganHealthCard } from './OrganHealthCard';
import { BodyOverviewSection } from './BodyOverviewSection';
import { BrandSection } from './BrandSection';
import { groupMetricsByOrganSystem } from '../../services/OrganSystemGrouping';
import LetterAvatar from '../shared/LetterAvatar';
import ENV from '../../config/environment';

export const DashboardScreen = memo(({ 
  user, 
  healthMetrics, 
  recentReports, 
  healthOverview, 
  refreshing, 
  onRefresh, 
  scrollY,
  formatDate,
  metricsData // Add this to receive full metrics response
}) => {
  const getFullImageUrl = (relativePath) => {
    if (!relativePath) return null;
    return `${ENV.apiUrl.replace('/api', '')}/storage/${relativePath}`;
  };

  // Smart name display logic (modern app pattern)
  const getDisplayName = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return 'User';
    
    const trimmedName = fullName.trim();
    const words = trimmedName.split(' ').filter(word => word.length > 0);
    
    if (words.length === 0) return 'User';
    if (words.length === 1) return words[0];
    
    // For names like "Dr. John Smith" or "John Michael Smith"
    const firstName = words[0];
    
    // If first name is too long, truncate it
    if (firstName.length > 12) {
      return firstName.substring(0, 12) + '...';
    }
    
    return firstName;
  };

  // Process metrics for organ grouping
  const organHealth = groupMetricsByOrganSystem(metricsData);
  const hasOrganData = Object.keys(organHealth).length > 0;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#162F65', '#0F2248', '#091429']}
        style={styles.background}
      />

      {/* Fixed Header + Body Section */}
      <View style={styles.fixedTopSection}>
        <LinearGradient
          colors={['#162F65', '#0F2248', '#091429']}
          style={styles.gradientBackground}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.userName}>{getDisplayName(user?.name)}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/tabs/profile')} style={styles.avatar}>
              {user?.profile_photo ? (
                <Image 
                  source={{ uri: getFullImageUrl(user.profile_photo) }}
                  style={styles.avatarImage}
                />
              ) : (
                <LetterAvatar 
                  name={user?.name || 'User'} 
                  size={45}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Health Overview Section */}
          <BodyOverviewSection healthOverview={healthOverview} />
        </LinearGradient>
      </View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#38BFA7']}
            tintColor="#38BFA7"
          />
        }
      >
        {/* Spacer to show fixed section initially */}
        <View style={styles.scrollSpacer} />
        
        {/* Health Metrics Section */}
        <View style={styles.metricsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Metrics</Text>
            <TouchableOpacity 
              onPress={() => router.push('/tabs/health')} 
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="chevron-forward" size={16} color="#38BFA7" />
            </TouchableOpacity>
          </View>
          
          {hasOrganData ? (
            <View style={styles.metricsGrid}>
              {Object.entries(organHealth).map(([organKey, organData], index) => (
                <OrganHealthCard
                  key={organKey}
                  organKey={organKey}
                  organData={organData}
                  index={index}
                />
              ))}
            </View>
          ) : healthMetrics.length > 0 ? (
            <View style={styles.metricsGrid}>
              {healthMetrics.map((metric, index) => (
                <HealthMetricCard
                  key={`${metric.id}-${index}`}
                  metric={metric}
                  index={index}
                />
              ))}
            </View>
          ) : (
            <View style={styles.metricsGrid}>
              <HealthMetricCard
                metric={{
                  type: 'Heart Rate (Sample)',
                  value: '72',
                  unit: 'bpm',
                  date: '2023-04-20',
                  status: 'normal'
                }}
                index={0}
              />
              <HealthMetricCard
                metric={{
                  type: 'Blood Pressure (Sample)',
                  value: '120/80',
                  unit: 'mmHg',
                  date: '2023-04-19',
                  status: 'normal'
                }}
                index={1}
              />
            </View>
          )}
        </View>

        {/* Recent Reports Section */}
        <View style={styles.reportsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reports</Text>
            <TouchableOpacity 
              onPress={() => router.push('/tabs/reports')} 
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="chevron-forward" size={16} color="#38BFA7" />
            </TouchableOpacity>
          </View>
          
          {recentReports.length > 0 ? (
            recentReports.map((report, index) => (
              <TouchableOpacity
                key={`${report.id}-${index}`}
                style={styles.reportCard}
                onPress={() => router.push(`/tabs/reports/${report.id}`)}
                activeOpacity={0.8}
              >
                <View style={styles.reportIconContainer}>
                  <Ionicons name="document-text" size={24} color="#38BFA7" />
                </View>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportTitle} numberOfLines={1}>
                    {report.title || report.report_title || 'Medical Report'}
                  </Text>
                  <Text style={styles.reportDate}>
                    {formatDate(report.report_date || report.created_at)}
                  </Text>
                  {report.summary_diagnosis && (
                    <Text style={styles.reportStatus}>
                      Status: {report.summary_diagnosis}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#a0c0ff" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noReportsContainer}>
              <Text style={styles.noReportsText}>No recent reports</Text>
              <Text style={styles.noReportsSubtext}>Upload reports to see them here</Text>
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={() => router.push('/tabs/upload')}
              >
                <Text style={styles.uploadButtonText}>Upload Report</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Brand Section */}
        <BrandSection />

        {/* Extra padding at bottom */}
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </View>
  );
});