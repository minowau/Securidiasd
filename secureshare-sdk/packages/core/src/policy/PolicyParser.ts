// PolicyParser for SecureShare
import { Policy } from './PolicyTypes';
import yaml from 'js-yaml';

export function parsePolicyFromYAML(yamlStr: string): Policy {
  return yaml.load(yamlStr) as Policy;
}

export function parsePolicyFromJSON(jsonStr: string): Policy {
  return JSON.parse(jsonStr) as Policy;
} 