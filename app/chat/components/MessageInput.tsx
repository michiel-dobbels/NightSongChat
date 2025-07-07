import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface Props {
  onSend: (text: string, recipientId: string) => void;
}

export default function MessageInput({ onSend }: Props) {
  const [text, setText] = useState('');
  const [recipient, setRecipient] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Recipient ID"
        value={recipient}
        onChangeText={setRecipient}
        style={styles.input}
      />
      <TextInput
        placeholder="Message"
        value={text}
        onChangeText={setText}
        style={styles.input}
      />
      <Button
        title="Send"
        onPress={() => {
          onSend(text, recipient);
          setText('');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 4,
  },
});
