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

  // ✨ New: Get recent metrics for timeline
  async getRecentMetrics(days = 7) {
    try {
      const response = await this.get(`/patient/metrics/recent?days=${days}`);
      console.log('✅ Recent metrics loaded:', response.summary);
      return response;
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

  // ✨ New: Helper to process upload response and refresh metrics
  async handleReportUploadComplete(uploadResponse) {
    try {
      console.log('📊 Processing report upload response:', {
        metrics_extracted: uploadResponse.health_metrics?.total_extracted || 0,
        categories_found: uploadResponse.health_metrics?.categories_found || [],
        new_metrics_available: uploadResponse.health_metrics?.new_metrics_available || false
      });

      // If new metrics were extracted, we can optionally refresh the metrics cache
      if (uploadResponse.health_metrics?.new_metrics_available) {
        console.log('🔄 New health metrics detected, consider refreshing health screen');
        
        // Return helpful info for the UI
        return {
          shouldRefreshHealthScreen: true,
          metricsExtracted: uploadResponse.health_metrics.total_extracted,
          categoriesFound: uploadResponse.health_metrics.categories_found,
          extractedMetrics: uploadResponse.extracted_metrics_details || []
        };
      }

      return {
        shouldRefreshHealthScreen: false,
        metricsExtracted: 0,
        categoriesFound: [],
        extractedMetrics: []
      };
    } catch (error) {
      console.error('Handle report upload complete failed:', error);
      return {
        shouldRefreshHealthScreen: false,
        metricsExtracted: 0,
        categoriesFound: [],
        extractedMetrics: []
      };
    }
  }
}

const healthMetricsAPI = new HealthMetricsAPI();
export default healthMetricsAPI;