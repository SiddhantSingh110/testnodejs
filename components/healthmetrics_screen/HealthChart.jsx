// app/tabs/health/components/HealthChart.jsx
import React from 'react';
import { View, Text } from 'react-native';
import Svg, { 
  Path,
  Circle,
  Line,
  G,
  Text as SvgText
} from 'react-native-svg';
import { styles } from '../../styles/healthmetrics_screen/HealthMetrics.styles';

// Helper function to safely convert values to numbers
const safeParseFloat = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

// Helper function to safely check if a number is valid
const isValidNumber = (value) => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

// Generate SVG path for line chart
const generatePath = (data, height, width, maxValue, minValue) => {
  if (!data || data.length === 0) return '';
  
  const range = maxValue - minValue;
  if (range === 0) return ''; // Avoid division by zero
  
  const padding = 20;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);
  
  const getX = (index) => padding + (index * (chartWidth / Math.max(data.length - 1, 1)));
  const getY = (value) => {
    const numValue = safeParseFloat(value);
    if (!isValidNumber(numValue) || !isValidNumber(minValue) || !isValidNumber(range)) {
      return height / 2; // Return middle position for invalid values
    }
    return height - padding - ((numValue - minValue) / range) * chartHeight;
  };
  
  // Get first valid data point
  let startIndex = 0;
  while (startIndex < data.length && !isValidNumber(safeParseFloat(data[startIndex].value))) {
    startIndex++;
  }
  
  if (startIndex >= data.length) return ''; // No valid data points
  
  let path = `M ${getX(startIndex)} ${getY(data[startIndex].value)}`;
  
  for (let i = startIndex + 1; i < data.length; i++) {
    const value = safeParseFloat(data[i].value);
    if (isValidNumber(value)) {
      path += ` L ${getX(i)} ${getY(data[i].value)}`;
    }
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
   
  // Sort data from oldest to newest (left to right on chart)
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Extract numeric values for min/max calculation with safety checks
  const values = sortedData.map(item => {
    if (typeof item.value === 'string' && item.value.includes('/')) {
      // Handle blood pressure (use systolic)
      return safeParseFloat(item.value.split('/')[0]);
    }
    return safeParseFloat(item.value);
  }).filter(v => isValidNumber(v)); // Filter out invalid values
  
  if (values.length === 0) {
    return (
      <View style={[styles.chartPlaceholder, { height, backgroundColor: color + '10' }]}>
        <Text style={{ color: '#aaa' }}>No valid data points to display</Text>
      </View>
    );
  }

  // Determine min and max values with padding
  let minValue = Math.min(...values);
  let maxValue = Math.max(...values);
  
  // Use reference ranges if available and valid
  if (referenceRanges) {
    if (isValidNumber(referenceRanges.min)) {
      minValue = Math.min(minValue, referenceRanges.min);
    }
    if (isValidNumber(referenceRanges.max)) {
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
  
  // Final safety check
  if (!isValidNumber(minValue) || !isValidNumber(maxValue) || minValue === maxValue) {
    return (
      <View style={[styles.chartPlaceholder, { height, backgroundColor: color + '10' }]}>
        <Text style={{ color: '#aaa' }}>Unable to calculate chart range</Text>
      </View>
    );
  }
  
  // Determine reference lines with safety checks
  const refLines = [];
  if (referenceRanges) {
    if (isValidNumber(referenceRanges.min)) {
      refLines.push({ value: referenceRanges.min, label: 'Min', color: '#FFC107' });
    }
    if (isValidNumber(referenceRanges.max)) {
      refLines.push({ value: referenceRanges.max, label: 'Max', color: '#FFC107' });
    }
  }
  
  // Determine data points (subsampled if there are too many)
  const dataPoints = [];
  const maxPoints = 10;
  const step = sortedData.length <= maxPoints ? 1 : Math.floor(sortedData.length / maxPoints);
  
  for (let i = 0; i < sortedData.length; i += step) {
    const value = safeParseFloat(sortedData[i].value);
    if (isValidNumber(value)) {
      dataPoints.push(sortedData[i]);
    }
  }
  
  // Always include the most recent point if it's valid
  if (step > 1 && sortedData.length > 0) {
    const lastPoint = sortedData[sortedData.length - 1];
    const lastValue = safeParseFloat(lastPoint.value);
    if (isValidNumber(lastValue) && !dataPoints.includes(lastPoint)) {
      dataPoints.push(lastPoint);
    }
  }
  
  // Generate line chart SVG using sorted data
  const linePath = generatePath(sortedData, height, width, maxValue, minValue);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <View style={[styles.chartContainer, { height }]}>
      <Svg width={width} height={height}>
        {/* Reference area - only render if both min and max are valid */}
        {referenceRanges && 
         isValidNumber(referenceRanges.min) && 
         isValidNumber(referenceRanges.max) && (
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
        
        {/* Reference lines - only render valid ones */}
        {refLines.map((line, index) => {
          const yPos = height - 20 - ((line.value - minValue) / (maxValue - minValue)) * (height - 40);
          if (!isValidNumber(yPos)) return null;
          
          return (
            <G key={index}>
              <Line
                x1={20}
                y1={yPos}
                x2={width - 20}
                y2={yPos}
                stroke={line.color}
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              <SvgText
                x={width - 25}
                y={yPos - 5}
                fill={line.color}
                fontSize={10}
                textAnchor="end"
              >
                {line.label} {line.value}
              </SvgText>
            </G>
          );
        })}
        
        {/* Data line - only render if path is valid */}
        {linePath && (
          <Path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
          />
        )}
          
        {/* Data points - only render valid ones */}
        {dataPoints.map((point, index) => {
          const pointValue = typeof point.value === 'string' && point.value.includes('/') 
            ? safeParseFloat(point.value.split('/')[0])
            : safeParseFloat(point.value);
            
          if (!isValidNumber(pointValue)) return null;
          
          const cx = 20 + (sortedData.indexOf(point) * ((width - 40) / Math.max(sortedData.length - 1, 1)));
          const cy = height - 20 - ((pointValue - minValue) / (maxValue - minValue)) * (height - 40);
          
          if (!isValidNumber(cx) || !isValidNumber(cy)) return null;
          
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
        
        {/* X-axis labels (dates) - using formatted dates */}
        {dataPoints.filter((_, i) => i % 2 === 0).map((point, index) => {
          const x = 20 + (sortedData.indexOf(point) * ((width - 40) / Math.max(sortedData.length - 1, 1)));
          if (!isValidNumber(x)) return null;
          
          return (
            <SvgText
              key={index}
              x={x}
              y={height - 5}
              fill="#aaa"
              fontSize={8}
              textAnchor="middle"
            >
              {formatDate(point.date)}
            </SvgText>
          );
        })}
        
        {/* Y-axis min/max - only render if values are valid */}
        {isValidNumber(maxValue) && (
          <SvgText x={15} y={15} fill="#aaa" fontSize={8} textAnchor="start">
            {maxValue.toFixed(1)}
          </SvgText>
        )}
        {isValidNumber(minValue) && (
          <SvgText x={15} y={height - 25} fill="#aaa" fontSize={8} textAnchor="start">
            {minValue.toFixed(1)}
          </SvgText>
        )}
      </Svg>
      
      <Text style={{ color: '#aaa', fontSize: 10, textAlign: 'center', marginTop: 5 }}>
        {timeframe === 'week' ? 'Last 7 days' : timeframe === 'month' ? 'Last 30 days' : 'Last 12 months'}
      </Text>
    </View>
  );
};

// The component to show an annotation on the chart
export const Annotation = ({ title, description, color }) => (
  <View style={[styles.annotation, { borderColor: color }]}>
    <Text style={styles.annotationTitle}>{title}</Text>
    <Text style={styles.annotationText}>{description}</Text>
  </View>
);

export default LineChart;
