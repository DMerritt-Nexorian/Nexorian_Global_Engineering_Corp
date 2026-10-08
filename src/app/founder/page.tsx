
import Link from "next/link";
import { cookies } from "next/headers";
import { REGISTERED_PRODUCTS, PORTAL_SURFACE } from "@/lib/products-registry";

export default function FounderPage() {
  const configured = Boolean(process.env.FOUNDER_ACCESS_TOKEN);
  const presented = cookies().get("nex_founder")?.value;
  const allowed = configured && presented === process.env.FOUNDER_ACCESS_TOKEN;

  if (!allowed) {
    return (
      <main>
        <p className="kicker">Founder</p>
        <h1>Access is not open</h1>
        <p className="lede">
          {configured
            ? "This console requires the founder token configured on the server. The public site does not grant it."
            : "FOUNDER_ACCESS_TOKEN is not set on this server. The console stays closed rather than pretending a role."}
        </p>
        <form action="/api/access" method="post">
          <p><input name="token" type="password" autoComplete="current-password" placeholder="Server token" /></p>
          <button className="btn" type="submit">Submit token</button>
        </form>
      </main>
    );
  }

  return (
    <main>
      <p className="kicker">Founder</p>
      <h1>Registry control</h1>
      <p className="lede">{PORTAL_SURFACE.role} No valuation is calculated here. No payment control is connected.</p>
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Repository</th><th>Implementation</th><th>Offer</th></tr>
        </thead>
        <tbody>
          {REGISTERED_PRODUCTS.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.repo}</td>
              <td>{p.implementationStatus}</td>
              <td>Not for sale or lease</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><Link className="btn" href="/jarvis">Jarvis</Link></p>
    </main>
  );
}
