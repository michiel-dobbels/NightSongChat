import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  message: string;
  isOwn: boolean;
  timestamp: string;
}

export default function MessageBubble({ message, isOwn, timestamp }: Props) {
  return (
    <View style={[styles.bubble, isOwn ? styles.own : styles.other]}>
      <Text style={styles.text}>{message}</Text>
      <Text style={styles.time}>
        {new Date(timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 8,
    borderRadius: 6,
    marginVertical: 4,
    maxWidth: '80%',
  },
  own: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  other: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEE',
  },
  text: {
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
});
