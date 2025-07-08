import { addPolicy, updatePolicy, getPolicy, listPolicies, deletePolicy } from '../../src/policy/PolicyRepository';
import { Policy } from '../../src/policy/PolicyTypes';

describe('PolicyRepository', () => {
  const basePolicy: Policy = {
    name: 'test_policy',
    rules: [
      { condition: "data.type == 'PII'", action: 'tokenize' as Policy['rules'][0]['action'] },
    ],
  };

  afterEach(() => {
    // Clean up
    deletePolicy('test_policy');
    deletePolicy('updated_policy');
  });

  it('adds and gets a policy', () => {
    const added = addPolicy(basePolicy);
    const fetched = getPolicy('test_policy');
    expect(fetched).toBeDefined();
    expect(fetched?.name).toBe('test_policy');
    expect(fetched?.version).toBe(1);
  });

  it('updates a policy and increments version', () => {
    addPolicy(basePolicy);
    const updated = updatePolicy('test_policy', { ...basePolicy, name: 'test_policy', rules: [{ condition: "user.role == 'admin'", action: 'allow' as Policy['rules'][0]['action'] }] });
    expect(updated).toBeDefined();
    expect(updated?.version).toBe(2);
    expect(updated?.rules[0].condition).toBe("user.role == 'admin'");
  });

  it('lists all policies', () => {
    addPolicy(basePolicy);
    const all = listPolicies();
    expect(all.length).toBeGreaterThan(0);
    expect(all[0].name).toBe('test_policy');
  });

  it('deletes a policy', () => {
    addPolicy(basePolicy);
    const deleted = deletePolicy('test_policy');
    expect(deleted).toBe(true);
    expect(getPolicy('test_policy')).toBeUndefined();
  });
}); 