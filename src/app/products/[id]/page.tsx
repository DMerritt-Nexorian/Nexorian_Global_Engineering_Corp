
import Link from "next/link";
import { notFound } from "next/navigation";
import { REGISTERED_PRODUCTS, getRegisteredProductById } from "@/lib/products-registry";

export function generateStaticParams() {
  return REGISTERED_PRODUCTS.filter((p) => p.publicVisible).map((p) => ({ id: p.id.toLowerCase() }));
}

export default function ProductDossier({ params }: { params: { id: string } }) {
  const product = getRegisteredProductById(params.id);
  if (!product || !product.publicVisible) notFound();
  return (
    <main>
      <p className="kicker">Dossier · {product.id}</p>
      <h1>{product.name}</h1>
      <p className="lede">{product.description}</p>
      <p className="note">Not for sale or lease. The portal itself is also not for sale or lease.</p>
      <table>
        <tbody>
          <tr><th>Repository</th><td>{product.repo}</td></tr>
          <tr><th>Implementation</th><td>{product.implementationStatus}</td></tr>
          <tr><th>Catalog status</th><td>{product.proposedStatus}</td></tr>
          <tr><th>License issued here</th><td>{product.licenseType}</td></tr>
          <tr><th>Limitations</th><td>{product.limitations}</td></tr>
          <tr><th>Evidence</th><td>{product.evidence}</td></tr>
          <tr><th>Demonstration</th><td>{product.demoNote || "None in this portal."}</td></tr>
        </tbody>
      </table>
      <p>
        <Link className="btn" href="/products">Registry</Link>
        {product.demoRoute ? <Link className="btn" href={product.demoRoute}>Open demonstration</Link> : null}
      </p>
    </main>
  );
}
