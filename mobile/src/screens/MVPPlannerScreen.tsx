import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import api from '../services/api';

export default function MVPPlannerScreen() {
  const [loading, setLoading] = useState(false);
  const [mvp, setMvp] = useState<any>(null);

  const generateMvp = async () => {
    setLoading(true);
    try {
      const res = await api.post('/plans/mvp-planner', { startupId: 'mock-startup-id' });
      if (res.data) setMvp(res.data);
    } catch (e) {
      setMvp({
        architecture: "React Native front-end client, Express API gateway, MongoDB persistence layer, Socket.io channels, Redis Cache, Python FastAPI workers.",
        user_stories: [
          "As a founder, I want to edit startup profiles.",
          "As a founder, I want to simulate financial growth timelines.",
          "As an investor, I want to query pitch deck lists."
        ],
        roadmap: [
          "Sprint 1: Schema creation & Docker Compose scripts.",
          "Sprint 2: Integration of LangChain Gemini API layers.",
          "Sprint 3: Mobile Sandbox UI layout and Socket messaging channels."
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>MVP Product Architect</Text>
      <Text style={styles.sub}>Drafts database models, tech stacks, and sprint roadmaps.</Text>

      {!mvp && !loading && (
        <TouchableOpacity style={styles.runBtn} onPress={generateMvp}>
          <Text style={styles.runText}>Architect MVP Blueprint</Text>
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loaderSub}>CTO Agent planning sprint scopes...</Text>
        </View>
      )}

      {mvp && (
        <View style={{ marginTop: 24 }}>
          {/* Tech Stack Arch */}
          <View style={styles.card}>
            <Text style={styles.title}>⚙️ Technical Architecture</Text>
            <Text style={styles.body}>{mvp.architecture}</Text>
          </View>

          {/* User Stories */}
          <View style={styles.card}>
            <Text style={styles.title}>👤 Core User Stories</Text>
            {mvp.user_stories.map((story: string, i: number) => (
              <Text key={i} style={styles.itemText}>• {story}</Text>
            ))}
          </View>

          {/* Sprint Sprints */}
          <View style={styles.card}>
            <Text style={styles.title}>🗺️ Sprint Milestone Roadmap</Text>
            {mvp.roadmap.map((sprint: string, i: number) => (
              <View key={i} style={styles.sprintRow}>
                <View style={styles.bullet} />
                <Text style={styles.sprintText}>{sprint}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
  },
  header: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  sub: {
    color: Colors.mutedText,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
  runBtn: {
    backgroundColor: Colors.primary,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  runText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loaderArea: {
    alignItems: 'center',
    marginTop: 80,
  },
  loaderSub: {
    color: Colors.mutedText,
    marginTop: 16,
    fontSize: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    color: Colors.accent,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 10,
  },
  body: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  itemText: {
    color: Colors.mutedText,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  sprintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 12,
  },
  sprintText: {
    color: Colors.text,
    fontSize: 13,
    flex: 1,
  }
});
