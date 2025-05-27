import * as SecureStore from 'expo-secure-store';

class HealthMetricsAPI {
  constructor() {
    this.baseURL = 'http://192.168.0.112:8001/api';
    this.token = null;
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

  async setToken(token) {
    try {
      this.token = token;
      await SecureStore.setItemAsync('userToken', token);
    } catch (error) {
      console.error('Error storing token:', error);
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
// ✨ FIXED: AsyncStorage helpers for timeline persistence
async getTimelineDismissTime() {
  try {
    const dismissTime = await SecureStore.getItemAsync('timeline_dismiss_time');
    const parsedTime = dismissTime ? parseInt(dismissTime) : 0;
    
    // Validate the timestamp
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
    
    // Validate timestamp before storing
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

  async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        await this.clearToken();
        throw new Error('Authentication failed. Please login again.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }
    return response.json();
  }

  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }

  // ✨ Enhanced: Get metrics with full metadata
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
      
      console.log('✅ Health metrics loaded with metadata:', {
        total_metrics: response.summary?.total_metrics || 0,
        recent_metrics: response.summary?.recent_metrics || 0,
        has_report_metrics: response.ui_hints?.has_report_metrics || false,
        unique_types: response.summary?.unique_metric_types || 0
      });
      
      return response;
    } catch (error) {
      console.error('Get metrics failed:', error);
      throw error;
    }
  }

  // ✨ Enhanced: Get recent metrics with dismiss time check
  async getRecentMetrics(days = 7) {
    try {
      const response = await this.get(`/patient/metrics/recent?days=${days}`);
      const dismissTime = await this.getTimelineDismissTime();
      
      // Filter timeline items based on dismiss time
      const filteredTimeline = (response.timeline || []).filter(item => {
        if (item.type === 'report_extraction') {
          const itemTime = new Date(item.date).getTime();
          return itemTime > dismissTime; // Only show if newer than last dismiss
        }
        return true; // Keep manual entries
      });

      console.log('✅ Recent metrics loaded:', {
        total: response.timeline?.length || 0,
        filtered: filteredTimeline.length,
        dismiss_time: new Date(dismissTime).toISOString()
      });
      
      return {
        ...response,
        timeline: filteredTimeline,
        has_new_items: filteredTimeline.length > 0
      };
    } catch (error) {
      console.error('Get recent metrics failed:', error);
      throw error;
    }
  }

  // ✨ New: Mark metrics as reviewed (remove review badges)
  async markMetricsAsReviewed(metricIds) {
    try {
      const response = await this.post('/patient/metrics/mark-reviewed', {
        metric_ids: metricIds
      });
      console.log('✅ Metrics marked as reviewed:', response.updated_count);
      return response;
    } catch (error) {
      console.error('Mark as reviewed failed:', error);
      throw error;
    }
  }

  async getInsights() {
    try {
      const response = await this.get('/patient/metrics/insights');
      return response.insights || [];
    } catch (error) {
      console.error('Get insights failed:', error);
      throw error;
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
      console.error('Create metric failed:', error);
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
      console.error('Delete metric failed:', error);
      throw error;
    }
  }

  // ✨ Enhanced: Get trends with reference ranges
  async getTrends(metricType, timeframe = 'month') {
    try {
      const response = await this.get(`/patient/metrics/trends/${metricType}?timeframe=${timeframe}`);
      return response;
    } catch (error) {
      console.error('Get trends failed:', error);
      throw error;
    }
  }

    // ✨ Enhanced: Handle report upload with better metrics integration
  // ✨ DEBUG: Handle report upload with extensive logging
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

      // If new metrics were extracted, we should refresh the health screen
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
}

const healthMetricsAPI = new HealthMetricsAPI();
export default healthMetricsAPI;