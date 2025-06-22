// components/shared/LetterAvatar.jsx - Blue/Violet Themed Version
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LetterAvatar = ({ 
  name, 
  size = 60, 
  fontSize = null, 
  borderRadius = null,
  style = {},
  textColor = '#FFFFFF',
  borderWidth = 0,
  borderColor = '#FFFFFF',
  showBorder = false,
  gradient = false, // Future enhancement
  customColors = null, // Allow custom color palette
  fallbackColor = '#6B7280'
}) => {
  // Get initials (supports first + last name)
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    
    const nameParts = name.trim().split(' ').filter(part => part.length > 0);
    
    if (nameParts.length === 0) return '?';
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    // First letter of first name + first letter of last name
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  // Dark themed blue/violet color generation
  const getColorFromName = (name) => {
    if (!name || typeof name !== 'string') return fallbackColor;
    
    // Use custom colors if provided, otherwise use dark blue/violet theme
    const colors = customColors || [
      '#1E3A8A', // Blue-900 (Deep Blue)
      '#1E40AF', // Blue-800 (Dark Blue)
      '#1D4ED8', // Blue-700 (Strong Dark Blue)
      '#2563EB', // Blue-600 (Medium Dark Blue)
      '#0369A1', // Sky-700 (Ocean Blue)
      '#075985', // Sky-800 (Dark Ocean)
      '#0C4A6E', // Sky-900 (Deep Ocean)
      '#164E63', // Sky-950 (Deepest Ocean)
      '#0891B2', // Cyan-600 (Dark Cyan)
      '#0E7490', // Cyan-700 (Deep Cyan)
      '#155E75', // Cyan-800 (Darker Cyan)
      '#083344', // Cyan-900 (Deepest Cyan)
      '#4F46E5', // Indigo-600 (Dark Indigo)
      '#4338CA', // Indigo-700 (Deep Indigo)
      '#3730A3', // Indigo-800 (Darker Indigo)
      '#312E81', // Indigo-900 (Deepest Indigo)
      '#1E1B4B', // Indigo-950 (Ultra Deep Indigo)
      '#7C3AED', // Violet-600 (Dark Violet)
      '#6D28D9', // Violet-700 (Deep Violet)
      '#5B21B6', // Violet-800 (Darker Violet)
      '#4C1D95', // Violet-900 (Deepest Violet)
      '#2E1065', // Violet-950 (Ultra Deep Violet)
      '#9333EA', // Purple-600 (Dark Purple)
      '#7E22CE', // Purple-700 (Deep Purple)
      '#6B21A8', // Purple-800 (Darker Purple)
      '#581C87', // Purple-900 (Deepest Purple)
      '#3B0764', // Purple-950 (Ultra Deep Purple)
      '#1F2937', // Gray-800 (Dark Gray-Blue)
      '#374151', // Gray-700 (Medium Gray-Blue)
      '#111827', // Gray-900 (Very Dark Gray)
      '#0F172A', // Slate-900 (Deep Dark Blue-Gray)
    ];

    // Better hash function for more even distribution
    let hash = 0;
    const cleanName = name.toLowerCase().trim();
    
    for (let i = 0; i < cleanName.length; i++) {
      const char = cleanName.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use absolute value and modulo for consistent positive index
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const initials = getInitials(name);
  const backgroundColor = getColorFromName(name);
  const calculatedFontSize = fontSize || Math.max(12, size * 0.35); // Minimum 12px, 35% of size
  const calculatedBorderRadius = borderRadius !== null ? borderRadius : size / 2;

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      backgroundColor,
      borderRadius: calculatedBorderRadius,
    },
    showBorder && {
      borderWidth: borderWidth || 2,
      borderColor: borderColor,
    },
    style
  ];

  const textStyle = [
    styles.letter,
    {
      fontSize: calculatedFontSize,
      lineHeight: calculatedFontSize * 1.1,
      color: textColor,
    }
  ];

  return (
    <View style={containerStyle}>
      <Text style={textStyle} numberOfLines={1} adjustsFontSizeToFit>
        {initials}
      </Text>
    </View>
  );
};

// Preset size variants for consistency
LetterAvatar.SIZES = {
  XS: 24,
  SM: 32,
  MD: 40,
  LG: 48,
  XL: 60,
  XXL: 80,
};

// Dark themed color presets (no light shades)
LetterAvatar.THEMES = {
  DEFAULT: null, // Uses the built-in dark blue/violet colors
  DARK_BLUE: [
    '#1E3A8A', '#1E40AF', '#1D4ED8', '#2563EB',
    '#0369A1', '#075985', '#0C4A6E', '#164E63'
  ],
  DEEP_OCEAN: [
    '#0369A1', '#075985', '#0C4A6E', '#164E63',
    '#0E7490', '#155E75', '#083344', '#0F172A'
  ],
  DARK_PURPLE: [
    '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95',
    '#9333EA', '#7E22CE', '#6B21A8', '#581C87'
  ],
  MIDNIGHT: [
    '#1F2937', '#374151', '#111827', '#0F172A',
    '#1E1B4B', '#2E1065', '#3B0764', '#312E81'
  ]
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  letter: {
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default LetterAvatar;