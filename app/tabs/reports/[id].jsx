// app/tabs/report/[id].jsx - Redesigned Report Detail Screen
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
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../api/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import environment from '../../../config/environment';

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

  // Format date and time without seconds
  const formatDateTime = (dateTimeString) => {
    try {
      const date = new Date(dateTimeString);
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      return { dateStr, timeStr };
    } catch {
      return { dateStr: dateTimeString, timeStr: '' };
    }
  };

  // Handle download original report
  const handleDownloadReport = () => {
    Alert.alert(
      'Download Report',
      'Choose your preferred format:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'AI Summary Report', onPress: () => downloadToDevice('summary') },
        { text: 'Original Report', onPress: () => downloadToDevice('original') },
      ]
    );
  };

  const downloadToDevice = async (type) => {
    try {
      let endpoint = '';
      let downloadType = '';
      
      if (type === 'original') {
        // ✅ Use secure download endpoint instead of file_url
        endpoint = `${environment.apiUrl}/patient/reports/${id}/download`;
        downloadType = 'Original Medical Report';
      } else if (type === 'summary') {
        // ✅ AI summary endpoint (already secure)
        endpoint = `${environment.apiUrl}/patient/reports/${id}/summary-pdf`;
        downloadType = 'AI Summary Report';
      }
  
      // Create filename with report title
      const reportTitle = report?.title || report?.report_title || 'medical_report';
      const sanitizedTitle = reportTitle.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = `${type}_${sanitizedTitle}_${Date.now()}.pdf`;
      const fileDestination = FileSystem.documentDirectory + fileName;
  
      console.log('📥 Downloading from detail screen:', downloadType);
      console.log('🔗 Endpoint:', endpoint);
      console.log('📁 Destination:', fileDestination);
  
      // Show initial loading alert
      Alert.alert(
        'Download Started', 
        `${downloadType} is being downloaded...`,
        [{ text: 'OK' }]
      );
  
      const downloadResumable = FileSystem.createDownloadResumable(
        endpoint,
        fileDestination,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/pdf',
            'User-Agent': 'WebsharkHealth-Mobile-App'
          }
        }
      );
  
      console.log('🚀 Starting secure download from detail screen...');
      
      const { uri, status, headers } = await downloadResumable.downloadAsync();
  
      console.log(`📥 Download completed with status: ${status}`);
      console.log(`📄 Headers:`, headers);
      console.log(`✅ File saved to: ${uri}`);
  
      // Verify download success
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('Downloaded file does not exist');
      }
  
      // Validate file size and content
      if (fileInfo.size < 500) {
        // File too small, might be an error response
        const fileContent = await FileSystem.readAsStringAsync(uri, { 
          length: 1000,
          encoding: FileSystem.EncodingType.UTF8 
        });
        
        console.log('⚠️ Small file detected, content:', fileContent.substring(0, 200));
        
        if (fileContent.includes('error') || 
            fileContent.includes('404') || 
            fileContent.includes('<html>') ||
            fileContent.includes('unauthorized')) {
          throw new Error('Server returned an error instead of the file');
        }
      }
  
      console.log(`📊 Valid file downloaded from detail screen - Size: ${fileInfo.size} bytes`);
  
      // Brief delay for file system
      await new Promise(resolve => setTimeout(resolve, 300));
  
      // Attempt to share the file
      const sharingAvailable = await Sharing.isAvailableAsync();
      if (!sharingAvailable) {
        Alert.alert(
          'Download Complete', 
          `${downloadType} has been downloaded successfully but sharing is not available on this device.`
        );
        return;
      }
  
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: downloadType,
        UTI: 'com.adobe.pdf'
      });
  
      console.log("✅ File shared successfully from detail screen");
  
      // Success message
      Alert.alert(
        'Download Complete',
        `${downloadType} has been downloaded and shared successfully!`
      );
  
    } catch (error) {
      console.error("❌ Download failed from detail screen:", error);
      
      let errorMessage = 'Unable to download file.';
      let errorTitle = 'Download Failed';
      
      if (error.message.includes('404') || error.message.includes('not found')) {
        errorMessage = 'File not found on server. The file may have been moved or deleted.';
      } else if (error.message.includes('403') || error.message.includes('401') || error.message.includes('unauthorized')) {
        errorMessage = 'Access denied. Please log out and log back in.';
        errorTitle = 'Authentication Error';
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
        errorTitle = 'Connection Error';
      } else if (error.message.includes('Server returned an error')) {
        errorMessage = 'The server encountered an error. Please try again later.';
        errorTitle = 'Server Error';
      }
      
      Alert.alert(
        errorTitle, 
        errorMessage,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Retry', 
            onPress: () => downloadToDevice(type)
          }
        ]
      );
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
  const reportDate = formatDateTime(report.report_date);
  const uploadedDate = formatDateTime(report.uploaded_at);

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#091429', '#0F2248', '#162F65']}
        style={styles.background}
      />
      
      {/* Compact Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push('/tabs/reports')} 
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {report.title || 'Medical Report'}
          </Text>
          <Text style={styles.headerSubtitle}>Analysis Report</Text>
        </View>

        <TouchableOpacity 
          onPress={handleDownloadReport}
          style={styles.downloadButton}
          activeOpacity={0.8}
        >
          <Ionicons name="download-outline" size={24} color="#38BFA7" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#38BFA7"]} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Compact Report Metadata */}
        <View style={styles.compactMetadata}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={16} color="#2C7BE5" />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaLabel}>Report Date</Text>
                <Text style={styles.metaValue}>{reportDate.dateStr}</Text>
                {reportDate.timeStr && <Text style={styles.metaTime}>{reportDate.timeStr}</Text>}
              </View>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="cloud-upload" size={16} color="#38BFA7" />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaLabel}>Uploaded</Text>
                <Text style={styles.metaValue}>{uploadedDate.dateStr}</Text>
                {uploadedDate.timeStr && <Text style={styles.metaTime}>{uploadedDate.timeStr}</Text>}
              </View>
            </View>
          </View>

          <View style={[styles.metaRow, { marginTop: 20 }]}>
            <View style={styles.metaItem}>
              <Ionicons name="analytics" size={16} color="#38BFA7" />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaLabel}>AI Analysis & Diagnosis</Text>
                <Text style={styles.metaValue} numberOfLines={2}>
                  {aiSummary.diagnosis || 'No diagnosis available'}
                </Text>
                {aiSummary.confidence_score && (
                  <View style={styles.confidenceBadgeSmall}>
                    <Text style={styles.confidenceText}>
                      Confidence: {aiSummary.confidence_score}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            {report.doctor_name && (
              <View style={styles.metaItem}>
                <Ionicons name="medical" size={16} color="#FF5656" />
                <View style={styles.metaTextContainer}>
                  <Text style={styles.metaLabel}>Doctor</Text>
                  <Text style={styles.metaValue}>{report.doctor_name}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Redesigned Patient Information */}
        <View style={styles.patientInfoCard}>
          <View style={styles.patientHeader}>
            <Ionicons name="person-circle" size={20} color="#2C7BE5" />
            <Text style={styles.cardTitle}>Patient Information</Text>
          </View>
          
          <View style={styles.patientInfoContainer}>
            <View style={styles.patientInfoRow}>
              <Text style={styles.patientInfoLabel}>Patient Name</Text>
              <Text style={styles.patientInfoValue}>
                {aiSummary.patient_name || 'Not Available'}
              </Text>
            </View>
            
            <View style={styles.patientInfoDivider} />
            
            <View style={styles.patientInfoRowDouble}>
              <View style={styles.patientInfoHalf}>
                <Text style={styles.patientInfoLabel}>Age</Text>
                <Text style={styles.patientInfoValue}>
                  {aiSummary.patient_age || 'N/A'}
                </Text>
              </View>
              
              <View style={styles.patientInfoDividerVertical} />
              
              <View style={styles.patientInfoHalf}>
                <Text style={styles.patientInfoLabel}>Gender</Text>
                <Text style={styles.patientInfoValue}>
                  {aiSummary.patient_gender || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Key Findings */}
        <View style={styles.findingsSection}>
          <View style={styles.findingsHeader}>
            <Text style={styles.cardTitle}>Key Findings</Text>
            <Text style={styles.findingsSubtitle}>
              Tap findings for detailed analysis
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
              <Ionicons name="checkmark-circle" size={20} color="#28D45C" />
              <Text style={styles.cardTitle}>AI Recommendations</Text>
            </View>
            <View style={styles.recommendationsList}>
              {aiSummary.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.recommendationBullet}>
                    <Text style={styles.recommendationNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#091429',
    paddingTop: 50, // Manual status bar padding
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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

  // Compact Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(22, 47, 101, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160, 192, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#a0c0ff',
    marginTop: 2,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 191, 167, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 30, // Extra padding for bottom nav overlap
  },

  // Compact Metadata
  compactMetadata: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.1)',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginHorizontal: 4,
  },
  metaTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: '#a0c0ff',
    marginBottom: 2,
  },
  metaValue: {
    textTransform: 'capitalize',
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  metaTime: {
    fontSize: 11,
    color: '#a0c0ff',
    marginTop: 1,
  },
  confidenceBadgeSmall: {
    backgroundColor: 'rgba(44, 123, 229, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  confidenceText: {
    fontSize: 10,
    color: '#18b30f',
    fontWeight: '600',
  },

  // Redesigned Patient Info
  patientInfoCard: {
    backgroundColor: 'rgba(44, 123, 229, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 123, 229, 0.2)',
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    //marginLeft: 8,
  },
  patientInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  patientInfoRow: {
    marginBottom: 12,
  },
  patientInfoRowDouble: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientInfoHalf: {
    flex: 1,
  },
  patientInfoLabel: {
    fontSize: 12,
    color: '#a0c0ff',
    marginBottom: 6,
    fontWeight: '500',
  },
  patientInfoValue: {
    textTransform: 'capitalize',
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    lineHeight: 20,
  },
  patientInfoDivider: {
    height: 1,
    backgroundColor: 'rgba(160, 192, 255, 0.1)',
    marginVertical: 12,
  },
  patientInfoDividerVertical: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(160, 192, 255, 0.1)',
    marginHorizontal: 16,
  },

  // Findings Section
  findingsSection: {
    marginBottom: 16,
  },
  findingsHeader: {
    marginBottom: 12,
  },
  findingsSubtitle: {
    fontSize: 12,
    color: '#a0c0ff',
    marginTop: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
  },

  // Finding Cards (keeping existing styles but updating some)
  findingCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.1)',
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
    width: 3,
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
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 2,
  },
  findingContentMain: {
    flex: 1,
  },
  findingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    lineHeight: 20,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  findingValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  unitText: {
    fontSize: 12,
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
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
    padding: 8,
  },
  referenceText: {
    fontSize: 12,
    color: '#a0c0ff',
  },
  expandedContent: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(160, 192, 255, 0.1)',
    paddingTop: 12,
  },

  // Tabs (keeping existing styles)
  tabsContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabScroll: {
    marginBottom: 8,
  },
  tabScrollContainer: {
    paddingHorizontal: 4,
  },
  modernTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  modernTabActive: {
    backgroundColor: '#2C7BE5',
  },
  modernTabText: {
    fontSize: 12,
    color: '#a0c0ff',
    fontWeight: '500',
    marginLeft: 4,
  },
  modernTabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  modernTabContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  detailIcon: {
    fontSize: 12,
    color: 'black',
  },
  detailContent: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  detailDescription: {
    fontSize: 12,
    color: '#a0c0ff',
    lineHeight: 16,
  },
  noInfoContainer: {
    alignItems: 'center',
    padding: 16,
  },
  noInfo: {
    fontSize: 12,
    color: '#a0c0ff',
    marginTop: 4,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  loadingDetailsText: {
    marginLeft: 8,
    color: '#a0c0ff',
    fontSize: 12,
  },

  // Recommendations
  recommendationsCard: {
    backgroundColor: 'rgba(40, 212, 92, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(40, 212, 92, 0.2)',
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  recommendationBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(40, 212, 92, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  recommendationNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#28D45C',
  },
  recommendationText: {
    flex: 1,
    fontSize: 13,
    color: '#fff',
    lineHeight: 18,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(56, 191, 167, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 191, 167, 0.3)',
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#38BFA7',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },

  bottomPadding: {
    height: 100, // Extra padding since bottom nav should be hidden
  },
});