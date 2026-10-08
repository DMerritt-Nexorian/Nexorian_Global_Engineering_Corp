
"use client";

import { useMemo, useState } from "react";
import { HdGtlmModel, LIMITS, nominalSample, type GtlmOutput } from "@/lib/hd-gtlm-model";

export default function GtlmDemoPage() {
  const model = useMemo(() => new HdGtlmModel(), []);
  const [log, setLog] = useState<GtlmOutput[]>([]);
  const [x, setX] = useState(10);

  function record(output: GtlmOutput) {
    setLog((prev) => [output, ...prev].slice(0, 8));
  }

  return (
    <main>
      <p className="kicker">HD-GTLM model</p>
      <h1>Bounds, then the relay.</h1>
      <p className="lede">X limit is {LIMITS.x}. This page runs the software model. It does not measure silicon delay or power.</p>
      <p>
        <label className="meta">X input </label>
        <input type="number" value={x} min={0} max={4095} onChange={(e) => setX(Number(e.target.value))} />
      </p>
      <button className="btn" type="button" onClick={() => record(model.step({ ...nominalSample(), reset: true }))}>Reset</button>
      <button className="btn" type="button" onClick={() => record(model.step(nominalSample()))}>Release strobe</button>
      <button className="btn" type="button" onClick={() => record(model.step({ ...nominalSample(), x }))}>Step with X</button>
      {log.map((row, index) => (
        <article className="card" key={index} style={{ marginTop: "0.7rem" }}>
          <p className="meta">{row.state} · relay {row.relayEnable ? "enabled" : "open"}</p>
          <p>{row.fault || "Within bounds."}</p>
        </article>
      ))}
    </main>
  );
}
