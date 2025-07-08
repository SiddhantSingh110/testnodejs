// components/report/ReportOrganHealthCard.jsx - Enhanced with AI Insights
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import api from '../../api/auth';

// ✅ FIXED: Shared status colors (consistent with backend)
const STATUS_COLORS = {
  normal: '#28D45C',   // Green for normal values
  borderline: '#FFC107', // Amber for borderline values 
  high: '#FF5656',     // Red for high values
  low: '#FF5656',      // ✅ FIXED: Red for low values (also concerning)
};

// Component for displaying AI insights tabs
const AIInsightsTabs = ({ insights, loading }) => {
  const [activeTab, setActiveTab] = useState('cases');
  
  const tabs = [
    { key: 'cases', title: 'Causes', icon: 'folder-open' },
    { key: 'symptoms', title: 'Symptoms', icon: 'medical' },
    { key: 'remedies', title: 'Treatment', icon: 'medkit' },
    { key: 'consequences', title: 'Risks', icon: 'warning' },
    { key: 'next_steps', title: 'Action Plan', icon: 'arrow-forward-circle' },
  ];

  const renderInsightItem = (item, index) => (
    <View key={index} style={styles.insightItem}>
      <View style={styles.insightIconContainer}>
        <Text style={styles.insightIcon}>{item.icon || '•'}</Text>
      </View>
      <View style={styles.insightContent}>
        <Text style={styles.insightTitle}>{item.title}</Text>
        <Text style={styles.insightDescription}>{item.description}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#2C7BE5" />
        <Text style={styles.loadingText}>Generating AI insights...</Text>
      </View>
    );
  }

  if (!insights) {
    return (
      <View style={styles.noInsightsContainer}>
        <Ionicons name="information-circle-outline" size={32} color="#a0c0ff" />
        <Text style={styles.noInsightsText}>No insights available</Text>
      </View>
    );
  }

  return (
    <View style={styles.tabsContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabScroll}
        contentContainerStyle={styles.tabScrollContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.insightTab, activeTab === tab.key && styles.insightTabActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={tab.icon} 
              size={16} 
              color={activeTab === tab.key ? '#fff' : '#a0c0ff'} 
            />
            <Text style={[styles.insightTabText, activeTab === tab.key && styles.insightTabTextActive]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.insightTabContent}>
        {insights[activeTab]?.map(renderInsightItem) || (
          <View style={styles.noInsightsContainer}>
            <Ionicons name="information-circle-outline" size={24} color="#a0c0ff" />
            <Text style={styles.noInsightsText}>No information available for this category</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const ReportOrganHealthCard = ({ organKey, organData, index, reportId, token }) => {
  const [expanded, setExpanded] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [animatedValue] = useState(new Animated.Value(1));
  
  if (!organData || !organData.hasData) {
    return null;
  }

  const { system, score, status, metrics, primaryMetric } = organData;

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.98,
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
    setExpanded(!expanded);
    if (!expanded) {
      setShowInsights(false); // Reset insights when collapsing
    }
  };

  // ✨ NEW: Fetch AI insights for this organ group
  const fetchAIInsights = async () => {
    if (aiInsights) {
      setShowInsights(!showInsights);
      return;
    }

    try {
      setLoadingInsights(true);
      setShowInsights(true);

      console.log('🧠 Fetching AI insights for organ:', organKey);

      const response = await api.post(`/patient/reports/${reportId}/organ-insights/${organKey}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setAiInsights(response.data.insights);
        console.log('✅ AI insights loaded successfully');
      } else {
        throw new Error('Failed to generate insights');
      }
    } catch (error) {
      console.error('❌ Error fetching AI insights:', error);
      Alert.alert(
        'Insights Unavailable', 
        'Unable to generate AI insights at this time. Please try again later.',
        [{ text: 'OK' }]
      );
      setShowInsights(false);
    } finally {
      setLoadingInsights(false);
    }
  };

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || STATUS_COLORS.normal;
  };

  const formatHealthScore = (score) => {
    let color;
    let label;
    
    if (score >= 90) {
      color = '#4CAF50'; label = 'Excellent';
    } else if (score >= 80) {
      color = '#8BC34A'; label = 'Good';
    } else if (score >= 70) {
      color = '#FFC107'; label = 'Fair';
    } else if (score >= 60) {
      color = '#FF9800'; label = 'Poor';
    } else {
      color = '#F44336'; label = 'Critical';
    }
    
    return { display: score.toString(), label, color };
  };

  const getMetricDisplayName = (metricType) => {
    const displayNames = {
      'hdl': 'HDL Cholesterol',
      'ldl': 'LDL Cholesterol',
      'total_cholesterol': 'Total Cholesterol',
      'triglycerides': 'Triglycerides',
      'vldl': 'VLDL Cholesterol',
      'non_hdl_cholesterol': 'Non-HDL Cholesterol',
      'vitamin_d': 'Vitamin D',
      'vitamin_b12': 'Vitamin B12',
      'tsh': 'TSH',
      't3': 'T3',
      't4': 'T4',
      'alt': 'ALT',
      'ast': 'AST',
      'creatinine': 'Creatinine',
      'hemoglobin': 'Hemoglobin',
      'glucose_fasting': 'Fasting Glucose',
      'hba1c': 'HbA1c'
    };
    
    return displayNames[metricType] || metricType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const scoreData = formatHealthScore(score);
  const statusColor = getStatusColor(status);

  return (
    <Animated.View
      style={[
        styles.organCard,
        {
          transform: [{ scale: animatedValue }],
          marginBottom: 16
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
              size={70} 
              color={`${system.color}15`} 
            />
          </View>

          {/* Card Content */}
          <View style={styles.organCardContent}>
            {/* Header */}
            <View style={styles.organHeader}>
              <View style={styles.organIconContainer}>
                <Ionicons name={system.icon} size={24} color={system.color} />
              </View>
              <View style={styles.organTitleContainer}>
                <Text style={styles.organName}>{system.name}</Text>
                <Text style={styles.organMetricCount}>
                  {metrics.length} metric{metrics.length > 1 ? 's' : ''} from this report
                </Text>
              </View>
              <View style={styles.organScoreContainer}>
                <Text style={[styles.organHealthScore, { color: scoreData.color }]}>
                  {scoreData.display}
                </Text>
                <Text style={styles.organScoreLabel}>/ 100</Text>
              </View>
            </View>
            
            {/* Score Status and Expand Indicator */}
            <View style={styles.organStatusRow}>
              <Text style={[styles.organScoreStatus, { color: scoreData.color }]}>
                {scoreData.label}
              </Text>
              <View style={styles.expandIndicator}>
                <Text style={styles.expandText}>
                  {expanded ? 'Hide Details' : 'View Details'}
                </Text>
                <Ionicons 
                  name={expanded ? "chevron-up" : "chevron-down"} 
                  size={18} 
                  color="#a0c0ff" 
                />
              </View>
            </View>

            {/* Primary Metric Preview (when collapsed) */}
            {!expanded && primaryMetric && (
              <View style={styles.primaryMetricPreview}>
                <View style={styles.previewHeader}>
                  <View style={[styles.metricStatusBadge, { backgroundColor: getStatusColor(primaryMetric.status) }]}>
                    <Text style={styles.statusBadgeText}>
                      {primaryMetric.status.charAt(0).toUpperCase() + primaryMetric.status.slice(1)}
                    </Text>
                  </View>
                  <Text style={styles.previewMetricName}>
                    {getMetricDisplayName(primaryMetric.type)}
                  </Text>
                  <Text style={styles.previewMetricValue}>
                    {primaryMetric.value} {primaryMetric.unit}
                  </Text>
                </View>
                <Text style={styles.previewNote}>
                  + {metrics.length - 1} more metric{metrics.length > 2 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>

          {/* Status Indicator Bar */}
          {status !== 'normal' && (
            <View style={[styles.organStatusIndicator, { backgroundColor: statusColor }]} />
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Expanded Metrics Details */}
      {expanded && (
        <View style={styles.expandedMetrics}>
          <View style={styles.expandedHeader}>
            <Ionicons name="list" size={16} color="#a0c0ff" />
            <Text style={styles.expandedTitle}>Test Results</Text>
          </View>
          
          {metrics.map((metric, metricIndex) => (
            <View key={metricIndex} style={styles.metricItem}>
              <View style={styles.metricHeader}>
                <View style={[styles.metricStatusBadge, { backgroundColor: getStatusColor(metric.status) }]}>
                  <Text style={styles.statusBadgeText}>
                    {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                  </Text>
                </View>
                <Text style={styles.metricName}>{getMetricDisplayName(metric.type)}</Text>
                <Text style={styles.metricValue}>{metric.value} {metric.unit}</Text>
              </View>
              <Text style={styles.metricExplanation}>
                {metric.simplified_explanation}
              </Text>
              {metricIndex < metrics.length - 1 && <View style={styles.metricDivider} />}
            </View>
          ))}
          
          {/* ✨ NEW: AI Insights Button and Content */}
          <View style={styles.aiInsightsSection}>
            <TouchableOpacity
              style={styles.aiInsightsButton}
              onPress={fetchAIInsights}
              activeOpacity={0.8}
              disabled={loadingInsights}
            >
              <Ionicons 
                name={showInsights ? "brain" : "bulb"} 
                size={18} 
                color="#fff" 
              />
              <Text style={styles.aiInsightsButtonText}>
                {loadingInsights 
                  ? 'Generating...' 
                  : showInsights 
                    ? 'Hide AI Insights' 
                    : 'Get AI Insights'
                }
              </Text>
              {loadingInsights && (
                <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 8 }} />
              )}
            </TouchableOpacity>

            {/* AI Insights Content */}
            {showInsights && (
              <View style={styles.aiInsightsContent}>
                <AIInsightsTabs 
                  insights={aiInsights} 
                  loading={loadingInsights}
                />
              </View>
            )}
          </View>
          
          <View style={styles.expandedFooter}>
            <Text style={styles.reportNote}>
              Results from your uploaded medical report
            </Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  organCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  organCardContainer: {
    overflow: 'hidden',
  },
  organCardGradient: {
    padding: 20,
    position: 'relative',
    minHeight: 120,
  },
  organBackgroundIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    opacity: 0.1,
    zIndex: 0,
  },
  organCardContent: {
    zIndex: 1,
    position: 'relative',
  },
  organHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  organIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  organTitleContainer: {
    flex: 1,
  },
  organName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  organMetricCount: {
    fontSize: 12,
    color: '#a0c0ff',
  },
  organScoreContainer: {
    alignItems: 'center',
  },
  organHealthScore: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  organScoreLabel: {
    fontSize: 12,
    color: '#a0c0ff',
    marginTop: -2,
  },
  organStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  organScoreStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  expandIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandText: {
    fontSize: 12,
    color: '#a0c0ff',
    marginRight: 4,
  },
  primaryMetricPreview: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  // ✅ NEW: Modern status badges instead of dots
  metricStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 10,
  },
  statusBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  
  previewMetricName: {
    flex: 1,
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  previewMetricValue: {
    fontSize: 13,
    color: '#a0c0ff',
    fontWeight: '500',
  },
  previewNote: {
    fontSize: 11,
    color: '#a0c0ff',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  organStatusIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },

  // Expanded Section
  expandedMetrics: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160, 192, 255, 0.1)',
  },
  expandedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  metricItem: {
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricName: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 14,
    color: '#a0c0ff',
    fontWeight: '500',
  },
  metricExplanation: {
    fontSize: 12,
    color: '#a0c0ff',
    marginLeft: 60, // Align with text after badge
    lineHeight: 16,
    fontStyle: 'italic',
  },
  metricDivider: {
    height: 1,
    backgroundColor: 'rgba(160, 192, 255, 0.05)',
    marginTop: 12,
  },

  // ✨ NEW: AI Insights Section
  aiInsightsSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(160, 192, 255, 0.1)',
    paddingTop: 16,
  },
  aiInsightsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C7BE5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  aiInsightsButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  aiInsightsContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    padding: 12,
  },

  // AI Insights Tabs
  tabsContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabScroll: {
    marginBottom: 12,
  },
  tabScrollContainer: {
    paddingHorizontal: 4,
  },
  insightTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
  },
  insightTabActive: {
    backgroundColor: '#38BFA7',
  },
  insightTabText: {
    fontSize: 11,
    color: '#a0c0ff',
    fontWeight: '500',
    marginLeft: 4,
  },
  insightTabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  insightTabContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
    padding: 10,
    minHeight: 120,
  },
  
  // Insight Items
  insightItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  insightIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(56, 191, 167, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  insightIcon: {
    fontSize: 10,
    color: '#38BFA7',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  insightDescription: {
    fontSize: 11,
    color: '#a0c0ff',
    lineHeight: 15,
  },

  // Loading and Empty States
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    color: '#a0c0ff',
    fontSize: 12,
  },
  noInsightsContainer: {
    alignItems: 'center',
    padding: 16,
  },
  noInsightsText: {
    fontSize: 11,
    color: '#a0c0ff',
    marginTop: 4,
    textAlign: 'center',
  },

  expandedFooter: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(160, 192, 255, 0.1)',
  },
  reportNote: {
    fontSize: 11,
    color: '#a0c0ff',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ReportOrganHealthCard;