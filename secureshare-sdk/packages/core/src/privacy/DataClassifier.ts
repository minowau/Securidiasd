// Basic PII classifier using regex
const patterns = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/,
  phone: /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/
};

export function classifyPII(value: string): string[] {
  const types: string[] = [];
  for (const [type, regex] of Object.entries(patterns)) {
    if (regex.test(value)) types.push(type);
  }
  return types;
} 