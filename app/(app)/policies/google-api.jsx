import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function GoogleAPIPolicy() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4285F4', '#34A853']}
        style={styles.heroBackground}
      />
      <LinearGradient
        colors={['#091429', '#0F2248', '#162F65']}
        style={styles.contentBackground}
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.lastUpdated}>LAST UPDATED ON</Text>
          <Text style={styles.updateDate}>5th June 2025</Text>
          <Text style={styles.heroTitle}>google{'\n'}services</Text>
          <Text style={styles.heroSubtitle}>
            integration with google cloud vision api for optical character recognition and text extraction.
          </Text>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.introText}>
            Webshark Health integrates with Google Cloud Vision API to provide optical character recognition (OCR) services for processing medical documents and images uploaded by users.
          </Text>

          <View style={styles.agreementBox}>
            <Text style={styles.agreementText}>
              By uploading medical documents to Webshark Health, you consent to the processing of these documents through Google Cloud Vision API for text extraction purposes only.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Ionicons name="cloud-upload" size={32} color="#4285F4" />
            </View>
            <Text style={styles.sectionTitle}>google cloud vision api</Text>
            <Text style={styles.sectionText}>
              We use Google Cloud Vision API to extract text from medical documents, prescriptions, and lab reports that you upload to our application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>A. Purpose of Integration</Text>
            <Text style={styles.bulletPoint}>• Extract text content from medical images and PDFs</Text>
            <Text style={styles.bulletPoint}>• Improve accuracy of AI health analysis</Text>
            <Text style={styles.bulletPoint}>• Enable digital processing of handwritten prescriptions</Text>
            <Text style={styles.bulletPoint}>• Convert medical documents into structured data</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>B. Data Processing</Text>
            <Text style={styles.bulletPoint}>• Images are temporarily processed by Google Cloud Vision</Text>
            <Text style={styles.bulletPoint}>• Only optical character recognition is performed</Text>
            <Text style={styles.bulletPoint}>• No data is permanently stored in Google systems</Text>
            <Text style={styles.bulletPoint}>• Processing occurs in secure, encrypted environments</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Ionicons name="shield-checkmark" size={32} color="#34A853" />
            </View>
            <Text style={styles.sectionTitle}>privacy & security</Text>
            <Text style={styles.sectionText}>
              Google Cloud Vision API processing is governed by Google Cloud's privacy and security policies, in addition to our own privacy commitments.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>A. Data Protection</Text>
            <Text style={styles.bulletPoint}>• Data transmission is encrypted using TLS 1.3</Text>
            <Text style={styles.bulletPoint}>• Google Cloud Vision operates under GDPR compliance</Text>
            <Text style={styles.bulletPoint}>• No human review of your medical documents by Google</Text>
            <Text style={styles.bulletPoint}>• Automatic deletion of processed data within 24 hours</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>B. Data Residency</Text>
            <Text style={styles.sectionText}>
              While our primary data storage is in India, Google Cloud Vision API processing may occur in Google's global infrastructure. However, no medical data is permanently stored outside India.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Ionicons name="settings" size={32} color="#4285F4" />
            </View>
            <Text style={styles.sectionTitle}>your control & choices</Text>
            <Text style={styles.bulletPoint}>• You can opt-out of OCR processing (manual text entry required)</Text>
            <Text style={styles.bulletPoint}>• Upload PDFs instead of images to minimize Google API usage</Text>
            <Text style={styles.bulletPoint}>• Request manual processing for sensitive documents</Text>
            <Text style={styles.bulletPoint}>• Delete documents anytime to remove from all systems</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Ionicons name="information-circle" size={32} color="#34A853" />
            </View>
            <Text style={styles.sectionTitle}>google's privacy policy</Text>
            <Text style={styles.sectionText}>
              Google Cloud Vision API is governed by Google Cloud's Privacy Policy and Terms of Service. We recommend reviewing these documents for complete understanding.
            </Text>
            
            <Text style={styles.linkText}>
              Google Cloud Privacy Policy: cloud.google.com/privacy
            </Text>
            <Text style={styles.linkText}>
              Google Cloud Terms: cloud.google.com/terms
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Ionicons name="eye-off" size={32} color="#FF5722" />
            </View>
            <Text style={styles.sectionTitle}>limitations & disclaimers</Text>
            <Text style={styles.bulletPoint}>• OCR accuracy depends on image quality and handwriting clarity</Text>
            <Text style={styles.bulletPoint}>• Google Cloud Vision may not recognize all medical terminology</Text>
            <Text style={styles.bulletPoint}>• Always verify extracted text for accuracy</Text>
            <Text style={styles.bulletPoint}>• We are not responsible for Google service availability</Text>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Questions About Google Integration?</Text>
            <Text style={styles.contactText}>
              Contact us for more information about our Google Cloud Vision integration:
            </Text>
            <Text style={styles.contactEmail}>grievances.myhealth@webshark.in</Text>
          </View>
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