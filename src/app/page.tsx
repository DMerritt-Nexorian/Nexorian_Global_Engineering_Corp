'use client';

import React from 'react';
import { REGISTERED_PRODUCTS } from '@/lib/products-registry';

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#0b0f17', color: '#f1f5f9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header Bar */}
      <header style={{ borderBottom: '1px solid #1e293b', padding: '1.25rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '2px' }}>NEXORIAN</span>
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', border: '1px solid #334155', color: '#94a3b8', borderRadius: '2px', letterSpacing: '1px' }}>
            GLOBAL ENGINEERING CORP
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '2.5rem', fontSize: '0.85rem', fontWeight: 500 }}>
          <a href="#technology" style={{ color: '#cbd5e1', textDecoration: 'none' }}>TECHNOLOGY</a>
          <a href="/products" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: 600 }}>PRODUCTS</a>
          <a href="/demos/pqc" style={{ color: '#cbd5e1', textDecoration: 'none' }}>DEMONSTRATIONS</a>
          <a href="/dataroom" style={{ color: '#cbd5e1', textDecoration: 'none' }}>DATA ROOM</a>
          <a href="/founder" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600 }}>FOUNDER PORTAL</a>
        </nav>

        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            SYSTEMS OPERATIONAL
          </span>
          <a href="/products" style={{ backgroundColor: '#f8fafc', color: '#0f172a', padding: '0.55rem 1.25rem', borderRadius: '3px', textDecoration: 'none', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.5px' }}>
            LICENSE SOFTWARE
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '6rem 3rem 4rem 3rem', borderBottom: '1px solid #1e293b', backgroundColor: '#090d16' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8', letterSpacing: '2px', marginBottom: '1rem', textTransform: 'uppercase' }}>
            ADVANCED ENGINEERING SYSTEMS & COMPUTATIONAL INFRASTRUCTURE
          </div>

          <h1 style={{ fontSize: '3.25rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 1.5rem 0', maxWidth: '900px' }}>
            High-Performance Cryptographic, Deterministic, and Embedded Computing Platforms.
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '780px', margin: '0 0 2.5rem 0' }}>
            Nexorian Global Engineering Corp designs and deploys post-quantum cryptographic libraries, hardware RTL acceleration cores, deterministic autonomous safety runtimes, and bio-intelligence software systems.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/products" style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '0.75rem 1.75rem', borderRadius: '3px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              EXPLORE PRODUCTS
            </a>
            <a href="/demos/ntt" style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', padding: '0.75rem 1.75rem', borderRadius: '3px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              LIVE DEMONSTRATIONS
            </a>
            <a href="#technology" style={{ border: '1px solid #334155', color: '#94a3b8', padding: '0.75rem 1.75rem', borderRadius: '3px', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
              TECHNICAL ARCHITECTURE
            </a>
          </div>
        </div>
      </section>

      {/* Engineering Capabilities Bar */}
      <section style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a', padding: '2rem 3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>REPOSITORY ECOSYSTEM</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.25rem' }}>20 Repositories</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>CRYPTOGRAPHIC BOUNDARY</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.25rem' }}>FIPS 203 & 204</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>DETERMINISTIC SAFETY</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.25rem' }}>Proof-before-Trust</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>DEPLOYMENT MODES</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.25rem' }}>Local / On-Prem / RTL</div>
          </div>
        </div>
      </section>

      {/* Technology Domains Section */}
      <section id="technology" style={{ padding: '5rem 3rem', borderBottom: '1px solid #1e293b', backgroundColor: '#0b0f17' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#0284c7', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>DISCIPLINE OVERVIEW</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.5rem' }}>Core Technology Domains</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '2rem', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, letterSpacing: '1px', marginBottom: '0.5rem' }}>01 / SECURITY & CRYPTOGRAPHY</div>
              <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: '0 0 1rem 0' }}>Post-Quantum Cryptography & NTT Acceleration</h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                Constant-time Number Theoretic Transform (NTT) arithmetic engines and FIPS 203 (ML-KEM) / FIPS 204 (ML-DSA) algorithm implementations for quantum-resistant communications.
              </p>
              <a href="/demos/ntt" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>Execute Live NTT Transformation &rarr;</a>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '2rem', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, letterSpacing: '1px', marginBottom: '0.5rem' }}>02 / AI EXECUTION & SAFETY</div>
              <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: '0 0 1rem 0' }}>Deterministic Guardrail Mesh (DAGM)</h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                Proof-before-Trust execution kernel surrounding probabilistic AI reasoning with invariant-checked state mutation gates and continuous Lyapunov parameter projection.
              </p>
              <a href="/demos/pqc" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>Execute Guardrail Verification &rarr;</a>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '2rem', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, letterSpacing: '1px', marginBottom: '0.5rem' }}>03 / HARDWARE & SEMICONDUCTOR IP</div>
              <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: '0 0 1rem 0' }}>High-Determinism RTL Computational Cores</h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                SystemVerilog / Verilog hardware IP for high-determinism execution control, embedded battery management system (BMS) controllers, and IoT industrial drivers.
              </p>
              <a href="/products/nex-gtlm" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>View Hardware RTL Dossier &rarr;</a>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products Catalog Grid */}
      <section style={{ padding: '5rem 3rem', borderBottom: '1px solid #1e293b', backgroundColor: '#090d16' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#0284c7', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>SOFTWARE LEASING & IP LICENSING</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.5rem' }}>Featured Commercial Products</h2>
            </div>
            <a href="/products" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>View Full 20-Repo Catalog &rarr;</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {REGISTERED_PRODUCTS.slice(0, 3).map((product) => (
              <div key={product.id} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '4px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#38bdf8', border: '1px solid #0284c7', padding: '0.2rem 0.5rem', borderRadius: '2px', fontWeight: 600 }}>
                      {product.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: product.buildStatus === 'SUCCESS' ? '#10b981' : '#f59e0b' }}>
                      BUILD: {product.buildStatus}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: '0 0 0.75rem 0' }}>{product.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>{product.description}</p>
                </div>

                <div>
                  <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>ANNUAL LEASE</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>${product.priceUSD.toLocaleString()} USD</div>
                    </div>
                    <a href={`/products/${product.id.toLowerCase()}`} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 600 }}>
                      VIEW DOSSIER
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem', backgroundColor: '#0f172a', fontSize: '0.8rem', color: '#64748b' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>NEXORIAN GLOBAL ENGINEERING CORP.</div>
            <div>Copyright &copy; 2026 Dennis W. Merritt. All rights reserved.</div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="/terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>Terms of Use</a>
            <a href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="/security" style={{ color: '#94a3b8', textDecoration: 'none' }}>Security Policy</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
