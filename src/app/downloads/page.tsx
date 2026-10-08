
const PUBLIC_SOURCES = [
  { name: "Core_Neural", href: "https://github.com/DMerritt-Nexorian/Core_Neural/archive/refs/heads/main.zip", note: "Public source archive. Not a medical device." },
  { name: "Core_Neural_Advanced", href: "https://github.com/DMerritt-Nexorian/Core_Neural_Advanced/archive/refs/heads/main.zip", note: "Public source archive." },
  { name: "bcind_nexus_core", href: "https://github.com/DMerritt-Nexorian/bcind_nexus_core/archive/refs/heads/main.zip", note: "Public source archive. Not a neural decoder product." },
  { name: "Portal source", href: "https://github.com/DMerritt-Nexorian/Nexorian_Global_Engineering_Corp/archive/refs/heads/main.zip", note: "This website. Not for sale or lease." }
];

const PRIVATE_REPOS = ["CORE_SEC_PQC", "Core_Sec_NTT", "Sentinel-1", "Jarvis", "HD-GTLM", "CORE_AGRI", "CORE_GLOBAL", "Integrated_Control_Core", "Vita-Crypto-Wealth", "Core_Gen", "Solid_State_BMS", "Aharonov", "Core_Quantum_Time", "Real-person-AI", "R-D-Team", "Roku_ai_client", "Refactor-IQ", "TechDebt-Scanner"];

export default function DownloadsPage() {
  return (
    <main>
      <p className="kicker">Source</p>
      <h1>Download the repository, not a claim.</h1>
      <p className="lede">A zip is the current default-branch source. It is not a certified module, a tape-out, or a license. Private repositories are not offered here.</p>
      <div className="grid">
        {PUBLIC_SOURCES.map((item) => (
          <article className="card" key={item.name}>
            <h2>{item.name}</h2>
            <p>{item.note}</p>
            <a className="btn" href={item.href}>Download zip</a>
          </article>
        ))}
      </div>
      <section className="card" style={{ marginTop: "1rem" }}>
        <h2>Not publicly downloadable</h2>
        <p>{PRIVATE_REPOS.join(", ")}</p>
        <p className="meta">These remain private. A public archive would publish them. Payment is not enabled.</p>
      </section>
    </main>
  );
}
