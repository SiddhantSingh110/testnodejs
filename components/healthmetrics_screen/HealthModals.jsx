// app/tabs/health/components/HealthModals.jsx - Fixed with proper exports
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/healthmetrics_screen/HealthMetrics.styles';

// Medical Goal Intelligence Database
const GOAL_INTELLIGENCE = {
  'hdl': {
    unit: 'mg/dL',
    optimal_min: 60,
    optimal_max: 80,
    improvement_targets: {
      low: { min: 40, target: 50, timeframe: '3-6 months' },
      borderline: { min: 40, target: 60, timeframe: '3-4 months' },
      normal: { min: 60, target: 70, timeframe: '2-3 months' }
    },
    suggestions: {
      dietary: 'Increase omega-3 rich foods, nuts, and olive oil',
      exercise: '30+ minutes cardio, 5 days/week',
      lifestyle: 'Quit smoking, moderate alcohol consumption'
    },
    clinical_notes: 'Higher HDL reduces cardiovascular disease risk. Levels >60 mg/dL are protective.'
  },
  'ldl': {
    unit: 'mg/dL',
    optimal_min: 70,
    optimal_max: 100,
    improvement_targets: {
      high: { max: 190, target: 130, timeframe: '3-6 months' },
      borderline: { max: 160, target: 100, timeframe: '2-4 months' },
      normal: { max: 100, target: 80, timeframe: '2-3 months' }
    },
    suggestions: {
      dietary: 'Reduce saturated fats, increase fiber, plant sterols',
      exercise: 'Regular aerobic exercise, strength training',
      lifestyle: 'Weight management, stress reduction'
    },
    clinical_notes: 'Lower LDL significantly reduces heart disease risk. Target <70 mg/dL for high-risk patients.'
  },
  'vitamin_b12': {
    unit: 'pg/mL',
    optimal_min: 550,
    optimal_max: 900,
    improvement_targets: {
      deficient: { min: 200, target: 600, timeframe: '8-12 weeks' },
      low: { min: 300, target: 700, timeframe: '6-8 weeks' },
      normal: { min: 550, target: 800, timeframe: '4-6 weeks' }
    },
    suggestions: {
      dietary: 'B12-rich foods: meat, fish, dairy, fortified cereals',
      supplements: 'Consider B12 supplements if vegetarian/vegan',
      lifestyle: 'Address absorption issues, limit alcohol'
    },
    clinical_notes: 'Optimal B12 (550-900 pg/mL) supports brain function, energy, and nerve health. Deficiency causes fatigue and neurological issues.'
  },
  'vitamin_d': {
    unit: 'ng/mL',
    optimal_min: 30,
    optimal_max: 50,
    improvement_targets: {
      deficient: { min: 20, target: 35, timeframe: '8-12 weeks' },
      insufficient: { min: 20, target: 40, timeframe: '6-8 weeks' },
      normal: { min: 30, target: 45, timeframe: '4-6 weeks' }
    },
    suggestions: {
      sunlight: '10-15 minutes direct sunlight daily',
      dietary: 'Fatty fish, fortified milk, egg yolks',
      supplements: 'D3 supplements 1000-2000 IU daily'
    },
    clinical_notes: 'Optimal vitamin D supports bone health, immune function, and mood. Levels 30-50 ng/mL are ideal.'
  },
  'glucose_fasting': {
    unit: 'mg/dL',
    optimal_min: 70,
    optimal_max: 99,
    improvement_targets: {
      prediabetic: { max: 125, target: 95, timeframe: '3-6 months' },
      elevated: { max: 110, target: 90, timeframe: '2-3 months' },
      normal: { max: 99, target: 85, timeframe: '1-2 months' }
    },
    suggestions: {
      dietary: 'Low glycemic foods, portion control, regular meals',
      exercise: 'Post-meal walks, strength training',
      lifestyle: 'Weight management, stress reduction, adequate sleep'
    },
    clinical_notes: 'Fasting glucose 70-99 mg/dL is normal. Higher levels increase diabetes and cardiovascular risk.'
  },
  'hba1c': {
    unit: '%',
    optimal_min: 4.0,
    optimal_max: 5.6,
    improvement_targets: {
      diabetic: { max: 9.0, target: 7.0, timeframe: '3-6 months' },
      prediabetic: { max: 6.4, target: 5.4, timeframe: '2-4 months' },
      normal: { max: 5.6, target: 5.0, timeframe: '2-3 months' }
    },
    suggestions: {
      dietary: 'Consistent carb counting, Mediterranean diet',
      monitoring: 'Regular blood glucose monitoring',
      medical: 'Work with healthcare provider for medication adjustment'
    },
    clinical_notes: 'HbA1c reflects 2-3 month average blood sugar. <5.7% is normal, 5.7-6.4% is prediabetic.'
  },
  'blood_pressure': {
    unit: 'mmHg',
    optimal_min: '90/60',
    optimal_max: '120/80',
    improvement_targets: {
      stage2: { max: '160/100', target: '130/80', timeframe: '3-6 months' },
      stage1: { max: '140/90', target: '120/80', timeframe: '2-4 months' },
      elevated: { max: '130/80', target: '115/75', timeframe: '1-3 months' }
    },
    suggestions: {
      dietary: 'DASH diet, reduce sodium, increase potassium',
      exercise: 'Regular aerobic exercise, 150 min/week',
      lifestyle: 'Weight loss, limit alcohol, stress management, adequate sleep'
    },
    clinical_notes: 'Optimal BP <120/80 mmHg. Higher levels significantly increase heart disease and stroke risk.'
  }
};

