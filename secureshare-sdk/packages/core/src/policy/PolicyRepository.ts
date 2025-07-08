// In-memory Policy Repository for SecureShare
import { Policy } from './PolicyTypes';

interface VersionedPolicy extends Policy {
  version: number;
  updatedAt: Date;
}

const policyStore: Record<string, VersionedPolicy> = {};

export function addPolicy(policy: Policy): VersionedPolicy {
  const versioned: VersionedPolicy = {
    ...policy,
    version: 1,
    updatedAt: new Date(),
  };
  policyStore[policy.name] = versioned;
  return versioned;
}

export function updatePolicy(name: string, policy: Policy): VersionedPolicy | undefined {
  const existing = policyStore[name];
  if (!existing) return undefined;
  const versioned: VersionedPolicy = {
    ...policy,
    version: existing.version + 1,
    updatedAt: new Date(),
  };
  policyStore[name] = versioned;
  return versioned;
}

export function getPolicy(name: string): VersionedPolicy | undefined {
  return policyStore[name];
}

export function listPolicies(): VersionedPolicy[] {
  return Object.values(policyStore);
}

export function deletePolicy(name: string): boolean {
  if (policyStore[name]) {
    delete policyStore[name];
    return true;
  }
  return false;
} 