import React from 'react';
import { getRegisteredProductById, REGISTERED_PRODUCTS } from '@/lib/products-registry';

export function generateStaticParams() {
  return REGISTERED_PRODUCTS.map((p) => ({
    id: p.id.toLowerCase(),
  }));
}

export default function DynamicProductPage({ params }: { params: { id: string } }) {
  const product = getRegisteredProductById(params.id) || REGISTERED_PRODUCTS[0];

  return (
    <div style={{ padding: '2.5rem', backgroundColor: '#030712', color: '#f8fafc', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <a href="/products" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'monospace', display: 'inline-block', marginBottom: '1.5rem' }}>
          &larr; Return to Technology Portfolio
        </a>

        <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginBottom: '0.5rem', fontFamily: 'monospace', fontWeight: 700 }}>
            CANONICAL DOSSIER // {product.id} • {product.structuralRole}
          </div>
          <h1 style={{ color: '#ffffff', fontSize: '2.25rem', margin: 0, fontWeight: 900 }}>{product.name}</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1rem', margin: '0.5rem 0 0 0', lineHeight: 1.6 }}>{product.description}</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Details */}
          <div>
            <div style={{ background: 'rgba(11, 15, 25, 0.85)', padding: '1.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem', backdropFilter: 'blur(12px)' }}>
              <h2 style={{ color: '#38bdf8', fontSize: '1.1rem', marginTop: 0, fontFamily: 'monospace', letterSpacing: '1px' }}>
                TECHNICAL SPECIFICATION & CANONICAL STATUS
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                <div><span style={{ color: '#64748b' }}>REPOSITORY:</span> <span style={{ color: '#38bdf8' }}>{product.repo}</span></div>
                <div><span style={{ color: '#64748b' }}>BUILD STATUS:</span> <span style={{ color: '#10b981' }}>{product.buildStatus}</span></div>
                <div><span style={{ color: '#64748b' }}>LICENSE:</span> <span style={{ color: '#cbd5e1' }}>{product.licenseType}</span></div>
                <div><span style={{ color: '#64748b' }}>PROPOSED STATUS:</span> <span style={{ color: '#fbbf24' }}>{product.proposedStatus}</span></div>
                <div><span style={{ color: '#64748b' }}>TRUTH STATE:</span> <span style={{ color: '#10b981' }}>{product.truthState}</span></div>
                <div><span style={{ color: '#64748b' }}>EVIDENCE TIER:</span> <span style={{ color: '#38bdf8' }}>{product.evidenceLevel}</span></div>
                <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>SOURCE DOCUMENT:</span> <span style={{ color: '#fbbf24' }}>{product.sourceDoc}</span></div>
              </div>
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                <strong>EVIDENCE BASIS:</strong> {product.evidenceDescription}
              </div>
            </div>

            {/* Release & Checksum */}
            <div style={{ background: 'rgba(11, 15, 25, 0.85)', padding: '1.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
              <h2 style={{ color: '#38bdf8', fontSize: '1.1rem', marginTop: 0, fontFamily: 'monospace', letterSpacing: '1px' }}>
                RELEASE ARTIFACT & CHECKSUM INTEGRITY
              </h2>
              <div style={{ fontSize: '0.8rem', wordBreak: 'break-all', background: '#030712', padding: '1.25rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'monospace' }}>
                <div style={{ marginBottom: '0.5rem', color: '#cbd5e1' }}><strong>ARTIFACT LOCATION:</strong> {product.downloadArtifact}</div>
                <div style={{ color: '#38bdf8' }}><strong>SHA-256 CHECKSUM:</strong> {product.sha256Checksum}</div>
              </div>
            </div>
          </div>

          {/* Commercial Sidebar */}
          <div style={{ background: 'rgba(11, 15, 25, 0.85)', padding: '1.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', height: 'fit-content', backdropFilter: 'blur(12px)' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.1rem', marginTop: 0, fontFamily: 'monospace' }}>COMMERCIAL LEASING</h2>

            <div style={{ margin: '1.5rem 0' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>ANNUAL LEASE TERMS</span>
              {product.priceUSD > 0 ? (
                <div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#38bdf8' }}>
                    ${product.priceUSD.toLocaleString()} USD <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>/ yr</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#fbbf24', marginTop: '0.35rem', fontFamily: 'monospace' }}>
                    ENTERPRISE OEM: ${product.enterprisePriceUSD.toLocaleString()} / yr
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#a855f7', marginTop: '0.35rem', fontFamily: 'monospace' }}>
                  {product.structuralRole === 'CORPORATE_PLATFORM' ? 'INTERNAL FOUNDER PLATFORM' : 'RESEARCH / EVALUATION GRANT'}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {product.demoRoute && (
                <a href={product.demoRoute} style={{ backgroundColor: '#0284c7', color: '#fff', textDecoration: 'none', padding: '0.75rem', textAlign: 'center', borderRadius: '5px', fontWeight: 800, fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  EXECUTE LIVE DEMONSTRATION &rarr;
                </a>
              )}
              <button disabled style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: '#64748b', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '5px', fontWeight: 700, fontSize: '0.8rem', cursor: 'not-allowed', fontFamily: 'monospace' }}>
                HUMAN REVIEW REQUIRED (GATE H3)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
