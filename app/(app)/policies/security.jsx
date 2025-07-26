import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function SecurityPolicy() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#FF5722', '#E91E63']}
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
          <Text style={styles.heroTitle}>Security &{'\n'}Data Protection</Text>
          <Text style={styles.heroSubtitle}>
            comprehensive security measures to protect your medical data and ensure privacy compliance.
          </Text>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.introText}>
            At Webshark Health, we implement industry-leading security measures to protect your sensitive medical information. Your health data deserves the highest level of protection.
          </Text>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="lock-closed" size={28} color="#FF5722" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>data encryption</Text>
            </View>
            <Text style={styles.bulletPoint}>• AES-256 encryption for data at rest in Indian servers</Text>
            <Text style={styles.bulletPoint}>• TLS 1.3 encryption for data in transit</Text>
            <Text style={styles.bulletPoint}>• End-to-end encryption for sensitive communications</Text>
            <Text style={styles.bulletPoint}>• Encrypted database storage with automatic backups</Text>
            <Text style={styles.bulletPoint}>• Zero-knowledge architecture where possible</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="finger-print" size={28} color="#E91E63" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>access controls</Text>
            </View>
            <Text style={styles.bulletPoint}>• Multi-factor authentication for user accounts</Text>
            <Text style={styles.bulletPoint}>• WhatsApp OTP verification for secure login</Text>
            <Text style={styles.bulletPoint}>• Role-based access controls for internal systems</Text>
            <Text style={styles.bulletPoint}>• Automatic session timeout for inactive accounts</Text>
            <Text style={styles.bulletPoint}>• Device-based security tokens and biometric support</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cloud-done" size={28} color="#4285F4" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>ai processing security</Text>
            </View>
            <Text style={styles.bulletPoint}>• Secure, isolated AI processing environments</Text>
            <Text style={styles.bulletPoint}>• Data anonymization before AI analysis</Text>
            <Text style={styles.bulletPoint}>• Encrypted communication with Google Cloud Vision</Text>
            <Text style={styles.bulletPoint}>• No persistent storage of data in external AI systems</Text>
            <Text style={styles.bulletPoint}>• Regular security audits of AI processing partners</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="eye" size={28} color="#38BFA7" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>monitoring & audit</Text>
            </View>
            <Text style={styles.bulletPoint}>• Real-time monitoring of data access and usage</Text>
            <Text style={styles.bulletPoint}>• Detailed audit logs for all system activities</Text>
            <Text style={styles.bulletPoint}>• Automated threat detection and response systems</Text>
            <Text style={styles.bulletPoint}>• Regular penetration testing by third-party experts</Text>
            <Text style={styles.bulletPoint}>• 24/7 security operations center</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark" size={28} color="#34A853" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>compliance & standards</Text>
            </View>
            <Text style={styles.bulletPoint}>• Digital Personal Data Protection Act, 2023 compliance</Text>
            <Text style={styles.bulletPoint}>• ISO 27001 security management standards</Text>
            <Text style={styles.bulletPoint}>• Healthcare data handling best practices</Text>
            <Text style={styles.bulletPoint}>• Regular compliance audits and certifications</Text>
            <Text style={styles.bulletPoint}>• Staff training on data protection protocols</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="phone-portrait" size={28} color="#2C7BE5" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>mobile app security</Text>
            </View>
            <Text style={styles.bulletPoint}>• Certificate pinning for API communications</Text>
            <Text style={styles.bulletPoint}>• Local data encryption on device storage</Text>
            <Text style={styles.bulletPoint}>• Biometric authentication support</Text>
            <Text style={styles.bulletPoint}>• Anti-tampering and root/jailbreak detection</Text>
            <Text style={styles.bulletPoint}>• Automatic security updates and patches</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="warning" size={28} color="#FFC107" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>incident response</Text>
            </View>
            <Text style={styles.sectionText}>
              In the unlikely event of a security incident:
            </Text>
            <Text style={styles.bulletPoint}>• Immediate containment and investigation procedures</Text>
            <Text style={styles.bulletPoint}>• Notification to affected users within 72 hours</Text>
            <Text style={styles.bulletPoint}>• Coordination with Data Protection Board if required</Text>
            <Text style={styles.bulletPoint}>• Post-incident analysis and security improvements</Text>
            <Text style={styles.bulletPoint}>• Transparent communication throughout the process</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-circle" size={28} color="#9C27B0" style={styles.sectionIconInline} />
              <Text style={styles.sectionTitle}>your security responsibilities</Text>
            </View>
            <Text style={styles.sectionText}>
              Help us keep your data secure by:
            </Text>
            <Text style={styles.bulletPoint}>• Using strong, unique passwords for your account</Text>
            <Text style={styles.bulletPoint}>• Enabling two-factor authentication</Text>
            <Text style={styles.bulletPoint}>• Keeping your app updated to the latest version</Text>
            <Text style={styles.bulletPoint}>• Not sharing your login credentials</Text>
            <Text style={styles.bulletPoint}>• Reporting suspicious activity immediately</Text>
            <Text style={styles.bulletPoint}>• Using secure Wi-Fi networks for health data access</Text>
          </View>

          <View style={styles.contactSection}>
            <View style={styles.contactHeader}>
              <Ionicons name="mail" size={24} color="#FF5722" />
              <Text style={styles.contactTitle}>Security Contact</Text>
            </View>
            <Text style={styles.contactText}>
              Report security concerns or incidents immediately:
            </Text>
            <TouchableOpacity 
              style={styles.emailContainer}
              onPress={() => {/* Add email functionality if needed */}}
            >
              <Text style={styles.contactEmail}>grievances.myhealth@webshark.in</Text>
            </TouchableOpacity>
            <View style={styles.urgentNotice}>
              <Ionicons name="alert-circle" size={16} color="#FF5722" />
              <Text style={styles.securityNote}>
                For urgent security matters, mark your email subject with "SECURITY URGENT"
              </Text>
            </View>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              This security policy is reviewed and updated regularly to ensure continued protection of your health data.
            </Text>
            <Text style={styles.lastReviewText}>
              Last security review: June 2025
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
    marginBottom: 32,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
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
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
    textTransform: 'capitalize',
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
  urgentNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF5722',
  },
  securityNote: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '500',
    marginLeft: 8,
    lineHeight: 16,
    flex: 1,
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