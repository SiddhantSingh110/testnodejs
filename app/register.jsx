import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { signUp } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    if (!name || !phone || !password || !confirmPassword) {
      setError('All fields except email are required');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setError('');
      setIsLoading(true);
      
      const userData = {
        name,
        phone,
        email: email || undefined, // Don't send empty email
        password,
      };
      
      await signUp(userData);
      router.replace('/tabs');
    } catch (err) {
      if (err.errors) {
        // Format validation errors from Laravel
        const errorMessages = Object.values(err.errors).flat().join('\n');
        setError(errorMessages);
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
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
            <Text style={styles.headerTitle}>Create Account</Text>
          </View>
          
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/health_logo_splash.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={20} color="#ff5656" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#6d88b7"
                value={name}
                onChangeText={setName}
                autoComplete="name"
                textContentType="name"
                autoCapitalize="words"
              />
            </View>
            
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#6d88b7"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                autoComplete="tel"
                textContentType="telephoneNumber"
              />
            </View>
            
            <Text style={styles.inputLabel}>Email (Optional)</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor="#6d88b7"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                autoComplete="email"
                textContentType="emailAddress"
              />
            </View>
            
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#6d88b7"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoComplete="new-password"
                textContentType="newPassword"
                passwordRules="minlength: 6;"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={22} 
                  color="#a0c0ff" 
                />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#a0c0ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#6d88b7"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoComplete="new-password"
                textContentType="newPassword"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                  size={22} 
                  color="#a0c0ff" 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.policyContainer}>
              <Text style={styles.policyText}>
                By signing up, you agree to our{" "}
                <Text style={styles.policyLink}>Terms of Service</Text> and{" "}
                <Text style={styles.policyLink}>Privacy Policy</Text>
              </Text>
            </View>
            
            <LinearGradient
              colors={['#2C7BE5', '#38BFA7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  logo: {
    width: 150,
    height: 40,
    display: 'none',
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
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(160, 192, 255, 0.2)',
    // Fix for autofill styling
    overflow: 'hidden',
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    // Override autofill colors
    backgroundColor: 'transparent',
    ...(Platform.OS === 'ios' && {
      // iOS specific autofill styling
      textShadowColor: 'transparent',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 0,
    }),
    ...(Platform.OS === 'android' && {
      // Android specific autofill styling
      backgroundImage: 'none',
      boxShadow: 'none',
    }),
  },
  eyeIcon: {
    padding: 12,
  },
  policyContainer: {
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  policyText: {
    color: '#a0c0ff',
    lineHeight: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  policyLink: {
    color: '#38BFA7',
    fontWeight: '500',
  },
  buttonGradient: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 25,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  footerText: {
    color: '#a0c0ff',
    fontSize: 16,
  },
  signInText: {
    color: '#38BFA7',
    fontSize: 16,
    fontWeight: '600',
  }
});