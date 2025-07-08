import React, { useEffect, useState } from 'react';

function emptyPolicy() {
  return { name: '', rules: [{ condition: '', action: '', constraints: [] }] };
}

export default function Policies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyPolicy());
  const [editing, setEditing] = useState(null); // policy name

  function fetchPolicies() {
    setLoading(true);
    fetch('/api/policies')
      .then(res => res.json())
      .then(setPolicies)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchPolicies(); }, []);

  function handleInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleRuleChange(i, field, value) {
    const rules = form.rules.map((r, idx) => idx === i ? { ...r, [field]: value } : r);
    setForm({ ...form, rules });
  }

  function handleAddRule() {
    setForm({ ...form, rules: [...form.rules, { condition: '', action: '', constraints: [] }] });
  }

  function handleRemoveRule(i) {
    setForm({ ...form, rules: form.rules.filter((_, idx) => idx !== i) });
  }

  function handleConstraintChange(i, value) {
    const rules = form.rules.map((r, idx) => idx === i ? { ...r, constraints: value.split(',').map(s => s.trim()).filter(Boolean) } : r);
    setForm({ ...form, rules });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/policies/${encodeURIComponent(editing)}` : '/api/policies';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save policy');
        return res.json();
      })
      .then(() => {
        setShowForm(false);
        setForm(emptyPolicy());
        setEditing(null);
        fetchPolicies();
      })
      .catch(e => setError(e.message));
  }

  function handleEdit(policy) {
    setForm({ ...policy, rules: policy.rules.map(r => ({ ...r, constraints: r.constraints || [] })) });
    setEditing(policy.name);
    setShowForm(true);
  }

  function handleDelete(name) {
    if (!window.confirm('Delete this policy?')) return;
    fetch(`/api/policies/${encodeURIComponent(name)}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete policy');
        fetchPolicies();
      })
      .catch(e => setError(e.message));
  }

  return (
    <div>
      <h2>Policies</h2>
      <button onClick={() => { setShowForm(true); setForm(emptyPolicy()); setEditing(null); }}>Add Policy</button>
      {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
        <table border="1" cellPadding="6" style={{ width: '100%', marginTop: 16 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Version</th>
              <th>Updated At</th>
              <th>Rules</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map(p => (
              <tr key={p.name}>
                <td>{p.name}</td>
                <td>{p.version}</td>
                <td>{new Date(p.updatedAt).toLocaleString()}</td>
                <td>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {p.rules.map((r, i) => (
                      <li key={i}>
                        <b>{r.action}</b> if <code>{r.condition}</code>
                        {r.constraints && r.constraints.length > 0 && (
                          <span> (constraints: {r.constraints.join(', ')})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.name)} style={{ marginLeft: 8 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#222', color: '#fff', padding: 16, borderRadius: 8, marginTop: 24 }}>
          <h3>{editing ? 'Edit Policy' : 'Add Policy'}</h3>
          <label>
            Name: <input name="name" value={form.name} onChange={handleInput} required disabled={!!editing} />
          </label>
          <div>
            <b>Rules:</b>
            {form.rules.map((rule, i) => (
              <div key={i} style={{ marginBottom: 8, border: '1px solid #444', padding: 8, borderRadius: 4 }}>
                <label>
                  Condition: <input value={rule.condition} onChange={e => handleRuleChange(i, 'condition', e.target.value)} required style={{ width: 180 }} />
                </label>
                <label style={{ marginLeft: 8 }}>
                  Action: <input value={rule.action} onChange={e => handleRuleChange(i, 'action', e.target.value)} required style={{ width: 100 }} />
                </label>
                <label style={{ marginLeft: 8 }}>
                  Constraints: <input value={rule.constraints.join(', ')} onChange={e => handleConstraintChange(i, e.target.value)} placeholder="comma separated" style={{ width: 160 }} />
                </label>
                <button type="button" onClick={() => handleRemoveRule(i)} style={{ marginLeft: 8 }}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={handleAddRule}>Add Rule</button>
          </div>
          <div style={{ marginTop: 12 }}>
            <button type="submit">{editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
} 