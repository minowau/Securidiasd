import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import Policies from './Policies';
import AuditLog from './AuditLog';

function Dashboard() {
  return <div><h2>Dashboard</h2><p>Welcome to SecureShare Admin Dashboard.</p></div>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>SecureShare Admin</h1>
          <nav style={{ marginBottom: 24 }}>
            <Link to="/" style={{ color: '#61dafb', marginRight: 16 }}>Dashboard</Link>
            <Link to="/policies" style={{ color: '#61dafb', marginRight: 16 }}>Policies</Link>
            <Link to="/audit" style={{ color: '#61dafb' }}>Audit Log</Link>
          </nav>
        </header>
        <main style={{ maxWidth: 900, margin: '0 auto', textAlign: 'left' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
