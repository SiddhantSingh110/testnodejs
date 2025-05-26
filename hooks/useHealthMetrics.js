//hooks/useHealthMetrics.js
import { useState, useEffect, useCallback } from 'react';
import healthMetricsAPI from '../services/HealthMetricsAPI';

/**
 * Custom hook for managing health metrics data
 */
export function useHealthMetrics() {
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch all metrics
   */
  const fetchMetrics = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Initialize API token if needed
      await healthMetricsAPI.init();
      
      // Fetch metrics from API - this returns transformed data
      const transformedData = await healthMetricsAPI.getMetrics(filters);
      
      setMetrics(transformedData);
    } catch (err) {
      setError(err.message || 'Failed to fetch metrics');
      console.error('Error in fetchMetrics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh metrics (for pull-to-refresh)
   */
  const refreshMetrics = useCallback(async (filters = {}) => {
    setRefreshing(true);
    setError(null);

    try {
      await healthMetricsAPI.init();
      const transformedData = await healthMetricsAPI.getMetrics(filters);
      setMetrics(transformedData);
    } catch (err) {
      setError(err.message || 'Failed to refresh metrics');
      console.error('Error in refreshMetrics:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  /**
   * Add new metric
   */
  const addMetric = useCallback(async (metricData) => {
    try {
      await healthMetricsAPI.init();
      const response = await healthMetricsAPI.createMetric(metricData);
      
      if (response.success) {
        // Refresh metrics after adding
        await fetchMetrics();
        return { success: true };
      } else {
        return { success: false, error: 'Failed to add metric' };
      }
    } catch (err) {
      console.error('Error in addMetric:', err);
      return { success: false, error: err.message || 'Failed to add metric' };
    }
  }, [fetchMetrics]);

  /**
   * Delete metric
   */
  const deleteMetric = useCallback(async (metricId) => {
    try {
      await healthMetricsAPI.init();
      const response = await healthMetricsAPI.deleteMetric(metricId);
      
      if (response.success) {
        // Refresh metrics after deleting
        await fetchMetrics();
        return { success: true };
      } else {
        return { success: false, error: 'Failed to delete metric' };
      }
    } catch (err) {
      console.error('Error in deleteMetric:', err);
      return { success: false, error: err.message || 'Failed to delete metric' };
    }
  }, [fetchMetrics]);

  // Load metrics on mount
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refreshing,
    fetchMetrics,
    refreshMetrics,
    addMetric,
    deleteMetric,
  };
}

/**
 * Custom hook for managing metric trends
 */
export function useMetricTrends(metricType) {
  const [trends, setTrends] = useState({
    count: 0,
    latest: null,
    average: null,
    trend: [],
    reference_range: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrends = useCallback(async (timeframe = 'month') => {
    if (!metricType) return;

    setLoading(true);
    setError(null);

    try {
      await healthMetricsAPI.init();
      const response = await healthMetricsAPI.getTrends(metricType, timeframe);
      
      setTrends(response);
    } catch (err) {
      setError(err.message || 'Failed to fetch trends');
      console.error('Error in fetchTrends:', err);
    } finally {
      setLoading(false);
    }
  }, [metricType]);

  // Load trends when metric type changes
  useEffect(() => {
    if (metricType) {
      fetchTrends();
    }
  }, [metricType, fetchTrends]);

  return {
    trends,
    loading,
    error,
    fetchTrends,
  };
}

/**
 * Custom hook for health insights
 */
export function useHealthInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await healthMetricsAPI.init();
      const insights = await healthMetricsAPI.getInsights();
      setInsights(insights);
    } catch (err) {
      setError(err.message || 'Failed to fetch insights');
      console.error('Error in fetchInsights:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load insights on mount
  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    loading,
    error,
    fetchInsights,
  };
}
/**
 * Custom hook for health metrics filters
 */