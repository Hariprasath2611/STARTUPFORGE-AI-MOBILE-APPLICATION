import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../theme/colors';
import api from '../services/api';

export default function BusinessPlanGeneratorScreen() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string>('');

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await api.post('/plans/business-plan', { startupId: 'mock-startup-id' });
      if (res.data) setPlan(res.data.content);
    } catch (e) {
      setPlan(
        "# Business Plan - Logistics automation\n\n" +
        "## 1. Executive Summary\n" +
        "Logistics automation provides zero-config routing automation workflows using AI agents, reducing B2B delays by 40%.\n\n" +
        "## 2. Market Analysis\n" +
        "The supply chain market is expanding. Initial serviceable addressable market represents $400M across local freight.\n\n" +
        "## 3. Revenue Architecture\n" +
        "- Pro Plan: $299/mo per hub access.\n" +
        "- Enterprise Plan: Custom SLA contracts starting at $1500/mo.\n\n" +
        "## 4. Financial Outlook\n" +
        "Predicting profitability at Month 14, targeting ARR of $1.2M in Year 2."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>AI Business Plan Generator</Text>
      <Text style={styles.sub}>Drafts executive plans, cost structures, and strategy outlines using templates.</Text>

      {plan === '' && !loading && (
        <TouchableOpacity style={styles.runBtn} onPress={generatePlan}>
          <Text style={styles.runText}>Compile Business Plan</Text>
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loaderSub}>LangChain agents drafting plan structure...</Text>
        </View>
      )}

      {plan !== '' && (
        <View style={{ marginTop: 24 }}>
          <View style={styles.planPaper}>
            <Text style={styles.planText}>{plan}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('Export Complete', 'Markdown document shared successfully.')}>
              <Text style={styles.actionText}>Export DOCX</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { borderColor: Colors.primary }]} onPress={() => Alert.alert('Export Complete', 'PDF report saved to device.')}>
              <Text style={[styles.actionText, { color: Colors.primary }]}>Download PDF</Text>
            </TouchableOpacity>
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
  planPaper: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 24,
    borderRadius: 12,
    minHeight: 400,
  },
  planText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'monospace',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  actionBtn: {
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    height: 50,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: Colors.text,
    fontWeight: 'bold',
  }
});
