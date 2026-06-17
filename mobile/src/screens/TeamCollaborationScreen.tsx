import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';

export default function TeamCollaborationScreen({ route }: any) {
  const channelId = route?.params?.channelId || 'general';
  
  const [messages, setMessages] = useState<any[]>([
    { id: '1', sender: 'Bob Smith', text: 'Hey Jane, I finished drafting the initial wireframe specs.' },
    { id: '2', sender: 'Alice Johnson', text: 'Awesome Bob. Jane, did you run the ML success predictor check?' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState<string | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'Jane (You)', text: input }]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>📣 Channel: {channelId.replace('_', ' ')}</Text>
      </View>

      <FlatList 
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBox, 
            item.sender === 'Jane (You)' ? styles.myBox : styles.otherBox
          ]}>
            <Text style={styles.senderName}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputArea}>
        <TextInput 
          style={styles.chatInput} 
          placeholder="Message channel team..." 
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
  header: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderBottomWidth: 1,
    padding: 16,
  },
  headerText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  list: {
    padding: 20,
  },
  messageBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    maxWidth: '85%',
  },
  myBox: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
  },
  otherBox: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  senderName: {
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
