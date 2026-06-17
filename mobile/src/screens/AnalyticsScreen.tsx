import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Accelerator Metrics</Text>
      <Text style={styles.sub}>Review analytical statistics parsed from our machine learning database.</Text>

      {/* Numerical Stats */}
      <View style={styles.statsCard}>
        <View style={styles.row}>
          <Text style={styles.label}>Platform Tier</Text>
          <Text style={styles.val}>PRO MEMBER</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>AI Agent Credits Used</Text>
          <Text style={styles.val}>42 / 500</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Document Splitting Token Use</Text>
          <Text style={styles.val}>12.4K Tokens</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ML Predictor Runs</Text>
          <Text style={styles.val}>18 Runs</Text>
        </View>
      </View>

      {/* Target graph mockup container */}
      <Text style={styles.sectionHeader}>📈 Interactive Projection Curve</Text>
      <View style={styles.graphContainer}>
        {/* Draw a CSS representation of a bar graph */}
        <View style={styles.barRow}>
          <View style={[styles.bar, { height: 40 }]} />
          <View style={[styles.bar, { height: 70 }]} />
          <View style={[styles.bar, { height: 110 }]} />
          <View style={[styles.bar, { height: 140 }]} />
          <View style={[styles.bar, { height: 190 }]} />
        </View>
        <View style={styles.labelRow}>
          <Text style={styles.axisLabel}>Q1</Text>
          <Text style={styles.axisLabel}>Q2</Text>
          <Text style={styles.axisLabel}>Q3</Text>
          <Text style={styles.axisLabel}>Q4</Text>
          <Text style={styles.axisLabel}>Y2</Text>
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
  statsCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 20,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    color: Colors.mutedText,
    fontSize: 13,
  },
  val: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 13,
  },
  sectionHeader: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  graphContainer: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    height: 260,
    justifyContent: 'flex-end',
  },
  barRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 190,
  },
  bar: {
    width: 30,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  axisLabel: {
    color: Colors.mutedText,
    fontSize: 11,
    width: 30,
    textAlign: 'center',
  }
});
