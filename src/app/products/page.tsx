
import Link from "next/link";
import { publicProducts } from "@/lib/products-registry";

export default function ProductsPage() {
  const products = publicProducts();
  return (
    <main>
      <p className="kicker">Registry</p>
      <h1>Named work, not a shop</h1>
      <p className="lede">
        Nexorian Global Engineering Corp is the portal and is excluded from sale and lease.
        Nothing on this page has a price because this repository does not contain an approved offer.
      </p>
      <div className="grid">
        {products.map((product) => (
          <article className="card" key={product.id}>
            <p className="meta">{product.id} · {product.implementationStatus.replaceAll("_", " ")}</p>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p className="meta">Repository {product.repo}. Not for sale or lease.</p>
            <Link className="btn" href={`/products/${product.id.toLowerCase()}`}>Dossier</Link>
            {product.demoRoute ? <Link className="btn" href={product.demoRoute}>Demonstration</Link> : null}
          </article>
        ))}
      </div>
    </main>
  );
}
