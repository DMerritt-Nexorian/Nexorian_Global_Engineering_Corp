
"use client";

import { useState } from "react";

type Reply = {
  answer?: string;
  truthState?: string;
  evidenceDetails?: string;
  governanceStatus?: string;
  error?: string;
};

export default function JarvisPage() {
  const [query, setQuery] = useState("What can you do, and which records are not for lease?");
  const [reply, setReply] = useState<Reply | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      const res = await fetch("/api/jarvis", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query, context: "PUBLIC" })
      });
      setReply(await res.json());
    } catch (err: any) {
      setReply({ error: err.message || "Request failed" });
    } finally {
      setPending(false);
    }
  }

  return (
    <main>
      <p className="kicker">Jarvis</p>
      <h1>Bound to this repository</h1>
      <p className="lede">
        Ask for a repository inspection, the NTT, the experimental lattice kernel, or a registry record.
        If no tool matches, the answer is unknown. This is not a general model and it does not lease software.
      </p>
      <form onSubmit={submit}>
        <textarea value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn" type="submit" disabled={pending}>{pending ? "Running" : "Run"}</button>
      </form>
      {reply ? (
        <section className="card" style={{ marginTop: "1rem" }}>
          <p className="meta">{reply.truthState || "ERROR"} · {reply.governanceStatus || ""}</p>
          <p>{reply.answer || reply.error}</p>
          {reply.evidenceDetails ? <p className="meta">{reply.evidenceDetails}</p> : null}
        </section>
      ) : null}
    </main>
  );
}
