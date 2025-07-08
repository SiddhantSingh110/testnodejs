// api/auth.js
import axios from 'axios';
import { Platform } from 'react-native';
import environment from '../config/environment';

// Create API instance with your backend URL
const api = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 360000, // Add a timeout to prevent hanging requests
});

// Debugging interceptor - add this to see what's happening with requests
api.interceptors.request.use(request => {
  //console.log('Starting API Request:', request.method, request.url);
  //console.log('Request headers:', request.headers);
  //console.log('Request data:', request.data);
  return request;
});

api.interceptors.response.use(
  response => {
    //console.log('Response received:', response.status);
    //console.log('Response data:', response.data);
    return response;
  },
  error => {
    //console.log('API Error:', error.message);
    if (error.response) {
      //console.log('Error data:', error.response.data);
      //console.log('Error status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

// 🚀 NEW: Unified OTP Authentication Functions

export const sendOtp = async (contact) => {
  try {
    console.log('Sending OTP to:', contact);
    const response = await api.post('/send-otp', contact);
    return response.data;
  } catch (error) {
    console.error('Send OTP failed:', error.message);
    if (error.response) {
      throw error.response.data || { message: 'Server error' };
    } else if (error.request) {
      throw { message: 'Network error - no response from server' };
    } else {
      throw { message: 'Network error' };
    }
  }
};

export const verifyOtp = async (otpData) => {
  try {
    console.log('Verifying OTP:', otpData);
    const response = await api.post('/verify-otp', otpData);
    return response.data;
  } catch (error) {
    console.error('OTP verification failed:', error.message);
    if (error.response) {
      throw error.response.data || { message: 'Server error' };
    } else if (error.request) {
      throw { message: 'Network error - no response from server' };
    } else {
      throw { message: 'Network error' };
    }
  }
};

export const completeProfile = async (profileData, token) => {
  try {
    console.log('Completing profile:', profileData);
    const response = await api.post('/complete-profile', profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Profile completion failed:', error.message);
    if (error.response) {
      throw error.response.data || { message: 'Server error' };
    } else {
      throw { message: 'Network error' };
    }
  }
};

// 📧 Legacy: Existing Authentication Functions

export const loginPatient = async (phone, password) => {
  try {
    console.log('Attempting to login with phone:', phone);
    const response = await api.post('/patient/login', { phone, password });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.message);
    if (error.response) {
      throw error.response.data || { message: 'Server error' };
    } else if (error.request) {
      // Request was made but no response received
      throw { message: 'Network error - no response from server' };
    } else {
      throw { message: 'Network error' };
    }
  }
};

export const registerPatient = async (userData) => {
  try {
    const response = await api.post('/patient/register', userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data || { message: 'Server error' };
    } else {
      throw { message: 'Network error' };
    }
  }
};

export const fetchPatientProfile = async (token) => {
  try {
    const response = await api.get('/patient/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data || { message: 'Server error' };
    } else {
      throw { message: 'Network error' };
    }
  }
};

// 🔄 ENHANCED: updatePatientProfile with improved FormData handling
export const updatePatientProfile = async (formData, token) => {
  try {
    // Handle FormData requests (with or without files)
    if (formData instanceof FormData) {
      // Use native Fetch API for better FormData support on Android/iOS
      const response = await fetch(`${environment.apiUrl}/patient/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // Do NOT set Content-Type for FormData - let fetch handle it automatically
        },
        body: formData,
        timeout: 60000, // 60 seconds timeout
      });
      
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${errorText}`);
      }
    } else {
      // Handle regular JSON data with Axios
      const response = await api.put('/patient/profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      return response.data;
    }
  } catch (error) {
    console.error('Profile update error:', error.message);
    
    // Provide user-friendly error messages
    if (error.message.includes('Network request failed')) {
      throw { message: 'Network connection failed. Please check your internet connection.' };
    } else if (error.message.includes('timeout')) {
      throw { message: 'Request timed out. Please try again.' };
    } else if (error.response) {
      throw error.response.data || { message: 'Server error' };
    } else {
      throw { message: `Network error: ${error.message}` };
    }
  }
};

export const fetchReports = async (token) => {
  try {
    const response = await api.get('/patient/reports', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.reports;
  } catch (error) {
    console.error('Failed to fetch reports:', error.message);
    throw error;
  }
};

export default api;