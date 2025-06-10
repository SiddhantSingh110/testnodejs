// app/tabs/reports/index.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, Alert, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../hooks/useAuth';
import { fetchReports } from '../../../api/auth'; 
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BlurView } from 'expo-blur';
import environment from '../../../config/environment';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalAnimation] = useState(new Animated.Value(0));
  const [isDownloading, setIsDownloading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  
  const router = useRouter();
  const { token } = useAuth();

  const showModal = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedReport(null);
    });
  };

  const loadReports = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      }
      
      console.log('🔄 Loading reports...', new Date().toLocaleTimeString());
      
      const data = await fetchReports(token);
      setReports(data || []);
      setLastFetchTime(Date.now());
      
      console.log('✅ Reports loaded:', data?.length || 0, 'reports');
      
    } catch (error) {
      console.error('❌ Error loading reports:', error.message);
      Alert.alert('Error', 'Failed to load reports. Pull down to retry.');
    } finally {
      setIsLoading(false);
      if (showRefreshIndicator) {
        setRefreshing(false);
      }
    }
  };

  const handleRefresh = () => {
    loadReports(true);
  };

  // ✅ AUTO-REFRESH: Load reports when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('📱 Reports screen focused');
      
      // Always refresh when screen comes into focus
      // This ensures new uploads are immediately visible
      loadReports();
      
      return () => {
        console.log('📱 Reports screen unfocused');
      };
    }, [token])
  );

  // Initial load
  useEffect(() => {
    console.log('🚀 Reports component mounted');
    loadReports();
  }, []);

  const handleDownload = async (type) => {
    if (isDownloading) return;
    
    try {
      setIsDownloading(true);
      
      let fileUri = '';
      if (type === 'original') {
        fileUri = selectedReport.file_url;
      } else if (type === 'summary') {
        fileUri = `${environment.apiUrl.replace('/api', '')}/api/patient/reports/${selectedReport.id}/summary-pdf`;
      }
      
      console.log(`📥 Starting download from: ${fileUri}`);

      const fileName = `${type}_report_${Date.now()}.pdf`;
      const fileDestination = FileSystem.documentDirectory + fileName;

      const downloadResumable = FileSystem.createDownloadResumable(
        fileUri,
        fileDestination,
        {
          headers: type === 'summary' ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      hideModal(); // Hide the modal before download
      const { uri, status } = await downloadResumable.downloadAsync();

      console.log(`📥 Download status: ${status}`);
      console.log(`✅ File downloaded: ${uri}`);

      // Check if file exists
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('Downloaded file does not exist');
      }

      console.log(`📄 File size: ${fileInfo.size} bytes`);

      // Wait longer for iOS to properly handle the file
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if sharing is available
      const sharingAvailable = await Sharing.isAvailableAsync();
      if (!sharingAvailable) {
        throw new Error('Sharing is not available on this device');
      }

      try {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Share ${type === 'summary' ? 'AI Summary' : 'Original'} Report`,
          UTI: 'com.adobe.pdf' // iOS specific
        });
        console.log("✅ File shared successfully");
      } catch (shareError) {
        console.log("❌ Sharing failed:", shareError);
        
        // Fallback: Try again with longer delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: `Share ${type === 'summary' ? 'AI Summary' : 'Original'} Report`
          });
          console.log("✅ File shared successfully on retry");
        } catch (retryError) {
          Alert.alert(
            'Sharing Failed', 
            'Unable to share the file. Please try again.',
            [
              { text: 'OK' },
              { 
                text: 'Try Again', 
                onPress: () => handleDownload(type)
              }
            ]
          );
        }
      }

    } catch (error) {
      console.log("❌ Download failed:", error);
      Alert.alert(
        'Download Failed', 
        error.message || 'Unable to download file.',
        [
          { text: 'OK' },
          { 
            text: 'Retry', 
            onPress: () => handleDownload(type)
          }
        ]
      );
    } finally {
      setIsDownloading(false);
    }
  };
  
  const getStatusColor = (diagnosis) => {
    if (!diagnosis || diagnosis === 'N/A') return ['#6C757D', '#495057'];
  
    const diagnosisLower = diagnosis.toLowerCase();
    
    if (diagnosisLower.includes('normal')) return ['#28D45C', '#28A745'];
    if (diagnosisLower.includes('high') || diagnosisLower.includes('elevated')) return ['#FF5656', '#DC3545'];
    if (diagnosisLower.includes('borderline') || diagnosisLower.includes('pre')) return ['#FFC107', '#E0A800'];
    if (diagnosisLower.includes('low') || diagnosisLower.includes('deficiency')) return ['#2C7BE5', '#1976D2'];
    
    return ['#a0c0ff', '#38BFA7']; // Default for other cases
  };
  
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date not available';
      
      // If date is in YYYY-MM-DD format
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
      }
      
      // If date is in full timestamp format
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const renderDownloadModal = () => {
    const animatedStyle = {
      opacity: modalAnimation,
      transform: [
        {
          scale: modalAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1],
          }),
        },
      ],
    };

    return (
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={hideModal}
        animationType="fade"
      >
        <BlurView intensity={30} style={styles.modalOverlay} tint="dark">
          <Animated.View style={[styles.modalContainer, animatedStyle]}>
            <LinearGradient
              colors={['#091429', '#0F2248', '#162F65']}
              style={{borderRadius: 20, overflow: 'hidden'}}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Download Options</Text>
                <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalBody}>
                <Text style={styles.modalSubtitle}>
                  Choose your preferred format for {selectedReport?.title || selectedReport?.report_title || 'this report'}
                </Text>
                
                <TouchableOpacity
                  style={[styles.modalOption, isDownloading && styles.disabledOption]}
                  onPress={() => !isDownloading && handleDownload('summary')}
                  disabled={isDownloading}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionGradient}>
                    <View style={[styles.optionIcon, { backgroundColor: 'rgba(56, 191, 167, 0.15)' }]}>
                      {isDownloading ? (
                        <ActivityIndicator size="small" color="#38BFA7" />
                      ) : (
                        <Ionicons name="analytics-outline" size={28} color="#38BFA7" />
                      )}
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>AI Summary Report</Text>
                      <Text style={styles.optionDescription}>
                        {isDownloading ? 'Downloading...' : 'Enhanced report with AI insights and analysis'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#a0c0ff" />
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalOption, isDownloading && styles.disabledOption]}
                  onPress={() => !isDownloading && handleDownload('original')}
                  disabled={isDownloading}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionGradient}>
                    <View style={[styles.optionIcon, { backgroundColor: 'rgba(44, 123, 229, 0.15)' }]}>
                      {isDownloading ? (
                        <ActivityIndicator size="small" color="#2C7BE5" />
                      ) : (
                        <Ionicons name="document-text-outline" size={28} color="#2C7BE5" />
                      )}
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>Original Report</Text>
                      <Text style={styles.optionDescription}>
                        {isDownloading ? 'Downloading...' : 'The original uploaded medical report'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#a0c0ff" />
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        </BlurView>
      </Modal>
    );
  };

  const renderReportItem = ({ item }) => {
    const colors = getStatusColor(item.summary_diagnosis);
    const isValidDiagnosis = item.summary_diagnosis && item.summary_diagnosis !== 'N/A';
    
    // ✅ Show OCR status for image reports
    const showOCRInfo = item.file_type === 'image' && item.ocr_info;
    
    return (
      <TouchableOpacity 
        style={styles.reportCard}
        activeOpacity={0.8}
        onPress={() => router.push(`/tabs/reports/${item.id}`)}
      >
        <LinearGradient
          colors={[`${colors[0]}10`, `${colors[1]}05`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.reportContent}
        >
          <View style={styles.reportHeader}>
            <View style={styles.reportHeaderLeft}>
              <View style={[styles.statusIndicator, { backgroundColor: colors[0] }]} />
              <View style={styles.titleContainer}>
                <Text style={styles.reportTitle} numberOfLines={1}>
                  {truncateText(item.title || item.report_title || 'Medical Report', 25)}
                </Text>
                {/* ✅ Show file type and OCR status */}
                <Text style={styles.fileTypeText}>
                  {item.file_type?.toUpperCase() || 'PDF'}
                  {showOCRInfo && (
                    <Text style={[
                      styles.ocrStatusText,
                      { color: item.ocr_info?.status === 'completed' ? '#38BFA7' : '#FFC107' }
                    ]}>
                      {' • '}
                      {item.ocr_info?.status === 'completed' ? 'OCR Complete' : 'Processing'}
                      {item.ocr_info?.confidence && ` (${item.ocr_info.confidence}%)`}
                    </Text>
                  )}
                </Text>
              </View>
            </View>
            {isValidDiagnosis && (
              <View style={[styles.statusBadge, { backgroundColor: `${colors[0]}20` }]}>
                <Text style={[styles.statusText, { color: colors[0] }]}>
                  {item.summary_diagnosis.split(' ')[0]}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.reportDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={14} color="#a0c0ff" />
              <Text style={styles.detailText}>
                {formatDate(item.report_date)}
              </Text>
            </View>
            
            {isValidDiagnosis && (
              <View style={styles.detailRow}>
                <Ionicons name="medical-outline" size={14} color="#a0c0ff" />
                <Text style={styles.detailText} numberOfLines={2}>
                  {item.summary_diagnosis}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.reportFooter}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: 'rgba(44, 123, 229, 0.2)' }]} 
              onPress={() => router.push(`/tabs/reports/${item.id}`)}
            >
              <Ionicons name="eye-outline" size={16} color="#fff" />
              <Text style={styles.actionText}>View</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: 'rgba(56, 191, 167, 0.2)' }]}
              onPress={() => showModal(item)}
            >
              <Ionicons name="download-outline" size={16} color="#fff" />
              <Text style={styles.actionText}>Download</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <SafeAreaView style={[styles.container, { paddingTop: 50 }]} edges={['bottom']}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#091429', '#0F2248', '#162F65']}
          style={styles.background}
        />
        
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Medical Reports</Text>
            <Text style={styles.headerSubtitle}>
              {reports.length > 0 ? `${reports.length} report${reports.length !== 1 ? 's' : ''}` : 'No reports'}
              {/* ✅ Show last updated time */}
              {lastFetchTime && (
                <Text style={styles.lastUpdated}>
                  {' • Updated '}{new Date(lastFetchTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
            </Text>
          </View>
          <LinearGradient
            colors={['#2C7BE5', '#38BFA7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.uploadButtonGradient}
          >
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={() => router.push('/tabs/upload')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#38BFA7" />
            <Text style={styles.loadingText}>Loading reports...</Text>
          </View>
        ) : reports.length > 0 ? (
          <FlatList
            data={reports}
            renderItem={renderReportItem}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="document-text-outline" size={64} color="#a0c0ff" />
            </View>
            <Text style={styles.emptyText}>No reports found</Text>
            <Text style={styles.emptySubtext}>Upload your first medical report with OCR processing</Text>
            <LinearGradient
              colors={['#2C7BE5', '#38BFA7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.uploadEmptyButtonGradient}
            >
              <TouchableOpacity 
                style={styles.uploadEmptyButton} 
                onPress={() => router.push('/tabs/upload')}
                activeOpacity={0.8}
              >
                <Text style={styles.uploadEmptyButtonText}>Upload Report</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
        {renderDownloadModal()}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#091429'
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160, 192, 255, 0.1)'
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#a0c0ff',
    marginTop: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#38BFA7',
  },
  uploadButtonGradient: { 
    borderRadius: 12, 
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#2C7BE5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  uploadButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 10 
  },
  uploadButtonText: { 
    color: '#fff', 
    marginLeft: 6, 
    fontWeight: '600',
    fontSize: 14
  },
  listContainer: { 
    padding: 16, 
    paddingTop: 8,
    paddingBottom: 80,
  },
  reportCard: { 
    marginBottom: 16, 
    borderRadius: 16, 
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#2C7BE5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.15)',
  },
  reportContent: { 
    padding: 16,
    backgroundColor: 'rgba(15, 34, 72, 0.5)',
  },
  reportHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  reportHeaderLeft: { 
    flexDirection: 'row', 
    alignItems: 'center',
    flex: 1,
    marginRight: 12
  },
  statusIndicator: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    marginRight: 10 
  },
  titleContainer: {
    flex: 1,
  },
  reportTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#fff',
    maxWidth: width * 0.5
  },
  fileTypeText: {
    fontSize: 12,
    color: '#a0c0ff',
    marginTop: 2,
  },
  ocrStatusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: '600' 
  },
  reportDetails: { 
    marginBottom: 16 
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  detailText: { 
    fontSize: 14, 
    color: '#a0c0ff', 
    marginLeft: 8,
    flex: 1
  },
  reportFooter: { 
    flexDirection: 'row', 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(160, 192, 255, 0.1)', 
    paddingTop: 12,
    justifyContent: 'space-between',
    gap: 12, // Added gap between buttons
  },
  actionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, // Increased padding for better touch target
    paddingVertical: 10,   // Increased padding for better touch target
    borderRadius: 8,
    flex: 1, // Each button takes equal space
    justifyContent: 'center'
  },
  actionText: { 
    color: '#fff', 
    fontSize: 13, 
    marginLeft: 6,
    fontWeight: '500'
  },
  loader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: {
    color: '#a0c0ff',
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(160, 192, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginTop: 10 
  },
  emptySubtext: { 
    fontSize: 16, 
    color: '#a0c0ff', 
    marginTop: 8, 
    marginBottom: 24,
    textAlign: 'center'
  },
  uploadEmptyButtonGradient: { 
    borderRadius: 12, 
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#2C7BE5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  uploadEmptyButton: { 
    paddingHorizontal: 24, 
    paddingVertical: 14 
  },
  uploadEmptyButtonText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 20, 41, 0.7)',
  },
  modalContainer: {
    width: width * 0.9,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#2C7BE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160, 192, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#a0c0ff',
    marginBottom: 20,
  },
  modalOption: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.1)',
  },
  disabledOption: {
    opacity: 0.7,
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#a0c0ff',
  },
});