// api/auth.js
import axios from 'axios';
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

export const updatePatientProfile = async (formData, token) => {
  try {
    // Create a custom axios instance for this specific request
    const formDataInstance = axios.create({
      baseURL: environment.apiUrl,
      timeout: 360000, // Increase timeout for file uploads
    });
    
    // Add the same interceptors for debugging
    formDataInstance.interceptors.request.use(request => {
      console.log('FormData Request:', request.method, request.url);
      console.log('FormData Headers:', request.headers);
      // Don't log the formdata contents as it won't display properly
      console.log('FormData being sent');
      return request;
    });
    
    formDataInstance.interceptors.response.use(
      response => {
        console.log('FormData Response received:', response.status);
        console.log('FormData Response data:', response.data);
        return response;
      },
      error => {
        console.log('FormData API Error:', error.message);
        if (error.response) {
          console.log('FormData Error data:', error.response.data);
          console.log('FormData Error status:', error.response.status);
        }
        return Promise.reject(error);
      }
    );

    let headers = {
      Authorization: `Bearer ${token}`,
    };
    
    let data;
    let config;
    
// Inside updatePatientProfile function when handling FormData
if (formData instanceof FormData) {
  // Do NOT explicitly set Content-Type for multipart/form-data
  headers['Accept'] = 'application/json';
  
  // Log FormData contents
  try {
    for (let pair of formData.entries()) {
      if (pair[0] === 'profile_photo' && pair[1] && pair[1].uri) {
        console.log(`FormData entry: ${pair[0]} = [File object - uri: ${pair[1].uri.substring(0, 20)}..., type: ${pair[1].type}]`);
      } else {
        console.log(`FormData entry: ${pair[0]} = ${pair[1]}`);
      }
    }
  } catch (err) {
    console.log('Could not log FormData entries:', err);
  }
  
  // Important: Use POST method for file uploads
  config = {
    method: 'post',
    url: '/patient/profile',
    headers: headers,
    data: formData,
    // Do not transform FormData
    transformRequest: data => data,
  };
  
  // Send the request
  const response = await formDataInstance(config);
  return response.data;
} else {
      // For regular JSON data
      headers['Content-Type'] = 'application/json';
      data = formData;
      
      // Use the regular api instance
      const response = await api.put('/patient/profile', data, { headers });
      return response.data;
    }
  } catch (error) {
    console.error('Profile update error:', error.response?.data || error.message);
    if (error.response) {
      throw error.response.data || { message: 'Server error' };
    } else {
      throw { message: 'Network error' };
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