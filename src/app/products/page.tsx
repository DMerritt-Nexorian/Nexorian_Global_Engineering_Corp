import { REGISTERED_PRODUCTS } from '@/lib/products-registry';

export default function ProductsPage() {
  return (
    <div style={{ fontFamily: 'monospace, sans-serif', padding: '2rem', backgroundColor: '#090d16', color: '#f8fafc', minHeight: '100vh' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginBottom: '0.5rem' }}>PORTFOLIO CONTROL PLANE</div>
        <h1 style={{ fontSize: '2rem', color: '#f1f5f9', margin: 0 }}>NEXORIAN GLOBAL ENGINEERING CORP.</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0.5rem 0 0 0' }}>Authoritative Portfolio Software Catalog & IP Registry (10 Connected Products)</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {REGISTERED_PRODUCTS.map((product) => (
          <div key={product.id} style={{ border: '1px solid #1e293b', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#0284c7', color: '#fff', fontWeight: 'bold' }}>
                  {product.category}
                </span>
                <span style={{ fontSize: '0.7rem', color: product.buildStatus === 'SUCCESS' ? '#22c55e' : '#f59e0b' }}>
                  [{product.buildStatus}]
                </span>
              </div>
              <h2 style={{ fontSize: '1.2rem', margin: '0.5rem 0', color: '#f1f5f9' }}>{product.name}</h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', minHeight: '2.8rem', margin: '0.5rem 0 1rem 0', lineHeight: '1.4' }}>{product.description}</p>

              <div style={{ margin: '0.75rem 0', fontSize: '0.75rem', color: '#fbbf24', borderLeft: '3px solid #f59e0b', paddingLeft: '0.5rem' }}>
                Status: {product.proposedStatus}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#38bdf8' }}>
                    {product.priceUSD > 0 ? `$${product.priceUSD.toLocaleString()} USD/yr` : 'EVALUATION LICENSE'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>OEM: ${product.enterprisePriceUSD.toLocaleString()}</div>
                </div>
                <a
                  href={`/products/${product.id.toLowerCase()}`}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: '4px',
                    backgroundColor: '#1e293b',
                    color: '#38bdf8',
                    textDecoration: 'none',
                    border: '1px solid #334155',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                >
                  DOSSIER &rarr;
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
