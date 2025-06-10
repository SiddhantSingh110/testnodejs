// services/HealthMetricsAPI.js - Enhanced for VPS connectivity
import * as SecureStore from 'expo-secure-store';
import environment from '../config/environment';

class HealthMetricsAPI {
  constructor() {
    this.baseURL = environment.apiUrl;
    this.token = null;
    this.defaultTimeout = 45000; // 45 seconds for VPS
    this.retryCount = 3;
  }

  async init() {
    try {
      this.token = await SecureStore.getItemAsync('userToken');
      return this.token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Enhanced fetch with retry logic and better timeout handling
  async fetchWithRetry(url, options = {}, retryCount = 0) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          await this.clearToken();
          throw new Error('Authentication failed. Please login again.');
        }
        
        // Retry on server errors
        if (response.status >= 500 && retryCount < this.retryCount) {
          console.log(`Server error ${response.status}, retrying... (${retryCount + 1}/${this.retryCount})`);
          await this.delay(1000 * (retryCount + 1));
          return this.fetchWithRetry(url, options, retryCount + 1);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.error('Request timed out:', url);
        
        // Retry on timeout
        if (retryCount < this.retryCount) {
          console.log(`Timeout error, retrying... (${retryCount + 1}/${this.retryCount})`);
          await this.delay(2000 * (retryCount + 1)); // Longer delay for timeouts
          return this.fetchWithRetry(url, options, retryCount + 1);
        }
        
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      
      // Retry on network errors
      if (error.message.includes('fetch') && retryCount < this.retryCount) {
        console.log(`Network error, retrying... (${retryCount + 1}/${this.retryCount})`);
        await this.delay(1000 * (retryCount + 1));
        return this.fetchWithRetry(url, options, retryCount + 1);
      }
      
      console.error(`Request failed:`, error);
      throw error;
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async get(endpoint) {
    const url = `${this.baseURL}${endpoint}`;
    console.log(`📡 GET ${endpoint}`);
    const startTime = Date.now();
    
    try {
      const data = await this.fetchWithRetry(url, { method: 'GET' });
      const duration = Date.now() - startTime;
      console.log(`✅ GET ${endpoint} completed (${duration}ms)`);
      return data;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ GET ${endpoint} failed after ${duration}ms:`, error.message);
      throw error;
    }
  }

  async post(endpoint, data) {
    const url = `${this.baseURL}${endpoint}`;
    console.log(`📡 POST ${endpoint}`);
    const startTime = Date.now();
    
    try {
      const result = await this.fetchWithRetry(url, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const duration = Date.now() - startTime;
      console.log(`✅ POST ${endpoint} completed (${duration}ms)`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ POST ${endpoint} failed after ${duration}ms:`, error.message);
      throw error;
    }
  }

  // Enhanced getMetrics with fallback
  async getMetrics(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      const queryString = queryParams.toString();
      const endpoint = `/patient/metrics${queryString ? `?${queryString}` : ''}`;
      
      const response = await this.get(endpoint);
      
      console.log('✅ Health metrics loaded:', {
        total_metrics: response.summary?.total_metrics || 0,
        recent_metrics: response.summary?.recent_metrics || 0,
      });
      
      return response;
    } catch (error) {
      console.error('❌ Get metrics failed:', error.message);
      
      // Return fallback data instead of throwing
      if (error.message.includes('timeout') || error.message.includes('fetch')) {
        console.warn('⚠️ Returning fallback metrics data due to network issues');
        return {
          metrics: {},
          summary: {
            total_metrics: 0,
            recent_metrics: 0,
            metrics_by_category: {},
            metrics_by_source: { manual: 0, report: 0, device: 0 },
            unique_metric_types: 0,
          },
          ui_hints: {
            has_new_metrics: false,
            show_review_badges: false,
            has_report_metrics: false,
            categories_available: [],
          },
          filters_applied: filters,
          generated_at: new Date().toISOString(),
          fallback_data: true,
        };
      }
      
      throw error;
    }
  }

  // Keep existing methods but add fallback handling...
  async getRecentMetrics(days = 7) {
    try {
      const response = await this.get(`/patient/metrics/recent?days=${days}`);
      const dismissTime = await this.getTimelineDismissTime();
      
      const filteredTimeline = (response.timeline || []).filter(item => {
        if (item.type === 'report_extraction') {
          const itemTime = new Date(item.date).getTime();
          return itemTime > dismissTime;
        }
        return true;
      });

      return {
        ...response,
        timeline: filteredTimeline,
        has_new_items: filteredTimeline.length > 0
      };
    } catch (error) {
      console.error('❌ Get recent metrics failed:', error.message);
      
      // Return empty timeline on error
      return {
        timeline: [],
        summary: {
          total_recent: 0,
          from_reports: 0,
          manual_entries: 0,
          days_covered: days,
          latest_extraction: null,
        },
        has_new_items: false,
        fallback_data: true,
      };
    }
  }

  // Keep all other existing methods...
  async getTimelineDismissTime() {
    try {
      const dismissTime = await SecureStore.getItemAsync('timeline_dismiss_time');
      const parsedTime = dismissTime ? parseInt(dismissTime) : 0;
      
      if (isNaN(parsedTime) || parsedTime < 0) {
        console.warn('Invalid dismiss time found, resetting to 0');
        return 0;
      }
      
      return parsedTime;
    } catch (error) {
      console.error('Error getting timeline dismiss time:', error);
      return 0;
    }
  }

