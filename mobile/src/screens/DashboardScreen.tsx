import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);

  // Mock dashboard metadata
  const healthScore = 84;
  const fundingReady = 'High';
  const runwayMonths = 14;

  const tools = [
    { label: '📊 Sandbox Simulator', screen: 'StartupSimulator', icon: '💸' },
    { label: '🔍 AI Idea Validator', screen: 'StartupValidator', icon: '💡' },
    { label: '📋 Business Planner', screen: 'BusinessPlanGenerator', icon: '📝' },
    { label: '🗺️ MVP Roadmap', screen: 'MVPPlanner', icon: '⚙️' },
    { label: '📈 Deck Generator', screen: 'PitchDeckGenerator', icon: '🎯' },
    { label: '⚖️ Competitor Intel', screen: 'CompetitorIntelligence', icon: '⚔️' },
    { label: '💳 Subscription', screen: 'Subscription', icon: '⚡' },
    { label: '📊 System Analytics', screen: 'Analytics', icon: '📈' }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome back, {user?.name || 'Founder'}</Text>
        <Text style={styles.subWelcome}>Jane's AI Incubator Workspace</Text>
      </View>

      {/* KPI Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Health Score</Text>
          <Text style={[styles.statValue, { color: Colors.success }]}>{healthScore}%</Text>
          <Text style={styles.statSub}>Strong Viability</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Funding Grade</Text>
          <Text style={[styles.statValue, { color: Colors.accent }]}>{fundingReady}</Text>
          <Text style={styles.statSub}>Ready for seed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Burn Runway</Text>
          <Text style={[styles.statValue, { color: Colors.secondary }]}>{runwayMonths} mo</Text>
          <Text style={styles.statSub}>At $8K burn/mo</Text>
        </View>
      </View>

      {/* Quick Tools Grid */}
      <Text style={styles.sectionTitle}>Startup Accelerator Suite</Text>
      <View style={styles.toolsGrid}>
        {tools.map((tool, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={styles.toolCard}
            onPress={() => navigation.navigate(tool.screen, { startupId: 'mock-startup-id' })}
          >
            <Text style={styles.toolIcon}>{tool.icon}</Text>
            <Text style={styles.toolLabel}>{tool.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Realtime Insights Panel */}
      <Text style={styles.sectionTitle}>Realtime Accelerator Intelligence</Text>
      <View style={styles.insightCard}>
        <View style={styles.insightIndicator} />
        <View style={{ flex: 1 }}>
          <Text style={styles.insightTitle}>Investor Match Notification</Text>
          <Text style={styles.insightBody}>Sequoia Capital matches 88% with your SaaS target description. Consider sending a pitch deck proposal.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subWelcome: {
    fontSize: 14,
    color: Colors.mutedText,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    width: (width - 60) / 3,
  },
  statLabel: {
    color: Colors.mutedText,
    fontSize: 11,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  statSub: {
    color: Colors.mutedText,
    fontSize: 10,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  toolCard: {
    backgroundColor: Colors.card,
    width: (width - 56) / 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  toolIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  toolLabel: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  insightIndicator: {
    width: 6,
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 3,
    marginRight: 16,
  },
  insightTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  insightBody: {
    color: Colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
  }
});
