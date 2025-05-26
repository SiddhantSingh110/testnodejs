// app/tabs/report/[id].jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  Platform,
  RefreshControl,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../api/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Define status colors for dark theme
const STATUS_COLORS = {
  normal: '#28D45C',  // App's green color
  borderline: '#FFC107',  // Golden yellow
  high: '#FF5656',  // App's red color
};

// Component for displaying expandable finding cards
const FindingCard = ({ finding, index, onToggle, isExpanded, children }) => {
  const determineStatus = (finding) => {
    if (typeof finding === 'string') {
      const text = finding.toLowerCase();
      if (text.includes('high') || text.includes('elevated') || text.includes('low') || text.includes('deficiency')) {
        return text.includes('slightly') || text.includes('borderline') ? 'borderline' : 'high';
      }
      return 'normal';
    }
    return finding.status || 'normal';
  };

  const status = determineStatus(finding);
  const statusColor = STATUS_COLORS[status];
  
  return (
    <TouchableOpacity
      style={styles.findingCard}
      onPress={() => onToggle(index)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={[styles.cardStripe, { backgroundColor: statusColor }]} />
        
        <View style={styles.findingHeaderContainer}>
          <View style={styles.findingHeader}>
            <View style={styles.findingLeft}>
              <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
              <View style={styles.findingContentMain}>
                <Text style={styles.findingTitle}>
                  {typeof finding === 'string' ? finding : (finding.description || finding.finding)}
                </Text>
                {typeof finding === 'object' && finding.value && (
                  <View style={styles.valueContainer}>
                    <Text style={styles.findingValue}>{finding.value}</Text>
                    {finding.unit && <Text style={styles.unitText}>{finding.unit}</Text>}
                  </View>
                )}
              </View>
            </View>
            <View style={[styles.chevronContainer, isExpanded && styles.chevronExpanded]}>
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#a0c0ff" 
              />
            </View>
          </View>
          
          {typeof finding === 'object' && finding.reference && (
            <View style={styles.referenceContainer}>
              <Text style={styles.referenceText}>
                Reference: {finding.reference}
              </Text>
            </View>
          )}
        </View>
        
        {isExpanded && (
          <View style={styles.expandedContent}>
            {children}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Component for detailed finding information tabs
const FindingDetailTabs = ({ details }) => {
  const [activeTab, setActiveTab] = useState('cases');
  
  const tabs = [
    { key: 'cases', title: 'Cases', icon: 'folder-open' },
    { key: 'symptoms', title: 'Symptoms', icon: 'medical' },
    { key: 'remedies', title: 'Remedies', icon: 'medkit' },
    { key: 'consequences', title: 'Future Risk', icon: 'warning' },
    { key: 'next_steps', title: 'Next Steps', icon: 'arrow-forward-circle' },
  ];

  const renderDetailItem = (item, index) => (
    <View key={index} style={styles.detailItem}>
      <View style={styles.detailIconContainer}>
        <Text style={styles.detailIcon}>{item.icon || '•'}</Text>
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailTitle}>{item.title}</Text>
        <Text style={styles.detailDescription}>{item.description}</Text>
      </View>
    </View>
  );

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
            style={[styles.modernTab, activeTab === tab.key && styles.modernTabActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={tab.icon} 
              size={18} 
              color={activeTab === tab.key ? '#fff' : '#a0c0ff'} 
            />
            <Text style={[styles.modernTabText, activeTab === tab.key && styles.modernTabTextActive]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.modernTabContent}>
        {details[activeTab]?.map(renderDetailItem) || (
          <View style={styles.noInfoContainer}>
            <Ionicons name="information-circle-outline" size={32} color="#a0c0ff" />
            <Text style={styles.noInfo}>No information available</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default function ReportDetail() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const router = useRouter();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [findingsDetails, setFindingsDetails] = useState({});

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/patient/reports/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error.message);
      Alert.alert('Error', 'Unable to load report');
      router.back();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReport();
  };

  const toggleAccordion = async (index) => {
    const finding = report.ai_summary?.key_findings[index];
    
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((i) => i !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
      
      if (!findingsDetails[index]) {
        try {
          const response = await api.post(`/patient/reports/${id}/findings`, 
            { finding },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          
          if (response.data.success) {
            setFindingsDetails({
              ...findingsDetails,
              [index]: response.data.details,
            });
          }
        } catch (error) {
          console.error('Error fetching finding details:', error);
        }
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#38BFA7" />
        <Text style={styles.loadingText}>Loading report...</Text>
      </View>
    );
  }

  if (!report) return null;

  const aiSummary = report.ai_summary || {};

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#091429', '#0F2248', '#162F65']}
        style={styles.background}
      />
      
      <LinearGradient
        colors={['#2C7BE5', '#38BFA7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{report.title}</Text>
            <Text style={styles.headerSubtitle}>Medical Report Analysis</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#38BFA7"]} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Report Metadata Card */}
        <View style={styles.metadataCard}>
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={20} color="#2C7BE5" />
              <Text style={styles.metaLabel}>Report Date</Text>
              <Text style={styles.metaValue}>{report.report_date}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="cloud-upload-outline" size={20} color="#38BFA7" />
              <Text style={styles.metaLabel}>Uploaded</Text>
              <Text style={styles.metaValue}>{report.uploaded_at}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={20} color="#FFC107" />
              <Text style={styles.metaLabel}>Uploaded By</Text>
              <Text style={styles.metaValue}>{report.uploaded_by}</Text>
            </View>
            {report.doctor_name && (
              <View style={styles.metaItem}>
                <Ionicons name="medical-outline" size={20} color="#FF5656" />
                <Text style={styles.metaLabel}>Doctor</Text>
                <Text style={styles.metaValue}>{report.doctor_name}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Patient Information Card */}
        <View style={styles.patientCard}>
          <View style={styles.patientHeader}>
            <Ionicons name="person-circle-outline" size={24} color="#2C7BE5" />
            <Text style={styles.sectionTitle}>Patient Information</Text>
          </View>
          <View style={styles.patientGrid}>
            <View style={styles.patientInfoItem}>
              <Text style={styles.patientLabel}>Name</Text>
              <Text style={styles.patientValue}>{aiSummary.patient_name || 'N/A'}</Text>
            </View>
            <View style={styles.patientInfoItem}>
              <Text style={styles.patientLabel}>Age</Text>
              <Text style={styles.patientValue}>{aiSummary.patient_age || 'N/A'}</Text>
            </View>
            <View style={styles.patientInfoItem}>
              <Text style={styles.patientLabel}>Gender</Text>
              <Text style={styles.patientValue}>{aiSummary.patient_gender || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Diagnosis Card */}
        <View style={styles.diagnosisCard}>
          <View style={styles.diagnosisHeader}>
            <Ionicons name="analytics-outline" size={24} color="#38BFA7" />
            <Text style={styles.sectionTitle}>Diagnosis</Text>
          </View>
          <Text style={styles.diagnosisText}>
            {aiSummary.diagnosis || 'No diagnosis available'}
          </Text>
          <View style={styles.confidenceContainer}>
            <View style={styles.confidenceInfo}>
              <Text style={styles.confidenceLabel}>AI Confidence Score</Text>
              <Text style={styles.confidenceDescription}>Based on AI analysis</Text>
            </View>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceValue}>
                {aiSummary.confidence_score || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Key Findings */}
        <View style={styles.findingsSection}>
          <View style={styles.findingsHeader}>
            <Text style={styles.sectionTitle}>Key Findings</Text>
            <Text style={styles.findingsSubtitle}>
              Tap on findings for detailed information
            </Text>
          </View>

          <View style={styles.legendContainer}>
            {Object.entries(STATUS_COLORS).map(([status, color]) => (
              <View key={status} style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: color }]} />
                <Text style={styles.legendText}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </View>
            ))}
          </View>

          {aiSummary.key_findings?.map((finding, index) => (
            <FindingCard
              key={index}
              finding={finding}
              index={index}
              onToggle={toggleAccordion}
              isExpanded={expandedItems.includes(index)}
            >
              {findingsDetails[index] ? (
                <FindingDetailTabs details={findingsDetails[index]} />
              ) : (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#2C7BE5" />
                  <Text style={styles.loadingDetailsText}>Loading details...</Text>
                </View>
              )}
            </FindingCard>
          ))}
        </View>

        {/* Recommendations */}
        {aiSummary.recommendations && aiSummary.recommendations.length > 0 && (
          <View style={styles.recommendationsCard}>
            <View style={styles.recommendationsHeader}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#28D45C" />
              <Text style={styles.sectionTitle}>Recommendations</Text>
            </View>
            <View style={styles.recommendationsList}>
              {aiSummary.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.recommendationBullet}>
                    <Ionicons name="chevron-forward" size={16} color="#28D45C" />
                  </View>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Hindi Summary */}
        {aiSummary.hindi_version && (
          <View style={styles.hindiCard}>
            <View style={styles.hindiHeader}>
              <Ionicons name="language-outline" size={24} color="#FF9800" />
              <Text style={styles.sectionTitle}>Hindi Summary</Text>
            </View>
            <Text style={styles.hindiText}>{aiSummary.hindi_version}</Text>
          </View>
        )}

        {/* View Original Report Button */}
        <LinearGradient
          colors={['#2C7BE5', '#38BFA7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.viewOriginalButton}
        >
          <TouchableOpacity
            style={styles.buttonContent}
            onPress={() => {
              Alert.alert('View Report', 'Opening original report...');
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text-outline" size={20} color="#fff" />
            <Text style={styles.viewOriginalButtonText}>View Original Report</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#091429',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#a0c0ff',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#2C7BE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  metadataCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.15)',
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metaItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  metaLabel: {
    fontSize: 12,
    color: '#a0c0ff',
    marginTop: 8,
  },
  metaValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  patientCard: {
    backgroundColor: 'rgba(44, 123, 229, 0.08)',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 123, 229, 0.2)',
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  patientGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  patientInfoItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    width: '31%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  patientLabel: {
    fontSize: 12,
    color: '#a0c0ff',
    marginBottom: 4,
  },
  patientValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  diagnosisCard: {
    backgroundColor: 'rgba(56, 191, 167, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 191, 167, 0.2)',
  },
  diagnosisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  diagnosisText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 16,
  },
  confidenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  confidenceInfo: {
    flex: 1,
  },
  confidenceLabel: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  confidenceDescription: {
    fontSize: 12,
    color: '#a0c0ff',
    marginTop: 4,
  },
  confidenceBadge: {
    backgroundColor: '#2C7BE5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  findingsSection: {
    marginBottom: 20,
  },
  findingsHeader: {
    marginBottom: 16,
  },
  findingsSubtitle: {
    fontSize: 14,
    color: '#a0c0ff',
    marginTop: 4,
    marginLeft: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.15)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#fff',
  },
  findingCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.15)',
  },
  cardContent: {
    padding: 16,
    position: 'relative',
  },
  cardStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  findingHeaderContainer: {
    marginLeft: 8,
  },
  findingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  findingLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  statusIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
    marginTop: 3,
  },
  findingContentMain: {
    flex: 1,
  },
  findingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  findingValue: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  unitText: {
    fontSize: 14,
    color: '#a0c0ff',
    marginLeft: 4,
  },
  chevronContainer: {
    padding: 4,
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  referenceContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  referenceText: {
    fontSize: 13,
    color: '#a0c0ff',
  },
  expandedContent: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(160, 192, 255, 0.15)',
    paddingTop: 16,
  },
  tabsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabScroll: {
    marginBottom: 12,
  },
  tabScrollContainer: {
    paddingHorizontal: 4,
  },
  modernTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  modernTabActive: {
    backgroundColor: '#2C7BE5',
  },
  modernTabText: {
    fontSize: 14,
    color: '#a0c0ff',
    fontWeight: '500',
    marginLeft: 6,
  },
  modernTabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  modernTabContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.15)',
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailIcon: {
    fontSize: 16,
    color: '#38BFA7',
  },
  detailContent: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  detailDescription: {
    fontSize: 14,
    color: '#a0c0ff',
    lineHeight: 22,
  },
  noInfoContainer: {
    alignItems: 'center',
    padding: 24,
  },
  noInfo: {
    fontSize: 14,
    color: '#a0c0ff',
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingDetailsText: {
    marginLeft: 10,
    color: '#a0c0ff',
  },
  recommendationsCard: {
    backgroundColor: 'rgba(40, 212, 92, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(40, 212, 92, 0.2)',
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recommendationsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  recommendationBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(40, 212, 92, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  hindiCard: {
    backgroundColor: 'rgba(255, 152, 0, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.2)',
  },
  hindiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hindiText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 22,
  },
  viewOriginalButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#2C7BE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  viewOriginalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
 });