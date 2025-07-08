// Simple symmetric encryption utility for demo
import * as crypto from 'crypto';

const ALGO = 'aes-256-cbc';
const KEY = crypto.createHash('sha256').update('demo_secret_key').digest();
const IV = Buffer.alloc(16, 0); // static IV for demo only

export function encryptValue(value: string): string {
  const cipher = crypto.createCipheriv(ALGO, KEY, IV);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decryptValue(encrypted: string): string {
  const decipher = crypto.createDecipheriv(ALGO, KEY, IV);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
} 