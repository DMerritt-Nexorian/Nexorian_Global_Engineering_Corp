import {
  Claim,
  Edge,
  Node,
  TruthState,
  WorldState,
} from "./types";

import { sha256 } from "./pqc-kernel";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type TransitionOperation =
  | "ADD_NODE"
  | "UPDATE_NODE"
  | "REMOVE_NODE"
  | "ADD_EDGE"
  | "REMOVE_EDGE"
  | "ADD_CLAIM"
  | "UPDATE_CLAIM"
  | "INVALIDATE_CLAIM";

export interface TransitionPrecondition {
  readonly id: string;
  readonly claimId?: string;
  readonly requiredTruth?: readonly TruthState[];
  readonly nodeId?: string;
  readonly edgeId?: string;
  readonly reason: string;
}

export interface StateTransition {
  readonly id: string;
  readonly operation: TransitionOperation;
  readonly targetId: string;
  readonly value?: Node | Edge | Claim;
  readonly preconditions: readonly TransitionPrecondition[];
  readonly expectedWorldFingerprint: string;
  readonly rationale?: string;
}

export interface TransitionFailure {
  readonly code:
    | "WORLD_STATE_MISMATCH"
    | "PRECONDITION_FAILED"
    | "TARGET_MISSING"
    | "TARGET_EXISTS"
    | "TYPE_MISMATCH"
    | "INVALID_OPERATION"
    | "CONFLICT";
  readonly message: string;
  readonly preconditionId?: string;
}

export interface StateTransitionResult {
  readonly accepted: boolean;
  readonly transitionId: string;
  readonly beforeFingerprint: string;
  readonly afterFingerprint?: string;
  readonly operation: TransitionOperation;
  readonly failures: readonly TransitionFailure[];
  readonly conflicts: readonly string[];
  readonly changedIds: readonly string[];
  readonly projectedState?: WorldState;
}

export interface TransitionAudit {
  readonly transitionId: string;
  readonly accepted: boolean;
  readonly operation: TransitionOperation;
  readonly targetId: string;
  readonly beforeFingerprint: string;
  readonly afterFingerprint?: string;
  readonly changedIds: readonly string[];
  readonly failures: readonly TransitionFailure[];
  readonly conflicts: readonly string[];
  readonly evaluatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Utility functions                                                          */
/* -------------------------------------------------------------------------- */

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

function findNode(state: WorldState, id: string): Node | undefined {
  return state.nodes.find((node) => node.id === id);
}

function findEdge(state: WorldState, id: string): Edge | undefined {
  return state.edges.find((edge) => edge.id === id);
}

function findClaim(state: WorldState, id: string): Claim | undefined {
  return state.claims.find((claim) => claim.id === id);
}

function replaceById<T extends { id: string }>(values: readonly T[], replacement: T): T[] {
  return values.map((value) => (value.id === replacement.id ? clone(replacement) : clone(value)));
}

function removeById<T extends { id: string }>(values: readonly T[], id: string): T[] {
  return values.filter((value) => value.id !== id).map(clone);
}

async function transitionFingerprint(
  worldFingerprint: string,
  transition: Omit<StateTransition, "id">
): Promise<string> {
  return sha256(
    JSON.stringify({
      worldFingerprint,
      operation: transition.operation,
      targetId: transition.targetId,
      value: transition.value ?? null,
      preconditions: transition.preconditions,
      rationale: transition.rationale ?? null,
    })
  );
}

/* -------------------------------------------------------------------------- */
/* Engine                                                                     */
/* -------------------------------------------------------------------------- */

export class StateTransitionEngine {
  public async createTransition(
    world: WorldState,
    input: Omit<StateTransition, "id" | "expectedWorldFingerprint">
  ): Promise<StateTransition> {
    const base = {
      operation: input.operation,
      targetId: input.targetId,
      value: input.value ? clone(input.value) : undefined,
      preconditions: clone(input.preconditions),
      expectedWorldFingerprint: world.fingerprint,
      rationale: input.rationale,
    };

    const fp = await transitionFingerprint(world.fingerprint, base);

    return {
      ...base,
      id: `transition:${fp}`,
    };
  }

