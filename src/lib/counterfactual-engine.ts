import {
  StateTransition,
  StateTransitionEngine,
  StateTransitionResult,
} from "./state-transition-engine";
import { WorldState } from "./types";

/**
 * Deterministic counterfactual evaluation.
 *
 * This engine does not execute a transition against the live system.
 * It evaluates the proposed transition against a supplied WorldState
 * and records the projected consequence.
 *
 * The purpose is to make consequence analysis an explicit computation
 * between reasoning and authorization:
 *
 *   candidate transition
 *          ↓
 *   counterfactual evaluation
 *          ↓
 *   projected state / rejection
 *          ↓
 *   Sentinel authorization
 *          ↓
 *   real execution
 *
 * No probabilistic claims are made here. This is a deterministic
 * state-transition analysis layer.
 */
export type CounterfactualStatus =
  | "PROJECTED"
  | "REJECTED"
  | "UNCHANGED";

export interface CounterfactualChange {
  readonly addedNodes: readonly string[];
  readonly removedNodes: readonly string[];
  readonly changedNodes: readonly string[];
  readonly addedEdges: readonly string[];
  readonly removedEdges: readonly string[];
  readonly addedClaims: readonly string[];
  readonly removedClaims: readonly string[];
  readonly changedClaims: readonly string[];
}

export interface CounterfactualEvaluation {
  readonly id: string;
  readonly status: CounterfactualStatus;
  readonly transitionId: string;
  readonly operation: StateTransition["operation"];
  readonly targetId: string;
  readonly beforeFingerprint: string;
  readonly projectedFingerprint?: string;
  readonly accepted: boolean;
  readonly failures: readonly StateTransitionResult["failures"][number][];
  readonly conflicts: readonly string[];
  readonly changes: CounterfactualChange;
  readonly invariantViolations: readonly string[];
  /**
   * True only when the projected state is different from the
   * supplied state and the transition was accepted.
   */
  readonly changesWorld: boolean;
  /**
   * True when the projected state can be safely handed to a
   * subsequent authorization/execution stage.
   */
  readonly executable: boolean;
  readonly rationale: string;
}

function sorted(values: Iterable<string>): string[] {
  return [...values].sort();
}

function ids<T extends { id: string }>(values: readonly T[]): Set<string> {
  return new Set(values.map((value) => value.id));
}

function changedIds<T extends { id: string }>(
  before: readonly T[],
  after: readonly T[],
): string[] {
  const beforeById = new Map(before.map((value) => [value.id, value]));
  const afterById = new Map(after.map((value) => [value.id, value]));
  const changed: string[] = [];
  for (const [id, afterValue] of afterById) {
    const beforeValue = beforeById.get(id);
    if (!beforeValue) {
      continue;
    }
    if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
      changed.push(id);
    }
  }
  return sorted(changed);
}

function removedIds<T extends { id: string }>(
  before: readonly T[],
  after: readonly T[],
): string[] {
  const afterIds = ids(after);
  return sorted(
    before
      .filter((value) => !afterIds.has(value.id))
      .map((value) => value.id),
  );
}

function addedIds<T extends { id: string }>(
  before: readonly T[],
  after: readonly T[],
): string[] {
  const beforeIds = ids(before);
  return sorted(
    after
      .filter((value) => !beforeIds.has(value.id))
      .map((value) => value.id),
  );
}

function buildChanges(
  before: WorldState,
  after: WorldState,
): CounterfactualChange {
  return {
    addedNodes: addedIds(before.nodes, after.nodes),
    removedNodes: removedIds(before.nodes, after.nodes),
    changedNodes: changedIds(before.nodes, after.nodes),
    addedEdges: addedIds(before.edges, after.edges),
    removedEdges: removedIds(before.edges, after.edges),
    addedClaims: addedIds(before.claims, after.claims),
    removedClaims: removedIds(before.claims, after.claims),
    changedClaims: changedIds(before.claims, after.claims),
  };
}

function countChanges(changes: CounterfactualChange): number {
  return (
    changes.addedNodes.length +
    changes.removedNodes.length +
    changes.changedNodes.length +
    changes.addedEdges.length +
    changes.removedEdges.length +
    changes.addedClaims.length +
    changes.removedClaims.length +
    changes.changedClaims.length
  );
}

