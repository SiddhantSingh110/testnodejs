// app/tabs/upload/index.jsx - User-Friendly Upload Screen
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
import healthMetricsAPI from '../../../services/HealthMetricsAPI';
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

// Simple, relatable health tips for everyday users
const healthTips = [
  "Drinking 8 glasses of water daily helps keep your body healthy and energized.",
  "Walking for just 30 minutes a day can improve your heart health significantly.",
  "Getting 7-8 hours of sleep helps your body recover and stay strong.",
  "Eating colorful fruits and vegetables gives your body important vitamins.",
  "Taking deep breaths when stressed can help lower your blood pressure.",
  "Washing your hands regularly is one of the best ways to stay healthy.",
  "Smiling and laughing can actually boost your immune system naturally.",
  "Regular check-ups help catch health issues early when they're easier to treat.",
  "Staying active helps maintain strong bones and muscles as you age.",
  "Eating breakfast gives your body energy to start the day right.",
  "Stretching for a few minutes daily can help prevent back pain.",
  "Limiting screen time before bed helps you sleep better at night.",
  "Staying connected with friends and family is good for mental health.",
  "Taking breaks during work helps reduce stress and improve focus.",
  "Fresh air and sunlight provide vitamin D that strengthens your bones.",
  "Cooking at home helps you control what goes into your meals.",
  "Regular dental check-ups prevent small problems from becoming big ones.",
  "Staying hydrated helps your skin look healthy and feel smooth.",
  "Gentle exercise like yoga can help reduce stress and anxiety.",
  "Keeping a health diary helps you track patterns and improvements."
];

