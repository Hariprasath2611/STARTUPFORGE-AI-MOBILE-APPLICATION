import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import api from '../services/api';

export default function StartupSimulatorScreen() {
  const [initialCapital, setInitialCapital] = useState('150000');
  const [burnRate, setBurnRate] = useState('10000');
  const [growth, setGrowth] = useState('5');
  const [cac, setCac] = useState('60');
  const [ltv, setLtv] = useState('300');
  const [loading, setLoading] = useState(false);
  const [simResults, setSimResults] = useState<any>(null);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.post('/simulations', {
        startupId: 'mock-startup-id',
        scenarioName: 'Optimistic Growth',
        initialCapital: parseFloat(initialCapital),
        burnRate: parseFloat(burnRate),
        customerGrowth: parseFloat(growth),
        cac: parseFloat(cac),
        ltv: parseFloat(ltv)
      });
      if (res.data) setSimResults(res.data);
    } catch (e) {
      // Offline fallback math
      const mockProjections = [];
      let cash = parseFloat(initialCapital);
      for (let month = 1; month <= 36; month++) {
        cash = cash - parseFloat(burnRate) + (month * (parseFloat(ltv) / 12) * (1 + parseFloat(growth) / 100));
        mockProjections.push({
          month,
          revenue: Math.round(month * (parseFloat(ltv) / 12) * 5),
          costs: Math.round(parseFloat(burnRate)),
          cash: Math.round(Math.max(cash, 0))
        });
      }
      setSimResults({
        runway: Math.round(parseFloat(initialCapital) / parseFloat(burnRate)),
        projections: mockProjections
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Financial Runway Sandbox</Text>
      <Text style={styles.sub}>Adjust inputs to model SaaS growth, break-even targets, and burn runways.</Text>

      {/* Input parameters */}
      <View style={styles.form}>
        <View style={styles.inputRow}>
          <View style={styles.inputBox}>
            <Text style={styles.label}>Initial Capital ($)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={initialCapital} onChangeText={setInitialCapital} placeholderTextColor={Colors.mutedText} />
          </View>
          <View style={styles.inputBox}>
            <Text style={styles.label}>Base Burn Rate ($/mo)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={burnRate} onChangeText={setBurnRate} placeholderTextColor={Colors.mutedText} />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputBox}>
            <Text style={styles.label}>Customer Growth (%)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={growth} onChangeText={setGrowth} placeholderTextColor={Colors.mutedText} />
          </View>
          <View style={styles.inputBox}>
            <Text style={styles.label}>CAC ($)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={cac} onChangeText={setCac} placeholderTextColor={Colors.mutedText} />
          </View>
        </View>

        <View style={{ width: '48.5%' }}>
          <Text style={styles.label}>Customer LTV ($)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={ltv} onChangeText={setLtv} placeholderTextColor={Colors.mutedText} />
        </View>

        <TouchableOpacity style={styles.runBtn} onPress={runSimulation}>
          <Text style={styles.runText}>Run Scenario Simulation</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 30 }} />
      )}

      {/* Simulation results details */}
      {simResults && !loading && (
        <View style={{ marginTop: 24, marginBottom: 40 }}>
          <View style={styles.runwayCard}>
            <Text style={styles.runwayLabel}>ESTIMATED RUNWAY</Text>
            <Text style={[styles.runwayValue, { color: simResults.runway > 12 ? Colors.success : Colors.error }]}>
              {simResults.runway >= 999 ? 'Self-Sustaining' : `${simResults.runway} Months`}
            </Text>
            <Text style={styles.runwaySub}>Based on starting equity and growth acceleration</Text>
          </View>

          {/* Forecast table snippet */}
          <Text style={styles.sectionTitle}>📅 36-Month Projections (Sample)</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, { backgroundColor: Colors.surface }]}>
              <Text style={styles.tableHeaderCell}>Month</Text>
              <Text style={styles.tableHeaderCell}>Revenue</Text>
              <Text style={styles.tableHeaderCell}>Costs</Text>
              <Text style={styles.tableHeaderCell}>Balance</Text>
            </View>

            {simResults.projections.slice(0, 6).map((proj: any, idx: number) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.tableCell}>M{proj.month}</Text>
                <Text style={[styles.tableCell, { color: Colors.success }]}>${proj.revenue}</Text>
                <Text style={[styles.tableCell, { color: Colors.error }]}>${proj.costs}</Text>
                <Text style={styles.tableCell}>${proj.cash}</Text>
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
  form: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 20,
    borderRadius: 12,
    marginTop: 24,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputBox: {
    width: '48.5%',
  },
  label: {
    color: Colors.mutedText,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    paddingHorizontal: 12,
    height: 44,
  },
  runBtn: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  runText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  runwayCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  runwayLabel: {
    color: Colors.mutedText,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  runwayValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  runwaySub: {
    color: Colors.mutedText,
    fontSize: 11,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  table: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableHeaderCell: {
    flex: 1,
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    color: Colors.mutedText,
    fontSize: 12,
    textAlign: 'center',
  }
});
