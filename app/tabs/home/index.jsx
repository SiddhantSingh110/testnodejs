// app/tabs/home/index.jsx - Enhanced Dashboard with Advanced Parallax Effect
import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions, 
  Image,
  RefreshControl,
  Alert,
  Animated,
  Platform
} from 'react-native';
import { useAuth } from '../../../hooks/useAuth';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ENV from '../../../config/environment';
import healthMetricsAPI from '../../../services/HealthMetricsAPI';
import { fetchReports } from '../../../api/auth';

const { width, height } = Dimensions.get('window');

const HealthMetricCard = ({ metric, index }) => {
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
};

export default function EnhancedDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [healthOverview, setHealthOverview] = useState({ 
    title: "Your Health Overview",
    subtitle: "Start Your Health Journey",
    reportsAnalyzed: 0, 
    healthInsights: 0,
    isNewUser: true,
    encouragementText: "Upload your first report to get AI insights"
  });
  const scrollY = new Animated.Value(0);

  // Helper function to get full image URL
  const getFullImageUrl = (relativePath) => {
    if (!relativePath) return null;
    return `${ENV.apiUrl.replace('/api', '')}/storage/${relativePath}`;
  };

  // Calculate health overview data dynamically
  const calculateHealthOverview = (metrics, reports) => {
    const hasMetrics = metrics.length >= 2;
    const totalReports = reports.length;
    
    if (!hasMetrics) {
      // New user experience
      return {
        title: "Your Health Overview",
        subtitle: "Start Your Health Journey",
        reportsAnalyzed: totalReports,
        healthInsights: 0,
        isNewUser: true,
        encouragementText: totalReports === 0 ? "Upload your first report to get AI insights" : "Add more health data for personalized insights"
      };
    }
    
    // Experienced user - calculate real insights
    const abnormalMetrics = metrics.filter(m => m.status === 'high' || m.status === 'borderline').length;
    const totalInsights = Math.max(metrics.length + abnormalMetrics, totalReports * 2);
    
    return {
      title: "Your Health Overview",
      subtitle: "Health Insights Available",
      reportsAnalyzed: totalReports,
      healthInsights: Math.min(totalInsights, 99), // Cap at 99 for UI
      isNewUser: false,
      encouragementText: null
    };
  };

  // Load dashboard data
  const loadDashboardData = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setIsLoading(true);

      // Initialize health metrics API
      await healthMetricsAPI.init();

      // Load data in parallel
      const [metricsResponse, reportsData] = await Promise.all([
        healthMetricsAPI.getMetrics().catch(err => {
          console.warn('Health metrics failed:', err);
          return { metrics: {}, summary: {} };
        }),
        fetchReports(await healthMetricsAPI.token).catch(err => {
          console.warn('Reports fetch failed:', err);
          return [];
        })
      ]);

      // Process health metrics
      const processedMetrics = processHealthMetrics(metricsResponse.metrics || {});
      setHealthMetrics(processedMetrics);

      // Set recent reports (limit to 3)
      setRecentReports((reportsData || []).slice(0, 3));

      // Calculate health overview from health data
      const overviewData = calculateHealthOverview(processedMetrics, reportsData || []);
      setHealthOverview(overviewData);

      console.log('✅ Dashboard data loaded:', {
        metrics: processedMetrics.length,
        reports: (reportsData || []).length,
        overview: overviewData
      });

    } catch (error) {
      console.error('❌ Dashboard load error:', error);
      Alert.alert('Error', 'Failed to load dashboard data. Pull down to refresh.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Process health metrics for display
  const processHealthMetrics = (metricsData) => {
    const processed = [];
    
    Object.entries(metricsData).forEach(([type, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        const latest = values[0];
        processed.push({
          id: type,
          type: formatMetricName(type),
          value: latest.value,
          unit: latest.unit || '',
          date: formatDate(latest.date),
          status: latest.status || 'normal',
          source: latest.source || 'manual'
        });
      }
    });

    return processed.slice(0, 4); // Show max 4 metrics
  };

  // Format metric name for display
  const formatMetricName = (type) => {
    const nameMap = {
      'blood_pressure': 'Blood Pressure',
      'heart_rate': 'Heart Rate',
      'blood_sugar': 'Blood Sugar',
      'cholesterol': 'Cholesterol',
      'hdl': 'HDL Cholesterol',
      'ldl': 'LDL Cholesterol',
      'triglycerides': 'Triglycerides'
    };
    return nameMap[type] || type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadDashboardData(true);
  };

  // Load data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#091429', '#0F2248', '#162F65']}
          style={styles.background}
        />
        <ActivityIndicator size="large" color="#38BFA7" />
        <Text style={styles.loadingText}>Generating your dashboard</Text>
      </View>
    );
  }

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
              <Text style={styles.userName}>{user?.name || 'Abhishek Singh k'}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/tabs/profile')} style={styles.avatar}>
              {user?.profile_photo ? (
                <Image 
                  source={{ uri: getFullImageUrl(user.profile_photo) }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Image 
                    source={{ uri: 'https://via.placeholder.com/60x60/E8F4FD/4A90E2?text=U' }}
                    style={styles.avatarImage}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Health Overview Section */}
          <View style={styles.bodySection}>
            <Image
              source={require('../../../assets/images/humanoid-transparent.png')}
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
            onRefresh={handleRefresh}
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
          
          {healthMetrics.length > 0 ? (
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
                  type: 'Heart Rate',
                  value: '72',
                  unit: 'bpm',
                  date: '2023-04-20',
                  status: 'normal'
                }}
                index={0}
              />
              <HealthMetricCard
                metric={{
                  type: 'Blood Pressure',
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

        {/* Fourth Section - Webshark MyHealth */}
        <View style={styles.fullScreenBrandSection}>
          <LinearGradient
            colors={['#091429', '#0F2248', '#162F65']}
            style={styles.brandFullGradient}
          >
            {/* Decorative Background Elements */}
            <View style={styles.brandDecorative}>
              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />
              <View style={styles.decorativeCircle3} />
              <View style={styles.decorativeCircle4} />
            </View>
            
            <View style={styles.brandFullContent}>
              {/* Medical Icon with Glow Effect */}
              <View style={styles.brandIconContainer}>
                <View style={styles.brandIconGlow} />
                <View style={styles.brandIcon}>
                  <Ionicons name="medical" size={50} color="#38BFA7" />
                </View>
              </View>
              
              {/* Main Text with 3D Effect */}
              <View style={styles.brandTextContainer}>
                <Text style={styles.brandMainText3D}>India's First</Text>
                <Text style={styles.brandSubText3D}>AI Health App</Text>
              </View>
              
              {/* Brand Name with Enhanced 3D Effect */}
              <View style={styles.brandNameContainer3D}>
                <Text style={styles.brandName3D}>WEBSHARK</Text>
                <Text style={styles.brandProduct3D}>MYHEALTH</Text>
              </View>
              
              {/* Feature Highlights */}
              <View style={styles.featureHighlights}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#38BFA7" />
                  <Text style={styles.featureText}>AI-Powered Health Insights</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#38BFA7" />
                  <Text style={styles.featureText}>Secure Medical Records</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#38BFA7" />
                  <Text style={styles.featureText}>Telemedicine Integration</Text>
                </View>
              </View>
              
              {/* Enhanced CTA Button */}
              <TouchableOpacity style={styles.enhancedCTAButton} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#38BFA7', '#2C7BE5']}
                  style={styles.ctaGradient}
                >
                  <Text style={styles.ctaButtonText}>Explore Features</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Extra padding at bottom */}
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container and Background
  container: {
    flex: 1,
    backgroundColor: '#091429',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#091429',
  },
  loadingText: {
    color: '#a0c0ff',
    marginTop: 12,
    fontSize: 16,
  },

  // Fixed Top Section (Header + Body)
  fixedTopSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'android' ? height * 0.65 : height * 0.65,
    zIndex: 0,
  },
  gradientBackground: {
    flex: 1,
    paddingTop: 40, // Added padding to bring header down
  },

  // Scrollable Content
  scrollView: {
    flex: 1,
    zIndex: Platform.OS === 'android' ? 50 : 2,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  scrollSpacer: {
    height: Platform.OS === 'android' ? height * 0.4 : height * 0.45,
  },

  // Header - Positioned lower
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#a0c0ff',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E8F4FD',
    borderRadius: 30,
  },

  // Health Overview Section (formerly Body Section)
  bodySection: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
    zIndex: Platform.OS === 'android' ? 0 : 1,
    marginTop: Platform.OS === 'android' ? -50 : 0,
  },
  bodyContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  bodyTextSection: {
    flex: 0,
    paddingRight: 20,
    zIndex: 2,
  },
  bodyTitle: {
    marginBottom: 30,
  },
  bodyTitleLine1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 32,
    textShadowColor: 'rgba(56, 191, 167, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bodyTitleLine2: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#38BFA7',
    lineHeight: 32,
    textShadowColor: 'rgba(56, 191, 167, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  bodyStats: {
    gap: 20,
    marginBottom: 20,
  },
  bodyStat: {
    marginBottom: 10,
  },
  bodyStatNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 48,
    textShadowColor: 'rgba(255, 255, 255, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bodyStatLabel: {
    fontSize: 16,
    color: '#a0c0ff',
    marginTop: 4,
    fontWeight: '500',
  },
  bodyModelImage: {
    width: Platform.OS === 'android' ? '80%' : '100%',
    height: Platform.OS === 'android' ? '80%' : '100%',
    position: 'absolute',
    resizeMode: 'cover',
    marginLeft: Platform.OS === 'android' ? '150' : '120',
    zIndex: -1,
    marginBottom: -5,
  },

  // New User Encouragement
  encouragementContainer: {
    marginTop: 10,
  },
  encouragementText: {
    fontSize: 14,
    color: '#a0c0ff',
    marginBottom: 12,
    lineHeight: 18,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 191, 167, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 191, 167, 0.3)',
    alignSelf: 'flex-start',
  },
  getStartedButtonText: {
    color: '#38BFA7',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  // Health Metrics Section
  metricsSection: {
    backgroundColor: '#162F65',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: Platform.OS === 'android' ? 100 : 3,
    marginTop: Platform.OS === 'android' ? 150 : 140,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 16,
    color: '#38BFA7',
    marginRight: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  healthMetricCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(56, 191, 167, 0.3)',
  },
  metricCardContainer: {
    flex: 1,
  },
  metricBackgroundIcon: {
    position: 'absolute',
    top: 10,
    right: -10,
    opacity: 0.3,
    zIndex: 1,
  },
  metricGlowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    zIndex: 1,
  },
  metricCardContent: {
    position: 'relative',
    zIndex: 3,
    padding: 0,
    minHeight: 140,
  },
  statusGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 2,
  },
  leftMetricCard: {
    marginRight: '2%',
  },
  rightMetricCard: {
    marginLeft: '2%',
  },
  metricCardGradient: {
    padding: 20,
    minHeight: 140,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  metricType: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    flex: 1,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  metricDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // Reports Section
  reportsSection: {
    backgroundColor: '#162F65',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  reportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(56, 191, 167, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    textTransform:'uppercase',
    color: '#fff',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 14,
    color: '#a0c0ff',
    marginBottom: 2,
  },
  reportStatus: {
    fontSize: 13,
    color: '#a0c0ff',
  },
  noReportsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  noReportsText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  noReportsSubtext: {
    fontSize: 14,
    color: '#a0c0ff',
    marginBottom: 16,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: 'rgba(56, 191, 167, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 191, 167, 0.3)',
  },
  uploadButtonText: {
    color: '#38BFA7',
    fontSize: 14,
    fontWeight: '600',
  },

 // Full-Screen Brand Section
 fullScreenBrandSection: {
  minHeight: height,
  width: width,
  zIndex: 5,
},
brandFullGradient: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
  position: 'relative',
},
brandDecorative: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},
decorativeCircle1: {
  position: 'absolute',
  top: '10%',
  right: '5%',
  width: 120,
  height: 120,
  borderRadius: 60,
  backgroundColor: 'rgba(56, 191, 167, 0.1)',
},
decorativeCircle2: {
  position: 'absolute',
  bottom: '15%',
  left: '8%',
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: 'rgba(44, 123, 229, 0.15)',
},
decorativeCircle3: {
  position: 'absolute',
  top: '30%',
  left: '10%',
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: 'rgba(56, 191, 167, 0.08)',
},
decorativeCircle4: {
  position: 'absolute',
  bottom: '30%',
  right: '15%',
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
},
brandFullContent: {
  alignItems: 'center',
  zIndex: 2,
},
brandIconContainer: {
  position: 'relative',
  marginBottom: 40,
},
brandIconGlow: {
  position: 'absolute',
  width: 120,
  height: 120,
  borderRadius: 60,
  backgroundColor: 'rgba(56, 191, 167, 0.2)',
  top: -10,
  left: -10,
  zIndex: 1,
},
brandIcon: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2,
  borderWidth: 2,
  borderColor: 'rgba(56, 191, 167, 0.3)',
},
brandTextContainer: {
  alignItems: 'center',
  marginBottom: 30,
},
brandMainText3D: {
  fontSize: 32,
  fontWeight: 'bold',
  color: '#fff',
  textAlign: 'center',
  marginBottom: 8,
  textShadowColor: 'rgba(0, 0, 0, 0.5)',
  textShadowOffset: { width: 2, height: 3 },
  textShadowRadius: 6,
},
brandSubText3D: {
  fontSize: 36,
  fontWeight: 'bold',
  color: '#38BFA7',
  textAlign: 'center',
  textShadowColor: 'rgba(0, 0, 0, 0.4)',
  textShadowOffset: { width: 2, height: 3 },
  textShadowRadius: 8,
},
brandNameContainer3D: {
  alignItems: 'center',
  marginBottom: 40,
},
brandName3D: {
  fontSize: 42,
  fontWeight: 'bold',
  color: '#fff',
  letterSpacing: 3,
  textShadowColor: 'rgba(0, 0, 0, 0.6)',
  textShadowOffset: { width: 3, height: 4 },
  textShadowRadius: 10,
},
brandProduct3D: {
  fontSize: 18,
  fontWeight: '600',
  color: 'rgba(160, 192, 255, 0.9)',
  letterSpacing: 2,
  marginTop: 8,
  textShadowColor: 'rgba(0, 0, 0, 0.3)',
  textShadowOffset: { width: 1, height: 2 },
  textShadowRadius: 4,
},
featureHighlights: {
  alignItems: 'flex-start',
  marginBottom: 40,
},
featureItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},
featureText: {
  fontSize: 16,
  color: '#a0c0ff',
  marginLeft: 12,
  fontWeight: '500',
},
enhancedCTAButton: {
  borderRadius: 30,
  overflow: 'hidden',
  elevation: 6,
  shadowColor: '#38BFA7',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
},
ctaGradient: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 32,
  paddingVertical: 16,
},
ctaButtonText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#fff',
  marginRight: 10,
  textShadowColor: 'rgba(0, 0, 0, 0.3)',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
},
  // Bottom Padding
  bottomPadding: {
    height: -20,
  },
});