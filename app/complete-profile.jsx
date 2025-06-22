import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CompleteProfile() {
  const { completeUserProfile } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Extract params
  const { contact, type } = params;
  
  // State management
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(type === 'email' ? contact : '');
  const [phone, setPhone] = useState(type === 'whatsapp' ? contact : '');
  const [gender, setGender] = useState('');
  const [acceptPolicies, setAcceptPolicies] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal state for policy display
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const validateForm = () => {
    if (!firstName.trim()) {
      setError('First name is required');
      return false;
    }
    
    if (!lastName.trim()) {
      setError('Last name is required');
      return false;
    }

    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!phone.trim()) {
      setError('Phone number is required');
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    
    if (!acceptPolicies) {
      setError('Please accept the Terms & Conditions and Privacy Policy to continue');
      return false;
    }
    
    return true;
  };

  const handleCompleteProfile = async () => {
    if (!validateForm()) return;

    try {
      setError('');
      setIsLoading(true);
      
      const profileData = {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        phone: phone.trim(),
        gender: gender || null,
      };
      
      const response = await completeUserProfile(profileData);
      
      if (response.success) {
        // Profile completed successfully - navigate to dashboard
        router.replace('/tabs');
      } else {
        setError(response.message || 'Failed to complete profile. Please try again.');
      }
    } catch (err) {
      if (err.errors) {
        // Format validation errors from Laravel
        const errorMessages = Object.values(err.errors).flat().join('\n');
        setError(errorMessages);
      } else {
        setError(err.message || 'Profile completion failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openPolicy = (policyType) => {
    setSelectedPolicy(policyType);
    setShowPolicyModal(true);
  };

  const closePolicyModal = () => {
    setShowPolicyModal(false);
    setSelectedPolicy(null);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const getPolicyContent = (policyType) => {
    switch (policyType) {
      case 'terms':
        return {
          title: 'Terms & Conditions',
          content: `Welcome to Webshark Health. By using our services, you agree to these terms.

1. ACCEPTANCE OF TERMS
By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.

2. SERVICES
Webshark Health provides health monitoring and reporting services. We reserve the right to modify or discontinue services at any time.

3. USER RESPONSIBILITIES
Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.

4. PRIVACY
Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.

5. LIMITATION OF LIABILITY
Webshark Health shall not be liable for any indirect, incidental, special, consequential, or punitive damages.

6. MODIFICATIONS
We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.

Contact us at support@websharkhealth.com for questions about these terms.`
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          content: `This Privacy Policy describes how Webshark Health collects, uses, and protects your information.

INFORMATION WE COLLECT
- Personal identification information (name, phone, email)
- Health data you choose to share
- Usage data and analytics

HOW WE USE YOUR INFORMATION
- To provide and improve our services
- To communicate with you about your account
- To ensure the security of our platform

DATA PROTECTION
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

DATA SHARING
We do not sell, trade, or rent your personal information to third parties. We may share information only:
- With your explicit consent
- To comply with legal obligations
- To protect our rights and safety

YOUR RIGHTS
You have the right to:
- Access your personal data
- Correct inaccurate information
- Request deletion of your data
- Withdraw consent

CONTACT US
If you have questions about this Privacy Policy, contact us at privacy@websharkhealth.com.`
        };
      default:
        return { title: 'Policy', content: 'Policy content not available.' };
    }
  };

  const PolicyModal = () => {
    if (!selectedPolicy) return null;
    
    const policy = getPolicyContent(selectedPolicy);
    
    return (
      <Modal
        visible={showPolicyModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closePolicyModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <LinearGradient
            colors={['#091429', '#0F2248', '#162F65']}
            style={styles.modalBackground}
          />
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{policy.title}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closePolicyModal}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.modalContent}
            contentContainerStyle={styles.modalContentContainer}
          >
            <Text style={styles.policyContentText}>{policy.content}</Text>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={closePolicyModal}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient
        colors={['#091429', '#0F2248', '#162F65']}
        style={styles.background}
      />
      
      <StatusBar style="light" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Complete Profile</Text>
            </View>

            <View style={styles.welcomeContainer}>
              <View style={styles.successIconContainer}>
                <Ionicons 
                  name="checkmark-circle" 
                  size={56} 
                  color="#38BFA7" 
                />
              </View>
              <Text style={styles.welcomeTitle}>Welcome to Webshark Health!</Text>
              <Text style={styles.welcomeSubtitle}>
                Your {type === 'whatsapp' ? 'WhatsApp number' : 'email address'} has been verified successfully. Please complete your profile to get started with AI-powered health insights.
              </Text>
            </View>
            
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={20} color="#ff5656" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            
            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>First Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your first name"
                  placeholderTextColor="#6d88b7"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoComplete="given-name"
                  textContentType="givenName"
                  autoCapitalize="words"
                />
              </View>

              <Text style={styles.inputLabel}>Last Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your last name"
                  placeholderTextColor="#6d88b7"
                  value={lastName}
                  onChangeText={setLastName}
                  autoComplete="family-name"
                  textContentType="familyName"
                  autoCapitalize="words"
                />
              </View>
              
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputContainer, type === 'email' && styles.inputDisabled]}>
                <Ionicons name="mail-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, type === 'email' && styles.inputDisabledText]}
                  placeholder="Enter your email address"
                  placeholderTextColor="#6d88b7"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  autoComplete="email"
                  textContentType="emailAddress"
                  editable={type !== 'email'}
                />
                {type === 'email' && (
                  <Ionicons name="checkmark-circle" size={20} color="#38BFA7" style={styles.verifiedIcon} />
                )}
              </View>
              
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={[styles.inputContainer, type === 'whatsapp' && styles.inputDisabled]}>
                <View style={styles.countryCodeContainer}>
                  <Text style={styles.countryFlag}>🇮🇳</Text>
                  <Text style={styles.countryCode}>+91</Text>
                </View>
                <TextInput
                  style={[styles.input, type === 'whatsapp' && styles.inputDisabledText]}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#6d88b7"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  maxLength={10}
                  editable={type !== 'whatsapp'}
                />
                {type === 'whatsapp' && (
                  <Ionicons name="checkmark-circle" size={20} color="#38BFA7" style={styles.verifiedIcon} />
                )}
              </View>

              <Text style={styles.inputLabel}>Gender (Optional)</Text>
              <View style={styles.genderContainer}>
                {['Male', 'Female', 'Other'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.genderOption,
                      gender === option.toLowerCase() && styles.genderOptionSelected
                    ]}
                    onPress={() => setGender(option.toLowerCase())}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      gender === option.toLowerCase() && styles.genderOptionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.policyContainer}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setAcceptPolicies(!acceptPolicies)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, acceptPolicies && styles.checkboxChecked]}>
                    {acceptPolicies && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </View>
                  <Text style={styles.policyText}>
                    I agree to Webshark Health's{" "}
                    <Text 
                      style={styles.policyLink}
                      onPress={() => openPolicy('terms')}
                    >
                      Terms & Conditions
                    </Text>
                    {" "}and{" "}
                    <Text 
                      style={styles.policyLink}
                      onPress={() => openPolicy('privacy')}
                    >
                      Privacy Policy
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
              
              <LinearGradient
                colors={['#2C7BE5', '#38BFA7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCompleteProfile}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Get Started</Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      
      <PolicyModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 35,
    paddingHorizontal: 16,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#a0c0ff',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  formContainer: {
    marginTop: 5,
  },
  inputLabel: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.2)',
    overflow: 'hidden',
  },
  inputDisabled: {
    backgroundColor: 'rgba(56, 191, 167, 0.1)',
    borderColor: 'rgba(56, 191, 167, 0.3)',
  },
  inputIcon: {
    marginLeft: 16,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: 'rgba(160, 192, 255, 0.2)',
  },
  countryFlag: {
    fontSize: 18,
    marginRight: 6,
  },
  countryCode: {
    color: '#a0c0ff',
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  inputDisabledText: {
    color: '#a0c0ff',
  },
  verifiedIcon: {
    marginRight: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.2)',
  },
  genderOptionSelected: {
    backgroundColor: 'rgba(56, 191, 167, 0.3)',
    borderColor: '#38BFA7',
  },
  genderOptionText: {
    color: '#a0c0ff',
    fontSize: 14,
    fontWeight: '500',
  },
  genderOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  policyContainer: {
    marginBottom: 30,
    paddingHorizontal: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#38BFA7',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#38BFA7',
    borderColor: '#38BFA7',
  },
  policyText: {
    color: '#a0c0ff',
    lineHeight: 20,
    fontSize: 14,
    flex: 1,
  },
  policyLink: {
    color: '#38BFA7',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  buttonGradient: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#2C7BE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  button: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 86, 86, 0.15)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 86, 86, 0.3)',
  },
  errorText: {
    color: '#ff5656',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#091429',
  },
  modalBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160, 192, 255, 0.2)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalContent: {
    flex: 1,
  },
  modalContentContainer: {
    padding: 20,
  },
  policyContentText: {
    color: '#a0c0ff',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'left',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(160, 192, 255, 0.2)',
  },
  modalCloseButton: {
    backgroundColor: '#38BFA7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});