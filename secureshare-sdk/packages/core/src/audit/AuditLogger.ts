// Simple audit logger for SecureShare
import * as fs from 'fs';
import * as path from 'path';

const logPath = process.env.SECURESHARE_AUDIT_LOG || path.resolve('D:/Securidiasd/secureshare-sdk/audit.log');

export function logAuditEvent(event: object) {
  const entry = JSON.stringify({ ...event, timestamp: new Date().toISOString() }) + '\n';
  fs.appendFileSync(logPath, entry, { encoding: 'utf8' });
} 