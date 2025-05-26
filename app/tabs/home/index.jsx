// app/tabs/home/index.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Image } from 'react-native';
import { useAuth } from '../../../hooks/useAuth';
import { Tabs, router } from 'expo-router'; // Added router import
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import ENV from '../../../config/environment';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [recentReports, setRecentReports] = useState([]);

  // Helper function to get full image URL
  const getFullImageUrl = (relativePath) => {
    if (!relativePath) return null;
    return `${ENV.apiUrl.replace('/api', '')}/storage/${relativePath}`;
  };

  // Navigate to profile screen
  const navigateToProfile = () => {
    router.push('/tabs/profile');
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setHealthMetrics([
        { id: 1, type: 'Heart Rate', value: '72', unit: 'bpm', date: '2023-04-20', status: 'normal' },
        { id: 2, type: 'Blood Pressure', value: '120/80', unit: 'mmHg', date: '2023-04-19', status: 'normal' },
        { id: 3, type: 'Blood Sugar', value: '140', unit: 'mg/dL', date: '2023-04-18', status: 'borderline' },
      ]);
      setRecentReports([
        { id: 1, title: 'Blood Test Report', date: '2023-04-15', diagnosis: 'Normal' },
        { id: 2, title: 'Chest X-Ray', date: '2023-04-01', diagnosis: 'No significant findings' },
      ]);
    }, 1500);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'normal': return ['#28D45C', '#28A745'];
      case 'borderline': return ['#FFC107', '#E0A800'];
      case 'high': return ['#FF5656', '#DC3545'];
      default: return ['#6C757D', '#495057'];
    }
  };

  return (
    <>
      <LinearGradient
        colors={['#091429', '#0F2248', '#162F65']}
        style={styles.background}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.userName}>{user?.name || 'Patient'}</Text>
            </View>
            <TouchableOpacity onPress={navigateToProfile} style={styles.avatar} activeOpacity={0.8}>
              {user?.profile_photo ? (
                <Image 
                  source={{ uri: getFullImageUrl(user.profile_photo) }}
                  style={styles.avatarImage}
                />
              ) : (
                <LinearGradient
                  colors={['#2C7BE5', '#38BFA7']}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'P'}</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>

          {/* Summary Card */}
          <LinearGradient
            colors={['#2C7BE5', '#38BFA7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.summaryCard}
          >
            <Text style={styles.summaryTitle}>How are you feeling today?</Text>
            <Text style={styles.summaryText}>
              Your health indicators are mostly within normal range.
            </Text>
            <View style={styles.summaryButtons}>
              <TouchableOpacity style={styles.summaryButton}>
                <Text style={styles.summaryButtonText}>Great</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.summaryButton}>
                <Text style={styles.summaryButtonText}>Good</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.summaryButton}>
                <Text style={styles.summaryButtonText}>Not Well</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Quick Actions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickActionBtn}>
                <View style={styles.actionIcon}>
                  <Ionicons name="document-text-outline" size={24} color="#2C7BE5" />
                </View>
                <Text style={styles.quickActionText}>Upload Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionBtn}>
                <View style={styles.actionIcon}>
                  <Ionicons name="pulse-outline" size={24} color="#38BFA7" />
                </View>
                <Text style={styles.quickActionText}>Add Health Data</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionBtn}>
                <View style={styles.actionIcon}>
                  <Ionicons name="calendar-outline" size={24} color="#FFC107" />
                </View>
                <Text style={styles.quickActionText}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Health Metrics */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Health Metrics</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <Ionicons name="chevron-forward" size={16} color="#38BFA7" />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#38BFA7" />
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {healthMetrics.map(metric => {
                  const colors = getStatusColor(metric.status);
                  return (
                    <TouchableOpacity key={metric.id} activeOpacity={0.8}>
                      <View style={styles.metricCard}>
                        <LinearGradient
                          colors={[`${colors[0]}20`, `${colors[1]}10`]}
                          style={styles.metricGradient}
                        >
                          <View style={styles.metricHeader}>
                            <View style={[styles.statusIndicator, { backgroundColor: colors[0] }]} />
                            <Text style={styles.metricType}>{metric.type}</Text>
                          </View>
                          <Text style={styles.metricValue}>{metric.value}</Text>
                          <Text style={styles.metricUnit}>{metric.unit}</Text>
                          <Text style={styles.metricDate}>{metric.date}</Text>
                        </LinearGradient>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* Recent Reports */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Reports</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <Ionicons name="chevron-forward" size={16} color="#38BFA7" />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#38BFA7" />
              </View>
            ) : (
              recentReports.map(report => (
                <TouchableOpacity key={report.id} style={styles.reportCard} activeOpacity={0.8}>
                  <View style={styles.reportIconContainer}>
                    <Ionicons name="document-text" size={24} color="#38BFA7" />
                  </View>
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                    <Text style={styles.reportDate}>{report.date}</Text>
                    <Text style={styles.reportDiagnosis}>Diagnosis: {report.diagnosis}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#a0c0ff" />
                </TouchableOpacity>
              ))
            )}
          </View>
          
          {/* Tips Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Health Tips</Text>
            <LinearGradient
              colors={['rgba(44, 123, 229, 0.2)', 'rgba(56, 191, 167, 0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.tipCard}
            >
              <View style={styles.tipHeader}>
                <Ionicons name="bulb-outline" size={24} color="#FFC107" />
                <Text style={styles.tipTitle}>Daily Recommendation</Text>
              </View>
              <Text style={styles.tipText}>
                Stay hydrated! Drink at least 8 glasses of water daily to maintain optimal health and cognitive function.
              </Text>
            </LinearGradient>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
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
  contentContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  safeArea: {
    flex: 1,
  },  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  greeting: {
    fontSize: 16,
    color: '#a0c0ff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryCard: {
    borderRadius: 16,
    marginBottom: 24,
    padding: 20,
    elevation: 4,
    shadowColor: '#2C7BE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 16,
  },
  summaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#38BFA7',
    marginRight: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickActionBtn: {
    alignItems: 'center',
    width: '31%',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickActionText: {
    fontSize: 12,
    color: '#a0c0ff',
    textAlign: 'center',
  },
  loaderContainer: {
    padding: 30,
    alignItems: 'center',
  },
  metricCard: {
    marginRight: 14,
    width: 160,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricGradient: {
    padding: 16,
    height: 150,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  metricType: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  metricUnit: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  metricDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 12,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  reportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(56, 191, 167, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 14,
    color: '#a0c0ff',
    marginBottom: 4,
  },
  reportDiagnosis: {
    fontSize: 14,
    color: '#a0c0ff',
  },
  tipCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 14,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#a0c0ff',
    lineHeight: 22,
  },
  noDataContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  noDataText: {
    color: '#a0c0ff',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  addDataBtn: {
    backgroundColor: 'rgba(56, 191, 167, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addDataText: {
    color: '#38BFA7',
    fontSize: 14,
    fontWeight: '500',
  },
});