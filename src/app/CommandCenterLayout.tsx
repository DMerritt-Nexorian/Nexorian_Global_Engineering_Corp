import React from 'react';

export default function HighEndCommandCenterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'monospace, sans-serif', minHeight: '100vh' }}>
      {/* Top High-Tech Command Bar */}
      <header style={{ borderBottom: '1px solid #1e293b', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#38bdf8', letterSpacing: '2px' }}>NEXORIAN</span>
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #0284c7', color: '#38bdf8' }}>
            JARVIS COMMAND CENTER v2.1
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
          <a href="/products" style={{ color: '#94a3b8', textDecoration: 'none' }}>PRODUCTS</a>
          <a href="/observatory" style={{ color: '#94a3b8', textDecoration: 'none' }}>OBSERVATORY / GLOBE</a>
          <a href="/docs" style={{ color: '#94a3b8', textDecoration: 'none' }}>DOCUMENTATION</a>
          <a href="/dataroom" style={{ color: '#94a3b8', textDecoration: 'none' }}>VIRTUAL DATA ROOM</a>
          <a href="/founder" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 'bold' }}>FOUNDER PORTAL</a>
        </nav>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>● SYSTEM OPERATIONAL</span>
          <button style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>
            SIGN IN
          </button>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
