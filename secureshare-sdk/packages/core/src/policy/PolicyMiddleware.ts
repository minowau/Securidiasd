// PolicyMiddleware for SecureShare
import { Request, Response, NextFunction } from 'express';
import { PolicyEvaluator } from './PolicyEvaluator';
import { PolicyEvaluationContext } from './PolicyTypes';
import { logAuditEvent } from '../audit/AuditLogger';
import { tokenize } from '../privacy/Tokenizer';
import { maskValue } from '../privacy/Masking';
import { encryptValue } from '../privacy/Encryption';

export function createPolicyMiddleware(evaluator: PolicyEvaluator) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.headers['x-user-role'] as string || (req.body && req.body.userRole);
    const context: PolicyEvaluationContext = {
      data: req.body,
      user: userRole ? { role: userRole } : undefined,
      purpose: req.headers['x-purpose'] as string || undefined,
    };
    const result = evaluator.evaluate(context);
    // Audit log for policy evaluation
    logAuditEvent({
      type: 'policy_evaluation',
      user: userRole,
      action: result.action,
      rule: result.rule?.condition,
      reason: result.reason,
      data: req.body,
      purpose: context.purpose,
    });
    if (result.action === 'deny') {
      return res.status(403).json({ error: 'Access denied by policy', reason: result.reason });
    }
    // If action is tokenize, perform tokenization and log it
    if (result.action === 'tokenize') {
      // Tokenize all string fields in req.body (demo logic)
      const tokenized: Record<string, any> = { ...req.body };
      for (const key of Object.keys(tokenized)) {
        if (typeof tokenized[key] === 'string') {
          const original = tokenized[key];
          tokenized[key] = tokenize(original);
          logAuditEvent({
            type: 'privacy_transformation',
            transformation: 'tokenize',
            field: key,
            original,
            token: tokenized[key],
            user: userRole,
            purpose: context.purpose,
          });
        }
      }
      req.body = tokenized;
    }
    // If action is mask, perform masking and log it
    if (result.action === 'mask') {
      const masked: Record<string, any> = { ...req.body };
      for (const key of Object.keys(masked)) {
        if (typeof masked[key] === 'string') {
          const original = masked[key];
          masked[key] = maskValue(original);
          logAuditEvent({
            type: 'privacy_transformation',
            transformation: 'mask',
            field: key,
            original,
            masked: masked[key],
            user: userRole,
            purpose: context.purpose,
          });
        }
      }
      req.body = masked;
    }
    // If action is encrypt, perform encryption and log it
    if (result.action === 'encrypt') {
      const encrypted: Record<string, any> = { ...req.body };
      for (const key of Object.keys(encrypted)) {
        if (typeof encrypted[key] === 'string') {
          const original = encrypted[key];
          encrypted[key] = encryptValue(original);
          logAuditEvent({
            type: 'privacy_transformation',
            transformation: 'encrypt',
            field: key,
            original,
            encrypted: encrypted[key],
            user: userRole,
            purpose: context.purpose,
          });
        }
      }
      req.body = encrypted;
    }
    // Attach policy result for downstream middleware
    (req as any).policyResult = result;
    next();
  };
} 