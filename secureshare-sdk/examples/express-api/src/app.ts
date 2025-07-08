import express from 'express';
import bodyParser from 'body-parser';
import { PolicyEvaluator } from '../../../packages/core/src/policy/PolicyEvaluator';
import { parsePolicyFromYAML } from '../../../packages/core/src/policy/PolicyParser';
import { createPolicyMiddleware } from '../../../packages/core/src/policy/PolicyMiddleware';

const yamlPolicy = `
name: demo_policy
rules:
  - condition: "data.type == 'PII'"
    action: tokenize
  - condition: "data.type == 'MASK'"
    action: mask
  - condition: "data.type == 'ENCRYPT'"
    action: encrypt
  - condition: "user.role == 'admin'"
    action: allow
`;

const policy = parsePolicyFromYAML(yamlPolicy);
const evaluator = new PolicyEvaluator(policy);

const app = express();
app.use(bodyParser.json());
app.use(createPolicyMiddleware(evaluator));

app.post('/data', (req, res) => {
  res.json({
    message: 'Request allowed by policy',
    policyResult: (req as any).policyResult,
    data: req.body,
  });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Demo app listening on port ${PORT}`);
  });
}

export default app; 