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
    <div style={{ padding: '2rem', backgroundColor: '#090d16', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginBottom: '0.5rem' }}>
          PRODUCT DOSSIER // {product.id}
        </div>
        <h1 style={{ color: '#f1f5f9', fontSize: '2rem', margin: 0 }}>{product.name}</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0.5rem 0 0 0' }}>{product.description}</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Main Details */}
        <div>
          <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#38bdf8', fontSize: '1.2rem', marginTop: 0 }}>TECHNICAL SPECIFICATION & STATUS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
              <div><strong>REPOSITORY:</strong> <span style={{ color: '#cbd5e1' }}>{product.repo}</span></div>
              <div><strong>BUILD STATUS:</strong> <span style={{ color: product.buildStatus === 'SUCCESS' ? '#22c55e' : '#f59e0b' }}>{product.buildStatus}</span></div>
              <div><strong>LICENSE:</strong> <span style={{ color: '#cbd5e1' }}>{product.licenseType}</span></div>
              <div><strong>PROPOSED STATUS:</strong> <span style={{ color: '#fbbf24' }}>{product.proposedStatus}</span></div>
            </div>
          </div>

          {/* Release & Checksum */}
          <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <h2 style={{ color: '#38bdf8', fontSize: '1.2rem', marginTop: 0 }}>RELEASE ARTIFACT & INTEGRITY</h2>
            <div style={{ fontSize: '0.8rem', wordBreak: 'break-all', backgroundColor: '#1e293b', padding: '1rem', borderRadius: '4px' }}>
              <div style={{ marginBottom: '0.5rem' }}><strong>ARTIFACT:</strong> {product.downloadArtifact}</div>
              <div><strong>SHA-256:</strong> {product.sha256Checksum}</div>
            </div>
          </div>
        </div>

        {/* Commercial Sidebar */}
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b', height: 'fit-content' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.2rem', marginTop: 0 }}>SOFTWARE LEASING</h2>

          <div style={{ margin: '1.5rem 0' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ANNUAL LEASE PRICE</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#38bdf8' }}>
              ${product.priceUSD.toLocaleString()} USD
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ENTERPRISE OEM: ${product.enterprisePriceUSD.toLocaleString()} / year</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {product.demoRoute && (
              <a href={product.demoRoute} style={{ backgroundColor: '#0284c7', color: '#fff', textDecoration: 'none', padding: '0.6rem', textAlign: 'center', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                EXECUTE LIVE DEMONSTRATION
              </a>
            )}
            <button disabled style={{ backgroundColor: '#334155', color: '#94a3b8', border: 'none', padding: '0.6rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'not-allowed' }}>
              HUMAN REVIEW REQUIRED (GATE H3)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
