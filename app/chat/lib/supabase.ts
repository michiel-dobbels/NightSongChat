import { supabase } from '../../lib/supabase';
import * as naclUtil from 'tweetnacl-util';

export async function uploadPublicKey(userId: string, publicKey: string) {
  await supabase.from('user_keys').upsert({ user_id: userId, public_key: publicKey });
}

export async function getPublicKeyForUser(userId: string): Promise<Uint8Array | null> {
  const { data } = await supabase.from('user_keys').select('public_key').eq('user_id', userId).single();
  if (!data) return null;
  return naclUtil.decodeBase64(data.public_key);
}

export async function sendEncryptedMessage(senderId: string, recipientId: string, ciphertext: string, nonce: string) {
  await supabase.from('messages').insert({ sender_id: senderId, recipient_id: recipientId, ciphertext, nonce });
}

export async function fetchMessagesForUser(userId: string) {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: true });
  return data || [];
}
