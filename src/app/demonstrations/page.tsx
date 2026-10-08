
import Link from "next/link";

const demos = [
  { href: "/demos/ntt", title: "Number-theoretic transform", body: "Forward and inverse transform on eight coefficients. Recovery is the proof." },
  { href: "/demos/pqc", title: "Experimental lattice kernel", body: "Local signature and encapsulation exercise. Not FIPS 203 or FIPS 204." },
  { href: "/demos/gtlm", title: "HD-GTLM interlock", body: "Software model of the eight bounds. Over-limit input locks the relay until reset." }
];

export default function DemonstrationsPage() {
  return (
    <main>
      <p className="kicker">Demonstrations</p>
      <h1>Three checks you can run.</h1>
      <p className="lede">Each page executes local code. None of them is a remote product, a payment, or a certification.</p>
      <div className="grid">
        {demos.map((demo) => (
          <article className="card" key={demo.href}>
            <h2>{demo.title}</h2>
            <p>{demo.body}</p>
            <Link className="btn" href={demo.href}>Open</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
