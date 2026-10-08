
const PRIVATE_WORK = [
  ["CORE_SEC_PQC", "Private cryptographic work. No public algorithm, parameters, or certificate."],
  ["Core_Sec_NTT", "Private arithmetic work. No public transform or proof package."],
  ["Sentinel-1", "Private control work. The portal gate is separate and does not publish this repository."],
  ["Jarvis", "Private assistant work. The website assistant does not include this repository."],
  ["HD-GTLM", "Private interlock work. The website model is a separate demonstration."],
  ["CORE_AGRI", "Private. No process or control data published."],
  ["CORE_GLOBAL", "Private. No protocol published."],
  ["Integrated_Control_Core", "Private. No control law published."],
  ["Vita-Crypto-Wealth", "Private. No valuation or cryptographic design published."],
  ["Core_Gen", "Private. No biological design published."],
  ["Solid_State_BMS", "Private. No battery control design published."],
  ["Aharonov", "Private. No simulation method published."],
  ["Core_Quantum_Time", "Private. No model published."],
  ["Real-person-AI", "Private. No detection method published."],
  ["R-D-Team", "Private. No generator published."],
  ["Roku_ai_client", "Private. No client published."],
  ["Refactor-IQ", "Private. No scanner published."],
  ["TechDebt-Scanner", "Private. No scanner published."]
];

export default function WorkPage() {
  return (
    <main>
      <p className="kicker">Private work</p>
      <h1>Named, not opened.</h1>
      <p className="lede">These repositories stay private. This page records that they exist. It does not include architecture, math, parameters, or internal structure.</p>
      <table>
        <thead><tr><th>Name</th><th>Public statement</th></tr></thead>
        <tbody>
          {PRIVATE_WORK.map(([name, statement]) => (
            <tr key={name}><td>{name}</td><td>{statement}</td></tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
