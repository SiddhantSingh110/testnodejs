// app/tabs/upload/index.jsx - Enhanced Upload Screen with Health Metrics Integration
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Platform, 
  ScrollView, 
  Animated,
  Modal,
  Dimensions
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../api/auth';
import healthMetricsAPI from '../../../services/HealthMetricsAPI'; // ✨ Add this import
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../../styles/upload_screen/UploadReportScreen.styles';
const { width } = Dimensions.get('window');

// Set up notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Custom Progress Bar Component
const ProgressBar = ({ progress }) => {
  const width = progress * 100 + '%';
  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBarFill, { width }]} />
    </View>
  );
};

// Health facts that display during processing
const healthFacts = [
  "Your heart beats about 115,000 times each day, pumping 2,000 gallons of blood.",
  "The human brain processes images in just 13 milliseconds.",
  "Your bones are stronger than steel, pound for pound.",
  "The average adult takes over 20,000 breaths per day.",
  "Your body has over 600 muscles, making up 40% of your body weight.",
  "The acid in your stomach is strong enough to dissolve metal.",
  "Every day, your kidneys filter about 120-150 quarts of blood.",
  "Humans shed about 600,000 particles of skin every hour.",
  "Your body contains enough iron to make a 3-inch nail.",
  "If stretched out, your intestines would be about 25 feet long.",
  "The human body contains enough fat to make 7 bars of soap.",
  "Red blood cells travel through 60,000 miles of blood vessels in your body.",
  "Your eyes can distinguish about 10 million different colors.",
  "Eyelashes typically last 3 months before falling out.",
  "Your lungs contain about 300 million tiny air sacs called alveoli.",
  "The surface area of your lungs is roughly the same size as a tennis court.",
  "Humans are the only species known to blush when embarrassed.",
  "Your body has enough DNA to stretch from the sun to Pluto and back 17 times.",
  "About 300 million cells die in your body every minute.",
  "Nerve impulses can travel at speeds up to 268 mph."
];