  public async evaluate(
    world: WorldState,
    transition: StateTransition
  ): Promise<StateTransitionResult> {
    const beforeFingerprint = await sha256(
      JSON.stringify({
        nodes: world.nodes,
        edges: world.edges,
        claims: world.claims,
        asOf: world.asOf,
      })
    );

    const failures: TransitionFailure[] = [];
    const conflicts: string[] = [];

    if (transition.expectedWorldFingerprint !== world.fingerprint) {
      failures.push({
        code: "WORLD_STATE_MISMATCH",
        message: "The transition was generated from a different world-state fingerprint.",
      });
    }

    this.evaluatePreconditions(world, transition.preconditions, failures);
    this.validateOperation(world, transition, failures);

    if (failures.length > 0) {
      return {
        accepted: false,
        transitionId: transition.id,
        beforeFingerprint,
        operation: transition.operation,
        failures,
        conflicts,
        changedIds: [],
      };
    }

    const projected = this.project(world, transition);
    conflicts.push(...this.detectConflicts(projected));

    if (conflicts.length > 0) {
      return {
        accepted: false,
        transitionId: transition.id,
        beforeFingerprint,
        operation: transition.operation,
        failures: [
          {
            code: "CONFLICT",
            message: "The proposed transition would create contradictory world state.",
          },
        ],
        conflicts,
        changedIds: [transition.targetId],
      };
    }

    const afterFingerprint = await sha256(JSON.stringify(projected));

    return {
      accepted: true,
      transitionId: transition.id,
      beforeFingerprint,
      afterFingerprint,
      operation: transition.operation,
      failures: [],
      conflicts: [],
      changedIds: [transition.targetId],
      projectedState: projected,
    };
  }

  public audit(
    result: StateTransitionResult,
    transition: StateTransition,
    evaluatedAt: string
  ): TransitionAudit {
    if (!Number.isFinite(Date.parse(evaluatedAt))) {
      throw new Error("evaluatedAt must be a valid ISO timestamp.");
    }

    return {
      transitionId: result.transitionId,
      accepted: result.accepted,
      operation: result.operation,
      targetId: transition.targetId,
      beforeFingerprint: result.beforeFingerprint,
      afterFingerprint: result.afterFingerprint,
      changedIds: result.changedIds,
      failures: result.failures,
      conflicts: result.conflicts,
      evaluatedAt,
    };
  }

  private evaluatePreconditions(
    world: WorldState,
    preconditions: readonly TransitionPrecondition[],
    failures: TransitionFailure[]
  ): void {
    for (const precondition of preconditions) {
      if (!precondition.id) {
        failures.push({
          code: "PRECONDITION_FAILED",
          message: "A transition precondition has no identifier.",
        });
        continue;
      }

      if (precondition.claimId) {
        const claim = findClaim(world, precondition.claimId);
        if (!claim) {
          failures.push({
            code: "PRECONDITION_FAILED",
            message: `Required claim "${precondition.claimId}" does not exist.`,
            preconditionId: precondition.id,
          });
          continue;
        }

        if (precondition.requiredTruth && !precondition.requiredTruth.includes(claim.truth)) {
          failures.push({
            code: "PRECONDITION_FAILED",
            message: `Claim "${precondition.claimId}" has truth state "${claim.truth}", which does not satisfy the required state.`,
            preconditionId: precondition.id,
          });
        }
      }

      if (precondition.nodeId) {
        if (!findNode(world, precondition.nodeId)) {
          failures.push({
            code: "PRECONDITION_FAILED",
            message: `Required node "${precondition.nodeId}" does not exist.`,
            preconditionId: precondition.id,
          });
        }
      }

      if (precondition.edgeId) {
        if (!findEdge(world, precondition.edgeId)) {
          failures.push({
            code: "PRECONDITION_FAILED",
            message: `Required edge "${precondition.edgeId}" does not exist.`,
            preconditionId: precondition.id,
          });
        }
      }
    }
  }

