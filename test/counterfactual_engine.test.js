const test = require("node:test");
const assert = require("node:assert/strict");

const {
  StateTransitionEngine,
} = require("../src/lib/state-transition-engine");

const {
  CounterfactualEngine,
} = require("../src/lib/counterfactual-engine");

function node(id, label) {
  return {
    id,
    type: "entity",
    label,
    properties: {},
  };
}

function claim(id, subject, object, truth = "OBSERVED") {
  return {
    id,
    subject,
    predicate: "status",
    object,
    truth,
    confidence: 1,
    evidenceIds: [],
    createdAt: "2026-10-04T00:00:00.000Z",
  };
}

function world(overrides = {}) {
  return {
    nodes: [],
    edges: [],
    claims: [],
    asOf: "2026-10-04T00:00:00.000Z",
    fingerprint: "world-test-fingerprint",
    ...overrides,
  };
}

test("1. counterfactual evaluate returns PROJECTED status for valid transition", async () => {
  const transitions = new StateTransitionEngine();
  const counterfactual = new CounterfactualEngine(transitions);

  const current = world();
  const transition = await transitions.createTransition(current, {
    operation: "ADD_NODE",
    targetId: "node-a",
    value: node("node-a", "Alpha"),
    preconditions: [],
  });

  const evaluation = await counterfactual.evaluate(current, transition);

  assert.equal(evaluation.status, "PROJECTED");
  assert.equal(evaluation.executable, true);
  assert.equal(evaluation.changesWorld, true);
  assert.deepEqual(evaluation.changes.addedNodes, ["node-a"]);
  assert.equal(evaluation.invariantViolations.length, 0);
});

test("2. counterfactual evaluate returns REJECTED status for invalid transition", async () => {
  const transitions = new StateTransitionEngine();
  const counterfactual = new CounterfactualEngine(transitions);

  const current = world({
    nodes: [node("node-a", "Existing")],
  });

  const transition = await transitions.createTransition(current, {
    operation: "ADD_NODE",
    targetId: "node-a",
    value: node("node-a", "Duplicate"),
    preconditions: [],
  });

  const evaluation = await counterfactual.evaluate(current, transition);

  assert.equal(evaluation.status, "REJECTED");
  assert.equal(evaluation.executable, false);
  assert.equal(evaluation.accepted, false);
});

test("3. counterfactual compare evaluates multiple transitions independently", async () => {
  const transitions = new StateTransitionEngine();
  const counterfactual = new CounterfactualEngine(transitions);

  const current = world();

  const trans1 = await transitions.createTransition(current, {
    operation: "ADD_NODE",
    targetId: "node-a",
    value: node("node-a", "Alpha"),
    preconditions: [],
  });

  const trans2 = await transitions.createTransition(current, {
    operation: "ADD_NODE",
    targetId: "node-b",
    value: node("node-b", "Beta"),
    preconditions: [],
  });

  const results = await counterfactual.compare(current, [trans1, trans2]);

  assert.equal(results.length, 2);
  assert.equal(results[0].status, "PROJECTED");
  assert.equal(results[1].status, "PROJECTED");
  assert.deepEqual(results[0].changes.addedNodes, ["node-a"]);
  assert.deepEqual(results[1].changes.addedNodes, ["node-b"]);
});

test("4. counterfactual leastChange selects candidate with smallest state delta", async () => {
  const transitions = new StateTransitionEngine();
  const counterfactual = new CounterfactualEngine(transitions);

  const current = world();

  const trans1 = await transitions.createTransition(current, {
    operation: "ADD_NODE",
    targetId: "node-a",
    value: node("node-a", "Alpha"),
    preconditions: [],
  });

  const trans2 = await transitions.createTransition(current, {
    operation: "ADD_CLAIM",
    targetId: "claim-a",
    value: claim("claim-a", "sys", "active"),
    preconditions: [],
  });

  const selected = await counterfactual.leastChange(current, [trans1, trans2]);

  assert.ok(selected);
  assert.equal(selected.executable, true);
});
