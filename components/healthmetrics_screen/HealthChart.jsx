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
   // Sort data from oldest to newest (left to right on chart)
   const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  
   // Extract numeric values for min/max calculation
   const values = sortedData.map(item => {
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
  const step = sortedData.length <= maxPoints ? 1 : Math.floor(sortedData.length / maxPoints);
  
  for (let i = 0; i < sortedData.length; i += step) {
    dataPoints.push(sortedData[i]);
  }
  // Always include the most recent point
  if (step > 1 && !dataPoints.includes(sortedData[sortedData.length - 1])) {
    dataPoints.push(sortedData[sortedData.length - 1]);
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
            
          const cx = 20 + (sortedData.indexOf(point) * ((width - 40) / (sortedData.length - 1)));
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
        
        {/* X-axis labels (dates) - using formatted dates */}
        {dataPoints.filter((_, i) => i % 2 === 0).map((point, index) => {
          const x = 20 + (sortedData.indexOf(point) * ((width - 40) / (sortedData.length - 1)));
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
export const Annotation = ({ title, description, color }) => (
  <View style={[styles.annotation, { borderColor: color }]}>
    <Text style={styles.annotationTitle}>{title}</Text>
    <Text style={styles.annotationText}>{description}</Text>
  </View>
);

export default LineChart;