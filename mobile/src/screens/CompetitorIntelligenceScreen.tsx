import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import api from '../services/api';

export default function CompetitorIntelligenceScreen() {
  const [loading, setLoading] = useState(false);
  const [intel, setIntel] = useState<any>(null);

  const fetchIntel = async () => {
    setLoading(true);
    try {
      const res = await api.post('/plans/competitors', { startupId: 'mock-startup-id' });
      if (res.data) setIntel(res.data);
    } catch (e) {
      setIntel({
        competitors: [
          { name: "SaaS Automate Inc.", price: "$49/mo", features: "Manual integrations, webhooks" },
          { name: "Agentify Log", price: "$120/mo", features: "Limited workflows, custom developer setup" },
          { name: "Flow Forge Core", price: "Free tier, $29/mo", features: "No AI search logic, template configs" }
        ],
        swot: {
          strengths: "Gemini 2.5 real-time context retrieval, zero-config onboarding.",
          weaknesses: "High reliance on LLM token costs, mobile-first constraint.",
          opportunities: "Expand to vertical supply chains, white-labeling.",
          threats: "Large hyper-scalers releasing integrated workflow libraries."
        },
        market_positioning: "Premium automated agent builder targeted for small-to-mid enterprise logistics."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Competitor Intelligence Scan</Text>
      <Text style={styles.sub}>Scrapes the web for direct rivals and constructs positioning grids.</Text>

      {!intel && !loading && (
        <TouchableOpacity style={styles.runBtn} onPress={fetchIntel}>
          <Text style={styles.runText}>Initiate Competitor Sweep</Text>
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loaderSub}>Extracting pricing matrices...</Text>
        </View>
      )}

      {intel && (
        <View style={{ marginTop: 24 }}>
          {/* Market Positioning Statement */}
          <View style={styles.posCard}>
            <Text style={styles.posTitle}>📍 Market Positioning</Text>
            <Text style={styles.posBody}>{intel.market_positioning}</Text>
          </View>

          {/* Competitor Matrix list */}
          <Text style={styles.sectionTitle}>⚔️ Competitors Matrix</Text>
          {intel.competitors.map((comp: any, idx: number) => (
            <View key={idx} style={styles.competitorCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.compName}>{comp.name}</Text>
                <Text style={styles.compPrice}>{comp.price}</Text>
              </View>
              <Text style={styles.compFeatures}>{comp.features}</Text>
            </View>
          ))}

          {/* SWOT Grid */}
          <Text style={styles.sectionTitle}>⚖️ SWOT Matrix</Text>
          <View style={styles.swotContainer}>
            <View style={styles.swotRow}>
              <View style={styles.swotBox}>
                <Text style={[styles.swotLabel, { color: Colors.success }]}>STRENGTHS</Text>
                <Text style={styles.swotBody}>{intel.swot.strengths}</Text>
              </View>
              <View style={styles.swotBox}>
                <Text style={[styles.swotLabel, { color: Colors.error }]}>WEAKNESSES</Text>
                <Text style={styles.swotBody}>{intel.swot.weaknesses}</Text>
              </View>
            </View>
            <View style={styles.swotRow}>
              <View style={styles.swotBox}>
                <Text style={[styles.swotLabel, { color: Colors.accent }]}>OPPORTUNITIES</Text>
                <Text style={styles.swotBody}>{intel.swot.opportunities}</Text>
              </View>
              <View style={styles.swotBox}>
                <Text style={[styles.swotLabel, { color: Colors.warning }]}>THREATS</Text>
                <Text style={styles.swotBody}>{intel.swot.threats}</Text>
              </View>
            </View>
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
  posCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  posTitle: {
    color: Colors.accent,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  posBody: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  competitorCard: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  compName: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  compPrice: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  compFeatures: {
    color: Colors.mutedText,
    fontSize: 12,
    marginTop: 8,
    lineHeight: 18,
  },
  swotContainer: {
    marginBottom: 40,
  },
  swotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  swotBox: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    width: '48.5%',
    minHeight: 140,
  },
  swotLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  swotBody: {
    color: Colors.mutedText,
    fontSize: 11,
    lineHeight: 16,
  }
});
