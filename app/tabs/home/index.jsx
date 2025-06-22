// app/tabs/home/index.jsx - Optimized with Component Separation
import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { 
  Animated,
  Alert
} from 'react-native';
import { useAuth } from '../../../hooks/useAuth';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ENV from '../../../config/environment';
import healthMetricsAPI from '../../../services/HealthMetricsAPI';
import { fetchReports } from '../../../api/auth';

// Import our new components
import { LoadingScreen } from '../../../components/home/LoadingScreen';
import { NewUserScreen } from '../../../components/home/NewUserScreen';
import { DashboardScreen } from '../../../components/home/DashboardScreen';

export default function UnifiedDashboard() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [metricsData, setMetricsData] = useState(null); // Store full metrics response
  const [healthOverview, setHealthOverview] = useState({ 
    title: "Your Health Overview",
    subtitle: "Start Your Health Journey",
    reportsAnalyzed: 0, 
    healthInsights: 0,
    isNewUser: true,
    encouragementText: "Upload your first report to get AI insights"
  });
  const scrollY = new Animated.Value(0);

  // Tab bar visibility control
  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: recentReports.length === 0
        ? { display: 'none' }
        : {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 75 + Math.max(insets.bottom, 10),
            paddingTop: 10,
            paddingBottom: Math.max(insets.bottom, 10),
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: 'transparent',
          }
    });
  }, [recentReports.length]);

  const calculateHealthOverview = (metrics, reports) => {
    const hasMetrics = metrics.length >= 2;
    const totalReports = reports.length;

    if (!hasMetrics) {
      return {
        title: "Your Health Overview",
        subtitle: "Start Your Health Journey",
        reportsAnalyzed: totalReports,
        healthInsights: 0,
        isNewUser: true,
        encouragementText: totalReports === 0 ? "Upload your first report to get AI insights" : "Add more health data for personalized insights"
      };
    }

    const abnormalMetrics = metrics.filter(m => m.status === 'high' || m.status === 'borderline').length;
    const totalInsights = Math.max(metrics.length + abnormalMetrics, totalReports * 2);

    return {
      title: "Your Health Overview",
      subtitle: "Health Insights Available",
      reportsAnalyzed: totalReports,
      healthInsights: Math.min(totalInsights, 99),
      isNewUser: false,
      encouragementText: null
    };
  };

  // 🚀 FULL DATA LOAD (only on mount or manual refresh)
  const loadDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setIsLoading(true);

      await healthMetricsAPI.init();
      const [metricsResponse, reportsData] = await Promise.all([
        healthMetricsAPI.getMetrics().catch(err => ({ metrics: {}, summary: {} })),
        fetchReports(await healthMetricsAPI.token).catch(err => [])
      ]);

      // Store full metrics response for organ grouping
      setMetricsData(metricsResponse);
      
      const processedMetrics = processHealthMetrics(metricsResponse.metrics || {});
      setHealthMetrics(processedMetrics);
      setRecentReports((reportsData || []).slice(0, 3));

      const overviewData = calculateHealthOverview(processedMetrics, reportsData || []);
      setHealthOverview(overviewData);
    } catch (error) {
      console.error('❌ Dashboard load error:', error);
      Alert.alert('Error', 'Failed to load dashboard data. Pull down to refresh.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // 🔥 LIGHTWEIGHT REFRESH (only reports - used on tab focus)
  const refreshOnlyReports = async () => {
    try {
      const reportsData = await fetchReports(await healthMetricsAPI.token);
      setRecentReports((reportsData || []).slice(0, 3));
      
      // Recalculate overview with new reports but existing metrics
      const overviewData = calculateHealthOverview(healthMetrics, reportsData || []);
      setHealthOverview(overviewData);
    } catch (error) {
      console.warn('Silent report refresh failed:', error);
      // Silent fail - don't show error to user
    }
  };

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
    return processed.slice(0, 4);
  };

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

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  // 🎯 OPTIMIZED: Load full data only once on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // 🔥 FIXED: Always refresh reports on tab focus (handles first upload)
  useFocusEffect(
    useCallback(() => {
      if (!isLoading) {
        // Always refresh reports when focusing back to home tab
        // This handles both first upload and subsequent updates
        refreshOnlyReports();
      }
    }, [isLoading])
  );

  // Render appropriate screen based on state
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (recentReports.length === 0) {
    return <NewUserScreen />;
  }

  return (
    <DashboardScreen
      user={user}
      healthMetrics={healthMetrics}
      recentReports={recentReports}
      healthOverview={healthOverview}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      scrollY={scrollY}
      formatDate={formatDate}
      metricsData={metricsData}
    />
  );
}