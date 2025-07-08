import React, { useEffect, useState } from 'react';

export default function AuditLog() {
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState('');
  const [user, setUser] = useState('');

  function fetchAudit() {
    setLoading(true);
    let url = '/api/audit';
    const params = [];
    if (type) params.push(`type=${encodeURIComponent(type)}`);
    if (user) params.push(`user=${encodeURIComponent(user)}`);
    if (params.length) url += '?' + params.join('&');
    fetch(url)
      .then(res => res.json())
      .then(setAudit)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchAudit(); }, [type, user]);

  return (
    <div>
      <h2>Audit Log</h2>
      <div style={{ marginBottom: 16 }}>
        <label>
          Type: <input value={type} onChange={e => setType(e.target.value)} placeholder="e.g. policy_evaluation" style={{ marginRight: 12 }} />
        </label>
        <label>
          User: <input value={user} onChange={e => setUser(e.target.value)} placeholder="username or role" />
        </label>
        <button onClick={fetchAudit} style={{ marginLeft: 12 }}>Search</button>
        <button onClick={() => { setType(''); setUser(''); }} style={{ marginLeft: 8 }}>Clear</button>
      </div>
      {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
        <div style={{ maxHeight: 400, overflowY: 'auto', background: '#222', color: '#fff', padding: 8, borderRadius: 4 }}>
          <table border="1" cellPadding="6" style={{ width: '100%', background: '#222', color: '#fff' }}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Type</th>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {audit.map((entry, i) => (
                <tr key={i}>
                  <td>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ''}</td>
                  <td>{entry.type}</td>
                  <td>{entry.user || ''}</td>
                  <td>{entry.action || entry.transformation || ''}</td>
                  <td>
                    <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(entry, null, 2)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 