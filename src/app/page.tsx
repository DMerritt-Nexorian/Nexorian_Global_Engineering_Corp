'use client';

import React, { useState } from 'react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'EARTH' | 'TECHNOLOGY' | 'PRODUCTS'>('TECHNOLOGY');
  const [selectedNode, setSelectedNode] = useState<string>('PQC');

  return (
    <div style={{ backgroundColor: '#060a12', color: '#f8fafc', fontFamily: 'monospace, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <header style={{ borderBottom: '1px solid #1e293b', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#38bdf8', letterSpacing: '3px' }}>NEXORIAN</span>
          <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #0284c7', color: '#38bdf8' }}>
            INTELLIGENT SYSTEMS NETWORK
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
          <a href="/products" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: 'bold' }}>PRODUCTS</a>
          <a href="/demos/pqc" style={{ color: '#94a3b8', textDecoration: 'none' }}>PQC DEMO</a>
          <a href="/demos/ntt" style={{ color: '#94a3b8', textDecoration: 'none' }}>NTT DEMO</a>
          <a href="/dataroom" style={{ color: '#94a3b8', textDecoration: 'none' }}>DATA ROOM</a>
          <a href="/founder" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 'bold' }}>FOUNDER PORTAL</a>
        </nav>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>● SYSTEMS OPERATIONAL</span>
          <a href="/products" style={{ backgroundColor: '#0284c7', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}>
            LICENSE SOFTWARE
          </a>
        </div>
      </header>

      {/* Main Command Center Hero Section */}
      <main style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: '320px 1fr 320px', gap: '2rem', alignItems: 'center' }}>

        {/* Left Side: JARVIS System Status Panel */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
          <div style={{ borderBottom: '1px solid #334155', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>JARVIS INTELLIGENCE SYSTEM</span>
            <h3 style={{ fontSize: '1.1rem', margin: '0.25rem 0 0 0', color: '#f1f5f9' }}>SYSTEM STATUS LAYER</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>ENGINEERING REPOSITORIES</span>
              <div style={{ fontSize: '1.25rem', color: '#38bdf8', fontWeight: 'bold' }}>20 Tracked Repositories</div>
            </div>

            <div>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>VERIFIED CAPABILITIES</span>
              <div style={{ fontSize: '1.25rem', color: '#22c55e', fontWeight: 'bold' }}>47 Verified Invariants</div>
            </div>

            <div>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>PRODUCT CANDIDATES</span>
              <div style={{ fontSize: '1.25rem', color: '#f59e0b', fontWeight: 'bold' }}>12 Commercial Products</div>
            </div>

            <div>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>SECURITY BOUNDARY</span>
              <div style={{ fontSize: '0.85rem', color: '#38bdf8', marginTop: '0.25rem' }}>
                FIPS 203 ML-KEM + FIPS 204 ML-DSA Enforced
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>QUICK COMMANDS</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <a href="/products" style={{ color: '#38bdf8', fontSize: '0.8rem', textDecoration: 'none' }}>&gt; Explore Security Portfolio</a>
              <a href="/demos/pqc" style={{ color: '#38bdf8', fontSize: '0.8rem', textDecoration: 'none' }}>&gt; Execute PQC Key Generation</a>
              <a href="/demos/ntt" style={{ color: '#38bdf8', fontSize: '0.8rem', textDecoration: 'none' }}>&gt; Verify NTT Polynomial Recovery</a>
              <a href="/founder" style={{ color: '#fbbf24', fontSize: '0.8rem', textDecoration: 'none' }}>&gt; Open Founder Control Center</a>
            </div>
          </div>
        </div>

        {/* Center: Interactive Technology Observatory & Globe Network */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#0f172a', padding: '0.25rem', borderRadius: '6px', border: '1px solid #1e293b', marginBottom: '1.5rem' }}>
            {(['EARTH', 'TECHNOLOGY', 'PRODUCTS'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveTab(mode)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: activeTab === mode ? '#0284c7' : 'transparent',
                  color: activeTab === mode ? '#fff' : '#94a3b8',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {mode} MODE
              </button>
            ))}
          </div>

          {/* 3D Globe / Technology Network Sphere Canvas Simulation */}
          <div style={{
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #0369a1 0%, #0f172a 70%, #0284c7 100%)',
            boxShadow: '0 0 50px rgba(56, 189, 248, 0.25), inset 0 0 30px rgba(0, 0, 0, 0.8)',
            border: '1px solid #38bdf8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Grid Overlay Effect */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.2) 1px, transparent 0)',
              backgroundSize: '20px 20px',
              opacity: 0.6
            }} />

            {/* Orbiting Network Nodes */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', letterSpacing: '2px' }}>NEXORIAN GLOBAL MESH</div>
              <h2 style={{ fontSize: '1.5rem', color: '#f1f5f9', margin: '0.5rem 0' }}>{selectedNode} DOMAIN</h2>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', maxWidth: '280px' }}>
                {selectedNode === 'PQC' && 'Post-Quantum Cryptography (FIPS 203/204)'}
                {selectedNode === 'NTT' && 'Number Theoretic Transform Hardware Core'}
                {selectedNode === 'DAGM' && 'Deterministic Autonomous Guardrail Mesh'}
                {selectedNode === 'GEN' && 'Bio-Intelligence Genomic Analysis Engine'}
              </div>
            </div>

            {/* Selectable Domain Chips */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', position: 'relative', zIndex: 10 }}>
              {['PQC', 'NTT', 'DAGM', 'GEN'].map((node) => (
                <button
                  key={node}
                  onClick={() => setSelectedNode(node)}
                  style={{
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    border: '1px solid #38bdf8',
                    backgroundColor: selectedNode === node ? '#38bdf8' : 'rgba(15, 23, 42, 0.8)',
                    color: selectedNode === node ? '#000' : '#38bdf8',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  {node}
                </button>
              ))}
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1.5rem' }}>
            Interactive Spatial Command Center — Select a domain node to inspect product dossiers & live code execution.
          </p>
        </div>

        {/* Right Side: Featured Technology Dossiers */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
          <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>FEATURED SYSTEM DOSSIER</span>
          <h3 style={{ fontSize: '1.25rem', color: '#f1f5f9', margin: '0.5rem 0 1rem 0' }}>CORE_SEC_PQC</h3>

          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <strong>ARCHITECTURE:</strong> Rust / WASM / C
            </div>
            <div>
              <strong>STANDARDS:</strong> FIPS 203 (ML-KEM) & FIPS 204 (ML-DSA)
            </div>
            <div>
              <strong>DEPLOYMENT:</strong> Local / Embedded / Cloud
            </div>
            <div>
              <strong>STATUS:</strong> <span style={{ color: '#fbbf24' }}>STATUS C — VALIDATION REQUIRED</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="/demos/pqc" style={{ backgroundColor: '#0284c7', color: '#fff', textDecoration: 'none', padding: '0.6rem', textAlign: 'center', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>
              WATCH / EXECUTE LIVE DEMO
            </a>
            <a href="/products/nex-pqc" style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#38bdf8', textDecoration: 'none', padding: '0.6rem', textAlign: 'center', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>
              VIEW PRODUCT DOSSIER
            </a>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e293b', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', fontSize: '0.75rem', color: '#64748b' }}>
        <div>Copyright © 2026 Dennis W. Merritt / Nexorian Corporation. All rights reserved.</div>
        <div>JARVIS MasterPrompt v2.1 — Executive Systems ARCS Group</div>
      </footer>
    </div>
  );
}
