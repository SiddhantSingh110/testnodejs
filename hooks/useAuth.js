// hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { loginPatient, registerPatient, fetchPatientProfile, sendOtp, verifyOtp, completeProfile } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load token and user data on startup
    async function loadStoredData() {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedUser = await SecureStore.getItemAsync('userData');
        
        if (storedToken) {
          setToken(storedToken);
          
          // First, set stored user data if available
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
            } catch (parseError) {
              console.error('Failed to parse stored user data:', parseError);
            }
          }
          
          // Then try to fetch fresh user data from server
          try {
            const userData = await fetchPatientProfile(storedToken);
            const userToStore = userData.user || userData;
            setUser(userToStore);
            
            // Update stored user data with fresh data
            await SecureStore.setItemAsync('userData', JSON.stringify(userToStore));
          } catch (fetchError) {
            console.error('Failed to fetch fresh user data:', fetchError);
            // If stored user data exists, we continue with it
            // If not, we'll fall back to login
            if (!storedUser) {
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load authentication data:', error);
        // Clear potentially corrupted data
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
      } finally {
        setLoading(false);
      }
    }
    
    loadStoredData();
  }, []);

  // Helper function to store both token and user data
  const storeAuthData = async (token, userData) => {
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('userData', JSON.stringify(userData));
  };

  // 🚀 NEW: Unified OTP Authentication Functions

  const sendOtpCode = async (contact) => {
    try {
      const response = await sendOtp(contact);
      return response;
    } catch (error) {
      console.error('Send OTP error', error);
      throw error;
    }
  };

  const verifyOtpCode = async (otpData) => {
    try {
      const response = await verifyOtp(otpData);
      
      if (response.success && response.token) {
        // Store both token and user data
        await storeAuthData(response.token, response.user);
        
        // Update state
        setToken(response.token);
        setUser(response.user);
        
        return {
          success: true,
          isNewUser: response.is_new_user,
          profileIncomplete: response.profile_incomplete,
          user: response.user,
          message: response.message
        };
      }
      
      return response;
    } catch (error) {
      console.error('OTP verification error', error);
      throw error;
    }
  };

  const completeUserProfile = async (profileData) => {
    try {
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const response = await completeProfile(profileData, token);
      
      if (response.success) {
        // Update both state and storage with completed profile
        setUser(response.user);
        await SecureStore.setItemAsync('userData', JSON.stringify(response.user));
        return response;
      }
      
      return response;
    } catch (error) {
      console.error('Profile completion error', error);
      throw error;
    }
  };

  // 📧 Legacy: Traditional Authentication Functions

  const signIn = async (phone, password) => {
    try {
      const response = await loginPatient(phone, password);
      
      // Store both token and user data
      await storeAuthData(response.token, response.user);
      
      // Update state
      setToken(response.token);
      setUser(response.user);
      
      return true;
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await registerPatient(userData);
      
      // Store both token and user data
      await storeAuthData(response.token, response.user);
      
      // Update state
      setToken(response.token);
      setUser(response.user);
      
      return true;
    } catch (error) {
      console.error('Registration error', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Remove both token and user data from storage
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      
      // Clear state
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error', error);
    }
  };
  
  // Function to update user info in context
  const updateUserInfo = async (updatedUser) => {
    console.log('Updating user info in context:', updatedUser);
    // Update both state and storage
    setUser(updatedUser);
    try {
      await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to store updated user data:', error);
    }
  };

  // Function to refresh user profile from the server
  const refreshUserProfile = async () => {
    if (!token) return false;
    
    try {
      setLoading(true);
      const userData = await fetchPatientProfile(token);
      const userToStore = userData.user || userData;
      setUser(userToStore);
      
      // Update stored user data
      await SecureStore.setItemAsync('userData', JSON.stringify(userToStore));
      return true;
    } catch (error) {
      console.error('Failed to refresh user profile', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        loading, 
        // Legacy functions
        signIn, 
        signUp, 
        signOut, 
        updateUserInfo,
        refreshUserProfile,
        isAuthenticated: !!token,
        // NEW: Unified OTP functions
        sendOtpCode,
        verifyOtpCode,
        completeUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;