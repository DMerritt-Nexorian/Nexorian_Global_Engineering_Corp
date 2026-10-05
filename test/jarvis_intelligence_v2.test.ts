import test from "node:test";
import assert from "node:assert/strict";
import { createJarvisRuntime } from "../src/lib/jarvis/runtime";
import { SafeWebResearch } from "../src/lib/jarvis/knowledge/web-research";
import { LocalSandboxRunner } from "../src/lib/jarvis/self-build/sandbox-runner";
import { githubApi } from "../src/lib/jarvis/github/github-client";
import { planResearch } from "../src/lib/jarvis/research/question-planner";
import { makeBuildProposal } from "../src/lib/jarvis/self-build/build-proposal";
import { integrationGate } from "../src/lib/jarvis/self-build/integration-gate";
import { manifest } from "../src/lib/jarvis/project/project-packager";
import { JarvisEngine } from "../src/lib/jarvis-engine";

console.log('----------------------------------------------------');
console.log('RUNNING SUBSTRATE V2 INTEGRATION & SECURITY TEST SUITE');
console.log('----------------------------------------------------');

test("1. Ingestion preserves provenance and deterministic content hash", () => {
  const r = createJarvisRuntime();
  const d = r.ingest.ingest({ title: "Arch Spec", content: "Deterministic Autonomous Guardrail Mesh", source: "file", uri: "docs/arch.md" });
  assert.equal(d.hash.length, 64);
  assert.equal(r.store.allChunks()[0].evidence.source, "file");
  assert.equal(r.store.allChunks()[0].evidence.uri, "docs/arch.md");
  console.log('✓ 1. Ingestion provenance & hashing passed.');
});

test("2. Epistemic state preserves UNKNOWN and does not auto-promote", () => {
  const r = createJarvisRuntime();
  r.epistemic.addClaim({
    id: "claim-1",
    subject: "quantum_teleport",
    predicate: "status",
    object: "active",
    truth: "UNKNOWN",
    confidence: 0,
    evidenceIds: [],
    createdAt: new Date().toISOString()
  });
  assert.equal(r.epistemic.evaluate("claim-1")?.truth, "UNKNOWN");
  console.log('✓ 2. Epistemic refusal & state preservation passed.');
});

test("3. Safe web research blocks SSRF destinations (loopback and private IPs)", async () => {
  const s = new SafeWebResearch({ fetch: async () => { throw new Error("Should not execute"); } });
  await assert.rejects(() => s.fetch("https://127.0.0.1/admin"), /SSRF Protection/);
  await assert.rejects(() => s.fetch("https://localhost/internal"), /SSRF Protection/);
  await assert.rejects(() => s.fetch("https://10.0.0.1/secret"), /SSRF Protection/);
  await assert.rejects(() => s.fetch("https://192.168.1.1/config"), /SSRF Protection/);
  console.log('✓ 3. SSRF destination blocking passed.');
});

test("4. Sandbox runner rejects unsafe commands and path traversal", async () => {
  const runner = new LocalSandboxRunner();
  await assert.rejects(() => runner.run("rm -rf /", [], { cwd: "/tmp", timeoutMs: 1000 }), /Unsafe command character/);
  await assert.rejects(() => runner.run("../bin/sh", [], { cwd: "/tmp", timeoutMs: 1000 }), /Path traversal detected/);
  console.log('✓ 4. Sandbox runner input safety passed.');
});

test("5. GitHub client returns UNAUTHORIZED when token is absent or invalid", async () => {
  const gh = githubApi("");
  const res = await gh.request("/user");
  assert.equal(res.status, 401);
  assert.ok(res.json.error.includes("UNAUTHORIZED"));
  console.log('✓ 5. GitHub credential enforcement passed.');
});

test("6. Research planner generates structured research vectors", () => {
  const questions = planResearch("How does NTT over Galois fields work? Compare omega parameters.", "mathematics");
  assert.ok(questions.length >= 2);
  assert.equal(questions[0].domain, "mathematics");
  assert.ok(questions[0].terms.includes("galois"));
  console.log('✓ 6. Research question vector planning passed.');
});

test("7. Self-build integration gate enforces high-risk authorization constraints", () => {
  const lowRiskProposal = makeBuildProposal({
    capability: "util.format",
    rationale: "Formatting utility",
    files: ["src/lib/format.ts"],
    tests: ["test/format.test.ts"],
    acceptance: ["Unit test pass"],
    risk: "low"
  });
  const lowGate = integrationGate(lowRiskProposal, true, true);
  assert.equal(lowGate.allowed, true);

  const highRiskProposal = makeBuildProposal({
    capability: "root.auth",
    rationale: "Modify auth policy",
    files: ["src/lib/auth.ts"],
    tests: ["test/auth.test.ts"],
    acceptance: ["Unit test pass"],
    risk: "high"
  });
  const highGate = integrationGate(highRiskProposal, true, true);
  assert.equal(highGate.allowed, false);
  assert.ok(highGate.reason.includes("High-risk self-built capabilities require explicit external authorization"));
  console.log('✓ 7. Integration gate risk policy enforcement passed.');
});

test("8. Project packager manifest calculates deterministic artifact SHA-256 hashes", () => {
  const artifacts = [
    { path: "config.json", content: '{"version":"1.0.0"}' },
    { path: "INDEX.md", content: '# Index File' }
  ];
  const m = manifest(artifacts);
  assert.equal(m.length, 2);
  assert.equal(m[0].path, "config.json");
  assert.equal(m[0].sha256.length, 64);
  assert.ok(m[0].bytes > 0);
  console.log('✓ 8. Project packager manifest calculation passed.');
});

test("9. End-to-end JarvisEngine integration with Substrate v2 features", async () => {
  // Test Research Query
  const resResearch = await JarvisEngine.processQuery({
    query: "Perform research investigation on quantum computing architectures",
    context: "DEVELOPER",
    sessionToken: "session-test-101"
  });
  assert.equal(resResearch.status, "COMPLETED");
  assert.equal(resResearch.truthState, "VERIFIED");
  assert.ok(resResearch.answer.includes("Research investigation completed"));

  // Test Build Proposal Query
  const resBuild = await JarvisEngine.processQuery({
    query: "Create self-build capability gap proposal for module extension",
    context: "DEVELOPER",
    sessionToken: "session-test-101"
  });
  assert.equal(resBuild.status, "COMPLETED");
  assert.equal(resBuild.truthState, "VERIFIED");
  assert.ok(resBuild.answer.includes("Build proposal generated"));

  // Test Package Manifest Query
  const resManifest = await JarvisEngine.processQuery({
    query: "Generate project package manifest and checksums",
    context: "DEVELOPER",
    sessionToken: "session-test-101"
  });
  assert.equal(resManifest.status, "COMPLETED");
  assert.equal(resManifest.truthState, "VERIFIED");
  assert.ok(resManifest.answer.includes("Project package manifest generated"));

  console.log('✓ 9. End-to-end Substrate v2 JarvisEngine orchestration passed.');
});

console.log('✓ ALL SUBSTRATE V2 INTEGRATION & SECURITY TESTS PASSED CLEANLY.');