  async setTimelineDismissTime() {
    try {
      const now = Date.now();
      
      if (isNaN(now) || now <= 0) {
        throw new Error('Invalid timestamp generated');
      }
      
      await SecureStore.setItemAsync('timeline_dismiss_time', now.toString());
      console.log('✅ Timeline dismiss time saved:', new Date(now).toISOString());
      return true;
    } catch (error) {
      console.error('Error setting timeline dismiss time:', error);
      return false;
    }
  }

  async clearToken() {
    try {
      this.token = null;
      await SecureStore.deleteItemAsync('userToken');
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  // Missing methods that are called by your app
  async getInsights() {
    try {
      console.log('📊 Fetching health insights...');
      const response = await this.get('/patient/metrics/insights');
      return response.insights || [];
    } catch (error) {
      console.error('❌ Get insights failed:', error.message);
      
      // Return fallback insights
      return [];
    }
  }

  async createMetric(metricData) {
    try {
      const payload = {
        type: metricData.type,
        value: metricData.value,
        unit: metricData.unit,
        source: metricData.source || 'manual',
        context: metricData.context || 'general',
        notes: metricData.notes || '',
        measured_at: metricData.measured_at || new Date().toISOString()
      };
      
      const response = await this.post('/patient/metrics', payload);
      console.log('✅ New metric created:', response.metric?.type);
      
      return {
        success: true,
        metric: response.metric,
        message: response.message
      };
    } catch (error) {
      console.error('❌ Create metric failed:', error.message);
      throw error;
    }
  }

  async deleteMetric(metricId) {
    try {
      const response = await this.delete(`/patient/metrics/${metricId}`);
      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      console.error('❌ Delete metric failed:', error.message);
      throw error;
    }
  }

  async delete(endpoint) {
    const url = `${this.baseURL}${endpoint}`;
    console.log(`📡 DELETE ${endpoint}`);
    const startTime = Date.now();
    
    try {
      const result = await this.fetchWithRetry(url, {
        method: 'DELETE',
      });
      const duration = Date.now() - startTime;
      console.log(`✅ DELETE ${endpoint} completed (${duration}ms)`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ DELETE ${endpoint} failed after ${duration}ms:`, error.message);
      throw error;
    }
  }

  async getTrends(metricType, timeframe = 'month') {
    try {
      const response = await this.get(`/patient/metrics/trends/${metricType}?timeframe=${timeframe}`);
      return response;
    } catch (error) {
      console.error('❌ Get trends failed:', error.message);
      
      // Return fallback trends data
      return {
        count: 0,
        latest: null,
        average: null,
        trend: [],
        reference_range: null,
        fallback_data: true,
      };
    }
  }

  async markMetricsAsReviewed(metricIds) {
    try {
      const response = await this.post('/patient/metrics/mark-reviewed', {
        metric_ids: metricIds
      });
      console.log('✅ Metrics marked as reviewed:', response.updated_count);
      return response;
    } catch (error) {
      console.error('❌ Mark as reviewed failed:', error.message);
      throw error;
    }
  }

  async handleReportUploadComplete(uploadResponse) {
    try {
      console.log('🔍 UPLOAD RESPONSE RECEIVED:', {
        has_health_metrics: !!uploadResponse.health_metrics,
        health_metrics_keys: uploadResponse.health_metrics ? Object.keys(uploadResponse.health_metrics) : [],
        health_metrics_content: uploadResponse.health_metrics,
        has_extracted_details: !!uploadResponse.extracted_metrics_details,
        extracted_details_length: uploadResponse.extracted_metrics_details?.length || 0
      });

      if (!uploadResponse.health_metrics) {
        console.warn('❌ No health_metrics in upload response');
        return {
          shouldRefreshHealthScreen: false,
          metricsExtracted: 0,
          categoriesFound: [],
          extractedMetrics: [],
          summary: null
        };
      }

      const metricsExtracted = uploadResponse.health_metrics.total_extracted || 0;
      const newMetricsAvailable = uploadResponse.health_metrics.new_metrics_available || false;

      console.log('🔍 METRICS PROCESSING:', {
        metrics_extracted: metricsExtracted,
        new_metrics_available: newMetricsAvailable,
        categories_found: uploadResponse.health_metrics.categories_found,
        should_refresh: newMetricsAvailable
      });

      if (newMetricsAvailable && metricsExtracted > 0) {
        console.log('✅ New health metrics detected - health screen should refresh');
        
        return {
          shouldRefreshHealthScreen: true,
          metricsExtracted: metricsExtracted,
          categoriesFound: uploadResponse.health_metrics.categories_found || [],
          extractedMetrics: uploadResponse.extracted_metrics_details || [],
          summary: uploadResponse.health_metrics.metrics_summary
        };
      }

      console.log('❌ No new metrics to process');
      return {
        shouldRefreshHealthScreen: false,
        metricsExtracted: 0,
        categoriesFound: [],
        extractedMetrics: [],
        summary: null
      };
    } catch (error) {
      console.error('❌ Handle report upload complete failed:', error);
      return {
        shouldRefreshHealthScreen: false,
        metricsExtracted: 0,
        categoriesFound: [],
        extractedMetrics: [],
        summary: null
      };
    }
  }

  async setToken(token) {
    try {
      this.token = token;
      await SecureStore.setItemAsync('userToken', token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }
}

const healthMetricsAPI = new HealthMetricsAPI();
export default healthMetricsAPI;