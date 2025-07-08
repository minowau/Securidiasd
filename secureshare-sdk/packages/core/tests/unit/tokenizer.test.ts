import { tokenize, detokenize } from '../../src/privacy/Tokenizer';

describe('Tokenizer', () => {
  it('tokenizes and detokenizes a value', () => {
    const original = 'secret123';
    const token = tokenize(original);
    expect(token).toMatch(/^token_\d+$/);
    const restored = detokenize(token);
    expect(restored).toBe(original);
  });

  it('returns the same token for the same value', () => {
    const value = 'repeat';
    const token1 = tokenize(value);
    const token2 = tokenize(value);
    expect(token1).toBe(token2);
  });

  it('returns undefined for unknown token', () => {
    expect(detokenize('token_9999')).toBeUndefined();
  });
}); 