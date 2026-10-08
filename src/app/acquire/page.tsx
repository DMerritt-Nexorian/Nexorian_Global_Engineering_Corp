
const OFFERS = [
  ["Software lease", "A named private repository can be licensed without publishing it. Delivery is a private archive after a confirmed payment. No processor is configured, so no lease is open."],
  ["IP assignment", "An outright transfer is a contract, not a zip file. It is not offered from this page."],
  ["Public teaser", "The public statement is the name and the boundary. The private math, layout, and novel parts stay in the private repository."]
];

export default function AcquirePage() {
  return (
    <main>
      <p className="kicker">Access</p>
      <h1>Payment before a private archive. No public copy.</h1>
      <p className="lede">The demonstrations on this site run portal code. They are not the private repositories. A download of private work waits for a confirmed payment record and a release file that is not in the public site.</p>
      <div className="grid">
        {OFFERS.map(([title, body]) => (
          <article className="card" key={title}><h2>{title}</h2><p>{body}</p></article>
        ))}
      </div>
      <p className="note">Checkout is closed. This deployment has no payment processor, no price, and no private release artifact.</p>
    </main>
  );
}
