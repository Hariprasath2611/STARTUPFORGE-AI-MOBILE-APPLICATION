import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Colors } from '../theme/colors';

export default function InvestorMarketplaceScreen() {
  const [search, setSearch] = useState('');

  const investors = [
    { id: '1', name: 'Sequoia Capital', stage: 'Seed, Series A', focus: 'AI, SaaS, Fintech', range: '$500K - $5M', match: 92 },
    { id: '2', name: 'Y Combinator', stage: 'Pre-seed, Seed', focus: 'All Industries', range: '$125K - $500K', match: 88 },
    { id: '3', name: 'Andreessen Horowitz', stage: 'Seed, Growth', focus: 'Web3, Infrastructure, AI', range: '$1M - $10M', match: 78 },
    { id: '4', name: 'Techstars Accelerator', stage: 'Idea, Pre-seed', focus: 'Hardware, SaaS, B2C', range: '$20K - $120K', match: 74 },
    { id: '5', name: 'Founder Collective', stage: 'Seed', focus: 'SaaS, Commerce', range: '$250K - $1.5M', match: 81 }
  ];

  const filtered = investors.filter(inv => 
    inv.name.toLowerCase().includes(search.toLowerCase()) || 
    inv.focus.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = (name: string) => {
    Alert.alert('Pitch Submitted', `Your startup description and success predictor scores have been forwarded to ${name}.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput 
          style={styles.searchBar} 
          placeholder="Search sector focus or VC firm name..." 
          placeholderTextColor={Colors.mutedText} 
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList 
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{item.match}% Match</Text>
              </View>
            </View>

            <Text style={styles.details}><Text style={{ fontWeight: 'bold' }}>Stage: </Text>{item.stage}</Text>
            <Text style={styles.details}><Text style={{ fontWeight: 'bold' }}>Sectors: </Text>{item.focus}</Text>
            <Text style={styles.details}><Text style={{ fontWeight: 'bold' }}>Ticket Size: </Text>{item.range}</Text>

            <TouchableOpacity style={styles.applyBtn} onPress={() => handleApply(item.name)}>
              <Text style={styles.btnText}>Submit Deck proposal</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  searchBar: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    paddingHorizontal: 16,
    height: 48,
  },
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  matchBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: Colors.success,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  matchText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: 'bold',
  },
  details: {
    color: Colors.mutedText,
    fontSize: 13,
    marginTop: 4,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  }
});
