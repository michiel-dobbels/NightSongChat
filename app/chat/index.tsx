import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import MessageInput from './components/MessageInput';
import { useLocalSearchParams } from 'expo-router';
import MessageBubble from './components/MessageBubble';
import { getOrCreateKeyPair } from './lib/keygen';
import { fetchMessagesForUser, sendEncryptedMessage, getPublicKeyForUser } from './lib/supabase';
import { encryptMessage, decryptMessage } from './lib/crypto';

interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  ciphertext: string;
  nonce: string;
  created_at: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [publicKey, setPublicKey] = useState<Uint8Array>();
  const [privateKey, setPrivateKey] = useState<Uint8Array>();
  const { recipientId } = useLocalSearchParams<{ recipientId?: string }>();
  const targetId = typeof recipientId === 'string' ? recipientId : '';

  useEffect(() => {
    (async () => {
      const { publicKey, privateKey, userId } = await getOrCreateKeyPair();
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
      setUserId(userId);
      const fetched = await fetchMessagesForUser(userId);
      setMessages(fetched);
    })();
  }, []);

  const onSend = async (text: string, recipientId: string) => {
    if (!publicKey || !privateKey) return;
    const recipientKey = await getPublicKeyForUser(recipientId);
    if (!recipientKey) return;
    const { ciphertext, nonce } = encryptMessage({
      plaintext: text,
      senderSecretKey: privateKey,
      recipientPublicKey: recipientKey,
    });
    await sendEncryptedMessage(userId, recipientId, ciphertext, nonce);
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender_id: userId,
      recipient_id: recipientId,
      ciphertext,
      nonce,
      created_at: new Date().toISOString(),
    };
    setMessages([...messages, newMsg]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble
            message={decryptMessage(item.ciphertext, item.nonce, publicKey!, privateKey!)}
            timestamp={item.created_at}
            isOwn={item.sender_id === userId}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <MessageInput onSend={onSend} recipientId={targetId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 80,
  },
});
