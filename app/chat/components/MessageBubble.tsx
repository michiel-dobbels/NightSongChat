import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  message: string;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: Props) {
  return (
    <View style={[styles.bubble, isOwn ? styles.own : styles.other]}>
      <Text style={styles.text}>{message}</Text>
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
});
