const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Import the core policy repository
const corePath = path.resolve(__dirname, '../../dist/core/policy/');
const { addPolicy, updatePolicy, getPolicy, listPolicies, deletePolicy } = require(corePath + '/PolicyRepository');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// List all policies
app.get('/api/policies', (req, res) => {
  res.json(listPolicies());
});

// Get a specific policy
app.get('/api/policies/:name', (req, res) => {
  const policy = getPolicy(req.params.name);
  if (!policy) return res.status(404).json({ error: 'Policy not found' });
  res.json(policy);
});

// Add a new policy
app.post('/api/policies', (req, res) => {
  const policy = req.body;
  const added = addPolicy(policy);
  res.status(201).json(added);
});

// Update a policy
app.put('/api/policies/:name', (req, res) => {
  const updated = updatePolicy(req.params.name, req.body);
  if (!updated) return res.status(404).json({ error: 'Policy not found' });
  res.json(updated);
});

// Delete a policy
app.delete('/api/policies/:name', (req, res) => {
  const deleted = deletePolicy(req.params.name);
  if (!deleted) return res.status(404).json({ error: 'Policy not found' });
  res.json({ success: true });
});

// List audit log entries (optionally filter by type or user)
app.get('/api/audit', (req, res) => {
  const logPath = path.resolve(__dirname, '../../audit.log');
  if (!fs.existsSync(logPath)) return res.json([]);
  const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
  let entries = lines.map(line => { try { return JSON.parse(line); } catch { return null; } }).filter(Boolean);
  if (req.query.type) entries = entries.filter(e => e.type === req.query.type);
  if (req.query.user) entries = entries.filter(e => e.user === req.query.user);
  res.json(entries);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Admin API listening on port ${PORT}`);
}); 