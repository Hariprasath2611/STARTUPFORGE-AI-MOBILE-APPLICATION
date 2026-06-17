import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import api from '../services/api';

export default function CoFounderMatchingScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const res = await api.get('/auth/matches');
        if (res.data) setMatches(res.data);
      } catch (err) {
        setMatches([
          {
            user: { name: "Bob Smith", email: "bob@startupforge.ai", bio: "Ex-Stripe UI/UX Designer. Focused on high-fidelity web design and mobile branding layouts.", skills: ["Figma", "Illustrator", "React Native"] },
            compatibilityScore: 94,
            suggestedRoles: ["CPO", "Design Lead"]
          },
          {
            user: { name: "Alice Johnson", email: "alice@startupforge.ai", bio: "Growth marketer. Accelerated SaaS users from 0 to 50k MRR.", skills: ["AdWords", "SEO", "Copywriting"] },
            compatibilityScore: 86,
            suggestedRoles: ["CMO", "Marketing Lead"]
          },
          {
            user: { name: "David Miller", email: "david@startupforge.ai", bio: "Kubernetes and Express dev. Focused on building high throughput message brokers.", skills: ["Node.js", "Redis", "Docker"] },
            compatibilityScore: 82,
            suggestedRoles: ["CTO", "Backend Lead"]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList 
          data={matches}
          keyExtractor={(item, i) => i.toString()}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.name}>{item.user.name}</Text>
                  <Text style={styles.roleTitle}>{item.suggestedRoles.join(' / ')}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.compatibilityScore}% Compatibility</Text>
                </View>
              </View>

              <Text style={styles.bio}>{item.user.bio}</Text>
              
              <View style={styles.skillsWrapper}>
                {item.user.skills.map((skill: string, idx: number) => (
                  <View key={idx} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.chatBtn} 
                onPress={() => navigation.navigate('TeamCollaboration', { channelId: `direct_${item.user.name.replace(' ', '_')}` })}
              >
                <Text style={styles.chatBtnText}>Connect & Chat</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 20,
    borderRadius: 12,
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
  roleTitle: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  bio: {
    color: Colors.mutedText,
    fontSize: 13,
    lineHeight: 18,
    marginVertical: 10,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  skillTag: {
    backgroundColor: Colors.card,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skillText: {
    color: Colors.text,
    fontSize: 11,
  },
  chatBtn: {
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBtnText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 12,
  }
});
