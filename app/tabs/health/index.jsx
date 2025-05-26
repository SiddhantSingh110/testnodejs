// app/tabs/health/index.jsx - Enhanced Health Screen
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

// Import components
import HealthChart, { Annotation } from '../../../components/healthmetrics_screen/HealthChart';
import { 
  AddMeasurementModal, 
  MetricInfoModal, 
  GoalSettingModal, 
  RecommendationsModal 
} from '../../../components/healthmetrics_screen/HealthModals';

// Import constants and styles
import { metricTypes, referenceRanges, categories, organCategories } from '../../../constants/healthmetrics_screen/HealthMetrics.constants';
import { styles } from '../../../styles/healthmetrics_screen/HealthMetrics.styles';
import healthMetricsAPI from '../../../services/HealthMetricsAPI';

export default function HealthMetrics() {
  // State management
  const [metricsData, setMetricsData] = useState({});
  const [metricsSummary, setMetricsSummary] = useState({});
  const [uiHints, setUiHints] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('organs');
  const [selectedSubCategory, setSelectedSubCategory] = useState('heart');
  const [selectedMetric, setSelectedMetric] = useState('hdl');
  const [timeframe, setTimeframe] = useState('week');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showRecommendationsModal, setShowRecommendationsModal] = useState(false);
  const [selectedMetricInfo, setSelectedMetricInfo] = useState(null);
  const [healthInsights, setHealthInsights] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // ✨ New states for enhanced functionality
  const [recentMetrics, setRecentMetrics] = useState([]);
  const [showRecentUpdates, setShowRecentUpdates] = useState(false);
  const [reviewableMetrics, setReviewableMetrics] = useState([]);

  // ✨ Auto-refresh when screen comes into focus (for report uploads)
  useFocusEffect(
    useCallback(() => {
      console.log('🏥 Health screen focused - checking for new metrics');
      initializeData();
    }, [])
  );

  // Initialize API and load data
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setIsLoading(true);
      
      // Initialize API (get stored token)
      await healthMetricsAPI.init();
      
      // Load all health data
      await Promise.all([
        loadMetricsData(),
        loadHealthInsights(),
        loadRecentMetrics()
      ]);
      
    } catch (error) {
      console.error('Failed to initialize health data:', error);
      Alert.alert('Error', 'Failed to load health data. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✨ Enhanced: Load metrics data with metadata
  const loadMetricsData = async () => {
    try {
      const response = await healthMetricsAPI.getMetrics();
      
      // Extract data from enhanced API response
      setMetricsData(response.metrics || response || {});
      setMetricsSummary(response.summary || {});
      setUiHints(response.ui_hints || {});
      
      // Find metrics that need review (from reports, within last 7 days)
      const needsReview = [];
      Object.values(response.metrics || response || {}).forEach(metricArray => {
        if (Array.isArray(metricArray)) {
          metricArray.forEach(metric => {
            if (metric.needs_review) {
              needsReview.push(metric);
            }
          });
        }
      });
      setReviewableMetrics(needsReview);
      
      console.log('✅ Health metrics loaded:', {
        total: response.summary?.total_metrics || 0,
        recent: response.summary?.recent_metrics || 0,
        needsReview: needsReview.length,
        hasReportMetrics: response.ui_hints?.has_report_metrics || false
      });
      
    } catch (error) {
      console.error('Failed to load metrics:', error);
      if (error.message.includes('Authentication failed')) {
        Alert.alert('Session Expired', 'Please login again.');
      }
    }
  };

  // ✨ New: Load recent metrics for timeline
  const loadRecentMetrics = async () => {
    try {
      const response = await healthMetricsAPI.getRecentMetrics(7); // Last 7 days
      setRecentMetrics(response.timeline || []);
      
      // Auto-show recent updates if there are new report metrics
      const hasRecentReportMetrics = response.timeline?.some(
        item => item.type === 'report_extraction'
      );
      setShowRecentUpdates(hasRecentReportMetrics);
      
    } catch (error) {
      console.error('Failed to load recent metrics:', error);
    }
  };

  // Load health insights from API
  const loadHealthInsights = async () => {
    try {
      const insights = await healthMetricsAPI.getInsights();
      setHealthInsights(insights);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  // ✨ Enhanced: Refresh data with loading state
  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        loadMetricsData(),
        loadHealthInsights(),
        loadRecentMetrics()
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // ✨ New: Mark metrics as reviewed
  const handleMarkAsReviewed = async (metricIds) => {
    try {
      await healthMetricsAPI.markMetricsAsReviewed(metricIds);
      
      // Refresh data to remove review badges
      await loadMetricsData();
      
      Alert.alert('Success', 'Metrics marked as reviewed!');
    } catch (error) {
      console.error('Failed to mark as reviewed:', error);
      Alert.alert('Error', 'Failed to mark metrics as reviewed');
    }
  };

  // Save new measurement
  const handleSaveMeasurement = async (measurementData) => {
    try {
      await healthMetricsAPI.createMetric(measurementData);
      
      // Refresh data to show new measurement
      await loadMetricsData();
      
      Alert.alert('Success', 'Measurement saved successfully!');
    } catch (error) {
      console.error('Failed to save measurement:', error);
      throw error;
    }
  };

  // Save new goal
  const handleSaveGoal = async (goalData) => {
    try {
      // You'll need to implement this in your API
      // await healthMetricsAPI.createGoal(goalData);
      console.log('Goal data to save:', goalData);
      
      // For now, just log the goal data
      // In a real implementation, this would save to your backend
    } catch (error) {
      console.error('Failed to save goal:', error);
      throw error;
    }
  };

  // Helper Functions
  const getMetricUnit = (metricId) => {
    const metricType = metricTypes.find(m => m.id === metricId);
    return metricType?.unit || referenceRanges[metricId]?.unit || '';
  };

  const getMetricColor = (metricId) => {
    return metricTypes.find(m => m.id === metricId)?.color || '#2C7BE5';
  };

  const getCurrentMetricValue = () => {
    if (!metricsData[selectedMetric] || metricsData[selectedMetric].length === 0) return 'N/A';
    return metricsData[selectedMetric][0].value;
  };
  
  const getStatusForValue = (metricId, value) => {
    if (!referenceRanges[metricId]) return 'normal';
    
    const range = referenceRanges[metricId];
    const numValue = parseFloat(value);
    
    if (metricId === 'blood_pressure' && value.includes('/')) {
      const [systolic, diastolic] = value.split('/').map(v => parseInt(v.trim()));
      const [maxSys, maxDia] = range.max.split('/').map(v => parseInt(v.trim()));
      const [warnSys, warnDia] = range.warningHigh.split('/').map(v => parseInt(v.trim()));
      
      if (systolic > warnSys || diastolic > warnDia) return 'high';
      if (systolic > maxSys || diastolic > maxDia) return 'borderline';
      return 'normal';
    }
    
    if (range.criticalLow && numValue <= range.criticalLow) return 'high';
    if (range.criticalHigh && numValue >= range.criticalHigh) return 'high';
    if (range.warningLow && numValue <= range.warningLow) return 'borderline';
    if (range.warningHigh && numValue >= range.warningHigh) return 'borderline';
    
    if (range.min && range.max) {
      if (numValue < range.min || numValue > range.max) return 'borderline';
    }
    
    return 'normal';
  };
  
  const getChangeSinceLastMeasurement = () => {
    if (!metricsData[selectedMetric] || metricsData[selectedMetric].length < 2) return null;
    
    const current = parseFloat(metricsData[selectedMetric][0].value);
    let previous;
    
    if (selectedMetric === 'blood_pressure') {
      const [currentSys] = metricsData[selectedMetric][0].value.split('/').map(v => parseInt(v.trim()));
      const [previousSys] = metricsData[selectedMetric][1].value.split('/').map(v => parseInt(v.trim()));
      const change = ((currentSys - previousSys) / previousSys * 100).toFixed(1);
      return { percent: change, value: currentSys - previousSys };
    }
    
    previous = parseFloat(metricsData[selectedMetric][1].value);
    const change = ((current - previous) / previous * 100).toFixed(1);
    return { percent: change, value: (current - previous).toFixed(1) };
  };

  // Category and metric selection handlers
  const getFilteredMetrics = () => {
    if (selectedCategory === 'all') {
      return metricTypes.filter(metric => 
        metricsData[metric.id] && metricsData[metric.id].length > 0
      );
    }
    
    if (selectedCategory === 'organs' && selectedSubCategory) {
      return metricTypes.filter(metric => 
        metric.category === 'organs' && 
        metric.subcategory === selectedSubCategory
      );
    }
    
    return metricTypes.filter(metric => metric.category === selectedCategory);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(null);
    
    const filtered = metricTypes.filter(m => m.category === categoryId);
    if (filtered.length > 0) {
      const withData = filtered.find(m => metricsData[m.id] && metricsData[m.id].length > 0);
      setSelectedMetric(withData ? withData.id : filtered[0].id);
    }
  };
  
  const handleSubCategorySelect = (subCategoryId) => {
    setSelectedSubCategory(subCategoryId);
    
    const filtered = metricTypes.filter(
      m => m.category === 'organs' && m.subcategory === subCategoryId
    );
    if (filtered.length > 0) {
      const withData = filtered.find(m => metricsData[m.id] && metricsData[m.id].length > 0);
      setSelectedMetric(withData ? withData.id : filtered[0].id);
    }
  };

  // Get relevant insights
  const getRelevantInsights = () => {
    return healthInsights.filter(insight => insight.metric_id === selectedMetric);
  };

  // Modal handlers
  const handleInfoPress = () => {
    const metricInfo = metricTypes.find(m => m.id === selectedMetric);
    if (metricInfo) {
      setSelectedMetricInfo(metricInfo);
      setShowInfoModal(true);
    }
  };

  const handleSetGoal = () => {
    setShowGoalModal(true);
  };

  const handleViewRecommendations = () => {
    setShowRecommendationsModal(true);
  };

  // ✨ New: Render recent updates section
  const renderRecentUpdates = () => {
    if (!showRecentUpdates || recentMetrics.length === 0) return null;

    return (
      <View style={styles.recentUpdatesCard}>
        <View style={styles.recentUpdatesHeader}>
          <View style={styles.recentUpdatesHeaderLeft}>
            <View style={styles.recentUpdatesIcon}>
              <Ionicons name="time-outline" size={20} color="#38BFA7" />
            </View>
            <Text style={styles.recentUpdatesTitle}>Recent Health Updates</Text>
          </View>
          <TouchableOpacity 
            style={styles.dismissButton}
            onPress={() => setShowRecentUpdates(false)}
          >
            <Ionicons name="close" size={18} color="#aaa" />
          </TouchableOpacity>
        </View>

        {recentMetrics.slice(0, 2).map((item, index) => (
          <View key={index} style={styles.recentUpdateItem}>
            <View style={[styles.recentUpdateIconContainer, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={16} color={item.color} />
            </View>
            <View style={styles.recentUpdateContent}>
              <Text style={styles.recentUpdateTitle}>{item.title}</Text>
              <Text style={styles.recentUpdateSubtitle}>{item.subtitle}</Text>
              <Text style={styles.recentUpdateDate}>{item.date}</Text>
            </View>
            {item.type === 'report_extraction' && (
              <View style={styles.reviewBadge}>
                <Text style={styles.reviewBadgeText}>New</Text>
              </View>
            )}
          </View>
        ))}

        {reviewableMetrics.length > 0 && (
          <TouchableOpacity 
            style={styles.reviewAllButton}
            onPress={() => handleMarkAsReviewed(reviewableMetrics.map(m => m.id))}
          >
            <Ionicons name="checkmark-circle-outline" size={16} color="#38BFA7" />
            <Text style={styles.reviewAllButtonText}>
              Mark all {reviewableMetrics.length} new metrics as reviewed
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#38BFA7" />
            <Text style={styles.loaderText}>Loading your health data...</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            
            {/* ✨ Recent Updates Section */}
            {renderRecentUpdates()}
            
            {/* Top level category selector */}
            <View style={styles.categorySelector}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && styles.categoryButtonActive
                    ]}
                    onPress={() => handleCategorySelect(category.id)}
                  >
                    <Ionicons 
                      name={category.icon} 
                      size={16} 
                      color={selectedCategory === category.id ? '#fff' : '#aaa'} 
                    />
                    <Text 
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === category.id && styles.categoryButtonTextActive
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Subcategory selector (shown only for organs) */}
            {selectedCategory === 'organs' && (
              <View style={styles.subCategorySelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {organCategories.map(organ => (
                    <TouchableOpacity
                      key={organ.id}
                      style={[
                        styles.subCategoryButton,
                        selectedSubCategory === organ.id && { 
                          backgroundColor: `${organ.color}20`, 
                          borderColor: organ.color 
                        }
                      ]}
                      onPress={() => handleSubCategorySelect(organ.id)}
                    >
                      <Ionicons name={organ.icon} size={20} color={organ.color} />
                      <Text 
                        style={[
                          styles.subCategoryButtonText, 
                          selectedSubCategory === organ.id && { color: organ.color }
                        ]}
                      >
                        {organ.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            
            {/* Metric selector */}
            <View style={styles.metricSelector}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {getFilteredMetrics().map(metric => (
                  <TouchableOpacity
                    key={metric.id}
                    style={[
                      styles.metricTypeButton,
                      selectedMetric === metric.id && { 
                        backgroundColor: `${metric.color}20`, 
                        borderColor: metric.color 
                      }
                    ]}
                    onPress={() => setSelectedMetric(metric.id)}
                  >
                    <Ionicons name={metric.icon} size={20} color={metric.color} />
                    <Text style={[styles.metricTypeText, selectedMetric === metric.id && { color: metric.color }]}>
                      {metric.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Current Value Card */}
            <LinearGradient
              colors={[`${getMetricColor(selectedMetric)}30`, `${getMetricColor(selectedMetric)}10`]}
              style={styles.currentValueCard}
            >
              <View style={styles.currentValueHeader}>
                <Text style={styles.currentValueLabel}>Current Value</Text>
                <View style={styles.headerActions}>
                  <TouchableOpacity 
                    style={styles.refreshButton}
                    onPress={refreshData}
                    disabled={isRefreshing}
                  >
                    <Ionicons 
                      name="refresh-outline" 
                      size={20} 
                      color={getMetricColor(selectedMetric)} 
                      style={isRefreshing && { opacity: 0.5 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.infoButton}
                    onPress={handleInfoPress}
                  >
                    <Ionicons name="information-circle-outline" size={22} color={getMetricColor(selectedMetric)} />
                  </TouchableOpacity>
                </View>
              </View>
              
              {metricsData[selectedMetric] && metricsData[selectedMetric].length > 0 ? (
                <>
                  <View style={styles.currentValueContainer}>
                    <Text style={[styles.currentValue, { color: getMetricColor(selectedMetric) }]}>
                      {getCurrentMetricValue()}
                    </Text>
                    <Text style={styles.currentValueUnit}>
                      {getMetricUnit(selectedMetric)}
                    </Text>
                  </View>
                  
                  {/* ✨ Enhanced: Reference range - now in Level 1 */}
                  {referenceRanges[selectedMetric] && (
                    <Text style={styles.referenceRange}>
                      Reference: {referenceRanges[selectedMetric].min} - {referenceRanges[selectedMetric].max} {referenceRanges[selectedMetric].unit}
                    </Text>
                  )}
                  
                  {/* Status indicator */}
                  <View style={styles.statusContainer}>
                    {metricsData[selectedMetric][0].status === 'normal' && (
                      <View style={styles.statusBadge}>
                        <View style={[styles.statusIndicator, styles.statusNormal]} />
                        <Text style={styles.statusText}>Normal</Text>
                      </View>
                    )}
                    
                    {metricsData[selectedMetric][0].status === 'borderline' && (
                      <View style={styles.statusBadge}>
                        <View style={[styles.statusIndicator, styles.statusBorderline]} />
                        <Text style={styles.statusText}>Borderline</Text>
                      </View>
                    )}
                    
                    {metricsData[selectedMetric][0].status === 'high' && (
                      <View style={styles.statusBadge}>
                        <View style={[styles.statusIndicator, styles.statusHigh]} />
                        <Text style={styles.statusText}>Attention Needed</Text>
                      </View>
                    )}
                  </View>
                  
                  {/* Change since last measurement */}
                  {getChangeSinceLastMeasurement() && (
                    <View style={styles.changeContainer}>
                      <Text style={styles.changeLabel}>Change from previous:</Text>
                      <Text 
                        style={[
                          styles.changeValue, 
                          parseFloat(getChangeSinceLastMeasurement().percent) > 0 
                            ? styles.increaseValue 
                            : parseFloat(getChangeSinceLastMeasurement().percent) < 0
                              ? styles.decreaseValue
                              : styles.unchangedValue
                        ]}
                      >
                        {parseFloat(getChangeSinceLastMeasurement().percent) > 0 ? '+' : ''}
                        {getChangeSinceLastMeasurement().percent}% 
                        ({parseFloat(getChangeSinceLastMeasurement().value) > 0 ? '+' : ''}
                        {getChangeSinceLastMeasurement().value} {getMetricUnit(selectedMetric)})
                      </Text>
                    </View>
                  )}
                  
                  {/* ✨ Enhanced: Last measurement with source */}
                  <View style={styles.measurementInfoContainer}>
                    <Text style={styles.measurementDate}>
                      Last measured: {metricsData[selectedMetric][0].date}, {metricsData[selectedMetric][0].time}
                    </Text>
                    <View style={styles.measurementSourceContainer}>
                      <Ionicons 
                        name={metricsData[selectedMetric][0].source === 'report' ? 'document-text-outline' : 'create-outline'} 
                        size={12} 
                        color="#aaa" 
                      />
                      <Text style={styles.measurementSource}>
                        {metricsData[selectedMetric][0].source_display || 'Manual Entry'}
                      </Text>
                      {metricsData[selectedMetric][0].needs_review && (
                        <View style={styles.needsReviewBadge}>
                          <Text style={styles.needsReviewText}>New</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  {/* Percentile data (shown for certain metrics) */}
                  {metricTypes.find(m => m.id === selectedMetric)?.percentileData && (
                    <View style={styles.percentileContainer}>
                      <Text style={styles.percentileTitle}>Your {metricTypes.find(m => m.id === selectedMetric)?.name} ranks in the top {metricTypes.find(m => m.id === selectedMetric)?.percentileData.percentile}%</Text>
                      <View style={styles.percentileBarContainer}>
                        <View style={styles.percentileBar}>
                          <View 
                            style={[
                              styles.percentileFill, 
                              { width: `${metricTypes.find(m => m.id === selectedMetric)?.percentileData.percentile}%` }
                            ]} 
                          />
                          <View 
                            style={[
                              styles.percentileTarget,
                              { left: `${metricTypes.find(m => m.id === selectedMetric)?.percentileData.target}%` }
                            ]}
                          />
                        </View>
                      </View>
                      <TouchableOpacity 
                        style={styles.recommendationsButton}
                        onPress={handleViewRecommendations}
                      >
                        <Text style={styles.recommendationsButtonText}>
                          Next target: Top {metricTypes.find(m => m.id === selectedMetric)?.percentileData.target}% - View Recommendations
                        </Text>
                        <Ionicons name="chevron-forward" size={16} color={getMetricColor(selectedMetric)} />
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No measurements available</Text>
                  <Text style={styles.noDataSubtext}>Add your first measurement below</Text>
                </View>
              )}
              
              <View style={styles.metricButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: getMetricColor(selectedMetric) }]}
                  onPress={() => setShowAddModal(true)}
                >
                  <Ionicons name="add" size={16} color="#fff" />
                  <Text style={styles.addButtonText}>Add Measurement</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.goalButton, { borderColor: getMetricColor(selectedMetric) }]}
                  onPress={handleSetGoal}
                >
                  <Ionicons name="flag-outline" size={16} color={getMetricColor(selectedMetric)} />
                  <Text style={[styles.goalButtonText, { color: getMetricColor(selectedMetric) }]}>Set Goal</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
            
            {/* Relevant Insights */}
            {getRelevantInsights().length > 0 && (
              <View style={styles.insightsCard}>
                <Text style={styles.insightsTitle}>Health Insights</Text>
                {getRelevantInsights().map((insight, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.insightItem,
                      insight.severity === 'warning' && styles.insightWarning,
                      insight.severity === 'attention' && styles.insightAttention,
                      insight.severity === 'positive' && styles.insightPositive,
                    ]}
                  >
                    <View style={styles.insightHeader}>
                      {insight.severity === 'warning' && <Ionicons name="warning-outline" size={20} color="#FFC107" />}
                      {insight.severity === 'attention' && <Ionicons name="alert-circle-outline" size={20} color="#F44336" />}
                      {insight.severity === 'positive' && <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />}
                      <Text style={styles.insightTitle}>{insight.title}</Text>
                    </View>
                    <Text style={styles.insightDescription}>{insight.description}</Text>
                    <Text style={styles.insightDate}>{insight.date}</Text>
                  </View>
                ))}
              </View>
            )}
            
            {/* Chart Card */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Recent Trend</Text>
                <View style={styles.timeframeButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.timeframeButton, 
                      timeframe === 'week' && styles.timeframeButtonActive
                    ]}
                    onPress={() => setTimeframe('week')}
                  >
                    <Text 
                      style={[
                        styles.timeframeButtonText, 
                        timeframe === 'week' && styles.timeframeButtonTextActive
                      ]}
                    >
                      Week
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.timeframeButton, 
                      timeframe === 'month' && styles.timeframeButtonActive
                    ]}
                    onPress={() => setTimeframe('month')}
                  >
                    <Text 
                      style={[
                        styles.timeframeButtonText, 
                        timeframe === 'month' && styles.timeframeButtonTextActive
                      ]}
                    >
                      Month
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.timeframeButton, 
                      timeframe === 'year' && styles.timeframeButtonActive
                    ]}
                    onPress={() => setTimeframe('year')}
                  >
                    <Text 
                      style={[
                        styles.timeframeButtonText, 
                        timeframe === 'year' && styles.timeframeButtonTextActive
                      ]}
                    >
                      Year
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {metricsData[selectedMetric] && metricsData[selectedMetric].length > 0 ? (
                <>
                  <HealthChart 
                    data={metricsData[selectedMetric]} 
                    referenceRanges={referenceRanges[selectedMetric]}
                    color={getMetricColor(selectedMetric)}
                    timeframe={timeframe}
                  />
                  
                  {selectedMetric === 'hdl' && (
                    <Annotation 
                      title="Started Diet Changes" 
                      description="Started Mediterranean diet and daily 30-minute walks"
                      color={getMetricColor(selectedMetric)}
                    />
                  )}
                </>
              ) : (
                <View style={styles.noChartDataContainer}>
                  <Ionicons name="analytics-outline" size={40} color="#555" />
                  <Text style={styles.noChartDataText}>Not enough data to show trend</Text>
                  <Text style={styles.noChartDataSubtext}>Add measurements to see your trends over time</Text>
                </View>
              )}
            </View>
            
            {/* History Card */}
            <View style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>History</Text>
                
                <TouchableOpacity style={styles.filterButton}>
                  <Ionicons name="filter-outline" size={18} color="#aaa" />
                  <Text style={styles.filterButtonText}>Filter</Text>
                </TouchableOpacity>
              </View>
              
              {metricsData[selectedMetric] && metricsData[selectedMetric].length > 0 ? (
                metricsData[selectedMetric].map((item, index) => (
                  <View key={index} style={styles.historyItem}>
                    <View style={styles.historyItemLeft}>
                      <Text style={styles.historyDate}>{item.date}</Text>
                      <View style={styles.historySourceContainer}>
                        <View style={styles.historySource}>
                          <Ionicons 
                            name={item.source === 'report' ? 'document-text-outline' : 'create-outline'} 
                            size={12} 
                            color="#aaa" 
                          />
                          <Text style={styles.historySourceText}>
                            {item.source_display || (item.source === 'report' ? 'Medical Report' : 'Manual Entry')}
                          </Text>
                        </View>
                        
                        {item.context && (
                          <Text style={styles.historyContext}>
                            {item.context.replace('_', ' ')}
                          </Text>
                        )}
                        
                        {/* ✨ Review badge for new metrics */}
                        {item.needs_review && (
                          <TouchableOpacity 
                            style={styles.historyReviewBadge}
                            onPress={() => handleMarkAsReviewed([item.id])}
                          >
                            <Text style={styles.historyReviewText}>Review</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.historyItemRight}>
                      <View style={styles.historyValueContainer}>
                        <Text style={[
                          styles.historyValue,
                          item.status === 'borderline' && styles.historyValueBorderline,
                          item.status === 'high' && styles.historyValueHigh,
                        ]}>
                          {item.value}
                        </Text>
                        <Text style={styles.historyUnit}>{getMetricUnit(selectedMetric)}</Text>
                      </View>
                      
                      <View 
                        style={[
                          styles.historyStatusIndicator,
                          item.status === 'normal' && styles.statusNormal,
                          item.status === 'borderline' && styles.statusBorderline,
                          item.status === 'high' && styles.statusHigh,
                        ]} 
                      />
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No history available</Text>
              )}
            </View>
            
            {/* Extra padding at the bottom */}
            <View style={styles.bottomPadding} />
          </ScrollView>
        )}
      </SafeAreaView>
      
      {/* Modals */}
      <AddMeasurementModal 
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        metricType={selectedMetric} 
        metricColor={getMetricColor(selectedMetric)}
        metricUnit={getMetricUnit(selectedMetric)}
        onSave={handleSaveMeasurement}
      />
      
      <MetricInfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        metric={selectedMetricInfo}
        color={getMetricColor(selectedMetric)}
      />
      
      <GoalSettingModal
        visible={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        metric={metricTypes.find(m => m.id === selectedMetric)}
        metricColor={getMetricColor(selectedMetric)}
        currentValue={getCurrentMetricValue()}
        onSaveGoal={handleSaveGoal}
      />
      
      <RecommendationsModal
        visible={showRecommendationsModal}
        onClose={() => setShowRecommendationsModal(false)}
        metric={metricTypes.find(m => m.id === selectedMetric)}
        color={getMetricColor(selectedMetric)}
      />
    </>
  );
}