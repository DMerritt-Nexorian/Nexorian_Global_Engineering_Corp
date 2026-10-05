import test from "node:test";
import assert from "node:assert/strict";
import { CounterfactualEngine } from "../src/lib/jarvis/core/counterfactual-engine";
import { StateTransitionEngine } from "../src/lib/state-transition-engine";
import { Claim, Node, WorldState } from "../src/lib/jarvis/core/types";

const node = (id: string, label = id): Node => ({
  id,
  kind: "entity",
  label,
  attributes: {},
});

const claim = (
  id: string,
  subject: string,
  object: string,
  truth: Claim["truth"] = "OBSERVED",
): Claim => ({
  id,
  subject,
  predicate: "status",
  object,
  truth,
  confidence: 1,
  evidenceIds: [],
  createdAt: "2026-10-05T00:00:00.000Z",
});

function world(overrides: Partial<WorldState> = {}): WorldState {
  const base = {
    nodes: [] as Node[],
    edges: [],
    claims: [],
    asOf: "2026-10-05T00:00:00.000Z",
  };
  return {
    ...base,
    ...overrides,
    fingerprint: "placeholder-to-be-replaced-by-engine-test",
  };
}

test("counterfactual reports an accepted node addition without mutating baseline", async () => {
  const transitions = new StateTransitionEngine();
  const engine = new CounterfactualEngine(transitions);
  const baseline = world();
  const before = structuredClone(baseline);

  // The transition engine's integrity check must validate this fingerprint.
  const { sha256 } = await import("../src/lib/jarvis/core/canonical");
  baseline.fingerprint = sha256({
    nodes: baseline.nodes,
    edges: baseline.edges,
    claims: baseline.claims,
    asOf: baseline.asOf,
  });

  const transition = await transitions.createTransition(baseline, {
    operation: "ADD_NODE",
    targetId: "node-a",
    value: node("node-a", "Alpha"),
    preconditions: [],
  });

  const result = await engine.evaluate(baseline, transition);

  assert.equal(result.status, "PROJECTED");
  assert.equal(result.accepted, true);
  assert.equal(result.executable, true);
  assert.deepEqual(result.changes.addedNodes, ["node-a"]);
  assert.ok(result.projectedFingerprint);
  assert.deepEqual(baseline.nodes, before.nodes);
  assert.equal(baseline.nodes.length, 0);
});

test("counterfactual rejects a stale transition", async () => {
  const transitions = new StateTransitionEngine();
  const engine = new CounterfactualEngine(transitions);
  const baseline = world();
  const { sha256 } = await import("../src/lib/jarvis/core/canonical");
  baseline.fingerprint = sha256({
    nodes: baseline.nodes,
    edges: baseline.edges,
    claims: baseline.claims,
    asOf: baseline.asOf,
  });

  const transition = await transitions.createTransition(baseline, {
    operation: "ADD_NODE",
    targetId: "node-a",
    value: node("node-a"),
    preconditions: [],
  });

  const changed = world({ nodes: [node("other")] });
  changed.fingerprint = sha256({
    nodes: changed.nodes,
    edges: changed.edges,
    claims: changed.claims,
    asOf: changed.asOf,
  });

  const result = await engine.evaluate(changed, transition);
  assert.equal(result.status, "REJECTED");
  assert.equal(result.executable, false);
  assert.ok(result.failures.some((failure) => failure.code === "WORLD_STATE_MISMATCH"));
});

test("alternatives are evaluated independently against the same baseline", async () => {
  const transitions = new StateTransitionEngine();
  const engine = new CounterfactualEngine(transitions);
  const baseline = world();
  const { sha256 } = await import("../src/lib/jarvis/core/canonical");
  baseline.fingerprint = sha256({
    nodes: baseline.nodes,
    edges: baseline.edges,
    claims: baseline.claims,
    asOf: baseline.asOf,
  });

  const first = await transitions.createTransition(baseline, {
    operation: "ADD_NODE",
    targetId: "a",
    value: node("a"),
    preconditions: [],
  });
  const second = await transitions.createTransition(baseline, {
    operation: "ADD_NODE",
    targetId: "b",
    value: node("b"),
    preconditions: [],
  });

  const results = await engine.compare(baseline, [first, second]);
  assert.equal(results.length, 2);
  assert.deepEqual(results[0].changes.addedNodes, ["a"]);
  assert.deepEqual(results[1].changes.addedNodes, ["b"]);
  assert.equal(baseline.nodes.length, 0);
});

test("leastChange only selects executable candidates", async () => {
  const transitions = new StateTransitionEngine();
  const engine = new CounterfactualEngine(transitions);
  const baseline = world();
  const { sha256 } = await import("../src/lib/jarvis/core/canonical");
  baseline.fingerprint = sha256({
    nodes: baseline.nodes,
    edges: baseline.edges,
    claims: baseline.claims,
    asOf: baseline.asOf,
  });

  const valid = await transitions.createTransition(baseline, {
    operation: "ADD_NODE",
    targetId: "valid",
    value: node("valid"),
    preconditions: [],
  });
  const invalid = await transitions.createTransition(baseline, {
    operation: "ADD_CLAIM",
    targetId: "bad-claim",
    value: claim("bad-claim", "system", "bad"),
    preconditions: [],
  });

  const selected = await engine.leastChange(baseline, [invalid, valid]);
  assert.ok(selected);
  assert.equal(selected.executable, true);
  assert.equal(selected.targetId, "valid");
});

test("invalid confidence is detected in a projected state if present", async () => {
  const engine = new CounterfactualEngine();
  const baseline = world({
    claims: [claim("existing", "system", "ready")],
  });
  const { sha256 } = await import("../src/lib/jarvis/core/canonical");
  baseline.fingerprint = sha256({
    nodes: baseline.nodes,
    edges: baseline.edges,
    claims: baseline.claims,
    asOf: baseline.asOf,
  });

  // This test deliberately checks the invariant checker through a candidate
  // transition only if the transition engine permits the input. If the
  // transition engine rejects malformed confidence earlier, rejection is valid.
  const transitions = new StateTransitionEngine();
  const malformed = claim("bad", "system", "ready");
  malformed.confidence = 2;
  const transition = await transitions.createTransition(baseline, {
    operation: "ADD_CLAIM",
    targetId: "bad",
    value: malformed,
    preconditions: [],
  });
  const result = await engine.evaluate(baseline, transition);

  if (result.accepted) {
    assert.ok(result.invariantViolations.includes("invalid-claim-confidence:bad"));
    assert.equal(result.executable, false);
  } else {
    assert.equal(result.executable, false);
  }
});
