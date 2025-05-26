// app/tabs/health/originalindex.jsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, // <- Import StyleSheet from react-native
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Modal,
  TextInput,
  FlatList,
  Dimensions,
  Pressable,
  Platform,
  Animated,
} from 'react-native';

// Import SVG components separately
import Svg, { 
  Path,
  Circle,
  Line,
  G,
  Text as SvgText
} from 'react-native-svg';

import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

// Rest of your code remains the same...

// Generate SVG path for line chart
const generatePath = (data, height, width, maxValue, minValue) => {
  if (!data || data.length === 0) return '';
  
  const range = maxValue - minValue;
  const padding = 20;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);
  
  const getX = (index) => padding + (index * (chartWidth / (data.length - 1)));
  const getY = (value) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return height - padding - ((numValue - minValue) / range) * chartHeight;
  };
  
  let path = `M ${getX(0)} ${getY(data[0].value)}`;
  
  for (let i = 1; i < data.length; i++) {
    path += ` L ${getX(i)} ${getY(data[i].value)}`;
  }
  
  return path;
};

// Real line chart component
const LineChart = ({ data, referenceRanges, color, timeframe, height = 200, width = 350 }) => {
  if (!data || data.length < 2) {
    return (
      <View style={[styles.chartPlaceholder, { height, backgroundColor: color + '10' }]}>
        <Text style={{ color: '#aaa' }}>Not enough data for visualization</Text>
      </View>
    );
  }
  
  // Extract numeric values for min/max calculation
  const values = data.map(item => {
    if (typeof item.value === 'string' && item.value.includes('/')) {
      // Handle blood pressure (use systolic)
      return parseFloat(item.value.split('/')[0]);
    }
    return parseFloat(item.value);
  });
  
  // Determine min and max values with padding
  let minValue = Math.min(...values);
  let maxValue = Math.max(...values);
  
  // Use reference ranges if available
  if (referenceRanges) {
    if (referenceRanges.min !== null && !isNaN(referenceRanges.min)) {
      minValue = Math.min(minValue, referenceRanges.min);
    }
    if (referenceRanges.max !== null && !isNaN(referenceRanges.max)) {
      maxValue = Math.max(maxValue, referenceRanges.max);
    }
  }
  
  // Add some padding to the range
  const rangePadding = (maxValue - minValue) * 0.1;
  minValue = Math.max(0, minValue - rangePadding);
  maxValue = maxValue + rangePadding;
  
  // If minValue and maxValue are equal (all values are the same), add some range
  if (minValue === maxValue) {
    minValue = minValue * 0.9;
    maxValue = maxValue * 1.1;
    // Ensure we don't go below zero for things that can't be negative
    if (minValue < 0 && values[0] >= 0) minValue = 0;
  }
  
  // Determine reference lines
  const refLines = [];
  if (referenceRanges) {
    if (referenceRanges.min !== null && !isNaN(referenceRanges.min)) {
      refLines.push({ value: referenceRanges.min, label: 'Min', color: '#FFC107' });
    }
    if (referenceRanges.max !== null && !isNaN(referenceRanges.max)) {
      refLines.push({ value: referenceRanges.max, label: 'Max', color: '#FFC107' });
    }
  }
  
  // Determine data points (subsampled if there are too many)
  const dataPoints = [];
  const maxPoints = 10;
  const step = data.length <= maxPoints ? 1 : Math.floor(data.length / maxPoints);
  
  for (let i = 0; i < data.length; i += step) {
    dataPoints.push(data[i]);
  }
  // Always include the most recent point
  if (step > 1 && !dataPoints.includes(data[0])) {
    dataPoints.unshift(data[0]);
  }
  
  // Generate line chart SVG
  const linePath = generatePath(data, height, width, maxValue, minValue);
  
  return (
    <View style={[styles.chartContainer, { height }]}>
      <Svg width={width} height={height}>
        {/* Reference area */}
        {referenceRanges && referenceRanges.min !== null && referenceRanges.max !== null && (
          <G>
            <Path
              d={`
                M ${20} ${height - 20 - ((referenceRanges.max - minValue) / (maxValue - minValue)) * (height - 40)}
                H ${width - 20}
                V ${height - 20 - ((referenceRanges.min - minValue) / (maxValue - minValue)) * (height - 40)}
                H ${20}
                Z
              `}
              fill={color + '30'}
              stroke="none"
            />
          </G>
        )}
        
        {/* Reference lines */}
        {refLines.map((line, index) => (
          <G key={index}>
            <Line
              x1={20}
              y1={height - 20 - ((line.value - minValue) / (maxValue - minValue)) * (height - 40)}
              x2={width - 20}
              y2={height - 20 - ((line.value - minValue) / (maxValue - minValue)) * (height - 40)}
              stroke={line.color}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            <SvgText
              x={width - 25}
              y={height - 20 - ((line.value - minValue) / (maxValue - minValue)) * (height - 40) - 5}
              fill={line.color}
              fontSize={10}
              textAnchor="end"
            >
              {line.label} {line.value}
            </SvgText>
          </G>
        ))}
        
        {/* Data line */}
        <Path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
        />
        
        {/* Data points */}
        {dataPoints.map((point, index) => {
          const pointValue = typeof point.value === 'string' && point.value.includes('/') 
            ? parseFloat(point.value.split('/')[0])
            : parseFloat(point.value);
            
          const cx = 20 + (data.indexOf(point) * ((width - 40) / (data.length - 1)));
          const cy = height - 20 - ((pointValue - minValue) / (maxValue - minValue)) * (height - 40);
          
          return (
            <G key={index}>
              <Circle
                cx={cx}
                cy={cy}
                r={4}
                fill={
                  point.status === 'high' ? '#F44336' :
                  point.status === 'borderline' ? '#FFC107' : 
                  color
                }
                stroke="#fff"
                strokeWidth={1.5}
              />
              {/* Source indicator */}
              {point.source === 'report' && (
                <Circle
                  cx={cx}
                  cy={cy}
                  r={8}
                  fill="none"
                  stroke={point.status === 'high' ? '#F44336' : point.status === 'borderline' ? '#FFC107' : color}
                  strokeWidth={1}
                  strokeDasharray="2,2"
                />
              )}
            </G>
          );
        })}
        
        {/* X-axis labels (dates) */}
        {dataPoints.filter((_, i) => i % 2 === 0).map((point, index) => {
          const x = 20 + (data.indexOf(point) * ((width - 40) / (data.length - 1)));
          return (
            <SvgText
              key={index}
              x={x}
              y={height - 5}
              fill="#aaa"
              fontSize={8}
              textAnchor="middle"
            >
              {point.date.split('-').slice(1).join('/')}
            </SvgText>
          );
        })}
        
        {/* Y-axis min/max */}
        <SvgText x={15} y={15} fill="#aaa" fontSize={8} textAnchor="start">
          {maxValue.toFixed(1)}
        </SvgText>
        <SvgText x={15} y={height - 25} fill="#aaa" fontSize={8} textAnchor="start">
          {minValue.toFixed(1)}
        </SvgText>
      </Svg>
      
      <Text style={{ color: '#aaa', fontSize: 10, textAlign: 'center', marginTop: 5 }}>
        {timeframe === 'week' ? 'Last 7 days' : timeframe === 'month' ? 'Last 30 days' : 'Last 12 months'}
      </Text>
    </View>
  );
};

// The component to show an annotation on the chart
const Annotation = ({ title, description, color }) => (
  <View style={[styles.annotation, { borderColor: color }]}>
    <Text style={styles.annotationTitle}>{title}</Text>
    <Text style={styles.annotationText}>{description}</Text>
  </View>
);

