// app/tabs/profile/index.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useAuth } from '../../../../hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ENV from '../../../../config/environment';

export default function Profile() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Helper function to get full image URL
  const getFullImageUrl = (relativePath) => {
    if (!relativePath) return null;
    return `${ENV.apiUrl.replace('/api', '')}/storage/${relativePath}`;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      
      const options = { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      };
      return date.toLocaleDateString('en-GB', options);
    } catch (error) {
      return null;
    }
  };

  // Helper function to format phone number
  const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    
    // If phone starts with country code, format it nicely
    if (phone.startsWith('+91')) {
      return `+91 ${phone.slice(3)}`;
    } else if (phone.startsWith('91') && phone.length === 12) {
      return `+91 ${phone.slice(2)}`;
    }
    return phone;
  };

  // Helper function to capitalize text properly
  const capitalizeText = (text) => {
    if (!text) return null;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Helper function to format height/weight display
  const formatPhysicalStats = (height, weight) => {
    const formattedHeight = height ? `${height} cm` : null;
    const formattedWeight = weight ? `${weight} kg` : null;
    
    if (formattedHeight && formattedWeight) {
      return `${formattedHeight} • ${formattedWeight}`;
    } else if (formattedHeight) {
      return formattedHeight;
    } else if (formattedWeight) {
      return formattedWeight;
    }
    return null;
  };

  // Helper function to truncate email if too long
  const formatEmail = (email) => {
    if (!email) return null;
    if (email.length > 25) {
      return `${email.substring(0, 22)}...`;
    }
    return email;
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      user?.name,
      user?.email,
      user?.phone,
      user?.dob,
      user?.gender,
      user?.blood_group,
      user?.height,
      user?.weight
    ];
    
    const completedFields = fields.filter(field => field && field.toString().trim() !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            signOut();
            router.replace('/');
          },
        },
      ]
    );
  };

  const profileCompletion = calculateProfileCompletion();

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#091429', '#0F2248', '#162F65']}
          style={styles.background}
        />
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          <LinearGradient
            colors={['#2C7BE5', '#38BFA7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
          >
            <View style={styles.profileImageContainer}>
              {user?.profile_photo ? (
                <Image
                  source={{ uri: getFullImageUrl(user.profile_photo) }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImage}>
                  <Text style={styles.profileInitial}>{user?.name?.charAt(0) || 'U'}</Text>
                </View>
              )}
              <TouchableOpacity 
                style={styles.editImageButton}
                onPress={() => router.push('/profile-edit')}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.phone}>{formatPhoneNumber(user?.phone) || 'Phone not available'}</Text>
            
            {/* Profile Completion Indicator */}
            <View style={styles.completionContainer}>
              <View style={styles.completionBarBackground}>
                <View 
                  style={[
                    styles.completionBarFill, 
                    { width: `${profileCompletion}%` }
                  ]} 
                />
              </View>
              <Text style={styles.completionText}>{profileCompletion}% Profile Complete</Text>
            </View>
          </LinearGradient>
          
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View>
                <Text style={styles.infoTitle}>Personal Information</Text>
                <Text style={styles.infoSubtitle}>Keep your information up to date</Text>
              </View>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => router.push('/profile-edit')}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={16} color="#38BFA7" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color="#a0c0ff" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>
                  {formatEmail(user?.email) || <Text style={styles.missingValue}>Add your email</Text>}
                </Text>
              </View>
              {!user?.email && (
                <View style={styles.incompleteBadge}>
                  <Ionicons name="alert-circle" size={16} color="#FFC107" />
                </View>
              )}
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color="#a0c0ff" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>
                  {formatDate(user?.dob) || <Text style={styles.missingValue}>Add your birth date</Text>}
                </Text>
              </View>
              {!user?.dob && (
                <View style={styles.incompleteBadge}>
                  <Ionicons name="alert-circle" size={16} color="#FFC107" />
                </View>
              )}
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="transgender-outline" size={20} color="#a0c0ff" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>
                  {capitalizeText(user?.gender) || <Text style={styles.missingValue}>Specify your gender</Text>}
                </Text>
              </View>
              {!user?.gender && (
                <View style={styles.incompleteBadge}>
                  <Ionicons name="alert-circle" size={16} color="#FFC107" />
                </View>
              )}
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="water-outline" size={20} color="#a0c0ff" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Blood Group</Text>
                <Text style={styles.infoValue}>
                  {user?.blood_group || <Text style={styles.missingValue}>Add blood group</Text>}
                </Text>
              </View>
              {!user?.blood_group && (
                <View style={styles.incompleteBadge}>
                  <Ionicons name="alert-circle" size={16} color="#FFC107" />
                </View>
              )}
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="resize-outline" size={20} color="#a0c0ff" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Physical Stats</Text>
                <Text style={styles.infoValue}>
                  {formatPhysicalStats(user?.height, user?.weight) || 
                   <Text style={styles.missingValue}>Add height and weight</Text>}
                </Text>
              </View>
              {(!user?.height && !user?.weight) && (
                <View style={styles.incompleteBadge}>
                  <Ionicons name="alert-circle" size={16} color="#FFC107" />
                </View>
              )}
            </View>
          </View>
          
          {/* Health & Reports Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>HEALTH & REPORTS</Text>
          </View>
          <View style={styles.menuCard}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/tabs/reports')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(44, 123, 229, 0.15)' }]}>
                <Ionicons name="document-text-outline" size={20} color="#2C7BE5" style={styles.menuIcon} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuText}>My Reports</Text>
                <Text style={styles.menuSubtext}>View all medical reports</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/tabs/health')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(56, 191, 167, 0.15)' }]}>
                <Ionicons name="pulse-outline" size={20} color="#38BFA7" style={styles.menuIcon} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuText}>Health Metrics</Text>
                <Text style={styles.menuSubtext}>Track vital signs</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/tabs/upload')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(255, 193, 7, 0.15)' }]}>
                <Ionicons name="cloud-upload-outline" size={20} color="#FFC107" style={styles.menuIcon} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuText}>Upload Reports</Text>
                <Text style={styles.menuSubtext}>Add new medical documents</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>
          </View>
          
          {/* Settings Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
          </View>
          <View style={styles.menuCard}>
            <TouchableOpacity 
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(233, 30, 99, 0.15)' }]}>
                <Ionicons name="lock-closed-outline" size={20} color="#E91E63" style={styles.menuIcon} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuText}>Privacy Settings</Text>
                <Text style={styles.menuSubtext}>Control data sharing</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(103, 58, 183, 0.15)' }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#673AB7" style={styles.menuIcon} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuText}>Security</Text>
                <Text style={styles.menuSubtext}>Password & authentication</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                <Ionicons name="download-outline" size={20} color="#4CAF50" style={styles.menuIcon} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuText}>Export Data</Text>
                <Text style={styles.menuSubtext}>Download your information</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>
          </View>
          
          {/* Support Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SUPPORT & POLICIES</Text>
          </View>
          <View style={styles.menuCard}>
            <TouchableOpacity 
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(0, 150, 136, 0.15)' }]}>
                <Ionicons name="help-circle-outline" size={20} color="#009688" style={styles.menuIcon} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuText}>Help & Support</Text>
                <Text style={styles.menuSubtext}>Get assistance</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/policies/terms')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(255, 152, 0, 0.15)' }]}>
                <Ionicons name="document-outline" size={20} color="#FF9800" style={styles.menuIcon} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuText}>Terms & Conditions</Text>
                <Text style={styles.menuSubtext}>App usage terms</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/policies/privacy')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(63, 81, 181, 0.15)' }]}>
                <Ionicons name="shield-outline" size={20} color="#3F51B5" style={styles.menuIcon} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuText}>Privacy Policy</Text>
                <Text style={styles.menuSubtext}>Data protection info</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/policies/security')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(244, 67, 54, 0.15)' }]}>
                <Ionicons name="lock-open-outline" size={20} color="#F44336" style={styles.menuIcon} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuText}>Security Policy</Text>
                <Text style={styles.menuSubtext}>Security measures</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/policies/google-api')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(96, 125, 139, 0.15)' }]}>
                <Ionicons name="code-outline" size={20} color="#607D8B" style={styles.menuIcon} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuText}>Google API Disclosure</Text>
                <Text style={styles.menuSubtext}>Third-party integrations</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ABOUT</Text>
          </View>
          <View style={styles.menuCard}>
            <TouchableOpacity 
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(3, 169, 244, 0.15)' }]}>
                <Ionicons name="information-circle-outline" size={20} color="#03A9F4" style={styles.menuIcon} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuText}>About Webshark Health</Text>
                <Text style={styles.menuSubtext}>App information</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(156, 39, 176, 0.15)' }]}>
                <Ionicons name="star-outline" size={20} color="#9C27B0" style={styles.menuIcon} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuText}>Rate App</Text>
                <Text style={styles.menuSubtext}>Share your feedback</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(121, 85, 72, 0.15)' }]}>
                <Ionicons name="share-outline" size={20} color="#795548" style={styles.menuIcon} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuText}>Share App</Text>
                <Text style={styles.menuSubtext}>Invite friends & family</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </>
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
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 30,
    paddingBottom: 30,
    elevation: 4,
    shadowColor: '#2C7BE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  phone: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  completionContainer: {
    marginTop: 15,
    alignItems: 'center',
    width: '80%',
  },
  completionBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  completionBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  completionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 6,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    margin: 15,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.15)',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160, 192, 255, 0.15)',
    paddingBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoSubtitle: {
    fontSize: 12,
    color: '#a0c0ff',
    marginTop: 2,
    opacity: 0.8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(56, 191, 167, 0.15)',
    borderRadius: 16,
  },
  editButtonText: {
    color: '#38BFA7',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160, 192, 255, 0.15)',
    alignItems: 'center',
  },
  infoIcon: {
    width: 30,
  },
  infoContent: {
    flex: 1,
    marginLeft: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: '#a0c0ff',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    marginTop: 2,
    fontWeight: '400',
  },
  missingValue: {
    color: '#FFC107',
    fontStyle: 'italic',
    fontSize: 13,
  },
  incompleteBadge: {
    width: 20,
    alignItems: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a0c0ff',
    opacity: 0.8,
    letterSpacing: 1,
  },
  menuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    margin: 15,
    marginTop: 5,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.15)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160, 192, 255, 0.15)',
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  menuSubtext: {
    fontSize: 12,
    color: '#a0c0ff',
    marginTop: 1,
    opacity: 0.8,
  },
  menuArrow: {
    width: 20,
  },
  logoutButton: {
    backgroundColor: '#FF5656',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 35,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#FF5656',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#a0c0ff',
    marginVertical: 15,
    opacity: 0.7,
  },
});