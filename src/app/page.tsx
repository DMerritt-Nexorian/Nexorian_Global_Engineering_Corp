
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <p className="kicker">Operating surface</p>
      <h1>Nexorian Global Engineering Corp</h1>
      <p className="lede">
        This application is the portal for the repository. It is not an asset offered for sale or lease.
        Product names below are registry records. A record is not a completed product, a certification, or a contract.
      </p>
      <p>
        <Link className="btn" href="/products">Open the registry</Link>
        {" "}
        <Link className="btn" href="/jarvis">Open Jarvis</Link>
      </p>
      <div className="grid">
        <section className="card">
          <p className="meta">Working in this deployment</p>
          <h2>Local demonstrations</h2>
          <p>An 8-coefficient number-theoretic transform, and an experimental lattice kernel. Both run in this application. Neither is a certified cryptographic module.</p>
        </section>
        <section className="card">
          <p className="meta">Not in this deployment</p>
          <h2>No lease desk</h2>
          <p>No payment provider is connected. Checkout refuses. Downloads, checksums, and dollar amounts previously shown here were not evidence.</p>
        </section>
      </div>
    </main>
  );
}
