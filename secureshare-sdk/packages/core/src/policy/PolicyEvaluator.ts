// PolicyEvaluator for SecureShare
import { Policy, PolicyEvaluationContext, PolicyEvaluationResult } from './PolicyTypes';

export class PolicyEvaluator {
  constructor(private policy: Policy) {}

  evaluate(context: PolicyEvaluationContext): PolicyEvaluationResult {
    // Now supports constraints in addition to simple equality checks
    for (const rule of this.policy.rules) {
      if (
        this.matchCondition(rule.condition, context) &&
        this.matchConstraints(rule.constraints, context)
      ) {
        return { action: rule.action, rule, reason: 'Matched rule' };
      }
    }
    return { action: 'deny', reason: 'No matching rule' };
  }

  private matchCondition(condition: string, context: PolicyEvaluationContext): boolean {
    // Support conditions like "data.type == 'PII'" and "user.role == 'admin'"
    const match = condition.match(/(data|user|purpose)(?:\.(\w+))?\s*==\s*'([^']+)'/);
    if (!match) return false;
    const [, obj, key, value] = match;
    const ctx = context as Record<string, any>;
    if (!ctx[obj]) return false;
    if (key) {
      return ctx[obj][key] === value;
    } else {
      return ctx[obj] === value;
    }
  }

  private matchConstraints(constraints?: string[], context?: PolicyEvaluationContext): boolean {
    if (!constraints || constraints.length === 0) return true;
    if (!context) return false;
    // All constraints must be satisfied
    return constraints.every(constraint => this.matchCondition(constraint, context));
  }
} 