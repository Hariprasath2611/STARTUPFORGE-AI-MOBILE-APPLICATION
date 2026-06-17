import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;
const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }: Props) {
  const [slide, setSlide] = useState(0);

  const onboardingSlides = [
    {
      title: 'Validate Your Idea',
      description: 'Run instantaneous AI validations powered by Gemini 2.5 Pro agents and real-time market research.',
      badge: '🔍 AI VALIDATION'
    },
    {
      title: 'Match With Investors',
      description: 'Get matched with VC partners and angel investors based on deep machine learning preference profiling.',
      badge: '📈 CAPITAL MATCHING'
    },
    {
      title: 'Financial Sandboxing',
      description: 'Simulate growth, track cash burn runway, forecast revenues, and model co-founder compatibility matrices.',
      badge: '💰 RUNWAY SANDBOX'
    }
  ];

  const handleNext = () => {
    if (slide < onboardingSlides.length - 1) {
      setSlide(slide + 1);
    } else {
      navigation.replace('MainTabs');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentCard}>
        <Text style={styles.badge}>{onboardingSlides[slide].badge}</Text>
        <Text style={styles.title}>{onboardingSlides[slide].title}</Text>
        <Text style={styles.description}>{onboardingSlides[slide].description}</Text>
      </View>

      <View style={styles.indicatorContainer}>
        {onboardingSlides.map((_, i) => (
          <View key={i} style={[styles.indicator, { backgroundColor: i === slide ? Colors.primary : Colors.border }]} />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>{slide === onboardingSlides.length - 1 ? 'Launch Workspace' : 'Continue'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  contentCard: {
    backgroundColor: Colors.surface,
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 280,
    justifyContent: 'center',
  },
  badge: {
    color: Colors.accent,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    color: Colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 40,
  },
  indicator: {
    width: 24,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
