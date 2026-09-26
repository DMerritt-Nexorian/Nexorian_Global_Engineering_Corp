import React from 'react';

export default function FounderPortalPage() {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#090d16', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#fbbf24', fontSize: '1.75rem', margin: 0 }}>NEXORIAN FOUNDER CONTROL CENTER</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>Executive Systems ARCS Group — System Control & Governance Hub</p>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #f59e0b', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 'bold' }}>
          FOUNDER ROLE: DENNIS W. MERRITT
        </div>
      </header>

      {/* Control Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>PORTFOLIO STATUS</span>
          <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: '#38bdf8' }}>11 Repositories</h3>
          <p style={{ fontSize: '0.8rem', color: '#22c55e', margin: 0 }}>● 1 Ready for Review | 10 In Engineering</p>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>GOVERNANCE GATES</span>
          <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: '#f59e0b' }}>Gate H1–H6 Active</h3>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>Gate H1 Approved | Gate H3–H6 Pending</p>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>ESTIMATED STRATEGIC IP VALUE</span>
          <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: '#38bdf8' }}>$68.5M – $140M</h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Replacement Cost: $11.15M</p>
        </div>
      </div>

      {/* Actions & Quick Controls */}
      <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#f1f5f9', marginTop: 0 }}>System Control Operations</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/products" style={{ backgroundColor: '#0284c7', color: '#fff', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' }}>
            VIEW COMMERCIAL PRODUCTS
          </a>
          <a href="/demos/pqc" style={{ backgroundColor: '#059669', color: '#fff', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' }}>
            EXECUTE LIVE PQC DEMO
          </a>
          <button disabled style={{ backgroundColor: '#334155', color: '#94a3b8', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'not-allowed' }}>
            ACTIVATE LIVE PAYMENTS (GATE H3 REQUIRED)
          </button>
        </div>
      </div>
    </div>
  );
}
