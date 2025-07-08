import { parsePolicyFromYAML, parsePolicyFromJSON } from '../../src/policy/PolicyParser';
import { PolicyEvaluator } from '../../src/policy/PolicyEvaluator';
import { Policy } from '../../src/policy/PolicyTypes';
import express, { Request, Response } from 'express';
import request from 'supertest';

describe('Policy Engine', () => {
  const yamlPolicy = `
name: test_policy
rules:
  - condition: "data.type == 'PII'"
    action: tokenize
  - condition: "user.role == 'admin'"
    action: allow
`;
  const jsonPolicy = JSON.stringify({
    name: 'test_policy',
    rules: [
      { condition: "data.type == 'PII'", action: 'tokenize' },
      { condition: "user.role == 'admin'", action: 'allow' },
    ],
  });

  it('parses YAML policy', () => {
    const policy = parsePolicyFromYAML(yamlPolicy);
    expect(policy.name).toBe('test_policy');
    expect(policy.rules.length).toBe(2);
  });

  it('parses JSON policy', () => {
    const policy = parsePolicyFromJSON(jsonPolicy);
    expect(policy.name).toBe('test_policy');
    expect(policy.rules.length).toBe(2);
  });

  it('evaluates policy for PII data', () => {
    const policy = parsePolicyFromYAML(yamlPolicy);
    const evaluator = new PolicyEvaluator(policy);
    const result = evaluator.evaluate({ data: { type: 'PII' } });
    expect(result.action).toBe('tokenize');
  });

  it('evaluates policy for admin user', () => {
    const policy = parsePolicyFromYAML(yamlPolicy);
    const evaluator = new PolicyEvaluator(policy);
    const result = evaluator.evaluate({ data: {}, user: { role: 'admin' } });
    expect(result.action).toBe('allow');
  });

  it('denies when no rule matches', () => {
    const policy = parsePolicyFromYAML(yamlPolicy);
    const evaluator = new PolicyEvaluator(policy);
    const result = evaluator.evaluate({ data: { type: 'public' }, user: { role: 'user' } });
    expect(result.action).toBe('deny');
  });

  it('evaluates policy with constraints (satisfied)', () => {
    const policy = {
      name: 'constraint_policy',
      rules: [
        {
          condition: "data.type == 'PII'",
          action: 'tokenize' as Policy['rules'][0]['action'],
          constraints: ["purpose == 'analytics'", "user.role == 'analyst'"]
        }
      ]
    };
    const evaluator = new PolicyEvaluator(policy);
    const result = evaluator.evaluate({ data: { type: 'PII' }, purpose: 'analytics', user: { role: 'analyst' } });
    expect(result.action).toBe('tokenize');
  });

  it('denies policy with constraints (not satisfied)', () => {
    const policy = {
      name: 'constraint_policy',
      rules: [
        {
          condition: "data.type == 'PII'",
          action: 'tokenize' as Policy['rules'][0]['action'],
          constraints: ["purpose == 'analytics'", "user.role == 'analyst'"]
        }
      ]
    };
    const evaluator = new PolicyEvaluator(policy);
    // Wrong purpose
    const result1 = evaluator.evaluate({ data: { type: 'PII' }, purpose: 'reporting', user: { role: 'analyst' } });
    expect(result1.action).toBe('deny');
    // Wrong user role
    const result2 = evaluator.evaluate({ data: { type: 'PII' }, purpose: 'analytics', user: { role: 'admin' } });
    expect(result2.action).toBe('deny');
  });

  it('enforces policy in Express middleware', async () => {
    const policy = parsePolicyFromYAML(yamlPolicy);
    const evaluator = new PolicyEvaluator(policy);
    const { createPolicyMiddleware } = await import('../../src/policy/PolicyMiddleware');
    const app = express();
    app.use(express.json());
    app.use(createPolicyMiddleware(evaluator));
    app.post('/test', (req, res) => {
      res.json({ result: (req as any).policyResult });
    });
    // Should allow admin
    await request(app)
      .post('/test')
      .send({})
      .set('Content-Type', 'application/json')
      .set('x-purpose', 'test')
      .set('x-user-role', 'admin')
      .expect(200);
    // Should deny for non-matching
    await request(app)
      .post('/test')
      .send({ type: 'public' })
      .set('Content-Type', 'application/json')
      .expect(403);
  });
}); 