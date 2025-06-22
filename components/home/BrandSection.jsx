// components/home/BrandSection.jsx
import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/homescreen/HomeScreen.styles';

export const BrandSection = memo(() => {
  return (
    <View style={styles.fullScreenBrandSection}>
      <LinearGradient
        colors={['#091429', '#0F2248', '#162F65']}
        style={styles.brandFullGradient}
      >
        {/* Decorative Background Elements */}
        <View style={styles.brandDecorative}>
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.decorativeCircle3} />
          <View style={styles.decorativeCircle4} />
        </View>
        
        <View style={styles.brandFullContent}>
          {/* Medical Icon with Glow Effect */}
          <View style={styles.brandIconContainer}>
            <View style={styles.brandIconGlow} />
            <View style={styles.brandIcon}>
              <Ionicons name="medical" size={50} color="#38BFA7" />
            </View>
          </View>
          
          {/* Main Text with 3D Effect */}
          <View style={styles.brandTextContainer}>
            <Text style={styles.brandMainText3D}>India's First</Text>
            <Text style={styles.brandSubText3D}>AI Health App</Text>
          </View>
          
          {/* Brand Name with Enhanced 3D Effect */}
          <View style={styles.brandNameContainer3D}>
            <Text style={styles.brandName3D}>WEBSHARK</Text>
            <Text style={styles.brandProduct3D}>MYHEALTH</Text>
          </View>
          
          {/* Feature Highlights */}
          <View style={styles.featureHighlights}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#38BFA7" />
              <Text style={styles.featureText}>AI-Powered Health Insights</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#38BFA7" />
              <Text style={styles.featureText}>Secure Medical Records</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#38BFA7" />
              <Text style={styles.featureText}>Telemedicine Integration</Text>
            </View>
          </View>
          
          {/* Enhanced CTA Button */}
          <TouchableOpacity style={styles.enhancedCTAButton} activeOpacity={0.8}>
            <LinearGradient
              colors={['#38BFA7', '#2C7BE5']}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaButtonText}>Explore Features</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
});