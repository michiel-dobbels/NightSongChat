import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';

export interface EncryptMessageInput {
  plaintext: string;
  senderSecretKey: Uint8Array;
  recipientPublicKey: Uint8Array;
}

export interface EncryptedPayload {
  ciphertext: string;
  nonce: string;
}

export function encryptMessage({
  plaintext,
  senderSecretKey,
  recipientPublicKey,
}: EncryptMessageInput): EncryptedPayload {
  const nonce = nacl.randomBytes(24);
  const messageBytes = naclUtil.decodeUTF8(plaintext);
  const encrypted = nacl.box(messageBytes, nonce, recipientPublicKey, senderSecretKey);
  return {
    ciphertext: naclUtil.encodeBase64(encrypted),
    nonce: naclUtil.encodeBase64(nonce),
  };
}

export function decryptMessage(
  ciphertextB64: string,
  nonceB64: string,
  senderPublicKey: Uint8Array,
  recipientPrivateKey: Uint8Array
): string {
  const plaintext = nacl.box.open(
    naclUtil.decodeBase64(ciphertextB64),
    naclUtil.decodeBase64(nonceB64),
    senderPublicKey,
    recipientPrivateKey
  );
  if (!plaintext) {
    return '';
  }
  return naclUtil.encodeUTF8(plaintext);
}
