
const PUBLIC_SOURCES = [
  {
    name: "Core_Neural v1.0.1",
    href: "https://doi.org/10.5281/zenodo.21605055",
    note: "Zenodo snapshot, 27.2 kB, CC0. GitHub tag v1.0.1. Not a neural interface."
  },
  {
    name: "Core_Neural_Advanced V2.0.0",
    href: "https://doi.org/10.5281/zenodo.21793550",
    note: "Zenodo snapshot, 19.3 kB, CC0. The record text claims Kani and material limits. This page does not repeat those as verified."
  },
  {
    name: "bcind_nexus_core",
    href: "https://github.com/DMerritt-Nexorian/bcind_nexus_core/archive/refs/heads/main.zip",
    note: "Public GitHub archive. No Zenodo DOI was supplied."
  },
  {
    name: "Portal source",
    href: "https://github.com/DMerritt-Nexorian/Nexorian_Global_Engineering_Corp/archive/refs/heads/main.zip",
    note: "This website. Not for sale or lease."
  }
];

export default function DownloadsPage() {
  return (
    <main>
      <p className="kicker">Source</p>
      <h1>Download the deposited snapshot.</h1>
      <p className="lede">A DOI identifies the archive. It does not certify the software. Private repositories stay off this page.</p>
      <div className="grid">
        {PUBLIC_SOURCES.map((item) => (
          <article className="card" key={item.name}>
            <h2>{item.name}</h2>
            <p>{item.note}</p>
            <a className="btn" href={item.href}>Open</a>
          </article>
        ))}
      </div>
    </main>
  );
}