  private validateOperation(
    world: WorldState,
    transition: StateTransition,
    failures: TransitionFailure[]
  ): void {
    switch (transition.operation) {
      case "ADD_NODE": {
        if (!transition.value) {
          failures.push({ code: "TYPE_MISMATCH", message: "ADD_NODE requires a Node value." });
          return;
        }
        if (findNode(world, transition.targetId)) {
          failures.push({ code: "TARGET_EXISTS", message: `Node "${transition.targetId}" already exists.` });
        }
        if (transition.value.id !== transition.targetId) {
          failures.push({ code: "TYPE_MISMATCH", message: "Transition targetId does not match the supplied Node id." });
        }
        break;
      }

      case "UPDATE_NODE": {
        if (!transition.value) {
          failures.push({ code: "TYPE_MISMATCH", message: "UPDATE_NODE requires a Node value." });
          return;
        }
        if (!findNode(world, transition.targetId)) {
          failures.push({ code: "TARGET_MISSING", message: `Node "${transition.targetId}" does not exist.` });
        }
        if (transition.value.id !== transition.targetId) {
          failures.push({ code: "TYPE_MISMATCH", message: "Transition targetId does not match the supplied Node id." });
        }
        break;
      }

      case "REMOVE_NODE": {
        if (!findNode(world, transition.targetId)) {
          failures.push({ code: "TARGET_MISSING", message: `Node "${transition.targetId}" does not exist.` });
        }
        break;
      }

      case "ADD_EDGE": {
        if (!transition.value) {
          failures.push({ code: "TYPE_MISMATCH", message: "ADD_EDGE requires an Edge value." });
          return;
        }
        if (findEdge(world, transition.targetId)) {
          failures.push({ code: "TARGET_EXISTS", message: `Edge "${transition.targetId}" already exists.` });
        }
        if (transition.value.id !== transition.targetId) {
          failures.push({ code: "TYPE_MISMATCH", message: "Transition targetId does not match the supplied Edge id." });
        }
        const edge = transition.value as Edge;
        if (!findNode(world, edge.from)) {
          failures.push({ code: "TARGET_MISSING", message: `Edge source node "${edge.from}" does not exist.` });
        }
        if (!findNode(world, edge.to)) {
          failures.push({ code: "TARGET_MISSING", message: `Edge destination node "${edge.to}" does not exist.` });
        }
        break;
      }

      case "REMOVE_EDGE": {
        if (!findEdge(world, transition.targetId)) {
          failures.push({ code: "TARGET_MISSING", message: `Edge "${transition.targetId}" does not exist.` });
        }
        break;
      }

      case "ADD_CLAIM": {
        if (!transition.value) {
          failures.push({ code: "TYPE_MISMATCH", message: "ADD_CLAIM requires a Claim value." });
          return;
        }
        if (findClaim(world, transition.targetId)) {
          failures.push({ code: "TARGET_EXISTS", message: `Claim "${transition.targetId}" already exists.` });
        }
        if (transition.value.id !== transition.targetId) {
          failures.push({ code: "TYPE_MISMATCH", message: "Transition targetId does not match the supplied Claim id." });
        }
        break;
      }

      case "UPDATE_CLAIM":
      case "INVALIDATE_CLAIM": {
        if (!transition.value) {
          failures.push({ code: "TYPE_MISMATCH", message: `${transition.operation} requires a Claim value.` });
          return;
        }
        if (!findClaim(world, transition.targetId)) {
          failures.push({ code: "TARGET_MISSING", message: `Claim "${transition.targetId}" does not exist.` });
        }
        if (transition.value.id !== transition.targetId) {
          failures.push({ code: "TYPE_MISMATCH", message: "Transition targetId does not match the supplied Claim id." });
        }
        const claimVal = transition.value as Claim;
        if (transition.operation === "INVALIDATE_CLAIM" && claimVal.truth !== "CONTRADICTED") {
          failures.push({ code: "INVALID_OPERATION", message: "INVALIDATE_CLAIM requires the replacement claim truth state to be CONTRADICTED." });
        }
        break;
      }

      default: {
        const unreachable: never = transition.operation;
        failures.push({ code: "INVALID_OPERATION", message: `Unsupported transition operation "${String(unreachable)}".` });
      }
    }
  }

  private project(world: WorldState, transition: StateTransition): WorldState {
    let nodes = world.nodes.map(clone);
    let edges = world.edges.map(clone);
    let claims = world.claims.map(clone);

    switch (transition.operation) {
      case "ADD_NODE":
        nodes.push(clone(transition.value as Node));
        break;
      case "UPDATE_NODE":
        nodes = replaceById(nodes, transition.value as Node);
        break;
      case "REMOVE_NODE":
        nodes = removeById(nodes, transition.targetId);
        edges = edges.filter((edge) => edge.from !== transition.targetId && edge.to !== transition.targetId);
        break;
      case "ADD_EDGE":
        edges.push(clone(transition.value as Edge));
        break;
      case "REMOVE_EDGE":
        edges = removeById(edges, transition.targetId);
        break;
      case "ADD_CLAIM":
        claims.push(clone(transition.value as Claim));
        break;
      case "UPDATE_CLAIM":
      case "INVALIDATE_CLAIM":
        claims = replaceById(claims, transition.value as Claim);
        break;
      default:
        break;
    }

    const body = {
      nodes,
      edges,
      claims,
      asOf: world.asOf,
    };
    const fingerprint = require("crypto").createHash("sha256").update(JSON.stringify(body)).digest("hex");
    return { ...body, fingerprint };
  }

  private detectConflicts(world: WorldState): string[] {
    const conflicts: string[] = [];

    for (let i = 0; i < world.claims.length; i += 1) {
      for (let j = i + 1; j < world.claims.length; j += 1) {
        const left = world.claims[i];
        const right = world.claims[j];

        if (
          left.subject === right.subject &&
          left.predicate === right.predicate &&
          left.object !== right.object &&
          left.truth !== "CONTRADICTED" &&
          right.truth !== "CONTRADICTED"
        ) {
          conflicts.push(`claim-conflict:${left.id}:${right.id}`);
        }
      }
    }

    for (const edge of world.edges) {
      if (!findNode(world, edge.from) || !findNode(world, edge.to)) {
        conflicts.push(`dangling-edge:${edge.id}`);
      }
    }

    return conflicts.sort();
  }
}
