import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Animated, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { sendOtpCode } = useAuth();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const authContainerAnim = useRef(new Animated.Value(0)).current;
  
  // State management
  const [authMethod, setAuthMethod] = useState('whatsapp'); // 'whatsapp' or 'email'
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const startAnimation = () => {
    // Reset animation values
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    authContainerAnim.setValue(0);
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(authContainerAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  // Use useFocusEffect instead of useEffect to handle screen focus
  useFocusEffect(
    React.useCallback(() => {
      startAnimation();
    }, [])
  );

  const validateInput = () => {
    if (!contact.trim()) {
      setError(`Please enter your ${authMethod === 'whatsapp' ? 'phone number' : 'email address'}`);
      return false;
    }

    if (authMethod === 'whatsapp') {
      // Indian phone number validation
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(contact.trim())) {
        setError('Please enter a valid 10-digit phone number');
        return false;
      }
    } else {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact.trim())) {
        setError('Please enter a valid email address');
        return false;
      }
    }

    return true;
  };

  const handleContinue = async () => {
    if (!validateInput()) return;

    try {
      setError('');
      setIsLoading(true);

      const otpData = authMethod === 'whatsapp' 
        ? { phone: contact.trim() }
        : { email: contact.trim() };

      const response = await sendOtpCode(otpData);

      if (response.success) {
        // Navigate to OTP verification screen with the contact info
        router.push({
          pathname: '/otp-verification',
          params: {
            contact: contact.trim(),
            type: authMethod,
            message: response.message
          }
        });
      } else {
        setError(response.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      if (err.errors) {
        const errorMessages = Object.values(err.errors).flat().join('\n');
        setError(errorMessages);
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchAuthMethod = (method) => {
    setAuthMethod(method);
    setContact('');
    setError('');
  };

  const uspFeatures = [
    {
      icon: 'analytics-outline',
      title: 'AI Report\nScreening'
    },
    {
      icon: 'pulse-outline',
      title: 'Health Trend\nTracking'
    },
    {
      icon: 'medical-outline',
      title: 'Smart Health\nInsights'
    }
  ];

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LinearGradient
          colors={['#091429', '#0F2248', '#162F65']}
          style={styles.background}
        />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView 
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Logo Section */}
              <View style={[styles.logoContainer, keyboardVisible && styles.logoContainerCompact]}>
                <Animated.View 
                  style={[
                    styles.logoWrapper,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }]
                    }
                  ]}
                >
                  <Image 
                    source={require('../../assets/images/health_logo_splash.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </Animated.View>
                
                <Animated.View 
                  style={[
                    styles.textContainer,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }],
                    }
                  ]}
                >
                  <Text style={styles.tagline}>
                    AI-Powered Care. Personalized for You.
                  </Text>
                  <Text style={styles.description}>
                    Advanced AI-based health reporting tool
                  </Text>
                </Animated.View>
              </View>

              {/* Auth Section */}
              <Animated.View 
                style={[
                  styles.authContainer,
                  {
                    opacity: authContainerAnim,
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                <Text style={styles.authTitle}>
                  Continue with {authMethod === 'whatsapp' ? 'WhatsApp' : 'Email'}
                </Text>

                {error ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={20} color="#ff5656" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                {/* Auth Method Toggle */}
                <View style={styles.methodToggleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.methodButton,
                      styles.methodButtonLeft,
                      authMethod === 'whatsapp' && styles.methodButtonActive
                    ]}
                    onPress={() => switchAuthMethod('whatsapp')}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={authMethod === 'whatsapp' ? ['#20B2AA', '#008B8B'] : ['transparent', 'transparent']}
                      style={styles.methodButtonGradient}
                    >
                      <Ionicons 
                        name="logo-whatsapp" 
                        size={20} 
                        color={authMethod === 'whatsapp' ? '#fff' : '#a0c0ff'} 
                      />
                      <Text style={[
                        styles.methodButtonText,
                        authMethod === 'whatsapp' && styles.methodButtonTextActive
                      ]}>
                        WhatsApp
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.methodButton,
                      styles.methodButtonRight,
                      authMethod === 'email' && styles.methodButtonActive
                    ]}
                    onPress={() => switchAuthMethod('email')}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={authMethod === 'email' ? ['#20B2AA', '#008B8B'] : ['transparent', 'transparent']}
                      style={styles.methodButtonGradient}
                    >
                      <Ionicons 
                        name="mail-outline" 
                        size={20} 
                        color={authMethod === 'email' ? '#fff' : '#a0c0ff'} 
                      />
                      <Text style={[
                        styles.methodButtonText,
                        authMethod === 'email' && styles.methodButtonTextActive
                      ]}>
                        Email
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {/* Input Field */}
                <View style={styles.inputContainer}>
                  {authMethod === 'whatsapp' ? (
                    <View style={styles.countryCodeContainer}>
                       <Text style={styles.countryCode}>+91</Text>
                    </View>
                  ) : (
                    <Ionicons 
                      name="mail-outline" 
                      size={20} 
                      color="#a0c0ff" 
                      style={styles.inputIcon} 
                    />
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder={authMethod === 'whatsapp' ? 'Enter your phone number' : 'Enter your email address'}
                    placeholderTextColor="#6d88b7"
                    value={contact}
                    onChangeText={setContact}
                    keyboardType={authMethod === 'whatsapp' ? 'phone-pad' : 'email-address'}
                    autoCapitalize="none"
                    autoComplete={authMethod === 'whatsapp' ? 'tel' : 'email'}
                    textContentType={authMethod === 'whatsapp' ? 'telephoneNumber' : 'emailAddress'}
                    maxLength={authMethod === 'whatsapp' ? 10 : undefined}
                  />
                </View>

                {/* Continue Button */}
                <LinearGradient
                  colors={['#2C7BE5', '#38BFA7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.continueButtonText}>Continue</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
                      </>
                    )}
                  </TouchableOpacity>
                </LinearGradient>
              </Animated.View>

              {/* USP Features */}
              {!keyboardVisible && (
                <Animated.View 
                  style={[
                    styles.uspContainer,
                    { opacity: authContainerAnim }
                  ]}
                >
                  <View style={styles.uspRow}>
                    {uspFeatures.map((feature, index) => (
                      <Animated.View 
                        key={index}
                        style={[
                          styles.uspItem,
                          {
                            opacity: authContainerAnim,
                            transform: [{
                              translateY: authContainerAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [30, 0]
                              })
                            }]
                          }
                        ]}
                      >
                        <View style={styles.uspIconContainer}>
                          <Ionicons name={feature.icon} size={28} color="#E5E7EB" />
                        </View>
                        <Text style={styles.uspTitle}>{feature.title}</Text>
                      </Animated.View>
                    ))}
                  </View>
                </Animated.View>
              )}

              {/* Footer */}
              <Animated.View 
                style={[
                  styles.footerContainer,
                  { opacity: fadeAnim }
                ]}
              >
                <Text style={styles.footerText}>
                  Securely manage your health reports with AI-powered insights
                </Text>
              </Animated.View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: height * 0.08,
    paddingBottom: height * 0.04,
  },
  logoContainerCompact: {
    paddingTop: height * 0.03,
    paddingBottom: height * 0.02,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.95,
    height: height * 0.16,
    marginBottom: 15,
  },
  logo: {
    width: '100%',
    height: '100%',
    maxWidth: width * 0.85,
    maxHeight: height * 0.15,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#a0c0ff',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  authContainer: {
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  authTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 86, 86, 0.15)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
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
  methodToggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  methodButton: {
    flex: 1,
    overflow: 'hidden',
  },
  methodButtonLeft: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  methodButtonRight: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  methodButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  methodButtonActive: {
    backgroundColor: 'rgba(56, 191, 167, 0.3)',
  },
  methodButtonText: {
    color: '#a0c0ff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  methodButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.2)',
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
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 16,
  },
  buttonGradient: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#2C7BE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  continueButton: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  uspContainer: {
    marginBottom: 30,
  },
  uspRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  uspItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  uspIconContainer: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uspTitle: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  footerContainer: {
    paddingBottom: 10,
  },
  footerText: {
    color: '#8fa8d1',
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 0.2,
    lineHeight: 16,
  },
});