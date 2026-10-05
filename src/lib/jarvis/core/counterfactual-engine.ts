import {
  StateTransition,
  StateTransitionEngine,
  StateTransitionResult,
} from "../../state-transition-engine";
import { WorldState } from "./types";

export type CounterfactualStatus = "PROJECTED" | "REJECTED" | "UNCHANGED";

export interface CounterfactualChanges {
  addedNodes: string[];
  removedNodes: string[];
  changedNodes: string[];
  addedEdges: string[];
  removedEdges: string[];
  changedEdges: string[];
  addedClaims: string[];
  removedClaims: string[];
  changedClaims: string[];
}

export interface CounterfactualEvaluation {
  id: string;
  status: CounterfactualStatus;
  transitionId: string;
  operation: StateTransition["operation"];
  targetId: string;
  beforeFingerprint: string;
  projectedFingerprint?: string;
  accepted: boolean;
  failures: StateTransitionResult["failures"];
  conflicts: string[];
  changes: CounterfactualChanges;
  invariantViolations: string[];
  changesWorld: boolean;
  executable: boolean;
  rationale: string;
}

const emptyChanges = (): CounterfactualChanges => ({
  addedNodes: [],
  removedNodes: [],
  changedNodes: [],
  addedEdges: [],
  removedEdges: [],
  changedEdges: [],
  addedClaims: [],
  removedClaims: [],
  changedClaims: [],
});

function sorted<T>(values: T[]): T[] {
  return values.sort((a, b) => String(a).localeCompare(String(b)));
}

function compareRecords<T extends { id: string }>(
  before: readonly T[],
  after: readonly T[],
): { added: string[]; removed: string[]; changed: string[] } {
  const oldMap = new Map(before.map((item) => [item.id, item]));
  const newMap = new Map(after.map((item) => [item.id, item]));

  const added: string[] = [];
  const removed: string[] = [];
  const changed: string[] = [];

  for (const [id, item] of newMap) {
    const previous = oldMap.get(id);
    if (!previous) added.push(id);
    else if (JSON.stringify(previous) !== JSON.stringify(item)) changed.push(id);
  }
  for (const id of oldMap.keys()) {
    if (!newMap.has(id)) removed.push(id);
  }

  return {
    added: sorted(added),
    removed: sorted(removed),
    changed: sorted(changed),
  };
}

function structuralChanges(
  before: WorldState,
  after: WorldState,
): CounterfactualChanges {
  const nodes = compareRecords(before.nodes, after.nodes);
  const edges = compareRecords(before.edges, after.edges);
  const claims = compareRecords(before.claims, after.claims);

  return {
    addedNodes: nodes.added,
    removedNodes: nodes.removed,
    changedNodes: nodes.changed,
    addedEdges: edges.added,
    removedEdges: edges.removed,
    changedEdges: edges.changed,
    addedClaims: claims.added,
    removedClaims: claims.removed,
    changedClaims: claims.changed,
  };
}

function changeCount(changes: CounterfactualChanges): number {
  return Object.values(changes).reduce(
    (total, values) => total + values.length,
    0,
  );
}

function duplicateIds(ids: string[], kind: string): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(`${kind}:${id}`);
    seen.add(id);
  }
  return [...duplicates];
}

function inspectInvariants(world: WorldState): string[] {
  const violations: string[] = [];
  const nodeIds = new Set(world.nodes.map((node) => node.id));

  violations.push(
    ...duplicateIds(world.nodes.map((node) => node.id), "duplicate-node"),
    ...duplicateIds(world.edges.map((edge) => edge.id), "duplicate-edge"),
    ...duplicateIds(world.claims.map((claim) => claim.id), "duplicate-claim"),
  );

  for (const edge of world.edges) {
    if (!nodeIds.has(edge.from)) {
      violations.push(`dangling-edge-source:${edge.id}:${edge.from}`);
    }
    if (!nodeIds.has(edge.to)) {
      violations.push(`dangling-edge-target:${edge.id}:${edge.to}`);
    }
  }

  for (const claim of world.claims) {
    if (
      !Number.isFinite(claim.confidence) ||
      claim.confidence < 0 ||
      claim.confidence > 1
    ) {
      violations.push(`invalid-claim-confidence:${claim.id}`);
    }
  }

  return sorted(violations);
}

export class CounterfactualEngine {
  constructor(
    private readonly transitionEngine: StateTransitionEngine =
      new StateTransitionEngine(),
  ) {}

  /**
   * Evaluates a proposed transition against a baseline snapshot.
   * This method does not mutate the snapshot and does not execute anything.
   * Passing this evaluation never substitutes for Sentinel authorization.
   */
  async evaluate(
    baseline: WorldState,
    transition: StateTransition,
  ): Promise<CounterfactualEvaluation> {
    const result = await this.transitionEngine.evaluate(baseline, transition);

    if (!result.accepted || !result.projectedState) {
      return {
        id: `counterfactual:${transition.id}`,
        status: "REJECTED",
        transitionId: transition.id,
        operation: transition.operation,
        targetId: transition.targetId,
        beforeFingerprint: result.beforeFingerprint,
        accepted: false,
        failures: result.failures,
        conflicts: [...result.conflicts],
        changes: emptyChanges(),
        invariantViolations: [],
        changesWorld: false,
        executable: false,
        rationale: "Transition engine rejected the candidate; no projected state is eligible for further processing.",
      };
    }

    const projected = result.projectedState;
    const changes = structuralChanges(baseline, projected);
    const invariantViolations = inspectInvariants(projected);
    const changesWorld = changeCount(changes) > 0;
    const executable = invariantViolations.length === 0;

    const status: CounterfactualStatus = !executable
      ? "REJECTED"
      : changesWorld
        ? "PROJECTED"
        : "UNCHANGED";

    return {
      id: `counterfactual:${transition.id}`,
      status,
      transitionId: transition.id,
      operation: transition.operation,
      targetId: transition.targetId,
      beforeFingerprint: result.beforeFingerprint,
      projectedFingerprint: result.afterFingerprint,
      accepted: result.accepted,
      failures: result.failures,
      conflicts: [...result.conflicts],
      changes,
      invariantViolations,
      changesWorld,
      executable,
      rationale: !executable
        ? "The projected state violates one or more structural invariants."
        : changesWorld
          ? "The candidate produces a deterministic projected state. Sentinel authorization and execution verification remain separate requirements."
          : "The candidate is accepted but produces no structural state change.",
    };
  }

  /**
   * Evaluates every candidate independently against the same baseline.
   */
  async compare(
    baseline: WorldState,
    candidates: readonly StateTransition[],
  ): Promise<CounterfactualEvaluation[]> {
    const evaluations: CounterfactualEvaluation[] = [];
    for (const candidate of candidates) {
      evaluations.push(await this.evaluate(baseline, candidate));
    }
    return evaluations;
  }

  /**
   * Selects the executable candidate with the fewest structural changes.
   * This is not a prediction of utility, safety, or future success.
   */
  async leastChange(
    baseline: WorldState,
    candidates: readonly StateTransition[],
  ): Promise<CounterfactualEvaluation | undefined> {
    const evaluations = await this.compare(baseline, candidates);
    return evaluations
      .filter((evaluation) => evaluation.executable)
      .sort((left, right) => {
        const delta = changeCount(left.changes) - changeCount(right.changes);
        return delta || left.id.localeCompare(right.id);
      })[0];
  }
}
