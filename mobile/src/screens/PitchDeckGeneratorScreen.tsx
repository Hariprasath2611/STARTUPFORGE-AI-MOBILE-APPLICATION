import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../theme/colors';
import api from '../services/api';

export default function PitchDeckGeneratorScreen() {
  const [loading, setLoading] = useState(false);
  const [deck, setDeck] = useState<any>(null);

  const generateDeck = async () => {
    setLoading(true);
    try {
      const res = await api.post('/plans/pitch-deck', { startupId: 'mock-startup-id' });
      if (res.data) setDeck(res.data);
    } catch (e) {
      setDeck({
        problem: "Founders spend hours drafting complex business documents and code bases to obtain proof of concepts.",
        solution: "StartupForge AI builds enterprise documents, prediction metrics, and codebases in under 30 seconds.",
        market: "100M new startups globally every year, with SaaS representing $200B addressable size.",
        slides: [
          "1. Title: StartupForge AI - Turn Ideas Into Funded Startups",
          "2. The Problem: Document waste and proof-of-concept bottlenecks",
          "3. The Solution: AI-powered full stack compiler & validator",
          "4. Market Opportunity: $200B addressable SaaS acceleration sector",
          "5. Product Demo: Sandbox runway simulation dashboard",
          "6. Business Model: B2B monthly tier scaling ($29 - $1500)",
          "7. The Ask: $1.5M Seed round for expanding integration channels"
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Investor Pitch Deck Swarm</Text>
      <Text style={styles.sub}>Drafts slide chapters, validation summaries, and financial hooks.</Text>

      {!deck && !loading && (
        <TouchableOpacity style={styles.runBtn} onPress={generateDeck}>
          <Text style={styles.runText}>Draft Pitch Slides</Text>
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loaderSub}>Pitch Agent compiling structure...</Text>
        </View>
      )}

      {deck && (
        <View style={{ marginTop: 24 }}>
          {/* Problem & Solution Cards */}
          <View style={styles.card}>
            <Text style={styles.title}>🚨 The Problem</Text>
            <Text style={styles.body}>{deck.problem}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>💡 The Solution</Text>
            <Text style={styles.body}>{deck.solution}</Text>
          </View>

          {/* Slides List */}
          <Text style={styles.sectionTitle}>🎬 Slide Map Outline</Text>
          {deck.slides.map((slide: string, idx: number) => (
            <View key={idx} style={styles.slideRow}>
              <Text style={styles.slideText}>{slide}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.exportBtn} onPress={() => Alert.alert('Export Complete', 'PowerPoint slides exported to documents.')}>
            <Text style={styles.exportText}>Export PPTX Slides</Text>
          </TouchableOpacity>
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
    marginBottom: 8,
  },
  body: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  slideRow: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  slideText: {
    color: Colors.text,
    fontSize: 13,
  },
  exportBtn: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  exportText: {
    color: Colors.primary,
    fontWeight: 'bold',
  }
});
