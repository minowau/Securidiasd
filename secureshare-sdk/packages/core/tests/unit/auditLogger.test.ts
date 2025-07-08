import { logAuditEvent } from '../../src/audit/AuditLogger';
import * as fs from 'fs';
import * as path from 'path';

describe('AuditLogger', () => {
  const logPath = path.resolve(__dirname, '../../../../audit.log');

  beforeEach(() => {
    if (fs.existsSync(logPath)) fs.unlinkSync(logPath);
  });

  it('writes an audit event to the log file', () => {
    const event = { type: 'policy_evaluation', user: 'alice', action: 'allow', data: { foo: 'bar' } };
    logAuditEvent(event);
    const content = fs.readFileSync(logPath, 'utf8');
    expect(content).toContain('policy_evaluation');
    expect(content).toContain('alice');
    expect(content).toContain('allow');
    expect(content).toContain('foo');
    expect(content).toContain('timestamp');
  });

  it('appends multiple events', () => {
    logAuditEvent({ type: 'event1' });
    logAuditEvent({ type: 'event2' });
    const content = fs.readFileSync(logPath, 'utf8');
    expect(content.split('\n').filter(Boolean).length).toBe(2);
  });
}); 