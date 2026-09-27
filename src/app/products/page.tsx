import { PRODUCTS } from '@/lib/types';

export default function ProductsPage() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#38bdf8' }}>NEXORIAN GLOBAL ENGINEERING CORP.</h1>
        <p style={{ color: '#94a3b8' }}>Verified Deep-Tech Asset Portfolio & Software Catalog</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {PRODUCTS.map((product) => (
          <div key={product.id} style={{ border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#1e293b' }}>
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#0284c7', color: '#fff', fontWeight: 'bold' }}>
              {product.category}
            </span>
            <h2 style={{ fontSize: '1.25rem', marginTop: '0.75rem', color: '#f1f5f9' }}>{product.name}</h2>
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', height: '3rem', overflow: 'hidden' }}>{product.description}</p>

            <div style={{ margin: '1rem 0', fontSize: '0.8rem', color: '#fbbf24', borderLeft: '3px solid #f59e0b', paddingLeft: '0.5rem' }}>
              Status: {product.proposedStatus}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#38bdf8' }}>${product.priceUSD.toLocaleString()} USD</span>
              <button
                disabled={true}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: '#475569',
                  color: '#94a3b8',
                  border: 'none',
                  cursor: 'not-allowed',
                  fontWeight: 'bold'
                }}
              >
                HUMAN REVIEW REQUIRED
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
