export default function HomePage() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#38bdf8' }}>NEXORIAN GLOBAL ENGINEERING CORP.</h1>
      <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '800px', margin: '1rem auto' }}>
        Executive Systems ARCS Group — Production Web Portal, 3D WebGL Jarvis AI Entity, and Air-Gapped Virtual Data Room (VDR).
      </p>

      <div style={{ margin: '2rem 0' }}>
        <a href="/products" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0284c7', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
          Explore Commercial Product Catalog
        </a>
      </div>

      <div style={{ borderTop: '1px solid #334155', paddingTop: '2rem', marginTop: '4rem', color: '#64748b', fontSize: '0.875rem' }}>
        Copyright © 2026 Dennis W. Merritt / Nexorian Corporation. All rights reserved.
      </div>
    </div>
  );
}