// Enhanced Component for metric info modal with comprehensive details
export const MetricInfoModal = ({ visible, onClose, metric, color }) => {
  if (!metric) return null;
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.infoModalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.infoModalContent}>
              <View style={styles.infoModalHeader}>
                <Text style={styles.infoModalTitle}>{metric.name}</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#94A3B8" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.infoModalBody}>
                {/* What is this parameter */}
                <View style={styles.infoSection}>
                  <Text style={styles.infoSectionTitle}>What is {metric.name}?</Text>
                  <Text style={styles.infoSectionText}>{metric.description || 'Information about this health metric.'}</Text>
                </View>
                
                {/* Why it matters */}
                {metric.importance && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoSectionTitle}>Why it matters</Text>
                    <Text style={styles.infoSectionText}>{metric.importance}</Text>
                  </View>
                )}
                
                {/* Healthy ranges */}
                {metric.ranges && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoSectionTitle}>Healthy ranges</Text>
                    <View style={styles.rangeContainer}>
                      <View style={[styles.rangeIndicator, styles.rangeLow]}>
                        <Text style={styles.rangeText}>Low</Text>
                      </View>
                      <View style={[styles.rangeIndicator, styles.rangeOptimal]}>
                        <Text style={styles.rangeText}>Optimal</Text>
                      </View>
                      <View style={[styles.rangeIndicator, styles.rangeHigh]}>
                        <Text style={styles.rangeText}>High</Text>
                      </View>
                    </View>
                    
                    <View style={styles.rangeDetails}>
                      {metric.ranges.map((range, index) => (
                        <View key={index} style={styles.rangeDetailItem}>
                          <View style={[styles.rangeDetailDot, { backgroundColor: range.color }]} />
                          <Text style={styles.rangeDetailText}>
                            <Text style={styles.rangeDetailTitle}>{range.label}: </Text>
                            {range.value}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                
                {/* Factors that influence */}
                {metric.factors && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoSectionTitle}>Factors that influence</Text>
                    <View style={styles.factorsList}>
                      {metric.factors.map((factor, index) => (
                        <View key={index} style={styles.factorItem}>
                          <View style={styles.factorIconContainer}>
                            <Ionicons name={factor.icon} size={16} color="#fff" />
                          </View>
                          <View style={styles.factorContent}>
                            <Text style={styles.factorTitle}>{factor.title}</Text>
                            <Text style={styles.factorDescription}>{factor.description}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                
                {/* When to be concerned */}
                {metric.concerns && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoSectionTitle}>When to be concerned</Text>
                    <View style={styles.concernsList}>
                      {metric.concerns.map((concern, index) => (
                        <View key={index} style={[styles.concernItem, { borderLeftColor: concern.severity === 'high' ? '#EF4444' : '#F59E0B' }]}>
                          <Text style={styles.concernTitle}>{concern.title}</Text>
                          <Text style={styles.concernDescription}>{concern.description}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                
                {/* Additional resources */}
                {metric.resources && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoSectionTitle}>Additional resources</Text>
                    {metric.resources.map((resource, index) => (
                      <TouchableOpacity key={index} style={styles.resourceLink}>
                        <Ionicons name="link-outline" size={16} color="#3B82F6" />
                        <Text style={styles.resourceLinkText}>{resource.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                {/* Source attribution */}
                <Text style={styles.infoSourceText}>
                  Information provided by trusted medical sources including Mayo Clinic, NIH, and WHO.
                </Text>
              </ScrollView>
              
              <TouchableOpacity 
                style={[styles.closeButton, { backgroundColor: color }]}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Add Measurement Modal - Complete Component with keyboard handling
export const AddMeasurementModal = ({ visible, onClose, metricType, metricColor, metricUnit, onSave }) => {
  const [value, setValue] = useState('');
  const [context, setContext] = useState('general');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Define metric types for display names
  const metricTypes = [
    { id: 'hdl', name: 'HDL Cholesterol' },
    { id: 'ldl', name: 'LDL Cholesterol' },
    { id: 'total_cholesterol', name: 'Total Cholesterol' },
    { id: 'triglycerides', name: 'Triglycerides' },
    { id: 'vitamin_d', name: 'Vitamin D' },
    { id: 'vitamin_b12', name: 'Vitamin B12' },
    { id: 'folate', name: 'Folate' },
    { id: 'iron', name: 'Iron' },
    { id: 'ferritin', name: 'Ferritin' },
    { id: 'hemoglobin', name: 'Hemoglobin' },
    { id: 'hematocrit', name: 'Hematocrit' },
    { id: 'glucose_fasting', name: 'Fasting Glucose' },
    { id: 'hba1c', name: 'HbA1c' },
    { id: 'creatinine', name: 'Creatinine' },
    { id: 'blood_urea_nitrogen', name: 'Blood Urea Nitrogen' },
    { id: 'alt', name: 'ALT' },
    { id: 'ast', name: 'AST' },
    { id: 'tsh', name: 'TSH' },
    { id: 'blood_pressure', name: 'Blood Pressure' }
  ];
  
  // Get display name for the modal title
  const metricDisplayName = metricTypes.find(m => m.id === metricType)?.name || metricType;
  
  const contextOptions = [
    { id: 'general', name: 'General' },
    { id: 'fasting', name: 'Fasting' },
    { id: 'after_meal', name: 'After Meal' },
    { id: 'morning', name: 'Morning' },
    { id: 'evening', name: 'Evening' },
  ];

  // Dismiss keyboard function
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  
  const handleSubmit = async () => {
    if (!value) {
      Alert.alert('Error', 'Please enter a value');
      return;
    }
    
    // Dismiss keyboard before submitting
    dismissKeyboard();
    
    setIsLoading(true);
    try {
      await onSave({
        type: metricType,  // This will now be the ID (e.g., 'hdl', 'ldl')
        value: value,
        unit: metricUnit,
        context: context,
        notes: notes,
      });
      
      // Reset form
      setValue('');
      setContext('general');
      setNotes('');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save measurement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add {metricDisplayName}</Text>
                  <TouchableOpacity onPress={() => {
                    dismissKeyboard();
                    onClose();
                  }}>
                    <Ionicons name="close" size={24} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView 
                  style={styles.modalScrollView}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Value</Text>
                    <View style={styles.valueInputContainer}>
                      <TextInput
                        style={styles.valueInput}
                        value={value}
                        onChangeText={setValue}
                        keyboardType="numeric"
                        placeholder="Enter value"
                        placeholderTextColor="#64748B"
                        returnKeyType="done"
                        onSubmitEditing={dismissKeyboard}
                      />
                      <Text style={styles.valueUnit}>{metricUnit}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Context</Text>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      keyboardShouldPersistTaps="handled"
                    >
                      {contextOptions.map(item => (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.contextButton,
                            context === item.id && { 
                              backgroundColor: metricColor + '20', 
                              borderColor: metricColor 
                            }
                          ]}
                          onPress={() => {
                            dismissKeyboard();
                            setContext(item.id);
                          }}
                        >
                          <Text style={[
                            styles.contextButtonText, 
                            context === item.id && { color: metricColor }
                          ]}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Notes (optional)</Text>
                    <TextInput
                      style={styles.notesInput}
                      value={notes}
                      onChangeText={setNotes}
                      placeholder="Add any additional notes"
                      placeholderTextColor="#64748B"
                      multiline
                      numberOfLines={3}
                      returnKeyType="done"
                      onSubmitEditing={dismissKeyboard}
                      blurOnSubmit={true}
                    />
                  </View>
                </ScrollView>
                
                <TouchableOpacity 
                  style={[styles.saveButton, { backgroundColor: metricColor }]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Measurement</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Enhanced Goal Setting Modal with Medical Intelligence
export const GoalSettingModal = ({ visible, onClose, metric, metricColor, currentValue, onSaveGoal }) => {
  const [targetValue, setTargetValue] = useState('');
  const [targetDate, setTargetDate] = useState('In 3 months');
  const [reminder, setReminder] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Get medical intelligence for current metric
  const medicalInfo = GOAL_INTELLIGENCE[metric?.id];
  
  // Calculate intelligent suggestions based on current value
  const getIntelligentSuggestions = () => {
    if (!medicalInfo || !currentValue || currentValue === 'N/A') return [];
    
    const numValue = parseFloat(currentValue.toString().replace(/[^\d.]/g, ''));
    const suggestions = [];
    
    // Determine current status and suggest targets
    if (medicalInfo.improvement_targets) {
      Object.entries(medicalInfo.improvement_targets).forEach(([status, target]) => {
        let isRelevant = false;
        
        // Check if current value fits this status category
        if (status === 'deficient' || status === 'low') {
          isRelevant = numValue < (medicalInfo.optimal_min || 0);
        } else if (status === 'high' || status === 'stage2' || status === 'stage1') {
          isRelevant = numValue > (medicalInfo.optimal_max || 999);
        } else if (status === 'borderline' || status === 'elevated' || status === 'prediabetic') {
          isRelevant = numValue >= (medicalInfo.optimal_min || 0) && numValue <= (medicalInfo.optimal_max || 999);
        } else if (status === 'normal') {
          isRelevant = numValue >= (medicalInfo.optimal_min || 0) && numValue <= (medicalInfo.optimal_max || 999);
        }
        
        if (isRelevant) {
          suggestions.push({
            type: status,
            target: target.target || target.max || target.min,
            timeframe: target.timeframe,
            reasoning: getReasoningText(status, numValue, target, metric?.id)
          });
        }
      });
    }
    
    // Add optimal range suggestion
    if (medicalInfo.optimal_min && medicalInfo.optimal_max) {
      const midOptimal = (medicalInfo.optimal_min + medicalInfo.optimal_max) / 2;
      suggestions.push({
        type: 'optimal',
        target: Math.round(midOptimal),
        timeframe: '2-4 months',
        reasoning: `Target the optimal range (${medicalInfo.optimal_min}-${medicalInfo.optimal_max} ${medicalInfo.unit}) for best health outcomes`
      });
    }
    
    return suggestions.slice(0, 3); // Limit to top 3 suggestions
  };

  const getReasoningText = (status, currentVal, target, metricId) => {
    const statusMessages = {
      'deficient': `Your current level (${currentVal}) is deficient. Reaching ${target.target} will restore normal function.`,
      'low': `Your level (${currentVal}) is below optimal. Targeting ${target.target} will improve your health markers.`,
      'high': `Your level (${currentVal}) is elevated. Reducing to ${target.target} will lower health risks.`,
      'borderline': `Your level (${currentVal}) is borderline. Improving to ${target.target} will move you to optimal range.`,
      'prediabetic': `Your level (${currentVal}) indicates prediabetes risk. Reducing to ${target.target} can prevent progression.`,
      'stage1': `Your level (${currentVal}) is stage 1 hypertension. Reducing to ${target.target} will significantly lower cardiovascular risk.`,
      'stage2': `Your level (${currentVal}) is stage 2 hypertension. Reducing to ${target.target} is crucial for health.`,
      'elevated': `Your level (${currentVal}) is elevated. Targeting ${target.target} will optimize your health.`,
      'normal': `Your level (${currentVal}) is normal. Targeting ${target.target} will optimize performance further.`
    };
    
    return statusMessages[status] || `Targeting ${target.target} will improve your ${metricId} levels.`;
  };

  const suggestions = getIntelligentSuggestions();

  // Dismiss keyboard function
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Auto-suggest based on medical intelligence
  useEffect(() => {
    if (suggestions.length > 0 && !targetValue) {
      setSelectedSuggestion(suggestions[0]);
      setTargetValue(suggestions[0].target.toString());
      setTargetDate(`In ${suggestions[0].timeframe.split('-')[0].trim()}`);
    }
  }, [suggestions]);
  
  const handleSubmit = async () => {
    if (!targetValue) {
      Alert.alert('Error', 'Please enter a target value');
      return;
    }
    
    dismissKeyboard();
    setIsLoading(true);
    
    try {
      const goalData = {
        metric_type: metric?.id,
        target_value: targetValue,
        target_date: targetDate,
        reminder_enabled: reminder,
        current_value: currentValue,
        suggestion_type: selectedSuggestion?.type,
        medical_reasoning: selectedSuggestion?.reasoning
      };
      
      if (onSaveGoal) {
        await onSaveGoal(goalData);
      }
      
      Alert.alert('Success', 'Goal set successfully!');
      
      // Reset form and close
      setTargetValue('');
      setTargetDate('In 3 months');
      setReminder(true);
      setSelectedSuggestion(null);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to set goal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    dismissKeyboard();
    setTargetValue('');
    setTargetDate('In 3 months');
    setReminder(true);
    setSelectedSuggestion(null);
    setShowAdvancedOptions(false);
    onClose();
  };

  const handleSuggestionSelect = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setTargetValue(suggestion.target.toString());
    setTargetDate(`In ${suggestion.timeframe.split('-')[0].trim()}`);
    dismissKeyboard();
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.modalContent, { maxHeight: '90%' }]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Set Goal for {metric?.name}</Text>
                  <TouchableOpacity onPress={handleClose}>
                    <Ionicons name="close" size={24} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView 
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {/* Current Value Display */}
                  <View style={styles.goalCurrentValue}>
                    <Text style={styles.goalCurrentValueLabel}>Current Value</Text>
                    <Text style={[styles.goalCurrentValueText, { color: metricColor }]}>
                      {currentValue} {metric?.unit}
                    </Text>
                    {medicalInfo && (
                      <Text style={styles.goalCurrentRange}>
                        Optimal: {medicalInfo.optimal_min}-{medicalInfo.optimal_max} {medicalInfo.unit}
                      </Text>
                    )}
                  </View>

                  {/* AI-Powered Suggestions */}
                  {suggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                      <View style={styles.suggestionsHeader}>
                        <Ionicons name="bulb" size={18} color="#F59E0B" />
                        <Text style={styles.suggestionsTitle}>Smart Recommendations</Text>
                      </View>
                      
                      {suggestions.map((suggestion, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.suggestionCard,
                            selectedSuggestion?.type === suggestion.type && {
                              borderColor: metricColor,
                              backgroundColor: metricColor + '10'
                            }
                          ]}
                          onPress={() => handleSuggestionSelect(suggestion)}
                        >
                          <View style={styles.suggestionHeader}>
                            <View style={styles.suggestionTypeContainer}>
                              <Text style={[
                                styles.suggestionType,
                                { color: metricColor }
                              ]}>
                                {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)} Target
                              </Text>
                              <Text style={styles.suggestionTarget}>
                                {suggestion.target} {medicalInfo?.unit}
                              </Text>
                            </View>
                            <Text style={styles.suggestionTimeframe}>
                              {suggestion.timeframe}
                            </Text>
                          </View>
                          <Text style={styles.suggestionReasoning}>
                            {suggestion.reasoning}
                          </Text>
                          {selectedSuggestion?.type === suggestion.type && (
                            <View style={styles.selectedIndicator}>
                              <Ionicons name="checkmark-circle" size={20} color={metricColor} />
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Manual Target Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Target Value</Text>
                    <View style={styles.valueInputContainer}>
                      <TextInput
                        style={styles.valueInput}
                        value={targetValue}
                        onChangeText={(value) => {
                          setTargetValue(value);
                          setSelectedSuggestion(null); // Clear suggestion when manually editing
                        }}
                        keyboardType="numeric"
                        placeholder="Enter target value"
                        placeholderTextColor="#64748B"
                        returnKeyType="done"
                        onSubmitEditing={dismissKeyboard}
                      />
                      <Text style={styles.valueUnit}>{metric?.unit}</Text>
                    </View>
                  </View>
                  
                  {/* Target Date */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Target Timeline</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {['In 1 month', 'In 2 months', 'In 3 months', 'In 6 months', 'In 1 year'].map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.timelineOption,
                            targetDate === option && {
                              backgroundColor: metricColor + '20',
                              borderColor: metricColor
                            }
                          ]}
                          onPress={() => {
                            dismissKeyboard();
                            setTargetDate(option);
                          }}
                        >
                          <Text style={[
                            styles.timelineOptionText,
                            targetDate === option && { color: metricColor }
                          ]}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Advanced Options Toggle */}
                  <TouchableOpacity
                    style={styles.advancedToggle}
                    onPress={() => {
                      dismissKeyboard();
                      setShowAdvancedOptions(!showAdvancedOptions);
                    }}
                  >
                    <Text style={styles.advancedToggleText}>Advanced Options</Text>
                    <Ionicons 
                      name={showAdvancedOptions ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#94A3B8" 
                    />
                  </TouchableOpacity>

                  {/* Advanced Options */}
                  {showAdvancedOptions && (
                    <View style={styles.advancedOptions}>
                      <View style={styles.inputGroup}>
                        <View style={styles.reminderToggle}>
                          <Text style={styles.inputLabel}>Remind me about my goal</Text>
                          <TouchableOpacity 
                            style={[
                              styles.toggleButton, 
                              reminder ? { backgroundColor: metricColor } : {}
                            ]}
                            onPress={() => {
                              dismissKeyboard();
                              setReminder(!reminder);
                            }}
                          >
                            <View style={[
                              styles.toggleHandle, 
                              reminder ? { right: 2 } : { left: 2 }
                            ]} />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Medical Information */}
                      {medicalInfo && (
                        <View style={styles.medicalInfoContainer}>
                          <Text style={styles.medicalInfoTitle}>Medical Insights</Text>
                          <Text style={styles.medicalInfoText}>
                            {medicalInfo.clinical_notes}
                          </Text>
                          
                          {medicalInfo.suggestions && (
                            <View style={styles.improvementTips}>
                              <Text style={styles.improvementTipsTitle}>Ways to improve:</Text>
                              {Object.entries(medicalInfo.suggestions).map(([key, value]) => (
                                <View key={key} style={styles.improvementTip}>
                                  <Ionicons name="checkmark-circle-outline" size={16} color="#22C55E" />
                                  <Text style={styles.improvementTipText}>
                                    <Text style={styles.improvementTipType}>{key}:</Text> {value}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                  
                  {/* Important Notice */}
                  <View style={styles.goalSuggestion}>
                    <Ionicons name="information-circle-outline" size={20} color="#3B82F6" />
                    <Text style={styles.goalSuggestionText}>
                      Goals are based on general medical guidelines. Always consult your healthcare provider before making significant changes to your health regimen.
                    </Text>
                  </View>
                </ScrollView>
                
                <TouchableOpacity 
                  style={[styles.saveButton, { backgroundColor: metricColor }]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Set Smart Goal</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Enhanced Modal for viewing recommendations
export const RecommendationsModal = ({ visible, onClose, metric, color }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Recommendations for {metric?.name}</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#94A3B8" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.recommendationsContainer}>
                {metric?.recommendations?.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <View style={styles.recommendationHeader}>
                      <View style={[styles.recommendationIcon, { backgroundColor: color }]}>
                        <Ionicons name={rec.icon} size={16} color="#fff" />
                      </View>
                      <Text style={styles.recommendationTitle}>{rec.title}</Text>
                    </View>
                    <Text style={styles.recommendationDescription}>{rec.description}</Text>
                    
                    {rec.steps && (
                      <View style={styles.recommendationSteps}>
                        {rec.steps.map((step, stepIndex) => (
                          <View key={stepIndex} style={styles.recommendationStep}>
                            <View style={[styles.recommendationStepNumber, { backgroundColor: color }]}>
                              <Text style={styles.recommendationStepNumberText}>{stepIndex + 1}</Text>
                            </View>
                            <Text style={styles.recommendationStepText}>{step}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
                
                <View style={styles.recommendationSourceInfo}>
                  <Text style={styles.recommendationSourceText}>
                    Recommendations are based on clinical guidelines and may not apply to everyone.
                    Always consult with your healthcare provider before making significant changes.
                  </Text>
                </View>
              </ScrollView>
              
              <TouchableOpacity 
                style={[styles.closeButton, { backgroundColor: color }]}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};