// Component for metric info modal
const MetricInfoModal = ({ visible, onClose, metric, color }) => {
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
              <Text style={styles.infoSectionText}>{metric.description}</Text>
            </View>
            
            {/* Why it matters */}
            <View style={styles.infoSection}>
              <Text style={styles.infoSectionTitle}>Why it matters</Text>
              <Text style={styles.infoSectionText}>{metric.importance}</Text>
            </View>
            
            {/* Healthy ranges */}
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
            
            {/* Factors that influence */}
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
            
            {/* When to be concerned */}
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
            
            {/* Additional resources */}
            <View style={styles.infoSection}>
              <Text style={styles.infoSectionTitle}>Additional resources</Text>
              {metric.resources.map((resource, index) => (
                <TouchableOpacity key={index} style={styles.resourceLink}>
                  <Ionicons name="link-outline" size={16} color="#38BFA7" />
                  <Text style={styles.resourceLinkText}>{resource.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
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

// The component for the "Add New Measurement" modal
const AddMeasurementModal = ({ visible, onClose, metricType, metricColor, metricUnit, metricCategory, metricSubCategory }) => {
  const [value, setValue] = useState('');
  const [context, setContext] = useState('');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('Now');
  const [notes, setNotes] = useState('');
  
  // Get appropriate context options based on metric type
  const getContextOptions = () => {
    // Default contexts for all types
    const defaultContexts = [
      { id: 'general', name: 'General' },
      { id: 'morning', name: 'Morning' },
      { id: 'evening', name: 'Evening' },
    ];
    
    if (metricCategory === 'vitals') {
      return [
        ...defaultContexts,
        { id: 'resting', name: 'Resting' },
        { id: 'after_exercise', name: 'After Exercise' },
        { id: 'before_sleep', name: 'Before Sleep' },
      ];
    }
    
    if (metricCategory === 'blood') {
      return [
        ...defaultContexts,
        { id: 'fasting', name: 'Fasting' },
        { id: 'after_meal', name: 'After Meal' },
        { id: 'before_meal', name: 'Before Meal' },
      ];
    }
    
    if (metricCategory === 'organs') {
      if (metricSubCategory === 'liver' || metricSubCategory === 'kidney') {
        return [
          ...defaultContexts,
          { id: 'fasting', name: 'Fasting' },
          { id: 'medical_test', name: 'Medical Test' },
        ];
      }
      
      if (metricSubCategory === 'heart') {
        return [
          ...defaultContexts,
          { id: 'resting', name: 'Resting' },
          { id: 'fasting', name: 'Fasting' },
          { id: 'medical_test', name: 'Medical Test' },
        ];
      }
    }
    
    // Default fallback
    return defaultContexts;
  };
  
  const contextOptions = getContextOptions();
  
  const handleSubmit = () => {
    // In a real implementation, this would save the data
    console.log({ metricType, value, date, time, context, notes });
    onClose();
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
            <Text style={styles.modalTitle}>Add {metricType}</Text>
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
            
            <View style={styles.timeInputContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date</Text>
                <TouchableOpacity style={styles.dateButton}>
                  <Text style={styles.dateButtonText}>{date}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#aaa" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Time</Text>
                <TouchableOpacity style={styles.dateButton}>
                  <Text style={styles.dateButtonText}>{time}</Text>
                  <Ionicons name="time-outline" size={20} color="#aaa" />
                </TouchableOpacity>
              </View>
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
          >
            <Text style={styles.saveButtonText}>Save Measurement</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Component for goal setting modal
const GoalSettingModal = ({ visible, onClose, metric, metricColor, currentValue }) => {
  const [targetValue, setTargetValue] = useState('');
  const [targetDate, setTargetDate] = useState('In 3 months');
  const [reminder, setReminder] = useState(true);
  
  const handleSubmit = () => {
    // In a real implementation, this would save the goal
    console.log({ metric, targetValue, targetDate, reminder });
    onClose();
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
              Healthy target range for {metric?.name} is {metric?.range}. Setting realistic goals increases your chances of success.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: metricColor }]}
            onPress={handleSubmit}
          >
            <Text style={styles.saveButtonText}>Set Goal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Modal for viewing recommendations
const RecommendationsModal = ({ visible, onClose, metric, color }) => {
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

export default function HealthMetrics() {
  const [metrics, setMetrics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('organs');
  const [selectedSubCategory, setSelectedSubCategory] = useState('heart');
  const [selectedMetric, setSelectedMetric] = useState('hdl');
  const [timeframe, setTimeframe] = useState('week');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showRecommendationsModal, setShowRecommendationsModal] = useState(false);
  const [selectedMetricInfo, setSelectedMetricInfo] = useState(null);
  
  // Categories for metrics
  const categories = [
    { id: 'all', name: 'All', icon: 'apps-outline' },
    { id: 'blood', name: 'Blood', icon: 'water-outline' },
    { id: 'organs', name: 'Organs', icon: 'fitness-outline' },
    { id: 'vitamins', name: 'Vitamins', icon: 'leaf-outline' },
    { id: 'custom', name: 'Custom', icon: 'add-circle-outline' },
  ];
  
  // Subcategories for organs
  const organCategories = [
    { id: 'heart', name: 'Heart', icon: 'heart-outline', color: '#E53935' },
    { id: 'liver', name: 'Liver', icon: 'medical-outline', color: '#FB8C00' },
    { id: 'kidney', name: 'Kidney', icon: 'water-outline', color: '#43A047' },
    { id: 'thyroid', name: 'Thyroid', icon: 'body-outline', color: '#673AB7' }
  ];
  
  // Full list of metric types with extended information
  const metricTypes = [
    // Blood related
    { 
      id: 'blood_sugar', 
      name: 'Blood Sugar', 
      icon: 'water-outline', 
      color: '#43A047', 
      category: 'blood', 
      subcategory: null,
      description: 'Blood sugar or blood glucose is the amount of glucose in your bloodstream. Glucose is your body\'s main source of energy.',
      importance: 'Monitoring blood sugar is essential, particularly for people with diabetes or prediabetes, as persistent high levels can damage organs and blood vessels.',
      ranges: [
        { label: 'Low', value: 'Below 70 mg/dL', color: '#F44336' },
        { label: 'Normal (fasting)', value: '70-99 mg/dL', color: '#4CAF50' },
        { label: 'Prediabetes (fasting)', value: '100-125 mg/dL', color: '#FFC107' },
        { label: 'Diabetes (fasting)', value: '126 mg/dL or higher', color: '#F44336' }
      ],
      factors: [
        { title: 'Diet', icon: 'nutrition-outline', description: 'Carbohydrates in food directly affect blood sugar levels.' },
        { title: 'Physical Activity', icon: 'fitness-outline', description: 'Exercise helps muscles use glucose and improves insulin sensitivity.' },
        { title: 'Medications', icon: 'medkit-outline', description: 'Insulin and other medications can lower blood sugar levels.' },
        { title: 'Stress', icon: 'sad-outline', description: 'Hormones released during stress can raise blood sugar levels.' }
      ],
     concerns: [
        { 
          title: 'Hypoglycemia (Low Blood Sugar)', 
          severity: 'high',
          description: 'Can cause confusion, dizziness, sweating, and in severe cases, loss of consciousness. Immediate treatment with fast-acting carbohydrates is needed.' 
        },
        { 
          title: 'Hyperglycemia (High Blood Sugar)', 
          severity: 'high',
          description: 'Persistent high levels can lead to diabetes complications, including nerve damage, kidney disease, and cardiovascular problems.' 
        }
      ],
      resources: [
        { title: 'American Diabetes Association', url: 'https://www.diabetes.org/' },
        { title: 'CDC - Managing Diabetes', url: 'https://www.cdc.gov/diabetes/managing/index.html' }
      ],
      percentileData: {
        value: 85,
        percentile: 70,
        target: 75
      },
      recommendations: [
        {
          title: 'Balanced Diet',
          icon: 'nutrition-outline',
          description: 'Focus on a diet rich in vegetables, lean proteins, and complex carbohydrates to maintain stable blood sugar levels.',
          steps: [
            'Choose foods with a low glycemic index',
            'Eat regular, balanced meals',
            'Limit processed foods and added sugars',
            'Include fiber-rich foods in your diet'
          ]
        },
        {
          title: 'Regular Exercise',
          icon: 'fitness-outline',
          description: 'Physical activity helps your body use insulin more efficiently and can help maintain healthy blood sugar levels.',
          steps: [
            'Aim for 150 minutes of moderate activity weekly',
            'Include both aerobic exercises and strength training',
            'Check your blood sugar before and after exercise',
            'Stay hydrated during workouts'
          ]
        }
      ]
    },
    { 
      id: 'cholesterol', 
      name: 'Cholesterol', 
      icon: 'water-outline', 
      color: '#FF5722', 
      category: 'blood', 
      subcategory: null,
      description: 'Cholesterol is a waxy substance found in the blood. Your body needs cholesterol to build healthy cells, but high levels can increase the risk of heart disease.',
      importance: 'Monitoring cholesterol is crucial because high levels typically don\'t cause symptoms but can lead to serious cardiovascular issues over time.',
      ranges: [
        { label: 'Desirable Total', value: 'Less than 200 mg/dL', color: '#4CAF50' },
        { label: 'Borderline High', value: '200-239 mg/dL', color: '#FFC107' },
        { label: 'High', value: '240 mg/dL and above', color: '#F44336' }
      ],
      factors: [
        { title: 'Diet', icon: 'nutrition-outline', description: 'Foods high in saturated and trans fats can raise cholesterol levels.' },
        { title: 'Weight', icon: 'body-outline', description: 'Being overweight can increase LDL (bad) cholesterol.' },
        { title: 'Physical Activity', icon: 'fitness-outline', description: 'Regular exercise can help raise HDL (good) cholesterol.' },
        { title: 'Genetics', icon: 'people-outline', description: 'Family history can influence your cholesterol levels.' }
      ],
      concerns: [
        { 
          title: 'Atherosclerosis', 
          severity: 'high',
          description: 'Buildup of plaque in arteries can restrict blood flow and lead to heart attacks or strokes.' 
        },
        { 
          title: 'Coronary Heart Disease', 
          severity: 'high',
          description: 'Reduced blood flow to the heart muscle due to plaque buildup can cause chest pain and heart attacks.' 
        }
      ],
      resources: [
        { title: 'American Heart Association', url: 'https://www.heart.org/' },
        { title: 'NIH - Cholesterol Information', url: 'https://www.nhlbi.nih.gov/health-topics/blood-cholesterol' }
      ]
    },
    { 
      id: 'hemoglobin', 
      name: 'Hemoglobin', 
      icon: 'water-outline', 
      color: '#9C27B0', 
      category: 'blood', 
      subcategory: null 
    },
    
    // Heart related
    { 
      id: 'hdl', 
      name: 'HDL Cholesterol', 
      icon: 'heart-outline', 
      color: '#4CAF50', 
      category: 'organs', 
      subcategory: 'heart',
      description: 'High-density lipoprotein (HDL) cholesterol is known as the "good" cholesterol because it helps remove other forms of cholesterol from your bloodstream.',
      importance: 'Higher levels of HDL cholesterol are associated with a lower risk of heart disease. HDL acts like a scavenger, carrying LDL (bad) cholesterol away from the arteries and back to the liver, where it\'s broken down and passed from the body.',
      ranges: [
        { label: 'Low (Risk Factor)', value: 'Less than 40 mg/dL for men, Less than 50 mg/dL for women', color: '#F44336' },
        { label: 'Average', value: '40-59 mg/dL', color: '#FFC107' },
        { label: 'Optimal (Protective)', value: '60 mg/dL and above', color: '#4CAF50' }
      ],
      factors: [
        { title: 'Physical Activity', icon: 'fitness-outline', description: 'Regular exercise can raise HDL levels significantly.' },
        { title: 'Diet', icon: 'nutrition-outline', description: 'Healthy fats like those in olive oil, nuts, and fatty fish can boost HDL.' },
        { title: 'Smoking', icon: 'flame-outline', description: 'Quitting smoking can help increase HDL levels.' },
        { title: 'Weight', icon: 'body-outline', description: 'Losing excess weight can increase HDL levels.' }
      ],
      concerns: [
        { 
          title: 'Increased Cardiovascular Risk', 
          severity: 'high',
          description: 'Low HDL levels are associated with an increased risk of heart disease and stroke.' 
        }
      ],
      resources: [
        { title: 'American Heart Association', url: 'https://www.heart.org/' },
        { title: 'Mayo Clinic - HDL Cholesterol', url: 'https://www.mayoclinic.org/diseases-conditions/high-blood-cholesterol/in-depth/hdl-cholesterol/art-20046388' }
      ],
      percentileData: {
        value: 58,
        percentile: 78,
        target: 85
      },
      recommendations: [
        {
          title: 'Heart-Healthy Fats',
          icon: 'nutrition-outline',
          description: 'Include sources of healthy fats in your diet to boost HDL levels.',
          steps: [
            'Add olive oil, avocados, and nuts to your diet',
            'Eat fatty fish like salmon twice a week',
            'Limit saturated and trans fats',
            'Consider using plant sterols/stanols'
          ]
        },
        {
          title: 'Regular Aerobic Exercise',
          icon: 'fitness-outline',
          description: 'Consistent aerobic activity can significantly raise HDL levels.',
          steps: [
            'Aim for 30 minutes of moderate activity most days',
            'Include activities like brisk walking, swimming or cycling',
            'Gradually increase intensity over time',
            'Be consistent - regular exercise has cumulative benefits'
          ]
        }
      ]
    },
    { 
      id: 'ldl', 
      name: 'LDL Cholesterol', 
      icon: 'heart-outline', 
      color: '#FF5722', 
      category: 'organs', 
      subcategory: 'heart',
      description: 'Low-density lipoprotein (LDL) cholesterol is often called the "bad" cholesterol because it collects in the walls of your blood vessels, increasing your risk of health problems.',
      importance: 'LDL cholesterol contributes to fatty buildups in arteries (atherosclerosis), which increases the risk of heart attack, stroke, and peripheral artery disease.',
      ranges: [
        { label: 'Optimal', value: 'Less than 100 mg/dL', color: '#4CAF50' },
        { label: 'Near Optimal', value: '100-129 mg/dL', color: '#8BC34A' },
        { label: 'Borderline High', value: '130-159 mg/dL', color: '#FFC107' },
        { label: 'High', value: '160-189 mg/dL', color: '#FF9800' },
        { label: 'Very High', value: '190 mg/dL and above', color: '#F44336' }
      ],
      factors: [
        { title: 'Diet', icon: 'nutrition-outline', description: 'Foods high in saturated and trans fats can raise LDL levels.' },
        { title: 'Weight', icon: 'body-outline', description: 'Excess weight can increase LDL cholesterol.' },
        { title: 'Physical Activity', icon: 'fitness-outline', description: 'Regular exercise can help lower LDL cholesterol.' },
        { title: 'Genetics', icon: 'people-outline', description: 'Family history can influence your LDL levels.' }
      ],
      concerns: [
        { 
          title: 'Atherosclerosis', 
          severity: 'high',
          description: 'Buildup of plaque in arteries can restrict blood flow and lead to heart attacks or strokes.' 
        },
        { 
          title: 'Coronary Heart Disease', 
          severity: 'high',
          description: 'Reduced blood flow to the heart muscle due to plaque buildup can cause chest pain and heart attacks.' 
        }
      ],
      resources: [
        { title: 'American Heart Association', url: 'https://www.heart.org/' },
        { title: 'NIH - LDL Management', url: 'https://www.nhlbi.nih.gov/health-topics/blood-cholesterol' }
      ]
    },
    { 
      id: 'blood_pressure', 
      name: 'Blood Pressure', 
      icon: 'fitness-outline', 
      color: '#2C7BE5', 
      category: 'organs', 
      subcategory: 'heart' 
    },
    
    // Liver related
    { 
      id: 'alt', 
      name: 'ALT', 
      icon: 'medical-outline', 
      color: '#FB8C00', 
      category: 'organs', 
      subcategory: 'liver',
      description: 'Alanine Aminotransferase (ALT) is an enzyme primarily found in liver cells. When liver cells are damaged, ALT is released into the bloodstream.',
      importance: 'ALT is a key indicator of liver health. Elevated levels may suggest liver inflammation or damage from various causes, including viral hepatitis, alcohol consumption, or certain medications.',
      ranges: [
        { label: 'Normal (Men)', value: '7-55 U/L', color: '#4CAF50' },
        { label: 'Normal (Women)', value: '7-45 U/L', color: '#4CAF50' },
        { label: 'Elevated', value: 'Above 55 U/L for men, Above 45 U/L for women', color: '#F44336' }
      ],
      factors: [
        { title: 'Alcohol Consumption', icon: 'wine-outline', description: 'Excessive alcohol can damage liver cells and raise ALT levels.' },
        { title: 'Medications', icon: 'medkit-outline', description: 'Some medications can cause liver injury and elevated ALT.' },
        { title: 'Obesity', icon: 'body-outline', description: 'Non-alcoholic fatty liver disease is associated with elevated ALT.' },
        { title: 'Viral Infections', icon: 'bug-outline', description: 'Hepatitis viruses can cause liver inflammation and high ALT.' }
      ],
      concerns: [
        { 
          title: 'Liver Damage', 
          severity: 'high',
          description: 'Persistently elevated ALT may indicate ongoing liver injury that could lead to scarring or impaired function.' 
        },
        { 
          title: 'Medication Effects', 
          severity: 'borderline',
          description: 'Some common medications can temporarily raise ALT levels without causing significant liver damage.' 
        }
      ],
      resources: [
        { title: 'American Liver Foundation', url: 'https://liverfoundation.org/' },
        { title: 'Mayo Clinic - Liver Function Tests', url: 'https://www.mayoclinic.org/tests-procedures/liver-function-tests/about/pac-20394595' }
      ]
    },
    { 
      id: 'ast', 
      name: 'AST', 
      icon: 'medical-outline', 
      color: '#FB8C00', 
      category: 'organs', 
      subcategory: 'liver' 
    },
    { 
      id: 'alp', 
      name: 'ALP', 
      icon: 'medical-outline', 
      color: '#FB8C00', 
      category: 'organs', 
      subcategory: 'liver' 
    },
    { 
      id: 'bilirubin', 
      name: 'Bilirubin', 
      icon: 'medical-outline', 
      color: '#FB8C00', 
      category: 'organs', 
      subcategory: 'liver' 
    },
    
    // Kidney related
    { 
      id: 'creatinine', 
      name: 'Creatinine', 
      icon: 'water-outline', 
      color: '#43A047', 
      category: 'organs', 
      subcategory: 'kidney' 
    },
    { 
      id: 'urea', 
      name: 'Urea', 
      icon: 'water-outline', 
      color: '#43A047', 
      category: 'organs', 
      subcategory: 'kidney' 
    },
    { 
      id: 'uric_acid', 
      name: 'Uric Acid', 
      icon: 'water-outline', 
      color: '#43A047', 
      category: 'organs', 
      subcategory: 'kidney' 
    },
    
    // Thyroid related  
    { 
      id: 'tsh', 
      name: 'TSH', 
      icon: 'body-outline', 
      color: '#673AB7', 
      category: 'organs', 
      subcategory: 'thyroid' 
    },
    { 
      id: 't3', 
      name: 'T3', 
      icon: 'body-outline', 
      color: '#673AB7', 
      category: 'organs', 
      subcategory: 'thyroid' 
    },
    { 
      id: 't4', 
      name: 'T4', 
      icon: 'body-outline', 
      color: '#673AB7', 
      category: 'organs', 
      subcategory: 'thyroid' 
    },
    
    // Vitamins
    { 
      id: 'vitamin_d', 
      name: 'Vitamin D', 
      icon: 'sunny-outline', 
      color: '#FFB300', 
      category: 'vitamins', 
      subcategory: null,
      description: 'Vitamin D is a fat-soluble vitamin that helps your body absorb calcium and phosphorus, essential for building and maintaining strong bones.',
      importance: 'Besides bone health, Vitamin D plays a role in immune function, cell growth, neuromuscular function, and reduction of inflammation. Deficiency is common and linked to various health problems.',
      ranges: [
        { label: 'Deficient', value: 'Less than 20 ng/mL', color: '#F44336' },
        { label: 'Insufficient', value: '20-29 ng/mL', color: '#FFC107' },
        { label: 'Sufficient', value: '30-100 ng/mL', color: '#4CAF50' },
        { label: 'Potential Toxicity', value: 'Greater than 100 ng/mL', color: '#F44336' }
      ],
      factors: [
        { title: 'Sun Exposure', icon: 'sunny-outline', description: 'Your skin produces Vitamin D when exposed to sunlight.' },
        { title: 'Diet', icon: 'nutrition-outline', description: 'Few foods naturally contain Vitamin D; fatty fish, egg yolks, and fortified foods are sources.' },
        { title: 'Supplements', icon: 'medical-outline', description: 'Many people need supplements to maintain adequate levels.' },
        { title: 'Skin Pigmentation', icon: 'color-palette-outline', description: 'Darker skin produces less Vitamin D from sunlight.' }
      ],
      concerns: [
        { 
          title: 'Bone Health Issues', 
          severity: 'high',
          description: 'Deficiency can lead to rickets in children and osteomalacia or osteoporosis in adults.' 
        },
        { 
          title: 'Immune System Effects', 
          severity: 'borderline',
          description: 'Low levels may be associated with increased susceptibility to infections and autoimmune diseases.' 
        }
      ],
      resources: [
        { title: 'NIH - Vitamin D Fact Sheet', url: 'https://ods.od.nih.gov/factsheets/VitaminD-Consumer/' },
        { title: 'Endocrine Society Guidelines', url: 'https://www.endocrine.org/guidelines-and-clinical-practice/clinical-practice-guidelines' }
      ],
      percentileData: {
        value: 28,
        percentile: 35,
        target: 60
      },
      recommendations: [
        {
          title: 'Sun Exposure',
          icon: 'sunny-outline',
          description: 'Safe sun exposure is a natural way to boost vitamin D levels.',
          steps: [
            'Aim for 10-30 minutes of midday sun exposure several times weekly',
            'Expose face, arms, legs, or back without sunscreen',
            'Darker skin may need longer exposure times',
            'Be careful not to burn'
          ]
        },
        {
          title: 'Dietary Sources',
          icon: 'nutrition-outline',
          description: 'Include vitamin D-rich foods in your diet regularly.',
          steps: [
            'Eat fatty fish like salmon, mackerel, and tuna twice weekly',
            'Choose vitamin D-fortified foods like milk, orange juice, and cereals',
            'Include egg yolks and mushrooms in your diet',
            'Consider a vitamin D supplement if levels remain low'
          ]
        }
      ]
    },
    { 
      id: 'vitamin_b12', 
      name: 'Vitamin B12', 
      icon: 'leaf-outline', 
      color: '#8BC34A', 
      category: 'vitamins', 
      subcategory: null 
    },
    
    // Custom measurements
    { 
      id: 'weight', 
      name: 'Weight', 
      icon: 'scale-outline', 
      color: '#795548', 
      category: 'custom', 
      subcategory: null 
    },
    { 
      id: 'bmi', 
      name: 'BMI', 
      icon: 'body-outline', 
      color: '#607D8B', 
      category: 'custom', 
      subcategory: null 
    }
  ];

  // Rich mock data with status indicators and sources
  const mockMetricsData = {
    hdl: [
      { id: 1, date: '2023-05-20', time: '08:30 AM', value: '58', status: 'normal', source: 'report', context: 'fasting', notes: 'Annual checkup' },
      { id: 2, date: '2023-04-15', time: '09:15 AM', value: '52', status: 'normal', source: 'report', context: 'fasting', notes: 'Quarterly test' },
      { id: 3, date: '2023-03-10', time: '08:45 AM', value: '48', status: 'normal', source: 'report', context: 'fasting', notes: '' },
      { id: 4, date: '2023-02-01', time: '09:30 AM', value: '45', status: 'borderline', source: 'report', context: 'fasting', notes: 'Began exercise program' },
      { id: 5, date: '2023-01-05', time: '08:15 AM', value: '42', status: 'borderline', source: 'report', context: 'fasting', notes: '' },
      { id: 6, date: '2022-12-01', time: '09:00 AM', value: '38', status: 'high', source: 'report', context: 'fasting', notes: 'Initial assessment' },
    ],
    ldl: [
      { id: 1, date: '2023-05-20', time: '08:30 AM', value: '115', status: 'borderline', source: 'report', context: 'fasting', notes: 'Annual checkup' },
      { id: 2, date: '2023-04-15', time: '09:15 AM', value: '125', status: 'borderline', source: 'report', context: 'fasting', notes: 'Quarterly test' },
      { id: 3, date: '2023-03-10', time: '08:45 AM', value: '135', status: 'borderline', source: 'report', context: 'fasting', notes: '' },
      { id: 4, date: '2023-02-01', time: '09:30 AM', value: '148', status: 'borderline', source: 'report', context: 'fasting', notes: 'Started diet changes' },
      { id: 5, date: '2023-01-05', time: '08:15 AM', value: '155', status: 'high', source: 'report', context: 'fasting', notes: '' },
      { id: 6, date: '2022-12-01', time: '09:00 AM', value: '162', status: 'high', source: 'report', context: 'fasting', notes: 'Initial assessment' },
    ],
    blood_pressure: [
      { id: 1, date: '2023-05-20', time: '08:30 AM', value: '120/80', status: 'normal', source: 'manual', context: 'resting', notes: '' },
      { id: 2, date: '2023-05-19', time: '07:45 AM', value: '118/78', status: 'normal', source: 'manual', context: 'resting', notes: '' },
      { id: 3, date: '2023-05-18', time: '09:00 AM', value: '122/82', status: 'normal', source: 'manual', context: 'resting', notes: '' },
      { id: 4, date: '2023-05-15', time: '07:30 AM', value: '145/95', status: 'high', source: 'report', context: 'resting', notes: 'From Annual Health Check' },
      { id: 5, date: '2023-05-14', time: '08:45 AM', value: '125/85', status: 'borderline', source: 'manual', context: 'after_meal', notes: 'After dinner' },
    ],
    alt: [
      { id: 1, date: '2023-05-15', time: '07:30 AM', value: '55', status: 'high', source: 'report', context: 'fasting', notes: 'From Annual Health Check' },
      { id: 2, date: '2023-02-10', time: '08:30 AM', value: '42', status: 'borderline', source: 'report', context: 'fasting', notes: 'Quarterly checkup' },
      { id: 3, date: '2022-11-15', time: '09:00 AM', value: '35', status: 'normal', source: 'report', context: 'fasting', notes: 'Regular checkup' },
    ],
    vitamin_d: [
      { id: 1, date: '2023-05-15', time: '07:30 AM', value: '28', status: 'borderline', source: 'report', context: 'fasting', notes: 'From Annual Health Check - Insufficient' },
      { id: 2, date: '2023-02-10', time: '08:30 AM', value: '22', status: 'high', source: 'report', context: 'fasting', notes: 'Started vitamin D supplements' },
      { id: 3, date: '2022-11-15', time: '09:00 AM', value: '15', status: 'high', source: 'report', context: 'fasting', notes: 'Initial test - Deficient' },
    ],
    // Add similar data structure for other metrics
  };
  
  // Reference ranges for each metric
  const referenceRanges = {
    heart_rate: { min: 60, max: 100, unit: 'bpm', warningLow: 50, warningHigh: 90 },
    blood_pressure: { min: '90/60', max: '120/80', unit: 'mmHg', warningLow: '90/60', warningHigh: '140/90' },
    blood_sugar: { min: 70, max: 99, unit: 'mg/dL', warningLow: 65, warningHigh: 130, criticalLow: 55, criticalHigh: 180 },
    alt: { min: 7, max: 40, unit: 'U/L', warningHigh: 50, criticalHigh: 200 },
    vitamin_d: { min: 30, max: 100, unit: 'ng/mL', warningLow: 20, criticalLow: 12 },
    oxygen_level: { min: 95, max: 100, unit: '%', warningLow: 92, criticalLow: 90 },
    hdl: { min: 40, max: 60, unit: 'mg/dL', warningLow: 35 },
    ldl: { min: 0, max: 100, unit: 'mg/dL', warningHigh: 130, criticalHigh: 160 },
    cholesterol: { min: 125, max: 200, unit: 'mg/dL', warningHigh: 240, criticalHigh: 300 },
    creatinine: { min: 0.7, max: 1.3, unit: 'mg/dL', warningHigh: 1.5, criticalHigh: 2.0 },
    tsh: { min: 0.4, max: 4.0, unit: 'mIU/L', warningLow: 0.1, warningHigh: 6.0, criticalLow: 0.01, criticalHigh: 10.0 },
  };
  
  // Health insights - AI generated recommendations based on metrics
  const healthInsights = [
    { 
      metricId: 'vitamin_d', 
      title: 'Low Vitamin D Levels',
      description: 'Your Vitamin D levels are below the recommended range. Consider a supplement after consulting with your doctor.',
      severity: 'warning',
      date: '2023-05-16'
    },
    { 
      metricId: 'alt', 
      title: 'Elevated Liver Enzymes',
      description: 'Your ALT levels are above normal. This could indicate liver stress. Avoid alcohol and consult your doctor at your next appointment.',
      severity: 'attention',
      date: '2023-05-16'
    },
    { 
      metricId: 'hdl', 
      title: 'HDL Levels Improving',
      description: 'Your HDL (good cholesterol) has improved by 52.6% over the past 6 months. Keep up the good work with your current lifestyle changes!',
      severity: 'positive',
      date: '2023-05-20'
    },
  ];

  useEffect(() => {
    // Simulate loading metrics
    setTimeout(() => {
      setMetrics(mockMetricsData);
      setIsLoading(false);
    }, 1500);
  }, []);

  // Helper Functions
  const getMetricUnit = (metricId) => {
    return referenceRanges[metricId]?.unit || '';
  };

  const getMetricColor = (metricId) => {
    return metricTypes.find(m => m.id === metricId)?.color || '#2C7BE5';
  };

  const getCurrentMetricValue = () => {
    if (!metrics[selectedMetric] || metrics[selectedMetric].length === 0) return 'N/A';
    return metrics[selectedMetric][0].value;
  };
  
  const getStatusForValue = (metricId, value) => {
    if (!referenceRanges[metricId]) return 'normal';
    
    const range = referenceRanges[metricId];
    const numValue = parseFloat(value);
    
    // Handle compound values like blood pressure
    if (metricId === 'blood_pressure' && value.includes('/')) {
      const [systolic, diastolic] = value.split('/').map(v => parseInt(v.trim()));
      const [maxSys, maxDia] = range.max.split('/').map(v => parseInt(v.trim()));
      const [warnSys, warnDia] = range.warningHigh.split('/').map(v => parseInt(v.trim()));
      
      if (systolic > warnSys || diastolic > warnDia) return 'high';
      if (systolic > maxSys || diastolic > maxDia) return 'borderline';
      return 'normal';
    }
    
    // For regular numeric values
    if (range.criticalLow && numValue <= range.criticalLow) return 'high';
    if (range.criticalHigh && numValue >= range.criticalHigh) return 'high';
    if (range.warningLow && numValue <= range.warningLow) return 'borderline';
    if (range.warningHigh && numValue >= range.warningHigh) return 'borderline';
    
    if (range.min && range.max) {
      if (numValue < range.min || numValue > range.max) return 'borderline';
    }
    
    return 'normal';
  };
  
  const getChangeSinceLastMeasurement = () => {
    if (!metrics[selectedMetric] || metrics[selectedMetric].length < 2) return null;
    
    const current = parseFloat(metrics[selectedMetric][0].value);
    let previous;
    
  // Handle blood pressure specially
    if (selectedMetric === 'blood_pressure') {
      const [currentSys] = metrics[selectedMetric][0].value.split('/').map(v => parseInt(v.trim()));
      const [previousSys] = metrics[selectedMetric][1].value.split('/').map(v => parseInt(v.trim()));
      const change = ((currentSys - previousSys) / previousSys * 100).toFixed(1);
      return { percent: change, value: currentSys - previousSys };
    }
    
    // For normal metrics
    previous = parseFloat(metrics[selectedMetric][1].value);
    const change = ((current - previous) / previous * 100).toFixed(1);
    return { percent: change, value: (current - previous).toFixed(1) };
  };

  // Function to filter metrics based on selected category and subcategory
  const getFilteredMetrics = () => {
    if (selectedCategory === 'all') {
      // Return all metric types with at least one measurement
      return metricTypes.filter(metric => 
        metrics[metric.id] && metrics[metric.id].length > 0
      );
    }
    
    if (selectedCategory === 'organs' && selectedSubCategory) {
      // Return metrics for the selected organ
      return metricTypes.filter(metric => 
        metric.category === 'organs' && 
        metric.subcategory === selectedSubCategory
      );
    }
    
    // Return metrics for the selected category
    return metricTypes.filter(metric => metric.category === selectedCategory);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(null);
    
    // Auto-select the first metric in this category that has data
    const filtered = metricTypes.filter(m => m.category === categoryId);
    if (filtered.length > 0) {
      // Find the first metric with data, or just use the first one
      const withData = filtered.find(m => metrics[m.id] && metrics[m.id].length > 0);
      setSelectedMetric(withData ? withData.id : filtered[0].id);
    }
  };
  
  // Handle subcategory selection for organs
  const handleSubCategorySelect = (subCategoryId) => {
    setSelectedSubCategory(subCategoryId);
    
    // Auto-select the first metric in this subcategory
    const filtered = metricTypes.filter(
      m => m.category === 'organs' && m.subcategory === subCategoryId
    );
    if (filtered.length > 0) {
      // Find the first metric with data, or just use the first one
      const withData = filtered.find(m => metrics[m.id] && metrics[m.id].length > 0);
      setSelectedMetric(withData ? withData.id : filtered[0].id);
    }
  };

  // Get insights relevant to the selected metric
  const getRelevantInsights = () => {
    return healthInsights.filter(insight => insight.metricId === selectedMetric);
  };
  
  // Open info modal with the selected metric's details
  const handleInfoPress = () => {
    const metricInfo = metricTypes.find(m => m.id === selectedMetric);
    if (metricInfo) {
      setSelectedMetricInfo(metricInfo);
      setShowInfoModal(true);
    }
  };
  
  // Handle opening goal setting modal
  const handleSetGoal = () => {
    setShowGoalModal(true);
  };
  
  // Handle opening recommendations modal
  const handleViewRecommendations = () => {
    setShowRecommendationsModal(true);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#38BFA7" style={styles.loader} />
        ) : (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {/* Top level category selector */}
            <View style={styles.categorySelector}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && styles.categoryButtonActive
                    ]}
                    onPress={() => handleCategorySelect(category.id)}
                  >
                    <Ionicons 
                      name={category.icon} 
                      size={16} 
                      color={selectedCategory === category.id ? '#fff' : '#aaa'} 
                    />
                    <Text 
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === category.id && styles.categoryButtonTextActive
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Subcategory selector (shown only for organs) */}
            {selectedCategory === 'organs' && (
              <View style={styles.subCategorySelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {organCategories.map(organ => (
                    <TouchableOpacity
                      key={organ.id}
                      style={[
                        styles.subCategoryButton,
                        selectedSubCategory === organ.id && { 
                          backgroundColor: `${organ.color}20`, 
                          borderColor: organ.color 
                        }
                      ]}
                      onPress={() => handleSubCategorySelect(organ.id)}
                    >
                      <Ionicons name={organ.icon} size={20} color={organ.color} />
                      <Text 
                        style={[
                          styles.subCategoryButtonText, 
                          selectedSubCategory === organ.id && { color: organ.color }
                        ]}
                      >
                        {organ.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            
            {/* Metric selector */}
            <View style={styles.metricSelector}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {getFilteredMetrics().map(metric => (
                  <TouchableOpacity
                    key={metric.id}
                    style={[
                      styles.metricTypeButton,
                      selectedMetric === metric.id && { 
                        backgroundColor: `${metric.color}20`, 
                        borderColor: metric.color 
                      }
                    ]}
                    onPress={() => setSelectedMetric(metric.id)}
                  >
                    <Ionicons name={metric.icon} size={20} color={metric.color} />
                    <Text style={[styles.metricTypeText, selectedMetric === metric.id && { color: metric.color }]}>
                      {metric.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Current Value Card */}
            <LinearGradient
              colors={[`${getMetricColor(selectedMetric)}30`, `${getMetricColor(selectedMetric)}10`]}
              style={styles.currentValueCard}
            >
              <View style={styles.currentValueHeader}>
                <Text style={styles.currentValueLabel}>Current Value</Text>
                <TouchableOpacity 
                  style={styles.infoButton}
                  onPress={handleInfoPress}
                >
                  <Ionicons name="information-circle-outline" size={22} color={getMetricColor(selectedMetric)} />
                </TouchableOpacity>
              </View>
              
              {metrics[selectedMetric] && metrics[selectedMetric].length > 0 ? (
                <>
                  <View style={styles.currentValueContainer}>
                    <Text style={[styles.currentValue, { color: getMetricColor(selectedMetric) }]}>
                      {getCurrentMetricValue()}
                    </Text>
                    <Text style={styles.currentValueUnit}>
                      {getMetricUnit(selectedMetric)}
                    </Text>
                  </View>
                  
                  {/* Status indicator */}
                  <View style={styles.statusContainer}>
                    {metrics[selectedMetric][0].status === 'normal' && (
                      <View style={styles.statusBadge}>
                        <View style={[styles.statusIndicator, styles.statusNormal]} />
                        <Text style={styles.statusText}>Normal</Text>
                      </View>
                    )}
                    
                    {metrics[selectedMetric][0].status === 'borderline' && (
                      <View style={styles.statusBadge}>
                        <View style={[styles.statusIndicator, styles.statusBorderline]} />
                        <Text style={styles.statusText}>Borderline</Text>
                      </View>
                    )}
                    
                    {metrics[selectedMetric][0].status === 'high' && (
                      <View style={styles.statusBadge}>
                        <View style={[styles.statusIndicator, styles.statusHigh]} />
                        <Text style={styles.statusText}>Attention Needed</Text>
                      </View>
                    )}
                  </View>
                  
                  {/* Reference range */}
                  {referenceRanges[selectedMetric] && (
                    <Text style={styles.referenceRange}>
                      Normal range: {referenceRanges[selectedMetric].min} - {referenceRanges[selectedMetric].max} {referenceRanges[selectedMetric].unit}
                    </Text>
                  )}
                  
                  {/* Change since last measurement */}
                  {getChangeSinceLastMeasurement() && (
                    <View style={styles.changeContainer}>
                      <Text style={styles.changeLabel}>Change from previous:</Text>
                      <Text 
                        style={[
                          styles.changeValue, 
                          parseFloat(getChangeSinceLastMeasurement().percent) > 0 
                            ? styles.increaseValue 
                            : parseFloat(getChangeSinceLastMeasurement().percent) < 0
                              ? styles.decreaseValue
                              : styles.unchangedValue
                        ]}
                      >
                        {parseFloat(getChangeSinceLastMeasurement().percent) > 0 ? '+' : ''}
                        {getChangeSinceLastMeasurement().percent}% 
                        ({parseFloat(getChangeSinceLastMeasurement().value) > 0 ? '+' : ''}
                        {getChangeSinceLastMeasurement().value} {getMetricUnit(selectedMetric)})
                      </Text>
                    </View>
                  )}
                  
                  {/* Last measurement date */}
                  <Text style={styles.measurementDate}>
                    Last measured: {metrics[selectedMetric][0].date}, {metrics[selectedMetric][0].time}
                    {metrics[selectedMetric][0].context && (
                      <Text> ({metrics[selectedMetric][0].context.replace('_', ' ')})</Text>
                    )}
                  </Text>
                  
                  {/* Percentile data (shown for certain metrics) */}
                  {metricTypes.find(m => m.id === selectedMetric)?.percentileData && (
                    <View style={styles.percentileContainer}>
                      <Text style={styles.percentileTitle}>Your {metricTypes.find(m => m.id === selectedMetric)?.name} ranks in the top {metricTypes.find(m => m.id === selectedMetric)?.percentileData.percentile}%</Text>
                      <View style={styles.percentileBarContainer}>
                        <View style={styles.percentileBar}>
                          <View 
                            style={[
                              styles.percentileFill, 
                              { width: `${metricTypes.find(m => m.id === selectedMetric)?.percentileData.percentile}%` }
                            ]} 
                          />
                          <View 
                            style={[
                              styles.percentileTarget,
                              { left: `${metricTypes.find(m => m.id === selectedMetric)?.percentileData.target}%` }
                            ]}
                          />
                        </View>
                      </View>
                      <TouchableOpacity 
                        style={styles.recommendationsButton}
                        onPress={handleViewRecommendations}
                      >
                        <Text style={styles.recommendationsButtonText}>
                          Next target: Top {metricTypes.find(m => m.id === selectedMetric)?.percentileData.target}% - View Recommendations
                        </Text>
                        <Ionicons name="chevron-forward" size={16} color={getMetricColor(selectedMetric)} />
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No measurements available</Text>
                  <Text style={styles.noDataSubtext}>Add your first measurement below</Text>
                </View>
              )}
              
              <View style={styles.metricButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: getMetricColor(selectedMetric) }]}
                  onPress={() => setShowAddModal(true)}
                >
                  <Ionicons name="add" size={16} color="#fff" />
                  <Text style={styles.addButtonText}>Add Measurement</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.goalButton, { borderColor: getMetricColor(selectedMetric) }]}
                  onPress={handleSetGoal}
                >
                  <Ionicons name="flag-outline" size={16} color={getMetricColor(selectedMetric)} />
                  <Text style={[styles.goalButtonText, { color: getMetricColor(selectedMetric) }]}>Set Goal</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
            
            {/* Relevant Insights */}
            {getRelevantInsights().length > 0 && (
              <View style={styles.insightsCard}>
                <Text style={styles.insightsTitle}>Health Insights</Text>
                {getRelevantInsights().map((insight, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.insightItem,
                      insight.severity === 'warning' && styles.insightWarning,
                      insight.severity === 'attention' && styles.insightAttention,
                      insight.severity === 'positive' && styles.insightPositive,
                    ]}
                  >
                    <View style={styles.insightHeader}>
                      {insight.severity === 'warning' && <Ionicons name="warning-outline" size={20} color="#FFC107" />}
                      {insight.severity === 'attention' && <Ionicons name="alert-circle-outline" size={20} color="#F44336" />}
                      {insight.severity === 'positive' && <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />}
                      <Text style={styles.insightTitle}>{insight.title}</Text>
                    </View>
                    <Text style={styles.insightDescription}>{insight.description}</Text>
                    <Text style={styles.insightDate}>{insight.date}</Text>
                  </View>
                ))}
              </View>
            )}
            
            {/* Chart Card */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Recent Trend</Text>
                <View style={styles.timeframeButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.timeframeButton, 
                      timeframe === 'week' && styles.timeframeButtonActive
                    ]}
                    onPress={() => setTimeframe('week')}
                  >
                    <Text 
                      style={[
                        styles.timeframeButtonText, 
                        timeframe === 'week' && styles.timeframeButtonTextActive
                      ]}
                    >
                      Week
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.timeframeButton, 
                      timeframe === 'month' && styles.timeframeButtonActive
                    ]}
                    onPress={() => setTimeframe('month')}
                  >
                    <Text 
                      style={[
                        styles.timeframeButtonText, 
                        timeframe === 'month' && styles.timeframeButtonTextActive
                      ]}
                    >
                      Month
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.timeframeButton, 
                      timeframe === 'year' && styles.timeframeButtonActive
                    ]}
                    onPress={() => setTimeframe('year')}
                  >
                    <Text 
                      style={[
                        styles.timeframeButtonText, 
                        timeframe === 'year' && styles.timeframeButtonTextActive
                      ]}
                    >
                      Year
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {metrics[selectedMetric] && metrics[selectedMetric].length > 0 ? (
                <>
                  <LineChart 
                    data={metrics[selectedMetric]} 
                    referenceRanges={referenceRanges[selectedMetric]}
                    color={getMetricColor(selectedMetric)}
                    timeframe={timeframe}
                  />
                  
                  {/* Sample annotation for HDL - only shown for this metric in the demo */}
                  {selectedMetric === 'hdl' && (
                    <Annotation 
                      title="Started Diet Changes" 
                      description="Started Mediterranean diet and daily 30-minute walks"
                      color={getMetricColor(selectedMetric)}
                    />
                  )}
                </>
              ) : (
                <View style={styles.noChartDataContainer}>
                  <Ionicons name="analytics-outline" size={40} color="#555" />
                  <Text style={styles.noChartDataText}>Not enough data to show trend</Text>
                  <Text style={styles.noChartDataSubtext}>Add measurements to see your trends over time</Text>
                </View>
              )}
            </View>
            
            {/* History Card */}
            <View style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>History</Text>
                
                {/* Filter button (for future implementation) */}
                <TouchableOpacity style={styles.filterButton}>
                  <Ionicons name="filter-outline" size={18} color="#aaa" />
                  <Text style={styles.filterButtonText}>Filter</Text>
                </TouchableOpacity>
              </View>
              
              {metrics[selectedMetric] && metrics[selectedMetric].length > 0 ? (
                metrics[selectedMetric].map((item, index) => (
                  <View key={index} style={styles.historyItem}>
                    <View style={styles.historyItemLeft}>
                      <Text style={styles.historyDate}>{item.date}</Text>
                      <View style={styles.historySourceContainer}>
                        {item.source === 'report' ? (
                          <View style={styles.historySource}>
                            <Ionicons name="document-text-outline" size={12} color="#aaa" />
                            <Text style={styles.historySourceText}>Medical Report</Text>
                          </View>
                        ) : (
                          <View style={styles.historySource}>
                            <Ionicons name="create-outline" size={12} color="#aaa" />
                            <Text style={styles.historySourceText}>Manual Entry</Text>
                          </View>
                        )}
                        
                        {item.context && (
                          <Text style={styles.historyContext}>
                            {item.context.replace('_', ' ')}
                          </Text>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.historyItemRight}>
                      <View style={styles.historyValueContainer}>
                        <Text style={[
                          styles.historyValue,
                          item.status === 'borderline' && styles.historyValueBorderline,
                          item.status === 'high' && styles.historyValueHigh,
                        ]}>
                          {item.value}
                        </Text>
                        <Text style={styles.historyUnit}>{getMetricUnit(selectedMetric)}</Text>
                      </View>
                      
                      {/* Status indicator */}
                      <View 
                        style={[
                          styles.historyStatusIndicator,
                          item.status === 'normal' && styles.statusNormal,
                          item.status === 'borderline' && styles.statusBorderline,
                          item.status === 'high' && styles.statusHigh,
                        ]} 
                      />
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No history available</Text>
              )}
            </View>
            
            {/* Extra padding at the bottom to prevent content from being hidden behind the navbar */}
            <View style={styles.bottomPadding} />
          </ScrollView>
        )}
      </SafeAreaView>
      
      {/* Add New Measurement Modal */}
      <AddMeasurementModal 
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        metricType={metricTypes.find(m => m.id === selectedMetric)?.name || ''}
        metricColor={getMetricColor(selectedMetric)}
        metricUnit={getMetricUnit(selectedMetric)}
        metricCategory={metricTypes.find(m => m.id === selectedMetric)?.category}
        metricSubCategory={metricTypes.find(m => m.id === selectedMetric)?.subcategory}
      />
      
      {/* Metric Info Modal */}
      <MetricInfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        metric={selectedMetricInfo}
        color={getMetricColor(selectedMetric)}
      />
      
      {/* Goal Setting Modal */}
      <GoalSettingModal
        visible={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        metric={metricTypes.find(m => m.id === selectedMetric)}
        metricColor={getMetricColor(selectedMetric)}
        currentValue={getCurrentMetricValue()}
      />
      
      {/* Recommendations Modal */}
      <RecommendationsModal
        visible={showRecommendationsModal}
        onClose={() => setShowRecommendationsModal(false)}
        metric={metricTypes.find(m => m.id === selectedMetric)}
        color={getMetricColor(selectedMetric)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Extra padding at the bottom
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Category Selectors
  categorySelector: {
    padding: 15,
    paddingBottom: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#38BFA7',
  },
  categoryButtonText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#aaa',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  
  // Subcategory selector
  subCategorySelector: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  subCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  subCategoryButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#ddd',
  },
  
  // Metric selector
  metricSelector: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  metricTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricTypeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#ddd',
  },
  
  // Current Value Card
  currentValueCard: {
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  currentValueHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentValueLabel: {
    fontSize: 14,
    color: '#bbb',
  },
  infoButton: {
    padding: 5,
  },
  currentValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 10,
  },
  currentValue: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  currentValueUnit: {
    fontSize: 16,
    color: '#aaa',
    marginLeft: 5,
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
  noDataSubtext: {
    color: '#777',
    fontSize: 14,
    marginTop: 5,
  },
  statusContainer: {
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusNormal: {
    backgroundColor: '#4CAF50',
  },
  statusBorderline: {
    backgroundColor: '#FFC107',
  },
  statusHigh: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#ddd',
    fontSize: 12,
  },
  referenceRange: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 5,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  changeLabel: {
    color: '#aaa',
    fontSize: 13,
    marginRight: 5,
  },
  changeValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  increaseValue: {
    color: '#4CAF50',
  },
  decreaseValue: {
    color: '#F44336',
  },
  unchangedValue: {
    color: '#FFC107',
  },
  measurementDate: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 5,
  },
  metricButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  goalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  goalButtonText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  
  // Percentile display
  percentileContainer: {
    width: '100%',
    marginTop: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    padding: 12,
  },
  percentileTitle: {
    color: '#eee',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  percentileBarContainer: {
    marginVertical: 5,
  },
  percentileBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  percentileFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  percentileTarget: {
    position: 'absolute',
    top: -3,
    width: 2,
    height: 14,
    backgroundColor: '#FFC107',
  },
  recommendationsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  recommendationsButtonText: {
    color: '#ddd',
    fontSize: 12,
  },
  
  // Insights card
  insightsCard: {
    backgroundColor: '#1E1E1E',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 16,
  },
 insightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  insightItem: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  insightWarning: {
    borderLeftWidth: 3,
    borderLeftColor: '#FFC107',
  },
  insightAttention: {
    borderLeftWidth: 3,
    borderLeftColor: '#F44336',
  },
  insightPositive: {
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  insightTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  insightDescription: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 18,
  },
  insightDate: {
    color: '#777',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },
  
  // Chart Card
  chartCard: {
    backgroundColor: '#1E1E1E',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeframeButtons: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timeframeButtonActive: {
    backgroundColor: '#38BFA7',
  },
  timeframeButtonText: {
    fontSize: 12,
    color: '#aaa',
  },
  timeframeButtonTextActive: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  chartPlaceholder: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  noChartDataContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
  },
  noChartDataText: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 10,
  },
  noChartDataSubtext: {
    color: '#777',
    fontSize: 13,
    marginTop: 5,
  },
  annotation: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    borderLeftWidth: 3,
  },
  annotationTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  annotationText: {
    color: '#aaa',
    fontSize: 12,
  },
  
  // History Card
  historyCard: {
    backgroundColor: '#1E1E1E',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  filterButtonText: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 5,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyItemLeft: {
    flex: 1,
  },
  historyItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDate: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 2,
  },
  historySourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historySource: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  historySourceText: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 3,
  },
  historyContext: {
    fontSize: 12,
    color: '#777',
    textTransform: 'capitalize',
  },
  historyValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  historyValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  historyValueBorderline: {
    color: '#FFC107',
  },
  historyValueHigh: {
    color: '#F44336',
  },
  historyUnit: {
    fontWeight: 'normal',
    color: '#aaa',
    fontSize: 12,
    marginLeft: 2,
  },
  historyStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  
  // Bottom padding
  bottomPadding: {
    height: 100, // Extra padding at the bottom to prevent content being hidden by the navbar
  },
  
  // Modal styles - Add New Measurement
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalScrollView: {
    maxHeight: '60%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  valueInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  valueInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    fontSize: 16,
  },
  valueUnit: {
    color: '#aaa',
    fontSize: 16,
  },
  notesInput: {
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
  },
  contextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  contextButtonText: {
    color: '#ddd',
    fontSize: 13,
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Modal styles - Metric Info
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoModalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  infoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoModalBody: {
    maxHeight: '70%',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoSectionText: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
  },
  rangeContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  rangeIndicator: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  rangeLow: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  rangeOptimal: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  rangeHigh: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  rangeText: {
    color: '#fff',
    fontSize: 12,
  },
  rangeDetails: {
    marginTop: 12,
  },
  rangeDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rangeDetailDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  rangeDetailText: {
    color: '#ddd',
    fontSize: 13,
  },
  rangeDetailTitle: {
    fontWeight: '500',
  },
  factorsList: {
    marginTop: 5,
  },
  factorItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  factorIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#38BFA7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  factorContent: {
    flex: 1,
  },
  factorTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 3,
  },
  factorDescription: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 18,
  },
  concernsList: {
    marginTop: 5,
  },
  concernItem: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  concernTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  concernDescription: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 18,
  },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  resourceLinkText: {
    color: '#38BFA7',
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
  infoSourceText: {
    color: '#777',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius:
    8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Modal styles - Goal Setting
  goalCurrentValue: {
    alignItems: 'center',
    marginBottom: 20,
  },
  goalCurrentValueLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 5,
  },
  goalCurrentValueText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  reminderToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleButton: {
    width: 50,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  toggleHandle: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    top: 2,
  },
  goalSuggestion: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#FFC107',
  },
  goalSuggestionText: {
    color: '#ddd',
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 10,
    flex: 1,
  },
  
  // Modal styles - Recommendations
  recommendationsContainer: {
    maxHeight: '70%',
  },
  recommendationItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendationIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  recommendationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  recommendationDescription: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  recommendationSteps: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 10,
  },
  recommendationStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationStepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#38BFA7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  recommendationStepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendationStepText: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  recommendationSourceInfo: {
    marginTop: 20,
    marginBottom: 10,
  },
  recommendationSourceText: {
    color: '#777',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});