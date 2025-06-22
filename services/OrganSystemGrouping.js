// services/OrganSystemGrouping.js
export const ORGAN_SYSTEMS = {
    heart: {
      name: 'Heart Health',
      icon: 'heart',
      color: '#FF6B6B',
      description: 'Cardiovascular system and blood lipids',
      metrics: ['hdl', 'ldl', 'total_cholesterol', 'triglycerides', 'vldl', 'non_hdl_cholesterol', 'blood_pressure', 'troponin', 'ck_mb', 'bnp'],
      priority: ['ldl', 'hdl', 'total_cholesterol', 'triglycerides', 'blood_pressure', 'vldl', 'troponin', 'ck_mb', 'bnp']
    },
    blood: {
      name: 'Blood Health', 
      icon: 'water',
      color: '#E74C3C',
      description: 'Blood count, glucose, and circulation',
      metrics: ['hemoglobin', 'hematocrit', 'rbc_count', 'wbc_count', 'platelet_count', 'glucose_fasting', 'blood_sugar', 'hba1c', 'sodium', 'potassium', 'chloride'],
      priority: ['hba1c', 'glucose_fasting', 'hemoglobin', 'hematocrit', 'wbc_count', 'platelet_count', 'rbc_count', 'sodium', 'potassium', 'chloride']
    },
    kidney: {
      name: 'Kidney Health',
      icon: 'medical',
      color: '#3498DB', 
      description: 'Kidney function and waste filtration',
      metrics: ['creatinine', 'blood_urea_nitrogen', 'bun', 'uric_acid', 'egfr'],
      priority: ['creatinine', 'egfr', 'blood_urea_nitrogen', 'bun', 'uric_acid']
    },
    liver: {
      name: 'Liver Health',
      icon: 'leaf',
      color: '#27AE60',
      description: 'Liver function and detoxification',
      metrics: ['alt', 'ast', 'alp', 'bilirubin', 'total_bilirubin', 'direct_bilirubin', 'indirect_bilirubin'],
      priority: ['alt', 'ast', 'alp', 'bilirubin', 'total_bilirubin', 'direct_bilirubin', 'indirect_bilirubin']
    },
    thyroid: {
      name: 'Thyroid Health',
      icon: 'fitness',
      color: '#9B59B6',
      description: 'Thyroid hormones and metabolism',
      metrics: ['tsh', 't3', 't4', 'free_t3', 'free_t4'],
      priority: ['tsh', 'free_t4', 'free_t3', 't4', 't3']
    },
    vitamins: {
      name: 'Vitamins & Minerals',
      icon: 'nutrition',
      color: '#F39C12',
      description: 'Essential vitamins and minerals',
      metrics: ['vitamin_d', 'vitamin_b12', 'vitamin_b6', 'folate', 'iron', 'ferritin', 'tibc', 'vitamin_c', 'vitamin_e', 'zinc', 'magnesium', 'calcium'],
      priority: ['vitamin_d', 'vitamin_b12', 'iron', 'ferritin', 'folate', 'vitamin_b6', 'calcium', 'magnesium', 'zinc', 'vitamin_c', 'vitamin_e', 'tibc']
    }
  };
  
  /**
   * Groups individual health metrics by organ system
   * @param {Object} metricsData - Response from healthMetricsAPI.getMetrics()
   * @returns {Object} Grouped metrics by organ system
   */
  export function groupMetricsByOrganSystem(metricsData) {
    if (!metricsData || !metricsData.metrics) {
      console.warn('No metrics data provided for organ grouping');
      return {};
    }
  
    const organHealth = {};
    
    // Initialize organ systems
    Object.keys(ORGAN_SYSTEMS).forEach(organKey => {
      organHealth[organKey] = {
        system: ORGAN_SYSTEMS[organKey],
        metrics: [],
        latestMetrics: {},
        score: null,
        status: 'normal',
        lastUpdated: null,
        hasData: false
      };
    });
  
    // Process each metric type
    Object.entries(metricsData.metrics).forEach(([metricType, metricValues]) => {
      if (!Array.isArray(metricValues) || metricValues.length === 0) {
        return;
      }
  
      // Find which organ system this metric belongs to
      const organKey = findOrganSystemForMetric(metricType);
      if (!organKey) {
        console.log(`Metric ${metricType} not mapped to any organ system`);
        return;
      }
  
      // Add metrics to the appropriate organ system
      organHealth[organKey].metrics.push(...metricValues);
      
      // Store latest metric for quick access
      const latest = metricValues[0]; // Metrics should be sorted by date desc
      organHealth[organKey].latestMetrics[metricType] = latest;
      organHealth[organKey].hasData = true;
      
      // Update last updated time
      const metricDate = new Date(latest.date);
      if (!organHealth[organKey].lastUpdated || metricDate > new Date(organHealth[organKey].lastUpdated)) {
        organHealth[organKey].lastUpdated = latest.date;
      }
    });
  
    // Calculate health scores and overall status for each organ system
    Object.keys(organHealth).forEach(organKey => {
      if (organHealth[organKey].hasData) {
        const scoreData = calculateOrganHealthScore(organHealth[organKey]);
        organHealth[organKey].score = scoreData.score;
        organHealth[organKey].status = scoreData.status;
        organHealth[organKey].primaryMetric = scoreData.primaryMetric;
      }
    });
  
    // Filter out organ systems without data
    const filteredOrganHealth = {};
    Object.keys(organHealth).forEach(organKey => {
      if (organHealth[organKey].hasData) {
        filteredOrganHealth[organKey] = organHealth[organKey];
      }
    });
  
    console.log('✅ Organ grouping completed:', {
      totalOrganSystems: Object.keys(filteredOrganHealth).length,
      organSystems: Object.keys(filteredOrganHealth),
      totalMetrics: Object.values(filteredOrganHealth).reduce((sum, organ) => sum + organ.metrics.length, 0)
    });
  
    return filteredOrganHealth;
  }
  
  /**
   * Find which organ system a metric belongs to
   */
  function findOrganSystemForMetric(metricType) {
    for (const [organKey, organSystem] of Object.entries(ORGAN_SYSTEMS)) {
      if (organSystem.metrics.includes(metricType)) {
        return organKey;
      }
    }
    return null;
  }
  
  /**
   * Calculate health score for an organ system
   */
  function calculateOrganHealthScore(organData) {
    const { system, latestMetrics } = organData;
    
    if (Object.keys(latestMetrics).length === 0) {
      return { score: null, status: 'normal', primaryMetric: null };
    }
  
    let totalScore = 0;
    let weightedTotal = 0;
    let highestPriorityMetric = null;
    let worstStatus = 'normal';
  
    // Calculate weighted average based on priority
    Object.entries(latestMetrics).forEach(([metricType, metric]) => {
      const priorityIndex = system.priority.indexOf(metricType);
      const weight = priorityIndex >= 0 ? (system.priority.length - priorityIndex) : 1;
      
      // Convert status to numeric score
      const metricScore = getNumericScore(metric.status);
      totalScore += metricScore * weight;
      weightedTotal += weight;
      
      // Track highest priority metric
      if (!highestPriorityMetric || priorityIndex < system.priority.indexOf(highestPriorityMetric.type)) {
        if (priorityIndex >= 0) {
          highestPriorityMetric = { ...metric, type: metricType };
        }
      }
      
      // Track worst status
      if (getStatusSeverity(metric.status) > getStatusSeverity(worstStatus)) {
        worstStatus = metric.status;
      }
    });
  
    const averageScore = weightedTotal > 0 ? Math.round(totalScore / weightedTotal) : 100;
    
    // Use fallback if no priority-based metric found
    if (!highestPriorityMetric) {
      const firstMetric = Object.entries(latestMetrics)[0];
      highestPriorityMetric = { ...firstMetric[1], type: firstMetric[0] };
    }
  
    return {
      score: averageScore,
      status: worstStatus,
      primaryMetric: highestPriorityMetric
    };
  }
  
  /**
   * Convert status string to numeric score for calculations
   */
  function getNumericScore(status) {
    const scoreMap = {
      'normal': 100,
      'borderline': 70,
      'high': 40,
      'low': 40
    };
    return scoreMap[status] || 100;
  }
  
  /**
   * Get severity level for status comparison
   */
  function getStatusSeverity(status) {
    const severityMap = {
      'normal': 0,
      'borderline': 1,
      'high': 2,
      'low': 2
    };
    return severityMap[status] || 0;
  }
  
  /**
   * Get status color for UI display
   */
  export function getStatusColor(status) {
    const colorMap = {
      'normal': '#4CAF50',
      'borderline': '#FFC107',
      'high': '#F44336',
      'low': '#F44336'
    };
    return colorMap[status] || '#4CAF50';
  }
  
  /**
   * Format health score for display
   */
  export function formatHealthScore(score) {
    if (score === null || score === undefined) {
      return { display: 'N/A', color: '#999999' };
    }
    
    let color;
    let label;
    
    if (score >= 90) {
      color = '#4CAF50'; // Green
      label = 'Excellent';
    } else if (score >= 80) {
      color = '#8BC34A'; // Light Green
      label = 'Good';
    } else if (score >= 70) {
      color = '#FFC107'; // Yellow
      label = 'Fair';
    } else if (score >= 60) {
      color = '#FF9800'; // Orange
      label = 'Poor';
    } else {
      color = '#F44336'; // Red
      label = 'Critical';
    }
    
    return {
      display: score.toString(),
      label,
      color
    };
  }
  
  /**
   * Get metric display name
   */
  export function getMetricDisplayName(metricType) {
    const displayNames = {
      // Heart/Cholesterol
      'hdl': 'HDL Cholesterol',
      'ldl': 'LDL Cholesterol',
      'total_cholesterol': 'Total Cholesterol',
      'triglycerides': 'Triglycerides',
      'vldl': 'VLDL Cholesterol',
      'blood_pressure': 'Blood Pressure',
      
      // Blood
      'hemoglobin': 'Hemoglobin',
      'hematocrit': 'Hematocrit',
      'glucose_fasting': 'Fasting Glucose',
      'hba1c': 'HbA1c',
      'wbc_count': 'WBC Count',
      'rbc_count': 'RBC Count',
      'platelet_count': 'Platelets',
      
      // Kidney
      'creatinine': 'Creatinine',
      'egfr': 'eGFR',
      'blood_urea_nitrogen': 'BUN',
      'uric_acid': 'Uric Acid',
      
      // Liver
      'alt': 'ALT',
      'ast': 'AST',
      'alp': 'ALP',
      'bilirubin': 'Bilirubin',
      
      // Thyroid
      'tsh': 'TSH',
      't3': 'T3',
      't4': 'T4',
      'free_t3': 'Free T3',
      'free_t4': 'Free T4',
      
      // Vitamins
      'vitamin_d': 'Vitamin D',
      'vitamin_b12': 'Vitamin B12',
      'iron': 'Iron',
      'ferritin': 'Ferritin',
      'folate': 'Folate'
    };
    
    return displayNames[metricType] || metricType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }