// app/tabs/profile/edit.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, Image, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../../hooks/useAuth';
import { fetchPatientProfile, updatePatientProfile } from '../../../api/auth';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import ENV from '../../../config/environment';

export default function EditProfile() {
  const { token, updateUserInfo, refreshUserProfile } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState({
    name: '',
    email: '',
    gender: '',
    dob: '',
    height: '',
    weight: '',
    blood_group: '',
    phone: '',
    profile_photo: ''
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showBloodGroupPicker, setShowBloodGroupPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formErrors, setFormErrors] = useState({});

  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const GENDER_OPTIONS = [
    { value: 'Male', icon: 'man-outline' },
    { value: 'Female', icon: 'woman-outline' },
    { value: 'Other', icon: 'transgender-outline' }
  ];

  // Helper function for getting full image URL from relative path
  const getFullImageUrl = (relativePath) => {
    if (!relativePath) return null;
    return `${ENV.apiUrl.replace('/api', '')}/storage/${relativePath}`;
  };

  // Load profile data only once when component mounts
  const loadProfile = useCallback(async () => {
    if (!token) return;
    
    try {
      setProfileLoading(true);
      setProfileError('');
      const response = await fetchPatientProfile(token);
      
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response from server');
      }
      
      const profileData = response.user || response;
      
      setForm({
        name: profileData.name || '',
        email: profileData.email || '',
        gender: profileData.gender ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1) : '',
        dob: profileData.dob || '',
        height: profileData.height ? String(profileData.height) : '',
        weight: profileData.weight ? String(profileData.weight) : '',
        blood_group: profileData.blood_group || '',
        phone: profileData.phone || '',
        profile_photo: profileData.profile_photo || ''
      });
      
      if (profileData.dob) {
        try {
          const dateObj = new Date(profileData.dob);
          if (!isNaN(dateObj.getTime())) {
            setSelectedDate(dateObj);
          }
        } catch (error) {
          console.warn('Invalid date format:', profileData.dob);
        }
      }
      
      if (profileData.profile_photo) {
        const fullImageUrl = getFullImageUrl(profileData.profile_photo);
        setImage(fullImageUrl);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfileError(error.message || 'Could not load profile data. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permission.granted) {
        Alert.alert(
          "Permission needed", 
          "We need access to your photos to update your profile picture.", 
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Open Settings", 
              onPress: () => Linking.openSettings(),
            }
          ]
        );
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      });
  
      if (!result.canceled && result.assets && result.assets[0]) {
        try {
          const imgUri = result.assets[0].uri;
          const fileInfo = await FileSystem.getInfoAsync(imgUri);
          
          if (!fileInfo.exists) {
            throw new Error('Selected image file does not exist');
          }
          
          if (fileInfo.size > 10 * 1024 * 1024) {
            Alert.alert("File too large", "Please select an image smaller than 10MB");
            return;
          }
          
          setImage(imgUri);
        } catch (error) {
          Alert.alert("Error", "Failed to process the selected image. Please try another one.");
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to access your photos. Please check your permissions and try again.");
    }
  };

  const handleDateChange = (_, date) => {
    const currentDate = date || selectedDate;
    
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date) {
      setSelectedDate(currentDate);
      const formattedDate = currentDate.toISOString().split('T')[0];
      setForm(prev => ({...prev, dob: formattedDate}));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate name
    if (!form.name || form.name.trim().length < 2) {
      errors.name = 'Name is required (min 2 characters)';
    }
    
    // Validate email - now mandatory
    if (!form.email || form.email.trim().length === 0) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Validate height and weight (if provided)
    if (form.height && (isNaN(form.height) || form.height <= 0 || form.height > 300)) {
      errors.height = 'Please enter a valid height (1-300 cm)';
    }
    
    if (form.weight && (isNaN(form.weight) || form.weight <= 0 || form.weight > 500)) {
      errors.weight = 'Please enter a valid weight (1-500 kg)';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
        const errorMessage = Object.values(formErrors).join('\n');
        Alert.alert('Validation Error', errorMessage);
        return;
    }
    
    try {
        setIsLoading(true);
        
        const formData = new FormData();
    
        if (form.name) formData.append('name', form.name.trim());
        if (form.email) formData.append('email', form.email.trim());
        if (form.gender) formData.append('gender', form.gender.toLowerCase());
        if (form.dob) formData.append('dob', form.dob);
        if (form.height) formData.append('height', form.height);
        if (form.weight) formData.append('weight', form.weight);
        if (form.blood_group) formData.append('blood_group', form.blood_group);
        if (form.phone) formData.append('phone', form.phone);
    
        let hasImageChanged = false;
        if (image && image !== getFullImageUrl(form.profile_photo)) {
          hasImageChanged = true;
          try {
            const fileInfo = await FileSystem.getInfoAsync(image);
            if (fileInfo.exists) {
              if (fileInfo.size > 1000000) {
                const resizedImage = await ImageManipulator.manipulateAsync(
                  image,
                  [{ resize: { width: 500 } }],
                  { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                );
                
                const fileName = `photo_${Date.now()}.jpg`;
                formData.append('profile_photo', {
                  uri: Platform.OS === 'android' ? resizedImage.uri : resizedImage.uri.replace('file://', ''),
                  name: fileName,
                  type: 'image/jpeg',
                });
              } else {
                const fileName = `photo_${Date.now()}.jpg`;
                formData.append('profile_photo', {
                  uri: Platform.OS === 'android' ? image : image.replace('file://', ''),
                  name: fileName,
                  type: 'image/jpeg',
                });
              }
            }
          } catch (error) {
            console.error('Image processing error:', error);
            Alert.alert(
              'Image Processing Error',
              'There was a problem preparing your image for upload: ' + error.message
            );
          }
        }

        const response = await updatePatientProfile(formData, token);
        
        if (response && response.user) {
          if (typeof updateUserInfo === 'function') {
            updateUserInfo(response.user);
          }
        } else {
          if (typeof refreshUserProfile === 'function') {
            await refreshUserProfile();
          }
        }

        Alert.alert(
            'Success', 
            'Profile updated successfully!',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        router.back();
                    }
                }
            ],
            { cancelable: false }
        );
    } catch (error) {
        console.error("Profile Update Error:", error);
        
        if (error.response && error.response.data && error.response.data.errors) {
            const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
            Alert.alert('Validation Error', errorMessages);
        } else if (error.message && error.message.includes('Network')) {
            Alert.alert('Connection Error', 'Please check your internet connection and try again.');
        } else {
            Alert.alert('Error', error.response?.data?.message || error.message || 'Failed to update profile. Please try again later.');
        }
    } finally {
        setIsLoading(false);
    }
};

  // Enhanced Gender Picker Modal
  const GenderPickerModal = ({ visible, onClose, options, onSelect, title }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={10} style={styles.blurView} tint="dark">
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#091429', '#0F2248', '#162F65']}
              style={{borderRadius: 20, overflow: 'hidden'}}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.genderOptionsContainer}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.genderOptionItem,
                      form.gender === option.value && styles.selectedGenderOption
                    ]}
                    onPress={() => {
                      onSelect(option.value);
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.genderOptionContent}>
                      <Ionicons 
                        name={option.icon} 
                        size={28} 
                        color={form.gender === option.value ? "#38BFA7" : "#a0c0ff"} 
                      />
                      <Text style={[
                        styles.genderOptionText,
                        form.gender === option.value && styles.selectedGenderText
                      ]}>
                        {option.value}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </View>
        </BlurView>
      </View>
    </Modal>
  );

  // Enhanced Blood Group Picker Modal
  const BloodGroupPickerModal = ({ visible, onClose, options, onSelect, title }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={10} style={styles.blurView} tint="dark">
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#091429', '#0F2248', '#162F65']}
              style={{borderRadius: 20, overflow: 'hidden'}}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.bloodGroupGrid}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.bloodGroupItem,
                      form.blood_group === option && styles.selectedBloodGroup
                    ]}
                    onPress={() => {
                      onSelect(option);
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.bloodGroupContent}>
                      <Ionicons 
                        name="water" 
                        size={20} 
                        color={form.blood_group === option ? "#38BFA7" : "#a0c0ff"} 
                      />
                      <Text style={[
                        styles.bloodGroupText,
                        form.blood_group === option && styles.selectedBloodGroupText
                      ]}>
                        {option}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </View>
        </BlurView>
      </View>
    </Modal>
  );

  // Loading state
  if (profileLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#091429' }]}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#38BFA7" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Error state
  if (profileError) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#091429' }]}>
        <StatusBar style="light" />
        <Ionicons name="alert-circle-outline" size={50} color="#FF5656" />
        <Text style={[styles.loadingText, { color: '#FF5656', marginTop: 20 }]}>{profileError}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadProfile}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.backToProfileButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backToProfileText}>Back to Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#091429', '#0F2248', '#162F65']}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom + 90, 100)
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileImageSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer} activeOpacity={0.8}>
            {image ? (
              <Image 
                source={{ uri: image }} 
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : form.profile_photo ? (
              <Image 
                source={{ uri: getFullImageUrl(form.profile_photo) }} 
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={['#2C7BE5', '#38BFA7']}
                style={styles.placeholderImage}
              >
                <Ionicons name="person" size={40} color="#fff" />
              </LinearGradient>
            )}
            <View style={styles.cameraIconContainer}>
              <LinearGradient
                colors={['#2C7BE5', '#38BFA7']}
                style={styles.cameraGradient}
              >
                <Ionicons name="camera" size={18} color="#fff" />
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Tap to change photo</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name <Text style={styles.requiredStar}>*</Text></Text>
            <View style={[styles.inputContainer, formErrors.name ? styles.inputError : null]}>
              <Ionicons name="person-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => {
                  setForm(prev => ({...prev, name: text}));
                  if (formErrors.name) {
                    setFormErrors(prev => ({...prev, name: ''}));
                  }
                }}
                placeholder="Enter your full name"
                placeholderTextColor="#6d88b7"
              />
            </View>
            {formErrors.name ? <Text style={styles.errorText}>{formErrors.name}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address <Text style={styles.requiredStar}>*</Text></Text>
            <View style={[styles.inputContainer, formErrors.email ? styles.inputError : null]}>
              <Ionicons name="mail-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(text) => {
                  setForm(prev => ({...prev, email: text}));
                  if (formErrors.email) {
                    setFormErrors(prev => ({...prev, email: ''}));
                  }
                }}
                placeholder="Enter your email"
                placeholderTextColor="#6d88b7"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {formErrors.email ? <Text style={styles.errorText}>{formErrors.email}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number <Text style={styles.requiredStar}>*</Text></Text>
            <View style={[styles.inputContainer, styles.readOnlyField]}>
              <Ionicons name="call-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                value={form.phone}
                editable={false}
                placeholder="Phone number"
                placeholderTextColor="#6d88b7"
                keyboardType="phone-pad"
              />
              <View style={styles.lockedIndicator}>
                <Ionicons name="lock-closed" size={16} color="#6d88b7" />
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity 
              style={styles.inputContainer}
              onPress={() => setShowGenderPicker(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="male-female-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
              <Text style={[styles.pickerText, !form.gender && styles.placeholderText]}>
                {form.gender || 'Select gender'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#a0c0ff" style={styles.chevronIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity 
              style={styles.inputContainer}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
              <Text style={[styles.pickerText, !form.dob && styles.placeholderText]}>
                {form.dob || 'Select date of birth'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#a0c0ff" style={styles.chevronIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Blood Group</Text>
            <TouchableOpacity 
              style={styles.inputContainer}
              onPress={() => setShowBloodGroupPicker(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="water-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
              <Text style={[styles.pickerText, !form.blood_group && styles.placeholderText]}>
                {form.blood_group || 'Select blood group'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#a0c0ff" style={styles.chevronIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Height</Text>
              <View style={[styles.inputContainer, formErrors.height ? styles.inputError : null]}>
                <Ionicons name="resize-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.height}
                  onChangeText={(text) => {
                    // Only allow numbers
                    const numericText = text.replace(/[^0-9.]/g, '');
                    setForm(prev => ({...prev, height: numericText}));
                    if (formErrors.height) {
                      setFormErrors(prev => ({...prev, height: ''}));
                    }
                  }}
                  placeholder="170"
                  placeholderTextColor="#6d88b7"
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>cm</Text>
              </View>
              {formErrors.height ? <Text style={styles.errorText}>{formErrors.height}</Text> : null}
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Weight</Text>
              <View style={[styles.inputContainer, formErrors.weight ? styles.inputError : null]}>
                <Ionicons name="scale-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.weight}
                  onChangeText={(text) => {
                    // Only allow numbers
                    const numericText = text.replace(/[^0-9.]/g, '');
                    setForm(prev => ({...prev, weight: numericText}));
                    if (formErrors.weight) {
                      setFormErrors(prev => ({...prev, weight: ''}));
                    }
                  }}
                  placeholder="70"
                  placeholderTextColor="#6d88b7"
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>kg</Text>
              </View>
              {formErrors.weight ? <Text style={styles.errorText}>{formErrors.weight}</Text> : null}
            </View>
          </View>

          <LinearGradient
            colors={['#2C7BE5', '#38BFA7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingButtonContainer}>
                  <ActivityIndicator color="#fff" size="small" style={{marginRight: 8}} />
                  <Text style={styles.saveButtonText}>Updating...</Text>
                </View>
              ) : (
                <Text style={styles.saveButtonText}>Update Profile</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* iOS Date Picker Modal */}
      {showDatePicker && Platform.OS === 'ios' && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <BlurView intensity={10} style={styles.blurView} tint="dark">
              <View style={styles.modalContent}>
                <LinearGradient
                  colors={['#091429', '#0F2248', '#162F65']}
                  style={{borderRadius: 20, overflow: 'hidden'}}
                >
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select Date</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.closeButton}>
                      <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.datePickerContainer}>
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                      style={styles.datePicker}
                      textColor="#fff"
                    />
                  </View>
                  <TouchableOpacity 
                    style={styles.dateConfirmButton}
                    onPress={() => {
                      setForm(prev => ({...prev, dob: selectedDate.toISOString().split('T')[0]}));
                      setShowDatePicker(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dateConfirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </BlurView>
          </View>
        </Modal>
      )}

      {/* Enhanced Gender Picker Modal */}
      <GenderPickerModal
        visible={showGenderPicker}
        onClose={() => setShowGenderPicker(false)}
        options={GENDER_OPTIONS}
        onSelect={(option) => setForm(prev => ({...prev, gender: option}))}
        title="Select Gender"
      />

      {/* Enhanced Blood Group Picker Modal */}
      <BloodGroupPickerModal
        visible={showBloodGroupPicker}
        onClose={() => setShowBloodGroupPicker(false)}
        options={BLOOD_GROUPS}
        onSelect={(option) => setForm(prev => ({...prev, blood_group: option}))}
        title="Select Blood Group"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  },
  loadingButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#a0c0ff',
    marginTop: 12,
    fontSize: 16,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: 'rgba(56, 191, 167, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 191, 167, 0.4)',
  },
  retryButtonText: {
    color: '#38BFA7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToProfileButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backToProfileText: {
    color: '#a0c0ff',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  profileImageSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2C7BE5',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#091429',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  cameraGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#091429',
  },
  changePhotoText: {
    color: '#A0C0FF',
    fontSize: 14,
    marginTop: 10,
  },
  formSection: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  requiredStar: {
    color: '#FF5656',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.2)',
    minHeight: 52,
  },
  inputError: {
    borderColor: '#FF5656',
  },
  errorText: {
    color: '#FF5656',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 14,
    paddingRight: 12,
  },
  readOnlyField: {
    opacity: 0.7,
  },
  readOnlyInput: {
    color: '#A0C0FF',
  },
  lockedIndicator: {
    paddingRight: 12,
  },
  pickerText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 16,
  },
  placeholderText: {
    color: '#6d88b7',
  },
  chevronIcon: {
    paddingRight: 12,
  },
  unitText: {
    color: '#a0c0ff',
    fontSize: 14,
    fontWeight: '500',
    paddingRight: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -8,
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: 8,
  },
  saveButtonGradient: {
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#2C7BE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  saveButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 20, 41, 0.5)',
  },
  blurView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160, 192, 255, 0.2)',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  // Enhanced Gender Picker Styles
  genderOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  genderOptionItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.2)',
    overflow: 'hidden',
    minHeight: 80,
  },
  selectedGenderOption: {
    borderColor: '#38BFA7',
    backgroundColor: 'rgba(56, 191, 167, 0.1)',
  },
  genderOptionContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  genderOptionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedGenderText: {
    color: '#38BFA7',
    fontWeight: '600',
  },

  // Enhanced Blood Group Picker Styles
  bloodGroupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  bloodGroupItem: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBloodGroup: {
    borderColor: '#38BFA7',
    backgroundColor: 'rgba(56, 191, 167, 0.1)',
  },
  bloodGroupContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodGroupText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  selectedBloodGroupText: {
    color: '#38BFA7',
  },

  // Date Picker Styles
  datePickerContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  datePicker: {
    width: '100%',
  },
  dateConfirmButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(56, 191, 167, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(56, 191, 167, 0.4)',
  },
  dateConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});