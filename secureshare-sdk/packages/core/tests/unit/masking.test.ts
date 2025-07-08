import { maskValue } from '../../src/privacy/Masking';

describe('Masking', () => {
  it('masks all but last 4 characters', () => {
    expect(maskValue('123456789')).toBe('*****6789');
    expect(maskValue('abcd')).toBe('abcd');
    expect(maskValue('abc')).toBe('***');
  });
}); 