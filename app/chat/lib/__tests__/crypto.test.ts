import { encryptMessage, decryptMessage } from '../crypto';
import * as nacl from 'tweetnacl';

it('encrypts and decrypts message', () => {
  const { publicKey, secretKey } = nacl.box.keyPair();
  const result = encryptMessage('hello', publicKey, secretKey);
  const text = decryptMessage(result.ciphertext, result.nonce, publicKey, secretKey);
  expect(text).toBe('hello');
});
