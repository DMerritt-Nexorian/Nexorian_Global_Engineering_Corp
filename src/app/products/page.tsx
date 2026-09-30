import React from 'react';
import { getCommercialProducts, getCorporatePlatforms, getResearchSystems } from '@/lib/products-registry';

export default function ProductsPage() {
  const commercialProducts = getCommercialProducts();
  const corporatePlatforms = getCorporatePlatforms();
  const researchSystems = getResearchSystems();

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '2.5rem', backgroundColor: '#030712', color: '#f8fafc', minHeight: '100vh' }}>

      {/* Top Header */}
      <header style={{ maxWidth: '1440px', margin: '0 auto 2.5rem auto', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.35rem', fontFamily: 'monospace' }}>
            NEXORIAN GLOBAL ENGINEERING CORP. • AUTHORITATIVE PORTFOLIO
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
            Technology Portfolio & Commercial IP Asset Catalog
          </h1>
        </div>
        <a href="/" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'monospace' }}>
          &larr; Return to AI Reasoning Console
        </a>
      </header>

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>

        {/* SECTION 1: COMMERCIAL LICENSABLE PRODUCTS */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ borderLeft: '4px solid #0284c7', paddingLeft: '1rem', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              1. Commercial Licensable Products (SaaS Lease & OEM IP)
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.25rem 0 0 0', fontFamily: 'monospace' }}>
              Authoritative pricing sourced from NEXORIAN_PORTFOLIO_VALUATION_SUPPORT_PACKAGE.md. Subject to Gate H3 human approval.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
            {commercialProducts.map((prod) => (
              <div key={prod.id} style={{ background: 'rgba(11, 15, 25, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backdropFilter: 'blur(12px)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#38bdf8', background: 'rgba(2, 132, 199, 0.15)', border: '1px solid rgba(2, 132, 199, 0.3)', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 700, fontFamily: 'monospace' }}>
                      {prod.category}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '3px', fontFamily: 'monospace' }}>
                      EVIDENCE: {prod.evidenceLevel}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', color: '#ffffff', margin: '0 0 0.5rem 0', fontWeight: 800 }}>{prod.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>{prod.description}</p>

                  <div style={{ background: '#030712', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.85rem', marginBottom: '1rem', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    <div style={{ color: '#64748b' }}>REPOSITORY: <span style={{ color: '#38bdf8' }}>{prod.repo}</span></div>
                    <div style={{ color: '#64748b', marginTop: '0.25rem' }}>CANONICAL TRUTH: <span style={{ color: '#10b981' }}>{prod.truthState}</span></div>
                    <div style={{ color: '#64748b', marginTop: '0.25rem' }}>SOURCE DOC: <span style={{ color: '#fbbf24' }}>{prod.sourceDoc}</span></div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>ANNUAL COMMERCIAL LEASE</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>${prod.priceUSD.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>/ yr</span></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>ENTERPRISE OEM / RTL</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>${prod.enterprisePriceUSD.toLocaleString()} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>/ yr</span></div>
                    </div>
                  </div>

                  <a href={`/products/${prod.id.toLowerCase()}`} style={{ display: 'block', textAlign: 'center', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff', textDecoration: 'none', padding: '0.65rem', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace' }}>
                    INSPECT PRODUCT DOSSIER &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: RESEARCH & EVALUATION SYSTEMS */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ borderLeft: '4px solid #a855f7', paddingLeft: '1rem', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              2. Research & Evaluation Systems
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.25rem 0 0 0', fontFamily: 'monospace' }}>
              Bio-intelligence and quantum time synchronization research systems.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
            {researchSystems.map((prod) => (
              <div key={prod.id} style={{ background: 'rgba(11, 15, 25, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backdropFilter: 'blur(12px)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#a855f7', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 700, fontFamily: 'monospace' }}>
                      {prod.category}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '3px', fontFamily: 'monospace' }}>
                      EVALUATION
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', color: '#ffffff', margin: '0 0 0.5rem 0', fontWeight: 800 }}>{prod.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>{prod.description}</p>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#a855f7', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    RESEARCH / GRANT LICENSE ({prod.enterprisePriceUSD > 0 ? `$${prod.enterprisePriceUSD.toLocaleString()}/yr Grant` : 'Academic Evaluation'})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: CORPORATE & FOUNDER COMMAND INFRASTRUCTURE */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ borderLeft: '4px solid #fbbf24', paddingLeft: '1rem', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              3. Corporate & Founder Command Infrastructure
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.25rem 0 0 0', fontFamily: 'monospace' }}>
              Internal executive control platform, telemetry hub, and air-gapped Virtual Data Room. Not available for standalone commercial purchase.
            </p>
          </div>

          {corporatePlatforms.map((prod) => (
            <div key={prod.id} style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '8px', padding: '1.75rem', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.15)', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 700, fontFamily: 'monospace' }}>
                  {prod.category}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontFamily: 'monospace', fontWeight: 'bold' }}>
                  PROPRIETARY FOUNDER PLATFORM
                </span>
              </div>

              <h3 style={{ fontSize: '1.4rem', color: '#ffffff', margin: '0 0 0.5rem 0', fontWeight: 800 }}>{prod.name}</h3>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>{prod.description}</p>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <a href="/founder" style={{ background: '#0284c7', color: '#ffffff', textDecoration: 'none', padding: '0.65rem 1.25rem', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace' }}>
                  OPEN FOUNDER CONTROL CENTER &rarr;
                </a>
                <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontFamily: 'monospace' }}>
                  GATE H1 APPROVED • INTERNAL USE ONLY
                </span>
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
