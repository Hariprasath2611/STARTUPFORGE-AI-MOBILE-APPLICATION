import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../theme/colors';
import api from '../services/api';

export default function StartupWorkspaceScreen({ navigation }: any) {
  const [name, setName] = useState('My AI Startup');
  const [industry, setIndustry] = useState('SaaS');
  const [description, setDescription] = useState('An enterprise platform utilizing agents to automate logistics workflows.');
  const [techStack, setTechStack] = useState('React Native, Node.js, Python');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      const response = await api.post('/startups', {
        name,
        tagline: 'Automating Logistics',
        description,
        industry,
        targetMarket: 'Enterprise Logistics',
        fundingStage: 'Idea',
        businessModel: 'B2B subscription model',
        technologyStack: techStack.split(',').map(s => s.trim()),
        teamComposition: ['Product Owner', 'Lead Full Stack Dev']
      });

      if (response.data) {
        Alert.alert('Success', 'Startup profile synchronised with ML predictors.');
        setIsEditing(false);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to update workspace data.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileCard}>
        <Text style={styles.sectionHeader}>🏢 Startup Profile</Text>
        
        {isEditing ? (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.label}>Startup Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor={Colors.mutedText} />

            <Text style={styles.label}>Industry Sector</Text>
            <TextInput style={styles.input} value={industry} onChangeText={setIndustry} placeholderTextColor={Colors.mutedText} />

            <Text style={styles.label}>Tech Stack (comma separated)</Text>
            <TextInput style={styles.input} value={techStack} onChangeText={setTechStack} placeholderTextColor={Colors.mutedText} />

            <Text style={styles.label}>Description</Text>
            <TextInput 
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
              value={description} 
              onChangeText={setDescription} 
              multiline 
              placeholderTextColor={Colors.mutedText}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.btnText}>Apply & Score</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.industryTag}>{industry.toUpperCase()}</Text>
            <Text style={styles.descText}>{description}</Text>
            
            <View style={styles.techWrapper}>
              <Text style={styles.label}>Stack: </Text>
              <Text style={styles.techText}>{techStack}</Text>
            </View>

            <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
              <Text style={styles.btnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* RAG Knowledge Base PDF Ingestion Box */}
      <View style={[styles.profileCard, { marginTop: 20 }]}>
        <Text style={styles.sectionHeader}>📂 RAG Knowledge Ingestion</Text>
        <Text style={styles.subtext}>Upload pitch proposals, competitors pricing lists, or market sheets. The LLM agent reads these for custom context.</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => Alert.alert('Ingestion', 'Selecting file from document picker...')}>
          <Text style={styles.uploadBtnText}>Upload PDF Document</Text>
        </TouchableOpacity>
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
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
  },
  sectionHeader: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    color: Colors.mutedText,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
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
    marginBottom: 8,
  },
  nameText: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  industryTag: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  descText: {
    color: Colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 8,
  },
  techWrapper: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  techText: {
    color: Colors.text,
    fontSize: 13,
  },
  editBtn: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subtext: {
    color: Colors.mutedText,
    fontSize: 12,
    marginVertical: 12,
    lineHeight: 18,
  },
  uploadBtn: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  uploadBtnText: {
    color: Colors.primary,
    fontWeight: 'bold',
  }
});
