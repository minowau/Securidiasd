import { encryptValue, decryptValue } from '../../src/privacy/Encryption';

describe('Encryption', () => {
  it('encrypts and decrypts a value', () => {
    const original = 'secret123';
    const encrypted = encryptValue(original);
    expect(typeof encrypted).toBe('string');
    expect(encrypted).not.toBe(original);
    const decrypted = decryptValue(encrypted);
    expect(decrypted).toBe(original);
  });
}); 