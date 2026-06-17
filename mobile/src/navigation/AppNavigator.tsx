import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/useAuthStore';
import { View, Text } from 'react-native';
import { Colors } from '../theme/colors';

// Mocks of Screens - real screens will import these navigators
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import StartupWorkspaceScreen from '../screens/StartupWorkspaceScreen';
import AIStartupValidatorScreen from '../screens/AIStartupValidatorScreen';
import CompetitorIntelligenceScreen from '../screens/CompetitorIntelligenceScreen';
import BusinessPlanGeneratorScreen from '../screens/BusinessPlanGeneratorScreen';
import MVPPlannerScreen from '../screens/MVPPlannerScreen';
import PitchDeckGeneratorScreen from '../screens/PitchDeckGeneratorScreen';
import StartupSimulatorScreen from '../screens/StartupSimulatorScreen';
import InvestorMarketplaceScreen from '../screens/InvestorMarketplaceScreen';
import CoFounderMatchingScreen from '../screens/CoFounderMatchingScreen';
import AIAdvisorScreen from '../screens/AIAdvisorScreen';
import TeamCollaborationScreen from '../screens/TeamCollaborationScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  StartupValidator: { startupId: string };
  CompetitorIntelligence: { startupId: string };
  BusinessPlanGenerator: { startupId: string };
  MVPPlanner: { startupId: string };
  PitchDeckGenerator: { startupId: string };
  StartupSimulator: { startupId: string };
  Analytics: { startupId: string };
  Subscription: undefined;
  TeamCollaboration: { channelId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Render simple placeholder icons
const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ 
      color: focused ? Colors.primary : Colors.mutedText, 
      fontSize: 11,
      fontWeight: focused ? 'bold' : 'normal'
    }}>
      {label}
    </Text>
  </View>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface, borderBottomColor: Colors.border, borderBottomWidth: 1 },
        headerTintColor: Colors.text,
        tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border, height: 60, paddingBottom: 8 },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.mutedText,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="⚡ Hub" focused={focused} /> }}
      />
      <Tab.Screen 
        name="Workspace" 
        component={StartupWorkspaceScreen} 
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="💼 Desk" focused={focused} /> }}
      />
      <Tab.Screen 
        name="Advisor" 
        component={AIAdvisorScreen} 
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="🤖 Advisor" focused={focused} /> }}
      />
      <Tab.Screen 
        name="CoFounder" 
        component={CoFounderMatchingScreen} 
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="👥 Team" focused={focused} /> }}
      />
      <Tab.Screen 
        name="Market" 
        component={InvestorMarketplaceScreen} 
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="📈 VCs" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: Colors.background }
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        
        {/* Main Tab Bar Entry */}
        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
        
        {/* Dynamic Tool Stacks */}
        <Stack.Screen name="StartupValidator" component={AIStartupValidatorScreen} options={{ title: 'AI Startup Validator' }} />
        <Stack.Screen name="CompetitorIntelligence" component={CompetitorIntelligenceScreen} options={{ title: 'Competitor Intel' }} />
        <Stack.Screen name="BusinessPlanGenerator" component={BusinessPlanGeneratorScreen} options={{ title: 'Business Plan Generator' }} />
        <Stack.Screen name="MVPPlanner" component={MVPPlannerScreen} options={{ title: 'MVP Product Planner' }} />
        <Stack.Screen name="PitchDeckGenerator" component={PitchDeckGeneratorScreen} options={{ title: 'Pitch Deck Generator' }} />
        <Stack.Screen name="StartupSimulator" component={StartupSimulatorScreen} options={{ title: 'Financial Sandbox' }} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Growth & Metrics' }} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ title: 'Accelerator Billing' }} />
        <Stack.Screen name="TeamCollaboration" component={TeamCollaborationScreen} options={{ title: 'Team Space' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