export default function UploadReportScreen() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [showCompressionModal, setShowCompressionModal] = useState(false);
  
  // ✨ New state for health metrics integration
  const [healthMetricsExtracted, setHealthMetricsExtracted] = useState(null);
  const [showHealthMetricsModal, setShowHealthMetricsModal] = useState(false);
  
  const { token } = useAuth();
  const router = useRouter();
  const factIntervalRef = useRef(null);

  // Processing status messages - Updated for OCR
  const statusMessages = [
    "Preparing document...",
    "Compressing image for optimal processing...",
    "Uploading document...",
    "Reading document...",
    "Extracting text data with OCR...",
    "Analyzing medical information...",
    "Identifying key health indicators...",
    "Processing with Webshark Health AI...",
    "Generating personalized insights...",
    "Creating health summary using Webshark Health AI...",
    "Finalizing your report..."
  ];

  // Ask for permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      // Notification permissions
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      if (notificationStatus !== 'granted') {
        Alert.alert('Enable Notifications', 'Turn on notifications to get updates when your reports are analyzed.');
      }

      // Camera permissions
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        console.log('Camera permission not granted');
      }

      // Media library permissions
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaStatus !== 'granted') {
        console.log('Media library permission not granted');
      }
    };
    
    requestPermissions();
  }, []);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (factIntervalRef.current) {
        clearInterval(factIntervalRef.current);
      }
    };
  }, []);

  // Reset form when upload is complete and user navigates away
  useEffect(() => {
    const resetForm = () => {
      if (uploadComplete) {
        setFile(null);
        setTitle('');
        setUploadComplete(false);
        setUploadProgress(0);
        setCurrentStatus('');
        setReportId(null);
      }
    };

    return resetForm;
  }, [uploadComplete]);

  /**
   * Compress image using Expo ImageManipulator
   * Optimized for medical report processing
   */
  const compressImage = async (imageUri) => {
    try {
      setShowCompressionModal(true);
      setCompressionProgress(0);

      // Step 1: Get image info
      setCompressionProgress(0.2);
      
      // Step 2: Resize image maintaining aspect ratio
      setCompressionProgress(0.4);
      const resizedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            resize: {
              width: 1500, // Max width for good OCR quality
              height: 1500, // Max height
            }
          }
        ],
        {
          compress: 0.8, // 80% quality for good text readability
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      setCompressionProgress(0.8);

      // Step 3: Apply sharpening for better text recognition
      const sharpened = await ImageManipulator.manipulateAsync(
        resizedImage.uri,
        [
          // Enhance contrast for better OCR
          { 
            crop: { 
              originX: 0, 
              originY: 0, 
              width: resizedImage.width, 
              height: resizedImage.height 
            } 
          }
        ],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      setCompressionProgress(1.0);

      console.log('Image compression completed:', {
        original: imageUri,
        compressed: sharpened.uri,
        width: sharpened.width,
        height: sharpened.height
      });

      // Hide compression modal after a brief delay
      setTimeout(() => {
        setShowCompressionModal(false);
      }, 1000);

      return sharpened;

    } catch (error) {
      setShowCompressionModal(false);
      console.error('Image compression failed:', error);
      throw new Error('Failed to compress image: ' + error.message);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera access is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1.0, // High quality for initial capture
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Compress the image for medical report processing
        const compressedImage = await compressImage(asset.uri);
        
        setFile({
          uri: compressedImage.uri,
          name: `medical_report_${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: asset.fileSize || 0,
          compressed: true,
          originalSize: asset.fileSize || 0,
          compressedSize: compressedImage.fileSize || 0
        });
        
        if (!title) {
          setTitle(`Medical Report - ${new Date().toLocaleDateString()}`);
        }
        setShowPickerModal(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo: ' + error.message);
    }
  };

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Photo library access is required to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1.0, // High quality for initial selection
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Compress the image for medical report processing
        const compressedImage = await compressImage(asset.uri);
        
        setFile({
          uri: compressedImage.uri,
          name: asset.fileName || `medical_report_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
          size: asset.fileSize || 0,
          compressed: true,
          originalSize: asset.fileSize || 0,
          compressedSize: compressedImage.fileSize || 0
        });
        
        if (!title) {
          let fileName = asset.fileName || 'Medical Report';
          fileName = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
          setTitle(fileName);
        }
        setShowPickerModal(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image: ' + error.message);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ 
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });
      
      if (result?.assets?.length > 0 && result.assets[0].uri) {
        const asset = result.assets[0];
        
        // Check if it's an image file that needs compression
        if (asset.mimeType && asset.mimeType.startsWith('image/')) {
          // Compress image files from document picker
          const compressedImage = await compressImage(asset.uri);
          
          setFile({
            uri: compressedImage.uri,
            name: asset.name || `compressed_${Date.now()}.jpg`,
            type: 'image/jpeg',
            size: asset.size || 0,
            compressed: true,
            originalSize: asset.size || 0,
            compressedSize: compressedImage.fileSize || 0
          });
        } else {
          // PDF files don't need compression
          setFile({
            ...asset,
            compressed: false
          });
        }
        
        if (!title) {
          let fileName = asset.name || '';
          fileName = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
          setTitle(fileName);
        }
        setShowPickerModal(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file: ' + error.message);
    }
  };

  const showPicker = () => {
    setShowPickerModal(true);
  };

  const startFactRotation = () => {
    if (factIntervalRef.current) {
      clearInterval(factIntervalRef.current);
    }
    
    factIntervalRef.current = setInterval(() => {
      setCurrentFactIndex(prevIndex => (prevIndex + 1) % healthFacts.length);
    }, 6000);
  };

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    setCurrentStatus(statusMessages[0]);
    setCurrentFactIndex(Math.floor(Math.random() * healthFacts.length));
    startFactRotation();
    
    const statusThresholds = statusMessages.map((_, index) => 
      (index / statusMessages.length) * 0.95
    );
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        let newProgress;
        if (prev < 0.95) {
          const increment = Math.max(0.005, (0.95 - prev) / 35); // Slower for OCR processing
          newProgress = prev + increment;
        } else {
          newProgress = prev;
        }
        
        for (let i = 0; i < statusThresholds.length; i++) {
          if (prev < statusThresholds[i] && newProgress >= statusThresholds[i]) {
            setCurrentStatus(statusMessages[i]);
            break;
          }
        }
        
        return newProgress;
      });
    }, 400); // Slightly slower intervals for OCR
    
    return interval;
  };

  // ✨ Enhanced handleUpload with health metrics integration
  const handleUpload = async () => {
    if (!file) {
      Alert.alert('Please select a report file');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Please enter a title for your report');
      return;
    }

    setUploading(true);
    setUploadComplete(false);
    setHealthMetricsExtracted(null); // Reset health metrics state
    const progressInterval = simulateUploadProgress();
    
    const formData = new FormData();

    formData.append('file', {
      uri: file.uri,
      name: file.name || 'report.pdf',
      type: file.type || 'application/pdf',
    });

    formData.append('report_title', title);
    formData.append('report_date', new Date().toISOString().split('T')[0]);

    try {
      const response = await api.post('/patient/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

     // ✨ ADD THIS DEBUG LOG RIGHT HERE
      console.log('🔍 UPLOAD RESPONSE DEBUG:', JSON.stringify(response.data, null, 2));

      clearInterval(progressInterval);
      setUploadProgress(1);
      
      // ✨ Enhanced: Process health metrics from upload response
      const uploadResult = await healthMetricsAPI.handleReportUploadComplete(response.data);
      
      if (uploadResult.shouldRefreshHealthScreen && uploadResult.metricsExtracted > 0) {
        setHealthMetricsExtracted({
          count: uploadResult.metricsExtracted,
          categories: uploadResult.categoriesFound,
          metrics: uploadResult.extractedMetrics
        });
        
        // Enhanced completion message for health metrics extraction
        setCurrentStatus(`✨ Report processed! ${uploadResult.metricsExtracted} health metrics extracted ✨`);
        
        // Show health metrics preview modal after upload
        setTimeout(() => {
          setShowHealthMetricsModal(true);
        }, 2000);
      } else {
        // Standard completion message
        if (response.data?.file_type === 'image') {
          const ocrStatus = response.data?.ocr_status;
          if (ocrStatus === 'completed') {
            setCurrentStatus("✨ OCR & AI Analysis Complete! ✨");
          } else if (ocrStatus === 'failed') {
            setCurrentStatus("📄 Report uploaded - OCR processing failed");
          } else {
            setCurrentStatus("📄 Report uploaded - Processing in background");
          }
        } else {
          setCurrentStatus("✨ Report summary ready! ✨");
        }
      }
      
      setUploadComplete(true);
      setUploading(false);
      
      if (factIntervalRef.current) {
        clearInterval(factIntervalRef.current);
      }

      // Enhanced notification
      const notificationTitle = uploadResult.metricsExtracted > 0 
        ? `📊 ${uploadResult.metricsExtracted} Health Metrics Extracted`
        : response.data?.file_type === 'image' 
          ? '📊 Medical Image Processed'
          : '📊 Report Analysis Complete';
        
      const notificationBody = uploadResult.metricsExtracted > 0
        ? `Your "${title}" report analysis found ${uploadResult.metricsExtracted} health metrics. Check your Health tab!`
        : response.data?.file_type === 'image'
          ? `Your "${title}" image has been processed with OCR and AI analysis is ready.`
          : `Your "${title}" report has been processed and insights are ready to view.`;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationTitle,
          body: notificationBody,
          data: { 
            screen: 'reports', 
            reportId: response.data?.report_id,
            healthMetricsExtracted: uploadResult.metricsExtracted > 0
          },
        },
        trigger: null,
      });

      setReportId(response.data?.report_id);

      // Log compression savings if applicable
      if (file.compressed && file.originalSize && file.compressedSize) {
        const savings = ((file.originalSize - file.compressedSize) / file.originalSize * 100).toFixed(1);
        console.log(`Image compression saved ${savings}% file size`);
      }

    } catch (error) {
      clearInterval(progressInterval);
      if (factIntervalRef.current) {
        clearInterval(factIntervalRef.current);
      }
      setUploadProgress(0);
      setCurrentStatus("");
      setUploading(false);
      
      Alert.alert(
        'Upload Failed', 
        error?.response?.data?.message || 'Please check your connection and try again'
      );
      console.error('Upload error', error);
    }
  };

  // ✨ New: Handle health metrics modal actions
  const handleViewHealthMetrics = () => {
    setShowHealthMetricsModal(false);
    router.push('/tabs/health');
  };

  const handleViewReport = () => {
    setShowHealthMetricsModal(false);
    if (reportId) {
      router.push(`/tabs/reports/${reportId}`);
    } else {
      router.push('/tabs/reports');
    }
  };

  const handleUploadAnother = () => {
    // Reset form for new upload
    setFile(null);
    setTitle('');
    setUploadComplete(false);
    setUploadProgress(0);
    setCurrentStatus('');
    setReportId(null);
    setHealthMetricsExtracted(null);
    setShowHealthMetricsModal(false);
  };

  // ✨ New: Health Metrics Preview Modal
  const renderHealthMetricsModal = () => {
    if (!healthMetricsExtracted) return null;

    return (
      <Modal
        visible={showHealthMetricsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHealthMetricsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxHeight: '80%' }]}>
            <LinearGradient
              colors={['#091429', '#0F2248']}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderContent}>
                  <View style={styles.modalHeaderIcon}>
                    <Ionicons name="analytics" size={24} color="#38BFA7" />
                  </View>
                  <View>
                    <Text style={styles.modalTitle}>Health Metrics Extracted!</Text>
                    <Text style={styles.modalSubtitle}>
                      {healthMetricsExtracted.count} metrics found in your report
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowHealthMetricsModal(false)}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalDescription}>
                  Great! We've automatically extracted health metrics from your report. 
                  You can view them in your Health tab or continue to the report details.
                </Text>

                {/* Categories found */}
                {healthMetricsExtracted.categories.length > 0 && (
                  <View style={styles.categoriesContainer}>
                    <Text style={styles.categoriesTitle}>Categories Found:</Text>
                    <View style={styles.categoriesList}>
                      {healthMetricsExtracted.categories.map((category, index) => (
                        <View key={index} style={styles.categoryChip}>
                          <Text style={styles.categoryChipText}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Sample metrics preview */}
                {healthMetricsExtracted.metrics.slice(0, 3).map((metric, index) => (
                  <View key={index} style={styles.metricPreviewItem}>
                    <View style={styles.metricPreviewLeft}>
                      <Text style={styles.metricName}>{metric.display_name}</Text>
                      <Text style={styles.metricSource}>From Medical Report</Text>
                    </View>
                    <View style={styles.metricPreviewRight}>
                      <Text style={styles.metricValue}>
                        {metric.value} {metric.unit}
                      </Text>
                      <View style={[
                        styles.metricStatusBadge,
                        { backgroundColor: 
                          metric.status === 'normal' ? '#4CAF50' : 
                          metric.status === 'borderline' ? '#FFC107' : '#F44336'
                        }
                      ]}>
                        <Text style={styles.metricStatusText}>
                          {metric.status === 'normal' ? 'Normal' : 
                           metric.status === 'borderline' ? 'Borderline' : 'Attention'}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}

                {healthMetricsExtracted.count > 3 && (
                  <Text style={styles.moreMetricsText}>
                    +{healthMetricsExtracted.count - 3} more metrics available
                  </Text>
                )}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={handleViewReport}
                >
                  <Text style={styles.modalButtonTextSecondary}>View Report</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleViewHealthMetrics}
                >
                  <Ionicons name="analytics" size={16} color="#fff" />
                  <Text style={styles.modalButtonText}>View Health Metrics</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#091429', '#0F2248', '#162F65']}
        style={styles.background}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upload Report</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Report Title</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter a title for your report"
              placeholderTextColor="#6d88b7"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              editable={!uploading && !uploadComplete}
            />
          </View>

          <Text style={styles.label}>Report File</Text>
          <TouchableOpacity 
            style={styles.fileSelector} 
            onPress={showPicker}
            disabled={uploading || uploadComplete}
            activeOpacity={0.8}
          >
            {file ? (
              <View style={styles.selectedFileContainer}>
                <View style={styles.fileIconContainer}>
                  <Ionicons 
                    name={file.type?.includes('image') ? "image" : "document-text"} 
                    size={24} 
                    color="#38BFA7" 
                  />
                </View>
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                    {file.name}
                  </Text>
                  <Text style={styles.fileSize}>
                    {file.size ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown size'}
                    {file.compressed && (
                      <Text style={{ color: '#38BFA7', fontSize: 12 }}>
                        {' • Optimized for OCR'}
                      </Text>
                    )}
                  </Text>
                </View>
                {!uploading && !uploadComplete && (
                  <TouchableOpacity 
                    style={styles.changeFileButton}
                    onPress={showPicker}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.changeFileText}>Change</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.chooserContainer}>
                <Ionicons name="cloud-upload-outline" size={36} color="#a0c0ff" />
                <Text style={styles.chooserText}>Upload Your Report</Text>
                <Text style={styles.chooserSubtext}>Camera, Gallery, or Files • OCR Enabled</Text>
              </View>
            )}
          </TouchableOpacity>

          {uploading && (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressPercent}>
                  {Math.round(uploadProgress * 100)}%
                </Text>
              </View>
              
              <ProgressBar progress={uploadProgress} />
              
              <Text style={styles.statusMessage}>
                {currentStatus}
              </Text>
              
              <View style={styles.factContainer}>
                <Text style={styles.factTitle}>Did you know?</Text>
                <Text style={styles.factText}>
                  {healthFacts[currentFactIndex]}
                </Text>
              </View>
            </View>
          )}

          {/* Updated Button Section */}
          {uploadComplete ? (
            <View style={styles.completedActions}>
              <LinearGradient
                colors={['#38BFA7', '#2C7BE5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleViewReport}
                  activeOpacity={0.8}
                >
                  <Text style={styles.uploadButtonText}>
                    Check Report
                  </Text>
                </TouchableOpacity>
              </LinearGradient>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleUploadAnother}
                activeOpacity={0.8}
              >
                <View style={styles.secondaryButtonContent}>
                  <Ionicons name="cloud-upload-outline" size={18} color="#a0c0ff" />
                  <Text style={styles.secondaryButtonText}>
                    Upload New Report
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <LinearGradient
              colors={['#2C7BE5', '#38BFA7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.buttonGradient, 
                (!file || uploading) && styles.buttonDisabled
              ]}
            >
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUpload}
                disabled={!file || uploading}
                activeOpacity={0.8}
              >
                {uploading ? (
                  <View style={styles.loadingButtonContent}>
                    <Text style={styles.uploadButtonText}>
                      Processing...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.uploadButtonText}>
                    Upload Report
                  </Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
          )}

          {!file && !uploading && !uploadComplete && (
            <View style={styles.helpTextContainer}>
              <Ionicons name="information-circle-outline" size={20} color="#a0c0ff" style={styles.helpIcon} />
              <Text style={styles.helpText}>
                Upload your medical reports, prescriptions, or lab results. 
                Take a photo, select from gallery, or choose files. 
                Images are automatically optimized for OCR text extraction and AI analysis.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ✨ Add the new health metrics modal */}
      {renderHealthMetricsModal()}

      {/* Image Compression Modal */}
      <Modal
        visible={showCompressionModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.compressionModalOverlay}>
          <View style={styles.compressionModalContainer}>
            <LinearGradient
              colors={['#091429', '#0F2248']}
              style={styles.compressionModalContent}
            >
              <Text style={styles.compressionModalTitle}>Optimizing Image</Text>
              <Text style={styles.compressionModalSubtitle}>Preparing for OCR processing...</Text>
              
              <View style={styles.compressionProgressContainer}>
                <View style={styles.compressionProgressBar}>
                  <View 
                    style={[
                      styles.compressionProgressFill, 
                      { width: `${compressionProgress * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.compressionProgressText}>
                  {Math.round(compressionProgress * 100)}%
                </Text>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Source Picker Modal */}
      <Modal
        visible={showPickerModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPickerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['#091429', '#0F2248']}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Source</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowPickerModal(false)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={takePhoto}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['rgba(44, 123, 229, 0.15)', 'rgba(56, 191, 167, 0.15)']}
                    style={styles.optionGradient}
                  >
                    <View style={styles.optionIconContainer}>
                      <Ionicons name="camera" size={28} color="#2C7BE5" />
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>Camera</Text>
                      <Text style={styles.optionDescription}>Take a photo of your report</Text>
                      <Text style={styles.optionSubDescription}>Auto-optimized for OCR</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={pickFromGallery}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['rgba(56, 191, 167, 0.15)', 'rgba(44, 123, 229, 0.15)']}
                    style={styles.optionGradient}
                  >
                    <View style={styles.optionIconContainer}>
                      <Ionicons name="images" size={28} color="#38BFA7" />
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>Gallery</Text>
                      <Text style={styles.optionDescription}>Choose from your photos</Text>
                      <Text style={styles.optionSubDescription}>Compressed for processing</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={pickDocument}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['rgba(255, 193, 7, 0.15)', 'rgba(255, 152, 0, 0.15)']}
                    style={styles.optionGradient}
                  >
                    <View style={styles.optionIconContainer}>
                      <Ionicons name="document-text" size={28} color="#FFC107" />
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>Files</Text>
                      <Text style={styles.optionDescription}>Browse PDF and image files</Text>
                      <Text style={styles.optionSubDescription}>All formats supported</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}