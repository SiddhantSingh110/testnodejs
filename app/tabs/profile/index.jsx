// app/tabs/profile/index.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ENV from '../../../config/environment';

export default function Profile() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Helper function to get full image URL
  const getFullImageUrl = (relativePath) => {
    if (!relativePath) return null;
    return `${ENV.apiUrl.replace('/api', '')}/storage/${relativePath}`;
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
            router.replace('/login');
          },
        },
      ]
    );
  };

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
                onPress={() => router.push('/tabs/profile/edit')}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.phone}>{user?.phone || 'Phone not available'}</Text>
          </LinearGradient>
          
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>Personal Information</Text>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => router.push('/tabs/profile/edit')}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={16} color="#38BFA7" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color="#a0c0ff" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || 'Not provided'}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color="#a0c0ff" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>{user?.dob || 'Not provided'}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="transgender-outline" size={20} color="#a0c0ff" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{user?.gender || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="water-outline" size={20} color="#a0c0ff" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Blood Group</Text>
                <Text style={styles.infoValue}>{user?.blood_group || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="resize-outline" size={20} color="#a0c0ff" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Height/Weight</Text>
                <Text style={styles.infoValue}>
                  {user?.height ? `${user.height} cm` : 'Not provided'}
                  {user?.height && user?.weight ? ' / ' : ''}
                  {user?.weight ? `${user.weight} kg` : ''}
                </Text>
              </View>
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
              <Text style={styles.menuText}>My Reports</Text>
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
              <Text style={styles.menuText}>Health Metrics</Text>
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
              <Text style={styles.menuText}>Upload Reports</Text>
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
              <Text style={styles.menuText}>Privacy Settings</Text>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(103, 58, 183, 0.15)' }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#673AB7" style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>Security</Text>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                <Ionicons name="download-outline" size={20} color="#4CAF50" style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>Export Data</Text>
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
              <Text style={styles.menuText}>Help & Support</Text>
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
              <Text style={styles.menuText}>Terms & Conditions</Text>
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
              <Text style={styles.menuText}>Privacy Policy</Text>
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
              <Text style={styles.menuText}>Security Policy</Text>
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
              <Text style={styles.menuText}>Google API Disclosure</Text>
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
              <Text style={styles.menuText}>About Webshark Health</Text>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(156, 39, 176, 0.15)' }]}>
                <Ionicons name="star-outline" size={20} color="#9C27B0" style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>Rate App</Text>
              <Ionicons name="chevron-forward" size={20} color="#a0c0ff" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(121, 85, 72, 0.15)' }]}>
                <Ionicons name="share-outline" size={20} color="#795548" style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>Share App</Text>
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
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160, 192, 255, 0.15)',
    paddingBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
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
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    marginTop: 2,
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
  menuText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  menuArrow: {
    width: 20,
  },
  logoutButton: {
    backgroundColor: '#FF5656',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
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