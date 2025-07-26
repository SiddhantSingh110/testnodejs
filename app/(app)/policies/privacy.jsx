import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#38BFA7', '#2C7BE5']}
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
          <Text style={styles.updateDate}>16th July 2025</Text>
          <Text style={styles.heroTitle}>Privacy{'\n'}Policy</Text>
          <Text style={styles.heroSubtitle}>
            this privacy policy includes important information about your personal data and we encourage you to read it carefully.
          </Text>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.introText}>
            WEBSHARK WEB SERVICES PVT LTD, its subsidiaries and affiliated companies (collectively referred to herein as "the Company," "Webshark Health," "We," "Us," or "Our"), place paramount importance on safeguarding the privacy and security of your personal health information ("Personal Data"). We prioritize the establishment and maintenance of your trust.
          </Text>

          <Text style={styles.policyDescription}>
            This Privacy Policy ("Privacy Policy" or "Policy") outlines the methods and principles governing our collection, use, processing, and disclosure of your Personal Data in connection with your use of our products, services, and our mobile application. Please note that this Policy does not apply to our partners, each of whom may maintain their own privacy policy. In situations where you interact with such partners, we strongly encourage you to review the privacy policy applicable to that particular service or interaction.
          </Text>

          <View style={styles.agreementBox}>
            <Text style={styles.agreementText}>
              By using our products, services, and mobile application, you hereby acknowledge that you have read, understood, and agree to the processing of your Personal Data in accordance with the terms of this Privacy Policy and our Terms & Conditions.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="folder-open" size={28} color="#38BFA7" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>Collection Of Information</Text>
            </View>
            <Text style={styles.sectionText}>
              Pursuant to this Policy, Webshark Health collects and processes the undermentioned types of information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>A. User Provided Information</Text>
            <Text style={styles.sectionText}>
              For utilization of the Webshark Health application, it is a prerequisite for you to share specific data during the registration phase and for your activities on the application.
            </Text>
            
            <Text style={styles.bulletText}>
              For registration purposes, we may collect personal details such as your name, mobile number, email ID, date of birth, gender, height, weight, blood group, and other health-related information you choose to provide.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>B. Medical Data</Text>
            <Text style={styles.bulletPoint}>• Medical reports and documents you upload</Text>
            <Text style={styles.bulletPoint}>• Health metrics you enter manually</Text>
            <Text style={styles.bulletPoint}>• AI-generated health summaries and insights</Text>
            <Text style={styles.bulletPoint}>• Health trends and analytics data</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>C. Technical Information</Text>
            <Text style={styles.bulletPoint}>• Device information and operating system</Text>
            <Text style={styles.bulletPoint}>• App usage patterns and preferences</Text>
            <Text style={styles.bulletPoint}>• Location data (only if explicitly permitted)</Text>
            <Text style={styles.bulletPoint}>• Crash reports and performance data</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cog" size={28} color="#2C7BE5" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>How We Use Your Information</Text>
            </View>
            <Text style={styles.bulletPoint}>• Process and analyze medical reports using AI technology</Text>
            <Text style={styles.bulletPoint}>• Generate personalized health insights and recommendations</Text>
            <Text style={styles.bulletPoint}>• Track health metrics and identify trends over time</Text>
            <Text style={styles.bulletPoint}>• Improve our AI analysis services and accuracy</Text>
            <Text style={styles.bulletPoint}>• Provide customer support and technical assistance</Text>
            <Text style={styles.bulletPoint}>• Send important updates about your health data</Text>
            <Text style={styles.bulletPoint}>• Comply with legal obligations and regulatory requirements</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cloud" size={28} color="#4285F4" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>AI Processing & Data Sharing</Text>
            </View>
            <Text style={styles.sectionText}>
              To provide AI-powered health analysis, we work with trusted technology partners including Google Cloud Vision API for optical character recognition.
            </Text>
            
            <Text style={styles.bulletPoint}>• Medical reports are processed by secure AI systems located in India</Text>
            <Text style={styles.bulletPoint}>• Only necessary medical information is shared for analysis</Text>
            <Text style={styles.bulletPoint}>• All AI processing partners are bound by strict confidentiality agreements</Text>
            <Text style={styles.bulletPoint}>• Your data is never used for advertising or marketing by third parties</Text>
            <Text style={styles.bulletPoint}>• Google Cloud Vision processes images temporarily for text extraction only</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark" size={28} color="#38BFA7" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>Data Security & Storage</Text>
            </View>
            <Text style={styles.sectionText}>
              We implement comprehensive security measures to protect your health information:
            </Text>
            
            <Text style={styles.bulletPoint}>• End-to-end encryption for data transmission</Text>
            <Text style={styles.bulletPoint}>• Secure storage with AES-256 encryption in Indian data centers</Text>
            <Text style={styles.bulletPoint}>• Regular security audits and penetration testing</Text>
            <Text style={styles.bulletPoint}>• Multi-factor authentication and access controls</Text>
            <Text style={styles.bulletPoint}>• Compliance with Digital Personal Data Protection Act, 2023</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="hand-right" size={28} color="#FF5722" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>Your Rights & Choices</Text>
            </View>
            <Text style={styles.sectionText}>
              Under the Digital Personal Data Protection Act, 2023, you have the following rights:
            </Text>
            
            <Text style={styles.bulletPoint}>• Access your personal and health data</Text>
            <Text style={styles.bulletPoint}>• Request correction of inaccurate information</Text>
            <Text style={styles.bulletPoint}>• Delete your account and associated data</Text>
            <Text style={styles.bulletPoint}>• Download your health data in a portable format</Text>
            <Text style={styles.bulletPoint}>• Withdraw consent for data processing</Text>
            <Text style={styles.bulletPoint}>• Lodge complaints with the Data Protection Board</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={28} color="#9C27B0" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>Data Retention</Text>
            </View>
            <Text style={styles.sectionText}>
              We retain your information as follows:
            </Text>
            
            <Text style={styles.bulletPoint}>• Health data is stored until you request deletion</Text>
            <Text style={styles.bulletPoint}>• Account information is retained while your account is active</Text>
            <Text style={styles.bulletPoint}>• AI processing logs are retained for service improvement (anonymized)</Text>
            <Text style={styles.bulletPoint}>• Backup data is automatically deleted after 90 days</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="refresh" size={28} color="#FF9800" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>Policy Updates</Text>
            </View>
            <Text style={styles.sectionText}>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes through the app or via email.
            </Text>
            
            <Text style={styles.bulletPoint}>• Changes will be posted in the app with an updated "Last Updated" date</Text>
            <Text style={styles.bulletPoint}>• Material changes will trigger in-app notifications</Text>
            <Text style={styles.bulletPoint}>• Continued use constitutes acceptance of updated terms</Text>
          </View>

          <View style={styles.contactSection}>
            <View style={styles.contactHeader}>
              <Ionicons name="mail" size={24} color="#38BFA7" />
              <Text style={styles.contactTitle}>Contact Our Privacy Officer</Text>
            </View>
            <Text style={styles.contactText}>
              For questions about this Privacy Policy or to exercise your rights:
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
              This privacy policy is designed to be transparent and help you understand how we protect your health information.
            </Text>
            <Text style={styles.lastReviewText}>
              Last privacy review: June 2025
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
  introText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#38BFA7',
  },
  policyDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 24,
  },
  agreementBox: {
    backgroundColor: '#e8f5e8',
    borderLeftWidth: 4,
    borderLeftColor: '#38BFA7',
    padding: 20,
    borderRadius: 8,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#c3e6c3',
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
  bulletText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
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