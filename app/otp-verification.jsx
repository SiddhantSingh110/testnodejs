import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function OtpVerification() {
  const { verifyOtpCode, sendOtpCode } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Extract params
  const { contact, type, message } = params;
  
  // State management
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [expiryTimer, setExpiryTimer] = useState(180); // 3 minutes
  
  // Refs for OTP inputs
  const otpRefs = useRef([]);

  // Timer countdown effect for resend
  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  // Expiry timer countdown effect
  useEffect(() => {
    let interval;
    if (expiryTimer > 0) {
      interval = setInterval(() => {
        setExpiryTimer(prev => {
          if (prev <= 1) {
            Alert.alert(
              'OTP Expired', 
              'Your OTP has expired. Please request a new one.',
              [{ text: 'OK', onPress: () => router.back() }]
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [expiryTimer, router]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (value, index) => {
    // Handle paste operation - if more than 1 character is entered
    if (value.length > 1) {
      // Extract only numeric characters
      const numericValue = value.replace(/\D/g, '');
      
      if (numericValue.length >= 1 && numericValue.length <= 6) {
        const newOtp = ['', '', '', '', '', ''];
        
        // Fill the OTP array with pasted digits starting from the current index
        for (let i = 0; i < Math.min(numericValue.length, 6 - index); i++) {
          newOtp[index + i] = numericValue[i];
        }
        
        // If pasting from first field and we have remaining digits, fill from start
        if (index === 0 && numericValue.length <= 6) {
          for (let i = 0; i < Math.min(numericValue.length, 6); i++) {
            newOtp[i] = numericValue[i];
          }
        }
        
        setOtp(newOtp);
        setError('');
        
        // Focus the next empty field or the last filled field
        const lastFilledIndex = Math.min(index + numericValue.length - 1, 5);
        const nextEmptyIndex = newOtp.findIndex((digit, i) => digit === '' && i > lastFilledIndex);
        
        if (nextEmptyIndex !== -1) {
          setTimeout(() => otpRefs.current[nextEmptyIndex]?.focus(), 50);
        } else {
          setTimeout(() => otpRefs.current[Math.min(lastFilledIndex + 1, 5)]?.focus(), 50);
        }
        
        // Auto-verify if all 6 digits are filled
        if (newOtp.every(digit => digit !== '')) {
          setTimeout(() => {
            handleVerifyOtp(newOtp.join(''));
          }, 300);
        }
        return;
      }
    }

    // Handle single character input
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered manually
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      setTimeout(() => {
        handleVerifyOtp(newOtp.join(''));
      }, 200);
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpCode = null) => {
    const fullOtp = otpCode || otp.join('');
    
    if (fullOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    if (expiryTimer <= 0) {
      setError('OTP has expired. Please request a new one.');
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      const verificationData = type === 'whatsapp' 
        ? { phone: contact, otp: fullOtp }
        : { email: contact, otp: fullOtp };

      const response = await verifyOtpCode(verificationData);

      if (response.success) {
        if (response.isNewUser && response.profileIncomplete) {
          // New user needs to complete profile
          router.replace({
            pathname: '/complete-profile',
            params: {
              contact,
              type,
              isNewUser: 'true'
            }
          });
        } else {
          // Existing user or profile complete - go to dashboard
          router.replace('/tabs');
        }
      } else {
        setError(response.message || 'Invalid OTP. Please try again.');
        // Clear OTP inputs on error
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      }
    } catch (err) {
      if (err.errors) {
        const errorMessages = Object.values(err.errors).flat().join('\n');
        setError(errorMessages);
      } else {
        setError(err.message || 'Verification failed. Please try again.');
      }
      // Clear OTP inputs on error
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      setError('');

      const contactData = type === 'whatsapp' 
        ? { phone: contact }
        : { email: contact };

      const response = await sendOtpCode(contactData);

      if (response.success) {
        setTimer(60);
        setCanResend(false);
        setExpiryTimer(180); // Reset expiry timer
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
        Alert.alert('Success', 'OTP sent successfully!');
      } else {
        setError(response.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  const formatContact = (contact, type) => {
    if (type === 'whatsapp') {
      return contact.replace(/(\d{5})(\d{5})/, '$1-$2');
    }
    return contact;
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient
        colors={['#091429', '#0F2248', '#162F65']}
        style={styles.background}
      />
      
      <StatusBar style="light" />
      
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Enter OTP</Text>
              <Text style={styles.headerSubtitle}>
                Sent to {type === 'whatsapp' ? 'WhatsApp' : 'Email'}
              </Text>
            </View>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.contactInfo}>
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={type === 'whatsapp' ? 'logo-whatsapp' : 'mail-outline'} 
                  size={32} 
                  color={type === 'whatsapp' ? '#25D366' : '#38BFA7'} 
                />
              </View>
              <Text style={styles.contactText}>
                {formatContact(contact, type)}
              </Text>
              <Text style={styles.instructionText}>
                {type === 'whatsapp' 
                  ? 'Please check your WhatsApp for the 6-digit code'
                  : 'Please check your email for the 6-digit code'
                }
              </Text>
            </View>

            {/* Expiry Timer */}
            <View style={styles.expiryContainer}>
              <Ionicons name="time-outline" size={16} color={expiryTimer <= 30 ? '#ff5656' : '#a0c0ff'} />
              <Text style={[
                styles.expiryText,
                expiryTimer <= 30 && styles.expiryTextWarning
              ]}>
                Code expires in {formatTime(expiryTimer)}
              </Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={20} color="#ff5656" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => otpRefs.current[index] = ref}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                    error && styles.otpInputError
                  ]}
                  value={digit}
                  onChangeText={value => handleOtpChange(value, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={index === 0 ? 6 : 1}
                  selectTextOnFocus
                  textAlign="center"
                  autoFocus={index === 0}
                  contextMenuHidden={false}
                />
              ))}
            </View>

            <LinearGradient
              colors={['#2C7BE5', '#38BFA7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={() => handleVerifyOtp()}
                disabled={isLoading || otp.join('').length !== 6}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.verifyButtonText}>Verify & Continue</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>

            <View style={styles.resendContainer}>
              {!canResend ? (
                <View style={styles.timerContainer}>
                  <Ionicons name="refresh-outline" size={16} color="#a0c0ff" />
                  <Text style={styles.timerText}>
                    Resend OTP in {timer}s
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleResendOtp}
                  disabled={isResending}
                  activeOpacity={0.7}
                >
                  <Ionicons name="refresh-outline" size={16} color="#38BFA7" />
                  <Text style={styles.resendText}>
                    {isResending ? 'Sending...' : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.changeMethodButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="swap-horizontal-outline" size={16} color="#a0c0ff" />
              <Text style={styles.changeMethodText}>
                Change {type === 'whatsapp' ? 'phone number' : 'email address'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#a0c0ff',
    marginTop: 5,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  contactInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  contactText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#a0c0ff',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  expiryText: {
    color: '#a0c0ff',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  expiryTextWarning: {
    color: '#ff5656',
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
    width: '100%',
  },
  errorText: {
    color: '#ff5656',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    width: '100%',
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 48,
    height: 58,
    borderWidth: 2,
    borderColor: 'rgba(160, 192, 255, 0.3)',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: '#38BFA7',
    backgroundColor: 'rgba(56, 191, 167, 0.1)',
    transform: [{ scale: 1.05 }],
  },
  otpInputError: {
    borderColor: '#ff5656',
    backgroundColor: 'rgba(255, 86, 86, 0.1)',
  },
  buttonGradient: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#2C7BE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  verifyButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    color: '#a0c0ff',
    fontSize: 14,
    marginLeft: 6,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(56, 191, 167, 0.1)',
  },
  resendText: {
    color: '#38BFA7',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  changeMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  changeMethodText: {
    color: '#a0c0ff',
    fontSize: 14,
    marginLeft: 6,
  },
});