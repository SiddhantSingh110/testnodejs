// app/tabs/health/components/HealthModals.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/healthmetrics_screen/HealthMetrics.styles';

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
      <View style={styles.infoModalOverlay}>
        <View style={styles.infoModalContent}>
          <View style={styles.infoModalHeader}>
            <Text style={styles.infoModalTitle}>{metric.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#aaa" />
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
                    <View key={index} style={[styles.concernItem, { borderLeftColor: concern.severity === 'high' ? '#F44336' : '#FFC107' }]}>
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
                    <Ionicons name="link-outline" size={16} color="#38BFA7" />
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
      </View>
    </Modal>
  );
};

// Add Measurement Modal - Complete Component
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
  
  const handleSubmit = async () => {
    if (!value) {
      Alert.alert('Error', 'Please enter a value');
      return;
    }
    
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add {metricDisplayName}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#aaa" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Value</Text>
              <View style={styles.valueInputContainer}>
                <TextInput
                  style={styles.valueInput}
                  value={value}
                  onChangeText={setValue}
                  keyboardType="numeric"
                  placeholder="Enter value"
                  placeholderTextColor="#aaa"
                />
                <Text style={styles.valueUnit}>{metricUnit}</Text>
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Context</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {contextOptions.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.contextButton,
                      context === item.id && { backgroundColor: metricColor + '20', borderColor: metricColor }
                    ]}
                    onPress={() => setContext(item.id)}
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
                placeholderTextColor="#aaa"
                multiline
                numberOfLines={3}
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
      </View>
    </Modal>
  );
};

// Enhanced Goal setting modal with comprehensive functionality
export const GoalSettingModal = ({ visible, onClose, metric, metricColor, currentValue, onSaveGoal }) => {
  const [targetValue, setTargetValue] = useState('');
  const [targetDate, setTargetDate] = useState('In 3 months');
  const [reminder, setReminder] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!targetValue) {
      Alert.alert('Error', 'Please enter a target value');
      return;
    }
    
    setIsLoading(true);
    try {
      const goalData = {
        metric_type: metric?.id,
        target_value: targetValue,
        target_date: targetDate,
        reminder_enabled: reminder,
        current_value: currentValue
      };
      
      if (onSaveGoal) {
        await onSaveGoal(goalData);
      }
      
      Alert.alert('Success', 'Goal set successfully!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to set goal. Please try again.');
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Set Goal for {metric?.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#aaa" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.goalCurrentValue}>
            <Text style={styles.goalCurrentValueLabel}>Current Value</Text>
            <Text style={[styles.goalCurrentValueText, { color: metricColor }]}>
              {currentValue} {metric?.unit}
            </Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Target Value</Text>
            <View style={styles.valueInputContainer}>
              <TextInput
                style={styles.valueInput}
                value={targetValue}
                onChangeText={setTargetValue}
                keyboardType="numeric"
                placeholder="Enter target value"
                placeholderTextColor="#aaa"
              />
              <Text style={styles.valueUnit}>{metric?.unit}</Text>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Target Date</Text>
            <TouchableOpacity style={styles.dateButton}>
              <Text style={styles.dateButtonText}>{targetDate}</Text>
              <Ionicons name="calendar-outline" size={20} color="#aaa" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.reminderToggle}>
              <Text style={styles.inputLabel}>Remind me about my goal</Text>
              <TouchableOpacity 
                style={[styles.toggleButton, reminder ? { backgroundColor: metricColor } : {}]}
                onPress={() => setReminder(!reminder)}
              >
                <View style={[styles.toggleHandle, reminder ? { right: 2 } : { left: 2 }]} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.goalSuggestion}>
            <Ionicons name="bulb-outline" size={20} color="#FFC107" />
            <Text style={styles.goalSuggestionText}>
              Setting realistic, achievable goals increases your chances of success. Consider consulting with your healthcare provider for personalized targets.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: metricColor }]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Set Goal</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Recommendations for {metric?.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#aaa" />
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
      </View>
    </Modal>
  );
};