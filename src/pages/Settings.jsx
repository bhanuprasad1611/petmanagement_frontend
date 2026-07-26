import React from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Code, Terminal, Database, Server, Cpu, ExternalLink, ShieldCheck } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();

  return (
    <div>
      <Navbar title="System Architecture & Developer Tools" />

      <div className="content-body">
        {/* Profile Details */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="var(--primary)" /> User Identity Profile
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
            <div>Name: <strong>{user?.name}</strong></div>
            <div>Email: <strong>{user?.email}</strong></div>
            <div>Role: <strong>{user?.role}</strong></div>
            <div>Status: <span style={{ color: '#34d399', fontWeight: 700 }}>● Active Session</span></div>
          </div>
        </div>

        {/* IDE & Workspace Integration Guide */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {/* React in VS Code Instructions */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Code size={20} /> Frontend IDE: VS Code Setup
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              The React 19 frontend is optimized for **Visual Studio Code**.
            </p>

            <div style={{ background: 'rgba(15,23,42,0.6)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.82rem', fontFamily: 'monospace' }}>
              <div># Open frontend directory in VS Code</div>
              <div style={{ color: 'var(--primary)', margin: '4px 0' }}>code C:\Users\ACER\.gemini\antigravity\scratch\pet-management-system\frontend</div>
              <div># Run development server</div>
              <div style={{ color: 'var(--primary)', marginTop: '4px' }}>npm run dev</div>
            </div>

            <ul style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1.25rem' }}>
              <li>Vite Dev Server URL: <code>http://localhost:5173</code></li>
              <li>Hot Module Replacement (HMR) enabled</li>
              <li>Lucide Icons & Raw CSS System</li>
            </ul>
          </div>

          {/* Spring Boot in Eclipse Instructions */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Server size={20} /> Backend IDE: Eclipse Setup
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              The Java 21 Spring Boot app is configured as a standard Maven project for **Eclipse IDE**.
            </p>

            <div style={{ background: 'rgba(15,23,42,0.6)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.82rem', fontFamily: 'monospace' }}>
              <div># Import into Eclipse:</div>
              <div>1. File -&gt; Import -&gt; Existing Maven Projects</div>
              <div style={{ color: 'var(--secondary)', margin: '4px 0' }}>2. Root Directory: backend/</div>
              <div>3. Run as -&gt; Spring Boot App / Java Application</div>
            </div>

            <ul style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1.25rem' }}>
              <li>REST API Base Endpoint: <code>http://localhost:8080/api</code></li>
              <li>H2 In-Memory Console: <code>http://localhost:8080/h2-console</code></li>
              <li>MySQL Driver: <code>com.mysql.cj.jdbc.Driver</code></li>
            </ul>
          </div>
        </div>

        {/* Database Configuration Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} color="var(--accent-amber)" /> MySQL & Dual Database Topology
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            The Spring Boot application contains pre-configured <code>schema-mysql.sql</code> for production MySQL instances, alongside automatic H2 fallback mode.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
            <div style={{ background: 'rgba(15,23,42,0.4)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <strong>MySQL JDBC Connection</strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                jdbc:mysql://localhost:3306/pet_db
              </div>
            </div>
            <div style={{ background: 'rgba(15,23,42,0.4)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <strong>H2 Embedded Console</strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                JDBC URL: jdbc:h2:mem:pet_db | Username: sa
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
