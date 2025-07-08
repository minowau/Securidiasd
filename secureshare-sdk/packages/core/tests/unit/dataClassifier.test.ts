import { classifyPII } from '../../src/privacy/DataClassifier';

describe('DataClassifier', () => {
  it('detects email addresses', () => {
    expect(classifyPII('test@example.com')).toContain('email');
  });

  it('detects SSN', () => {
    expect(classifyPII('123-45-6789')).toContain('ssn');
  });

  it('detects phone numbers', () => {
    expect(classifyPII('555-123-4567')).toContain('phone');
    expect(classifyPII('555 123 4567')).toContain('phone');
    expect(classifyPII('555.123.4567')).toContain('phone');
  });

  it('returns empty array for non-PII', () => {
    expect(classifyPII('hello world')).toEqual([]);
  });
}); 