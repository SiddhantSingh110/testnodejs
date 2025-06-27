import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function TermsAndConditions() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#2C7BE5', '#38BFA7']}
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
          <Text style={styles.heroTitle}>terms &{'\n'}conditions</Text>
          <Text style={styles.heroSubtitle}>
            this agreement governs your use of webshark health and we encourage you to read it carefully.
          </Text>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.agreementBox}>
            <View style={styles.agreementHeader}>
              <Ionicons name="document-text" size={20} color="#2C7BE5" />
              <Text style={styles.agreementTitle}>Legal Agreement</Text>
            </View>
            <Text style={styles.agreementText}>
              By using Webshark Health, you hereby acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions and our Privacy Policy.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-circle" size={28} color="#38BFA7" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>Acceptance Of Terms</Text>
            </View>
            <Text style={styles.sectionText}>
              WEBSHARK WEB SERVICES PVT LTD and its affiliates (collectively "Webshark Health," "We," "Us," or "Company") provide this mobile application and related services subject to your compliance with these terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>A. Eligibility</Text>
            <Text style={styles.sectionText}>
              You must be at least 18 years old to use Webshark Health. By using our services, you represent that you meet this age requirement and have the legal capacity to enter into this agreement.
            </Text>
            <Text style={styles.bulletPoint}>• Must be 18 years or older</Text>
            <Text style={styles.bulletPoint}>• Legal capacity to enter agreements</Text>
            <Text style={styles.bulletPoint}>• Resident of India or authorized jurisdiction</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>B. Account Registration</Text>
            <Text style={styles.sectionText}>
              To use our services, you must create an account by providing accurate information including your name, phone number, and health details. You are responsible for maintaining the confidentiality of your account credentials.
            </Text>
            <Text style={styles.bulletPoint}>• Provide accurate registration information</Text>
            <Text style={styles.bulletPoint}>• Maintain account security and confidentiality</Text>
            <Text style={styles.bulletPoint}>• One account per individual</Text>
            <Text style={styles.bulletPoint}>• Update information when changes occur</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="medical" size={28} color="#FF5722" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>Medical Disclaimer</Text>
            </View>
            <Text style={styles.importantText}>
              Webshark Health provides AI-generated health insights for informational and educational purposes only. Our services are NOT intended to replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical decisions.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>A. AI-Powered Analysis</Text>
            <Text style={styles.sectionText}>
              Our application uses artificial intelligence to analyze medical reports and generate health insights. While we strive for accuracy, AI analysis may contain errors and should be verified with healthcare professionals.
            </Text>
            <Text style={styles.bulletPoint}>• AI analysis is for informational purposes only</Text>
            <Text style={styles.bulletPoint}>• Results may contain errors or inaccuracies</Text>
            <Text style={styles.bulletPoint}>• Always verify with qualified healthcare providers</Text>
            <Text style={styles.bulletPoint}>• Not a substitute for professional medical advice</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>B. Health Data Processing</Text>
            <Text style={styles.sectionText}>
              We process your medical reports using secure AI systems and Google Cloud Vision API for optical character recognition. Your data is encrypted and processed in compliance with Indian data protection laws.
            </Text>
            <Text style={styles.bulletPoint}>• Secure AI processing with encryption</Text>
            <Text style={styles.bulletPoint}>• Google Cloud Vision for text recognition</Text>
            <Text style={styles.bulletPoint}>• Compliance with Indian data protection laws</Text>
            <Text style={styles.bulletPoint}>• Data processed in secure Indian data centers</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark" size={28} color="#34A853" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>Permitted Use</Text>
            </View>
            <Text style={styles.sectionText}>
              You may use Webshark Health for personal health management, including uploading medical reports, tracking health metrics, and accessing AI-generated insights for your own healthcare decisions.
            </Text>
            
            <Text style={styles.allowedTitle}>Allowed Activities:</Text>
            <Text style={styles.bulletPoint}>• Upload personal medical reports and documents</Text>
            <Text style={styles.bulletPoint}>• Track personal health metrics and trends</Text>
            <Text style={styles.bulletPoint}>• Access AI-generated health insights</Text>
            <Text style={styles.bulletPoint}>• Export your personal health data</Text>
            <Text style={styles.bulletPoint}>• Share reports with your healthcare providers</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.prohibitedTitle}>Prohibited Activities:</Text>
            <Text style={styles.bulletPoint}>• Sharing account credentials with others</Text>
            <Text style={styles.bulletPoint}>• Uploading false or misleading health information</Text>
            <Text style={styles.bulletPoint}>• Using the service for commercial purposes</Text>
            <Text style={styles.bulletPoint}>• Attempting to reverse engineer our AI systems</Text>
            <Text style={styles.bulletPoint}>• Violating applicable laws or regulations</Text>
            <Text style={styles.bulletPoint}>• Accessing other users' health data</Text>
            <Text style={styles.bulletPoint}>• Using the platform for non-health related content</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cloud-upload" size={28} color="#4285F4" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>Data Processing & AI Services</Text>
            </View>
            <Text style={styles.sectionText}>
              We use advanced AI technology and Google Cloud Vision API to process your medical documents. Your data is processed securely and in accordance with our Privacy Policy.
            </Text>
            <Text style={styles.bulletPoint}>• Optical Character Recognition (OCR) processing</Text>
            <Text style={styles.bulletPoint}>• AI-powered health trend analysis</Text>
            <Text style={styles.bulletPoint}>• Secure data transmission and storage</Text>
            <Text style={styles.bulletPoint}>• Temporary processing with Google Cloud Vision</Text>
            <Text style={styles.bulletPoint}>• Data retention as per Privacy Policy</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="card" size={28} color="#9C27B0" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>Service Availability & Fees</Text>
            </View>
            <Text style={styles.sectionText}>
              Webshark Health is currently provided free of charge. We reserve the right to introduce paid features or subscription plans with advance notice to users.
            </Text>
            <Text style={styles.bulletPoint}>• Currently free to use</Text>
            <Text style={styles.bulletPoint}>• Future paid features may be introduced</Text>
            <Text style={styles.bulletPoint}>• 30-day advance notice for any pricing changes</Text>
            <Text style={styles.bulletPoint}>• Service availability subject to maintenance</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="warning" size={28} color="#FF5722" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>Limitation Of Liability</Text>
            </View>
            <Text style={styles.sectionText}>
              Webshark Health shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability is limited to the amount paid by you, if any.
            </Text>
            <Text style={styles.bulletPoint}>• No liability for indirect or consequential damages</Text>
            <Text style={styles.bulletPoint}>• Limited liability to amount paid (if any)</Text>
            <Text style={styles.bulletPoint}>• No responsibility for third-party AI service issues</Text>
            <Text style={styles.bulletPoint}>• User assumes risk for medical decision-making</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="refresh" size={28} color="#FF9800" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>Changes To Terms</Text>
            </View>
            <Text style={styles.sectionText}>
              We may update these terms periodically. Continued use of Webshark Health after changes constitutes acceptance of the updated terms. We will notify you of material changes through the app.
            </Text>
            <Text style={styles.bulletPoint}>• Terms may be updated periodically</Text>
            <Text style={styles.bulletPoint}>• In-app notifications for material changes</Text>
            <Text style={styles.bulletPoint}>• Continued use implies acceptance</Text>
            <Text style={styles.bulletPoint}>• Historical versions available upon request</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="ban" size={28} color="#F44336" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>Account Termination</Text>
            </View>
            <Text style={styles.sectionText}>
              You may terminate your account at any time. We may suspend or terminate accounts that violate these terms or for legal compliance reasons.
            </Text>
            <Text style={styles.bulletPoint}>• Users can delete accounts anytime</Text>
            <Text style={styles.bulletPoint}>• Data deletion within 30 days of account closure</Text>
            <Text style={styles.bulletPoint}>• Account suspension for terms violations</Text>
            <Text style={styles.bulletPoint}>• Export data before account deletion</Text>
          </View>

          <View style={styles.contactSection}>
            <View style={styles.contactHeader}>
              <Ionicons name="mail" size={24} color="#2C7BE5" />
              <Text style={styles.contactTitle}>Contact Us</Text>
            </View>
            <Text style={styles.contactText}>
              For questions about these Terms & Conditions:
            </Text>
            <TouchableOpacity 
              style={styles.emailContainer}
              onPress={() => {/* Add email functionality if needed */}}
            >
              <Text style={styles.contactEmail}>grievances.myhealth@webshark.in</Text>
            </TouchableOpacity>
            <View style={styles.companyContainer}>
              <Text style={styles.companyDetails}>
                WEBSHARK WEB SERVICES PVT LTD{'\n'}
                4B, 2nd Floor, 42/3, Outer Ring Rd,{'\n'}
                near Kanakapura Main Road, J P Nagar,{'\n'}
                Umarbagh Layout, J. P. Nagar,{'\n'}
                Bengaluru, Karnataka 560078
              </Text>
            </View>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              These terms and conditions constitute a legally binding agreement between you and Webshark Health.
            </Text>
            <Text style={styles.lastReviewText}>
              Last legal review: June 2025
            </Text>
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
    backgroundColor: 'whitesmoke',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    marginTop: -20,
    flex: 1,
  },
  agreementBox: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: '#2C7BE5',
    padding: 20,
    borderRadius: 8,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  agreementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  agreementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565c0',
    marginLeft: 8,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIconInline: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 28,
    textTransform: 'capitalize',
    width: '100%',
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 16,
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2C7BE5',
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  bulletPoint: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginLeft: 0,
    marginBottom: 8,
    paddingLeft: 4,
  },
  allowedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
    marginTop: 12,
    backgroundColor: '#e8f5e8',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#4caf50',
  },
  prohibitedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c62828',
    marginBottom: 8,
    marginTop: 12,
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#f44336',
  },
  importantText: {
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
    lineHeight: 22,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  contactSection: {
    backgroundColor: '#f8f9fa',
    padding: 24,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  emailContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  contactEmail: {
    fontSize: 16,
    color: '#2C7BE5',
    fontWeight: '600',
    textAlign: 'center',
  },
  companyContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  companyDetails: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
  },
  footerSection: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#1565c0',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  lastReviewText: {
    fontSize: 12,
    color: '#1976d2',
    textAlign: 'center',
    fontWeight: '500',
  },
});