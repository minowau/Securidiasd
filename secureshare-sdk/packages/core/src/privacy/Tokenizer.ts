// Simple reversible tokenization utility for demo
const tokenMap = new Map<string, string>();
const reverseMap = new Map<string, string>();
let tokenCounter = 0;

export function tokenize(value: string): string {
  if (tokenMap.has(value)) return tokenMap.get(value)!;
  const token = `token_${++tokenCounter}`;
  tokenMap.set(value, token);
  reverseMap.set(token, value);
  return token;
}

export function detokenize(token: string): string | undefined {
  return reverseMap.get(token);
} 