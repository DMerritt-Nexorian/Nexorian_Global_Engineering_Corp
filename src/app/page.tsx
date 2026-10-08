
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <p className="kicker">Operating surface</p>
      <h1>Proof, then rules, then a repeated result.</h1>
      <p className="lede">
        This portal is the public face of the repository. A language model may propose. It may not act.
        Sentinel-1 is the rule check. A demonstration is admitted only when the same inputs return the same result.
      </p>
      <div className="grid">
        <section className="card">
          <p className="meta">01</p>
          <h2>Proof before trust</h2>
          <p>A claim is shown with the check that produced it. File presence, a recovered polynomial, or a lockdown transition. Unsigned prose is not proof.</p>
        </section>
        <section className="card">
          <p className="meta">02</p>
          <h2>Rules before reasoning</h2>
          <p>Jarvis plans a step. Sentinel-1 allows or refuses it before execution. Founder files and destructive actions are refused to a public caller.</p>
        </section>
        <section className="card">
          <p className="meta">03</p>
          <h2>Determinism before autonomy</h2>
          <p>The N=8 transform and the eight-input interlock are deterministic. If a result cannot be repeated, it is not offered as an action.</p>
        </section>
      </div>
      <p>
        <Link className="btn" href="/demonstrations">Run a demonstration</Link>
        <Link className="btn" href="/jarvis">Ask Jarvis</Link>
        <Link className="btn" href="/products">Read the registry</Link>
      </p>
      <p className="note">Not on this site: a lease desk, a certified cryptographic module, a fabricated chip, or a valuation.</p>
    </main>
  );
}
