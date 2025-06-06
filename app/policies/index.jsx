import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function PoliciesIndex() {
  const router = useRouter();

  const policyPages = [
    {
      id: 'terms',
      title: 'Terms & Conditions',
      description: 'Your agreement with Webshark Health',
      icon: 'document-text-outline',
      color: '#2C7BE5',
      route: '/policies/terms'
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'How we protect and use your health data',
      icon: 'shield-checkmark-outline',
      color: '#38BFA7',
      route: '/policies/privacy'
    },
    {
      id: 'google-api',
      title: 'Google Services',
      description: 'Google Cloud Vision API integration',
      icon: 'cloud-outline',
      color: '#4285F4',
      route: '/policies/google-api'
    },
    {
      id: 'security',
      title: 'Security & Data Protection',
      description: 'How we keep your medical data safe',
      icon: 'lock-closed-outline',
      color: '#FF5722',
      route: '/policies/security'
    }
  ];

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
        <Text style={styles.headerTitle}>Legal & Privacy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Policies & Legal</Text>
          <Text style={styles.heroSubtitle}>
            Important information about your data, privacy, and our services
          </Text>
        </View>

        <View style={styles.policiesGrid}>
          {policyPages.map((policy, index) => (
            <TouchableOpacity
              key={policy.id}
              style={styles.policyCard}
              onPress={() => router.push(policy.route)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[`${policy.color}15`, `${policy.color}05`]}
                style={styles.policyGradient}
              >
                <View style={[styles.policyIcon, { backgroundColor: `${policy.color}20` }]}>
                  <Ionicons name={policy.icon} size={24} color={policy.color} />
                </View>
                <View style={styles.policyContent}>
                  <Text style={styles.policyTitle}>{policy.title}</Text>
                  <Text style={styles.policyDescription}>{policy.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#a0c0ff" />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            These policies were last updated on June 5, 2025
          </Text>
          <Text style={styles.companyInfo}>
            WEBSHARK WEB SERVICES PVT LTD{'\n'}
            Bengaluru, Karnataka 560078
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#091429',
    },
    heroBackground: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '45%',
    },
    contentBackground: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '60%',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      paddingTop: 8,
      zIndex: 10,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContainer: {
      flex: 1,
    },
    heroSection: {
      padding: 24,
      paddingTop: 40,
      paddingBottom: 60,
    },
    lastUpdated: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.8)',
      letterSpacing: 2,
      marginBottom: 8,
    },
    updateDate: {
      fontSize: 18,
      color: '#fff',
      fontWeight: '600',
      marginBottom: 40,
    },
    heroTitle: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#fff',
      lineHeight: 52,
      marginBottom: 16,
    },
    heroSubtitle: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.9)',
      lineHeight: 24,
    },
    contentSection: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      marginTop: -20,
      flex: 1,
    },
    introText: {
      fontSize: 16,
      color: '#333',
      lineHeight: 24,
      marginBottom: 24,
    },
    policyDescription: {
      fontSize: 14,
      color: '#666',
      lineHeight: 22,
      marginBottom: 24,
    },
    agreementBox: {
      backgroundColor: '#f8f9fa',
      borderLeftWidth: 4,
      borderLeftColor: '#38BFA7',
      padding: 20,
      borderRadius: 8,
      marginBottom: 32,
    },
    agreementText: {
      fontSize: 15,
      color: '#333',
      fontWeight: '500',
      lineHeight: 22,
    },
    section: {
      marginBottom: 32,
    },
    sectionIcon: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 16,
      lineHeight: 28,
    },
    subsectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      marginBottom: 12,
      marginTop: 16,
    },
    sectionText: {
      fontSize: 14,
      color: '#666',
      lineHeight: 22,
      marginBottom: 12,
    },
    bulletPoint: {
      fontSize: 14,
      color: '#666',
      lineHeight: 22,
      marginLeft: 0,
      marginBottom: 8,
    },
    bulletText: {
      fontSize: 14,
      color: '#666',
      lineHeight: 22,
      marginBottom: 12,
    },
    importantText: {
      fontSize: 15,
      color: '#333',
      backgroundColor: '#fff3cd',
      padding: 16,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#ffc107',
      lineHeight: 22,
      fontWeight: '500',
    },
    linkText: {
      fontSize: 14,
      color: '#2C7BE5',
      marginBottom: 8,
      textDecorationLine: 'underline',
    },
    contactSection: {
      backgroundColor: '#f8f9fa',
      padding: 24,
      borderRadius: 12,
      marginTop: 24,
      marginBottom: 40,
    },
    contactTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 12,
    },
    contactText: {
      fontSize: 14,
      color: '#666',
      marginBottom: 12,
    },
    contactEmail: {
      fontSize: 16,
      color: '#2C7BE5',
      fontWeight: '600',
      marginBottom: 16,
    },
    companyDetails: {
      fontSize: 14,
      color: '#666',
      lineHeight: 20,
    },
    securityNote: {
      fontSize: 12,
      color: '#FF5722',
      fontStyle: 'italic',
      marginTop: 8,
    },
    // Policy Index Styles
    content: {
      flex: 1,
      padding: 20,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
    },
    policiesGrid: {
      marginTop: 24,
    },
    policyCard: {
      marginBottom: 16,
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    policyGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    policyIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    policyContent: {
      flex: 1,
    },
    policyTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 4,
    },
    policyDescription: {
      fontSize: 14,
      color: '#a0c0ff',
    },
    footerInfo: {
      marginTop: 32,
      padding: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 12,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      color: '#a0c0ff',
      textAlign: 'center',
      marginBottom: 8,
    },
    companyInfo: {
      fontSize: 12,
      color: '#a0c0ff',
      textAlign: 'center',
      opacity: 0.8,
    },
  });