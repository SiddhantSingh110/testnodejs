// app/tabs/report/[id].jsx - Redesigned Report Detail Screen with Organ Grouping
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
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import environment from '../../config/environment';
import ReportOrganHealthCard from '../../components/report/ReportOrganHealthCard';

const { width } = Dimensions.get('window');

// ✅ FIXED: Define status colors for dark theme (consistent with backend)
const STATUS_COLORS = {
  normal: '#28D45C',   // Green for normal values
  borderline: '#FFC107', // Amber for borderline values 
  high: '#FF5656',     // Red for high values
  low: '#FF5656',      // ✅ FIXED: Red for low values (also concerning)
};

export default function ReportDetail() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const router = useRouter();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
        endpoint = `${environment.apiUrl}/patient/reports/${id}/download`;
        downloadType = 'Original Medical Report';
      } else if (type === 'summary') {
        endpoint = `${environment.apiUrl}/patient/reports/${id}/summary-pdf`;
        downloadType = 'AI Summary Report';
      }

      const reportTitle = report?.title || report?.report_title || 'medical_report';
      const sanitizedTitle = reportTitle.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = `${type}_${sanitizedTitle}_${Date.now()}.pdf`;
      const fileDestination = FileSystem.documentDirectory + fileName;

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
          }
        }
      );

      const { uri } = await downloadResumable.downloadAsync();
      const sharingAvailable = await Sharing.isAvailableAsync();
      
      if (sharingAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: downloadType,
        });
      }

      Alert.alert('Download Complete', `${downloadType} downloaded successfully!`);

    } catch (error) {
      console.error("Download failed:", error);
      Alert.alert('Download Failed', 'Unable to download file. Please try again.');
    }
  };

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
  const organHealth = report.organ_health || {};
  const reportDate = formatDateTime(report.report_date);
  const uploadedDate = formatDateTime(report.uploaded_at);

  // ✨ NEW: Check if we have organ data to determine layout
  const hasOrganData = Object.keys(organHealth).length > 0;

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#091429', '#0F2248', '#162F65']}
        style={styles.background}
      />
      
      {/* Header */}
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
          <Text style={styles.headerSubtitle}>Health Analysis</Text>
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
                  {aiSummary.diagnosis || 'Comprehensive health analysis completed'}
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

        {/* Patient Information */}
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

        {/* ✨ PRIMARY FEATURE: Organ Health Analysis */}
        {hasOrganData ? (
          <View style={styles.organSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="pulse" size={22} color="#38BFA7" />
                <Text style={styles.sectionTitle}>Health by Body System</Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                AI analysis grouped by organ systems from your medical report
              </Text>
            </View>

            {Object.entries(organHealth).map(([organKey, organData], index) => (
              <ReportOrganHealthCard
                key={organKey}
                organKey={organKey}
                organData={organData}
                index={index}
                reportId={id}
                token={token}
              />
            ))}
          </View>
        ) : (
          // ✨ Fallback: Show general health summary when no organ data
          <View style={styles.generalHealthCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="document-text" size={22} color="#FFC107" />
                <Text style={styles.sectionTitle}>Report Summary</Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                General health insights from your medical report
              </Text>
            </View>
            
            <View style={styles.summaryContent}>
              <Text style={styles.summaryText}>
                {aiSummary.diagnosis || 'Your medical report has been analyzed. Please consult with your doctor for detailed interpretation.'}
              </Text>
            </View>

            {/* ✨ Show simplified findings if no organ data */}
            {aiSummary.key_findings && aiSummary.key_findings.length > 0 && (
              <View style={styles.findingsSection}>
                <Text style={styles.findingsTitle}>Key Findings</Text>
                {aiSummary.key_findings.slice(0, 5).map((finding, index) => (
                  <View key={index} style={styles.findingItem}>
                    <View style={[styles.findingStatusDot, { 
                      backgroundColor: STATUS_COLORS[finding.status] || STATUS_COLORS.normal 
                    }]} />
                    <Text style={styles.findingText}>
                      {typeof finding === 'string' ? finding : finding.description || finding.finding}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Health Recommendations */}
        {aiSummary.recommendations && aiSummary.recommendations.length > 0 && (
          <View style={styles.recommendationsCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="checkmark-circle" size={20} color="#28D45C" />
                <Text style={styles.cardTitle}>Health Recommendations</Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                Personalized suggestions based on your report
              </Text>
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
    paddingTop: 50,
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

  // Header
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
    paddingBottom: 100,
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

  // Patient Info Card
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
    marginLeft: 8,
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

  // Section Headers
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#a0c0ff',
    lineHeight: 18,
  },

  // Organ Section
  organSection: {
    marginBottom: 20,
  },

  // General Health Card (Fallback)
  generalHealthCard: {
    backgroundColor: 'rgba(255, 193, 7, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.2)',
  },
  summaryContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },

  // ✨ NEW: Simplified findings for fallback
  findingsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
  },
  findingsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  findingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  findingStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 6,
  },
  findingText: {
    flex: 1,
    fontSize: 13,
    color: '#fff',
    lineHeight: 18,
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

  bottomPadding: {
    height: 10,
  },
});