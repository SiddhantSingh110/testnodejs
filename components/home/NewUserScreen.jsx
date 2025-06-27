// components/home/NewUserScreen.jsx
import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { styles } from '../../styles/homescreen/HomeScreen.styles';

export const NewUserScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  const startAnimation = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleGetStartedPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();

    setTimeout(() => {
      router.push('/report-upload');
    }, 100);
  };

  useEffect(() => {
    setTimeout(() => startAnimation(), 100);
  }, []);

  return (
    <View style={styles.newUserContainer}>
      <StatusBar style="light" />
      <Image 
        source={require('../../assets/images/newuserbgscreen.png')}
        style={styles.newUserBackgroundImage}
        resizeMode="cover"
      />
      <SafeAreaView style={styles.newUserSafeArea} edges={['top', 'bottom']}>
        <View style={styles.newUserContentContainer}>
          <View style={styles.newUserTopSpacer} />
          <Animated.View 
            style={[
              styles.newUserTextContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.newUserMainTitle}>Your Health,{'\n'}One Tap Away</Text>
            <Text style={styles.newUserSubtitle}>Upload your medical reports and get AI-powered health insights in seconds</Text>
          </Animated.View>
          <Animated.View 
            style={[
              styles.newUserButtonContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: buttonScaleAnim }
                ]
              }
            ]}
          >
            <TouchableOpacity
              style={styles.newUserGetStartedButton}
              onPress={handleGetStartedPress}
              activeOpacity={0.9}
            >
              <Text style={styles.newUserButtonText}>Get started</Text>
              <View style={styles.newUserButtonIcon}>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};