export default function UploadReportScreen() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [showCompressionModal, setShowCompressionModal] = useState(false);
  const [healthMetricsExtracted, setHealthMetricsExtracted] = useState(null);
  const [showHealthMetricsModal, setShowHealthMetricsModal] = useState(false);
  
  const { token } = useAuth();
  const router = useRouter();
  const tipIntervalRef = useRef(null);

  // Simple, user-friendly status messages
  const statusMessages = [
    "Getting your document ready...",
    "Making your image clearer...",
    "Uploading your report...",
    "Reading your document...",
    "Understanding the text in your report...",
    "Looking for health information...",
    "Finding important health details...",
    "Webshark Health AI is analyzing your report...",
    "Creating your personalized health insights...",
    "Webshark Health AI is preparing your summary...",
    "Almost done! Finishing up..."
  ];

  // Ask for permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      // Notification permissions
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      if (notificationStatus !== 'granted') {
        Alert.alert('Stay Updated', 'Turn on notifications to know when your reports are ready!');
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
      if (tipIntervalRef.current) {
        clearInterval(tipIntervalRef.current);
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
   * Enhance image quality for better text reading
   */
  const enhanceImage = async (imageUri) => {
    try {
      setShowCompressionModal(true);
      setCompressionProgress(0);

      // Step 1: Get image info
      setCompressionProgress(0.2);
      
      // Step 2: Improve image quality for text reading
      setCompressionProgress(0.4);
      const enhancedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            resize: {
              width: 1500, // Good size for reading text
              height: 1500,
            }
          }
        ],
        {
          compress: 0.8, // Keep good quality for text reading
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      setCompressionProgress(0.8);

      // Step 3: Final optimization
      const finalImage = await ImageManipulator.manipulateAsync(
        enhancedImage.uri,
        [
          { 
            crop: { 
              originX: 0, 
              originY: 0, 
              width: enhancedImage.width, 
              height: enhancedImage.height 
            } 
          }
        ],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      setCompressionProgress(1.0);

      console.log('Image enhancement completed:', {
        original: imageUri,
        enhanced: finalImage.uri,
        width: finalImage.width,
        height: finalImage.height
      });

      // Hide modal after a brief delay
      setTimeout(() => {
        setShowCompressionModal(false);
      }, 1000);

      return finalImage;

    } catch (error) {
      setShowCompressionModal(false);
      console.error('Image enhancement failed:', error);
      throw new Error('Failed to enhance image: ' + error.message);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera Access Needed', 'We need camera access to take photos of your reports.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1.0,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Enhance the image for better text reading
        const enhancedImage = await enhanceImage(asset.uri);
        
        setFile({
          uri: enhancedImage.uri,
          name: `medical_report_${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: asset.fileSize || 0,
          enhanced: true,
          originalSize: asset.fileSize || 0,
          enhancedSize: enhancedImage.fileSize || 0
        });
        
        if (!title) {
          setTitle(`Medical Report - ${new Date().toLocaleDateString()}`);
        }
        setShowPickerModal(false);
      }
    } catch (error) {
      Alert.alert('Photo Error', 'Could not take photo. Please try again.');
    }
  };

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Photo Access Needed', 'We need access to your photos to select report images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1.0,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Enhance the image for better text reading
        const enhancedImage = await enhanceImage(asset.uri);
        
        setFile({
          uri: enhancedImage.uri,
          name: asset.fileName || `medical_report_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
          size: asset.fileSize || 0,
          enhanced: true,
          originalSize: asset.fileSize || 0,
          enhancedSize: enhancedImage.fileSize || 0
        });
        
        if (!title) {
          let fileName = asset.fileName || 'Medical Report';
          fileName = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
          setTitle(fileName);
        }
        setShowPickerModal(false);
      }
    } catch (error) {
      Alert.alert('Photo Error', 'Could not select photo. Please try again.');
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
        
        // Check if it's an image file that needs enhancement
        if (asset.mimeType && asset.mimeType.startsWith('image/')) {
          const enhancedImage = await enhanceImage(asset.uri);
          
          setFile({
            uri: enhancedImage.uri,
            name: asset.name || `enhanced_${Date.now()}.jpg`,
            type: 'image/jpeg',
            size: asset.size || 0,
            enhanced: true,
            originalSize: asset.size || 0,
            enhancedSize: enhancedImage.fileSize || 0
          });
        } else {
          // PDF files don't need enhancement
          setFile({
            ...asset,
            enhanced: false
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
      Alert.alert('File Error', 'Could not select file. Please try again.');
    }
  };

  const showPicker = () => {
    setShowPickerModal(true);
  };

  const startTipRotation = () => {
    if (tipIntervalRef.current) {
      clearInterval(tipIntervalRef.current);
    }
    
    tipIntervalRef.current = setInterval(() => {
      setCurrentTipIndex(prevIndex => (prevIndex + 1) % healthTips.length);
    }, 5000); // Show tips every 5 seconds
  };

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    setCurrentStatus(statusMessages[0]);
    setCurrentTipIndex(Math.floor(Math.random() * healthTips.length));
    startTipRotation();
    
    const statusThresholds = statusMessages.map((_, index) => 
      (index / statusMessages.length) * 0.95
    );
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        let newProgress;
        if (prev < 0.95) {
          const increment = Math.max(0.005, (0.95 - prev) / 30);
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
    }, 400);
    
    return interval;
  };

  const handleUpload = async () => {
    if (!file) {
      Alert.alert('Missing File', 'Please select a report file first');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your report');
      return;
    }

    setUploading(true);
    setUploadComplete(false);
    setHealthMetricsExtracted(null);
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

      console.log('🔍 UPLOAD RESPONSE DEBUG:', JSON.stringify(response.data, null, 2));

      clearInterval(progressInterval);
      setUploadProgress(1);
      
      // Process health information from upload response
      const uploadResult = await healthMetricsAPI.handleReportUploadComplete(response.data);
      
      if (uploadResult.shouldRefreshHealthScreen && uploadResult.metricsExtracted > 0) {
        setHealthMetricsExtracted({
          count: uploadResult.metricsExtracted,
          categories: uploadResult.categoriesFound,
          metrics: uploadResult.extractedMetrics
        });
        
        // Enhanced completion message for health information extraction
        setCurrentStatus(`✨ Report complete! Found ${uploadResult.metricsExtracted} health details ✨`);
        
        // Show health information preview modal after upload
        setTimeout(() => {
          setShowHealthMetricsModal(true);
        }, 2000);
      } else {
        // Standard completion message
        if (response.data?.file_type === 'image') {
          const textReadStatus = response.data?.ocr_status;
          if (textReadStatus === 'completed') {
            setCurrentStatus("✨ Webshark Health AI has read your report! ✨");
          } else if (textReadStatus === 'failed') {
            setCurrentStatus("📄 Report uploaded - Text reading in progress");
          } else {
            setCurrentStatus("📄 Report uploaded - Processing in background");
          }
        } else {
          setCurrentStatus("✨ Report summary ready! ✨");
        }
      }
      
      setUploadComplete(true);
      setUploading(false);
      
      if (tipIntervalRef.current) {
        clearInterval(tipIntervalRef.current);
      }

      // User-friendly notification
      const notificationTitle = uploadResult.metricsExtracted > 0 
        ? `📊 Found ${uploadResult.metricsExtracted} Health Details`
        : response.data?.file_type === 'image' 
          ? '📊 Your Report is Ready'
          : '📊 Report Analysis Complete';
        
      const notificationBody = uploadResult.metricsExtracted > 0
        ? `Great news! We found ${uploadResult.metricsExtracted} health details in your "${title}" report. Check your Health tab!`
        : response.data?.file_type === 'image'
          ? `Your "${title}" report has been read and analyzed. Tap to view your results!`
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

      // Log enhancement savings if applicable
      if (file.enhanced && file.originalSize && file.enhancedSize) {
        const improvement = file.originalSize > file.enhancedSize ? 'optimized' : 'enhanced';
        console.log(`Image ${improvement} for better text reading`);
      }

    } catch (error) {
      clearInterval(progressInterval);
      if (tipIntervalRef.current) {
        clearInterval(tipIntervalRef.current);
      }
      setUploadProgress(0);
      setCurrentStatus("");
      setUploading(false);
      
      Alert.alert(
        'Upload Failed', 
        'Something went wrong. Please check your internet connection and try again.'
      );
      console.error('Upload error', error);
    }
  };

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

  // Health Information Preview Modal
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
                    <Ionicons name="checkmark-circle" size={24} color="#38BFA7" />
                  </View>
                  <View>
                    <Text style={styles.modalTitle}>Health Information Found!</Text>
                    <Text style={styles.modalSubtitle}>
                      We found {healthMetricsExtracted.count} health details in your report
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
                  Excellent! Webshark Health AI automatically found important health information in your report. 
                  You can see all the details in your Health section.
                </Text>

                {/* Categories found */}
                {healthMetricsExtracted.categories.length > 0 && (
                  <View style={styles.categoriesContainer}>
                    <Text style={styles.categoriesTitle}>What We Found:</Text>
                    <View style={styles.categoriesList}>
                      {healthMetricsExtracted.categories.map((category, index) => (
                        <View key={index} style={styles.categoryChip}>
                          <Text style={styles.categoryChipText}>
                            {category.charAt(0).toUpperCase() + category.slice(1)} Tests
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Sample health information preview */}
                {healthMetricsExtracted.metrics.slice(0, 3).map((metric, index) => (
                  <View key={index} style={styles.metricPreviewItem}>
                    <View style={styles.metricPreviewLeft}>
                      <Text style={styles.metricName}>{metric.display_name}</Text>
                      <Text style={styles.metricSource}>From Your Report</Text>
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
                           metric.status === 'borderline' ? 'Watch' : 'Check'}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}

                {healthMetricsExtracted.count > 3 && (
                  <Text style={styles.moreMetricsText}>
                    +{healthMetricsExtracted.count - 3} more health details found
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
                  <Ionicons name="heart" size={16} color="#fff" />
                  <Text style={styles.modalButtonText}>See Health Details</Text>
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
          <Text style={styles.headerTitle}>Add Medical Report</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Report Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Give your report a name (e.g., Blood Test Results)"
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
                    {file.size ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : 'File size unknown'}
                    {file.enhanced && (
                      <Text style={{ color: '#38BFA7', fontSize: 12 }}>
                        {' • Enhanced for text reading'}
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
                <Ionicons name="add-circle-outline" size={36} color="#a0c0ff" />
                <Text style={styles.chooserText}>Add Your Medical Report</Text>
                <Text style={styles.chooserSubtext}>Take Photo • Gallery • Document</Text>
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
                <Text style={styles.factTitle}>Health Tip 💡</Text>
                <Text style={styles.factText}>
                  {healthTips[currentTipIndex]}
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
                    View My Report
                  </Text>
                </TouchableOpacity>
              </LinearGradient>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleUploadAnother}
                activeOpacity={0.8}
              >
                <View style={styles.secondaryButtonContent}>
                  <Ionicons name="add-circle-outline" size={18} color="#a0c0ff" />
                  <Text style={styles.secondaryButtonText}>
                    Add Another Report
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
                      Reading Report...
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
                Add your medical reports and lab results. 
                Take a photo or select a document. 
                Webshark Health AI will read your report and find important health information.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Health Information Modal */}
      {renderHealthMetricsModal()}

      {/* Image Enhancement Modal */}
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
              <Text style={styles.compressionModalTitle}>Preparing Your Image</Text>
              <Text style={styles.compressionModalSubtitle}>Making it easier to read...</Text>
              
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