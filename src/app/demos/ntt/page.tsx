
"use client";

import { useState } from "react";
import { OMEGA_ROOT, Q_MODULUS, executeNTTTransformation } from "@/lib/ntt-kernel";

const SAMPLE = [12, 45, 102, 3, 0, 89, 500, 120];

export default function NttDemoPage() {
  const [result, setResult] = useState<ReturnType<typeof executeNTTTransformation> | null>(null);

  return (
    <main>
      <p className="kicker">Eight-coefficient transform</p>
      <h1>Same polynomial back.</h1>
      <p className="lede">
        Field F_{Q_MODULUS}. Omega {OMEGA_ROOT} is a primitive 8th root: omega^8 = 1 and omega^4 = -1 in this field.
        The page calls the shared kernel, not a second copy. This is not the Rust core and not a Kyber parameter set.
      </p>
      <p className="meta">Sample coefficients: {SAMPLE.join(", ")}</p>
      <button className="btn" type="button" onClick={() => setResult(executeNTTTransformation(SAMPLE))}>Run recovery</button>
      {result ? (
        <section className="card" style={{ marginTop: "1rem" }}>
          <p className="meta">{result.verified ? "Recovered" : "Failed"}</p>
          <p>Transformed: {result.transformed.join(", ")}</p>
          <p>Recovered: {result.recovered.join(", ")}</p>
        </section>
      ) : null}
    </main>
  );
}
