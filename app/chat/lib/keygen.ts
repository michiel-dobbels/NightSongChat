import AsyncStorage from '@react-native-async-storage/async-storage';
import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';
import { uploadPublicKey } from './supabase';

interface KeyPairResult {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
  userId: string;
}

const PUB_KEY_STORAGE = 'chat_public_key';
const PRIV_KEY_STORAGE = 'chat_private_key';
const USER_ID_STORAGE = 'chat_user_id';

export async function getOrCreateKeyPair(): Promise<KeyPairResult> {
  const [pub, priv, uid] = await Promise.all([
    AsyncStorage.getItem(PUB_KEY_STORAGE),
    AsyncStorage.getItem(PRIV_KEY_STORAGE),
    AsyncStorage.getItem(USER_ID_STORAGE),
  ]);

  if (pub && priv && uid) {
    console.log('Key loaded');
    return {
      publicKey: naclUtil.decodeBase64(pub),
      privateKey: naclUtil.decodeBase64(priv),
      userId: uid,
    };
  }

  const { publicKey, secretKey } = nacl.box.keyPair();
  const userId = naclUtil.encodeBase64(nacl.randomBytes(16));
  await Promise.all([
    AsyncStorage.setItem(PUB_KEY_STORAGE, naclUtil.encodeBase64(publicKey)),
    AsyncStorage.setItem(PRIV_KEY_STORAGE, naclUtil.encodeBase64(secretKey)),
    AsyncStorage.setItem(USER_ID_STORAGE, userId),
  ]);
  await uploadPublicKey(userId, naclUtil.encodeBase64(publicKey));
  console.log('Key generated');
  return { publicKey, privateKey: secretKey, userId };
}
