// Policy-related types for SecureShare

export type PolicyAction = 'allow' | 'deny' | 'tokenize' | 'mask' | 'log' | 'encrypt';

export interface PolicyRule {
  condition: string; // e.g., "data.type == 'PII'"
  action: PolicyAction;
  constraints?: string[];
  scope?: string;
}

export interface Policy {
  name: string;
  rules: PolicyRule[];
}

export interface PolicyEvaluationContext {
  data: Record<string, any>;
  user?: Record<string, any>;
  purpose?: string;
}

export interface PolicyEvaluationResult {
  action: PolicyAction;
  rule?: PolicyRule;
  reason?: string;
} 