function validateProjectedState(state: WorldState): string[] {
  const violations: string[] = [];
  const nodeIds = ids(state.nodes);
  const duplicateNodeIds = state.nodes
    .map((node) => node.id)
    .filter(
      (id, index, all) =>
        all.indexOf(id) !== index,
    );
  for (const id of sorted(new Set(duplicateNodeIds))) {
    violations.push(`duplicate-node:${id}`);
  }
  const edgeIds = state.edges.map((edge) => edge.id);
  for (const id of sorted(
    new Set(
      edgeIds.filter(
        (id, index, all) =>
          all.indexOf(id) !== index,
      ),
    ),
  )) {
    violations.push(`duplicate-edge:${id}`);
  }
  const claimIds = state.claims.map((claim) => claim.id);
  for (const id of sorted(
    new Set(
      claimIds.filter(
        (id, index, all) =>
          all.indexOf(id) !== index,
      ),
    ),
  )) {
    violations.push(`duplicate-claim:${id}`);
  }
  for (const edge of state.edges) {
    if (!nodeIds.has(edge.from)) {
      violations.push(`dangling-edge-source:${edge.id}:${edge.from}`);
    }
    if (!nodeIds.has(edge.to)) {
      violations.push(`dangling-edge-target:${edge.id}:${edge.to}`);
    }
  }
  for (const claim of state.claims) {
    if (
      typeof claim.confidence === "number" &&
      (!Number.isFinite(claim.confidence) ||
        claim.confidence < 0 ||
        claim.confidence > 1)
    ) {
      violations.push(`invalid-claim-confidence:${claim.id}`);
    }
  }
  return sorted(violations);
}

export class CounterfactualEngine {
  private readonly transitions: StateTransitionEngine;
  constructor(
    transitions: StateTransitionEngine = new StateTransitionEngine(),
  ) {
    this.transitions = transitions;
  }

  /**
   * Evaluate a candidate transition without mutating the supplied
   * WorldState.
   */
  async evaluate(
    world: WorldState,
    transition: StateTransition,
  ): Promise<CounterfactualEvaluation> {
    const result = await this.transitions.evaluate(
      world,
      transition,
    );
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
        conflicts: result.conflicts,
        changes: {
          addedNodes: [],
          removedNodes: [],
          changedNodes: [],
          addedEdges: [],
          removedEdges: [],
          addedClaims: [],
          removedClaims: [],
          changedClaims: [],
        },
        invariantViolations: [],
        changesWorld: false,
        executable: false,
        rationale:
          "The candidate transition was rejected before a valid projected state could be produced.",
      };
    }
    const projected = result.projectedState;
    const changes = buildChanges(
      world,
      projected,
    );
    const invariantViolations =
      validateProjectedState(projected);
    const changesWorld =
      countChanges(changes) > 0;
    const executable =
      result.accepted &&
      invariantViolations.length === 0;
    let status: CounterfactualStatus;
    if (!executable) {
      status = "REJECTED";
    } else if (!changesWorld) {
      status = "UNCHANGED";
    } else {
      status = "PROJECTED";
    }
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
      conflicts: result.conflicts,
      changes,
      invariantViolations,
      changesWorld,
      executable,
      rationale: executable
        ? changesWorld
          ? "The candidate transition produces a valid deterministic projected world state."
          : "The candidate transition is accepted but produces no observable world-state change."
        : "The projected consequence violates one or more state invariants and must not proceed to execution.",
    };
  }

  /**
   * Evaluate multiple mutually exclusive candidate transitions against
   * the same baseline world.
   *
   * Each candidate is evaluated independently against the identical
   * baseline. No candidate mutates another candidate's input.
   */
  async compare(
    world: WorldState,
    transitions: readonly StateTransition[],
  ): Promise<readonly CounterfactualEvaluation[]> {
    const evaluations: CounterfactualEvaluation[] = [];
    for (const transition of transitions) {
      evaluations.push(
        await this.evaluate(world, transition),
      );
    }
    return evaluations;
  }

  /**
   * Return the executable candidate with the smallest deterministic
   * state delta.
   *
   * This is deliberately not presented as an intelligence score or
   * prediction of future utility. It is only a structural comparison
   * of the state changes that the engine can actually observe.
   */
  async leastChange(
    world: WorldState,
    transitions: readonly StateTransition[],
  ): Promise<CounterfactualEvaluation | undefined> {
    const evaluations = await this.compare(
      world,
      transitions,
    );
    return evaluations
      .filter((evaluation) => evaluation.executable)
      .sort((a, b) => {
        const changeDelta =
          countChanges(a.changes) -
          countChanges(b.changes);
        if (changeDelta !== 0) {
          return changeDelta;
        }
        return a.id.localeCompare(b.id);
      })[0];
  }
}
