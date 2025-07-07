import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';

export function encryptMessage(message: string, recipientPublicKey: Uint8Array, senderPrivateKey: Uint8Array) {
  const nonce = nacl.randomBytes(24);
  const ciphertext = nacl.box(
    naclUtil.decodeUTF8(message),
    nonce,
    recipientPublicKey,
    senderPrivateKey
  );
  return {
    ciphertext: naclUtil.encodeBase64(ciphertext),
    nonce: naclUtil.encodeBase64(nonce),
  };
}

export function decryptMessage(ciphertextB64: string, nonceB64: string, senderPublicKey: Uint8Array, recipientPrivateKey: Uint8Array) {
  const plaintext = nacl.box.open(
    naclUtil.decodeBase64(ciphertextB64),
    naclUtil.decodeBase64(nonceB64),
    senderPublicKey,
    recipientPrivateKey
  );
  if (!plaintext) return '';
  return naclUtil.encodeUTF8(plaintext);
}
