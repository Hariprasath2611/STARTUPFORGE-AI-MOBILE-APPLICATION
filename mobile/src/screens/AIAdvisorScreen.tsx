import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import api from '../services/api';

export default function AIAdvisorScreen() {
  const [messages, setMessages] = useState<any[]>([
    { id: '1', sender: 'advisor', text: 'Greetings, Founder. I am your StartupForge AI Advisor. Ask me anything about scaling, pitch mechanics, or funding routes.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'founder', text: input };
    setMessages(prev => [...prev, userMsg]);
    const promptToSend = input;
    setInput('');
    setLoading(true);

    try {
      // Send to AI chat endpoint
      const res = await api.post('/plans/advisor/chat', {
        startup_id: 'mock-startup-id',
        message: promptToSend,
        history: messages.map(m => ({ sender: m.sender, text: m.text }))
      });

      if (res.data) {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'advisor', text: res.data.reply }]);
      }
    } catch (e) {
      // mock advisor answers
      setTimeout(() => {
        let answer = "I suggest refining your initial customer profile. Have you run validation models on your target market yet?";
        if (promptToSend.toLowerCase().includes('funding')) {
          answer = "For seed rounds, standard benchmarks expect $10k - $50k MRR or an audited prototype validation score > 80.";
        }
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'advisor', text: answer }]);
        setLoading(false);
      }, 1000);
      return;
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <FlatList 
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBox, 
            item.sender === 'founder' ? styles.founderBox : styles.advisorBox
          ]}>
            <Text style={styles.senderLabel}>{item.sender === 'founder' ? 'Jane (You)' : '🤖 Advisor'}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      {loading && (
        <ActivityIndicator size="small" color={Colors.primary} style={{ marginBottom: 12 }} />
      )}

      <View style={styles.inputArea}>
        <TextInput 
          style={styles.chatInput} 
          placeholder="Ask about validation, pitch, burn rate..." 
          placeholderTextColor={Colors.mutedText}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  messageBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    maxWidth: '85%',
  },
  founderBox: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
  },
  advisorBox: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  senderLabel: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
  },
  inputArea: {
    flexDirection: 'row',
    padding: 16,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    paddingHorizontal: 16,
    height: 44,
    marginRight: 12,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
});
