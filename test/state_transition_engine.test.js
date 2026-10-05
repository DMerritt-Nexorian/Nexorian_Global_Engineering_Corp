const test = require("node:test");
const assert = require("node:assert/strict");

const {
  StateTransitionEngine,
} = require("../src/lib/state-transition-engine");

function node(
  id,
  label
) {
  return {
    id,
    type: "entity",
    label,
    properties: {},
  };
}

function edge(
  id,
  from,
  to
) {
  return {
    id,
    from,
    to,
    relation: "related_to",
    weight: 1,
  };
}

function claim(
  id,
  subject,
  object,
  truth = "OBSERVED"
) {
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

function world(
  overrides = {}
) {
  return {
    nodes: [],
    edges: [],
    claims: [],
    asOf: "2026-10-04T00:00:00.000Z",
    fingerprint: "world-test-fingerprint",
    ...overrides,
  };
}

test("1. creates deterministic transition identifiers", async () => {
  const engine = new StateTransitionEngine();

  const current = world();

  const input = {
    operation: "ADD_NODE",
    targetId: "node-a",
    value: node("node-a", "Alpha"),
    preconditions: [],
    rationale: "Create the Alpha entity",
  };

  const first = await engine.createTransition(
    current,
    input,
  );

  const second = await engine.createTransition(
    current,
    input,
  );

  assert.equal(first.id, second.id);
  assert.equal(first.expectedWorldFingerprint, current.fingerprint);
});

test("2. accepts a valid node addition", async () => {
  const engine = new StateTransitionEngine();

  const current = world();

  const transition = await engine.createTransition(
    current,
    {
      operation: "ADD_NODE",
      targetId: "node-a",
      value: node("node-a", "Alpha"),
      preconditions: [],
    },
  );

  const result = await engine.evaluate(
    current,
    transition,
  );

  assert.equal(result.accepted, true);
  assert.equal(result.failures.length, 0);
  assert.ok(result.projectedState);
  assert.equal(
    result.projectedState?.nodes.length,
    1,
  );
  assert.equal(
    result.projectedState?.nodes[0].id,
    "node-a",
  );
  assert.ok(result.afterFingerprint);
});

test("3. rejects a stale transition", async () => {
  const engine = new StateTransitionEngine();

  const original = world();

  const transition = await engine.createTransition(
    original,
    {
      operation: "ADD_NODE",
      targetId: "node-a",
      value: node("node-a", "Alpha"),
      preconditions: [],
    },
  );

  const changedWorld = world({
    nodes: [
      node("existing", "Existing"),
    ],
    fingerprint: "different-world-fingerprint",
  });

  const result = await engine.evaluate(
    changedWorld,
    transition,
  );

  assert.equal(result.accepted, false);

  assert.ok(
    result.failures.some(
      (failure) =>
        failure.code === "WORLD_STATE_MISMATCH",
    ),
  );
});

test("4. rejects a failed claim precondition", async () => {
  const engine = new StateTransitionEngine();

  const current = world({
    claims: [
      claim(
        "claim-a",
        "system",
        "inactive",
        "OBSERVED",
      ),
    ],
  });

  const transition = await engine.createTransition(
    current,
    {
      operation: "ADD_NODE",
      targetId: "node-a",
      value: node("node-a", "Alpha"),
      preconditions: [
        {
          id: "require-active",
          claimId: "claim-a",
          requiredTruth: ["VERIFIED"],
          reason: "The system must be verified before modification.",
        },
      ],
    },
  );

  const result = await engine.evaluate(
    current,
    transition,
  );

  assert.equal(result.accepted, false);

  assert.ok(
    result.failures.some(
      (failure) =>
        failure.code === "PRECONDITION_FAILED",
    ),
  );
});

test("5. rejects duplicate node creation", async () => {
  const engine = new StateTransitionEngine();

  const current = world({
    nodes: [
      node("node-a", "Existing"),
    ],
  });

  const transition = await engine.createTransition(
    current,
    {
      operation: "ADD_NODE",
      targetId: "node-a",
      value: node("node-a", "Replacement"),
      preconditions: [],
    },
  );

  const result = await engine.evaluate(
    current,
    transition,
  );

  assert.equal(result.accepted, false);

  assert.ok(
    result.failures.some(
      (failure) =>
        failure.code === "TARGET_EXISTS",
    ),
  );
});

test("6. rejects an edge referencing a missing node", async () => {
  const engine = new StateTransitionEngine();

  const current = world({
    nodes: [
      node("node-a", "Alpha"),
    ],
  });

  const transition = await engine.createTransition(
    current,
    {
      operation: "ADD_EDGE",
      targetId: "edge-a",
      value: edge(
        "edge-a",
        "node-a",
        "missing-node",
      ),
      preconditions: [],
    },
  );

  const result = await engine.evaluate(
    current,
    transition,
  );

  assert.equal(result.accepted, false);

  assert.ok(
    result.failures.some(
      (failure) =>
        failure.code === "TARGET_MISSING",
    ),
  );
});

test("7. removes incident edges when a node is removed", async () => {
  const engine = new StateTransitionEngine();

  const current = world({
    nodes: [
      node("node-a", "Alpha"),
      node("node-b", "Beta"),
    ],
    edges: [
      edge(
        "edge-a",
        "node-a",
        "node-b",
      ),
    ],
  });

  const transition = await engine.createTransition(
    current,
    {
      operation: "REMOVE_NODE",
      targetId: "node-a",
      preconditions: [],
    },
  );

  const result = await engine.evaluate(
    current,
    transition,
  );

  assert.equal(result.accepted, true);
  assert.equal(
    result.projectedState?.nodes.some(
      (n) => n.id === "node-a",
    ),
    false,
  );
  assert.equal(
    result.projectedState?.edges.some(
      (e) => e.id === "edge-a",
    ),
    false,
  );
});

test("8. detects contradictory claims", async () => {
  const engine = new StateTransitionEngine();

  const current = world({
    claims: [
      claim(
        "claim-a",
        "system",
        "active",
        "OBSERVED",
      ),
    ],
  });

  const transition = await engine.createTransition(
    current,
    {
      operation: "ADD_CLAIM",
      targetId: "claim-b",
      value: claim(
        "claim-b",
        "system",
        "inactive",
        "OBSERVED",
      ),
      preconditions: [],
    },
  );

  const result = await engine.evaluate(
    current,
    transition,
  );

  assert.equal(result.accepted, false);

  assert.ok(
    result.conflicts.some(
      (conflict) =>
        conflict ===
        "claim-conflict:claim-a:claim-b",
    ),
  );
});

test("9. invalidates a claim only with CONTRADICTED truth state", async () => {
  const engine = new StateTransitionEngine();

  const current = world({
    claims: [
      claim(
        "claim-a",
        "system",
        "active",
        "OBSERVED",
      ),
    ],
  });

  const invalidTransition =
    await engine.createTransition(
      current,
      {
        operation: "INVALIDATE_CLAIM",
        targetId: "claim-a",
        value: claim(
          "claim-a",
          "system",
          "inactive",
          "OBSERVED",
        ),
        preconditions: [],
      },
    );

  const invalidResult =
    await engine.evaluate(
      current,
      invalidTransition,
    );

  assert.equal(
    invalidResult.accepted,
    false,
  );

  const validTransition =
    await engine.createTransition(
      current,
      {
        operation: "INVALIDATE_CLAIM",
        targetId: "claim-a",
        value: claim(
          "claim-a",
          "system",
          "inactive",
          "CONTRADICTED",
        ),
        preconditions: [],
      },
    );

  const validResult =
    await engine.evaluate(
      current,
      validTransition,
    );

  assert.equal(
    validResult.accepted,
    true,
  );
});

test("10. accepted transition produces a different projected fingerprint", async () => {
  const engine = new StateTransitionEngine();

  const current = world();

  const transition = await engine.createTransition(
    current,
    {
      operation: "ADD_NODE",
      targetId: "node-a",
      value: node("node-a", "Alpha"),
      preconditions: [],
    },
  );

  const result = await engine.evaluate(
    current,
    transition,
  );

  assert.equal(result.accepted, true);
  assert.ok(result.afterFingerprint);
  assert.notEqual(
    result.afterFingerprint,
    result.beforeFingerprint,
  );
});

test("11. audit rejects invalid timestamps", async () => {
  const engine = new StateTransitionEngine();

  const current = world();

  const transition =
    await engine.createTransition(
      current,
      {
        operation: "ADD_NODE",
        targetId: "node-a",
        value: node("node-a", "Alpha"),
        preconditions: [],
      },
    );

  const result = await engine.evaluate(
    current,
    transition,
  );

  assert.throws(
    () =>
      engine.audit(
        result,
        transition,
        "not-a-date",
      ),
    /valid ISO timestamp/,
  );
});

test("12. audit preserves the transition evidence chain", async () => {
  const engine = new StateTransitionEngine();

  const current = world();

  const transition =
    await engine.createTransition(
      current,
      {
        operation: "ADD_NODE",
        targetId: "node-a",
        value: node("node-a", "Alpha"),
        preconditions: [],
        rationale: "Evidence-backed state transition",
      },
    );

  const result = await engine.evaluate(
    current,
    transition,
  );

  const audit = engine.audit(
    result,
    transition,
    "2026-10-04T12:00:00.000Z",
  );

  assert.equal(
    audit.transitionId,
    transition.id,
  );

  assert.equal(
    audit.accepted,
    true,
  );

  assert.equal(
    audit.beforeFingerprint,
    result.beforeFingerprint,
  );

  assert.equal(
    audit.afterFingerprint,
    result.afterFingerprint,
  );

  assert.deepEqual(
    audit.changedIds,
    ["node-a"],
  );
});
