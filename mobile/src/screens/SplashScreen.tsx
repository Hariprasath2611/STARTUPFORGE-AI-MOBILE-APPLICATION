import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors } from '../theme/colors';
import { useAuthStore } from '../store/useAuthStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const checkSession = async () => {
      // Simulate session check & mock authentication credentials
      setTimeout(() => {
        setAuth({
          _id: 'mock-user-id',
          email: 'founder@startupforge.ai',
          name: 'Jane Doe',
          role: 'Founder',
          firebaseUid: 'mock-uid-jane',
          subscriptionPlan: 'Pro',
          subscriptionStatus: 'active',
          skills: ['React Native', 'Node.js', 'Figma'],
          interests: ['AI', 'SaaS', 'Fintech']
        }, 'mock-token-jane');
        
        navigation.replace('Onboarding');
      }, 2000);
    };

    checkSession();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>🚀 STARTUPFORGE <Text style={{ color: Colors.primary }}>AI</Text></Text>
      <Text style={styles.tagline}>Turn Ideas Into Funded Startups</Text>
      <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
    color: Colors.mutedText,
    marginTop: 8,
  }
});
