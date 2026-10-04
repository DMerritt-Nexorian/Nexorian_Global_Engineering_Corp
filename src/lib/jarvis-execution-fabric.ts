/**
 * JARVIS EXECUTION FABRIC
 *
 * File 7
 * src/lib/jarvis-execution-fabric.ts
 *
 * Architectural position:
 *
 *   JARVIS
 *      ↓
 *   WORLD MODEL
 *      ↓
 *   EVIDENCE
 *      ↓
 *   REASONING
 *      ↓
 *   INTENT COMPILER
 *      ↓
 *   SENTINEL-1
 *      ↓
 *   EXECUTION FABRIC ← THIS FILE
 *      ↓
 *   OBSERVATION
 *      ↓
 *   VERIFICATION
 *
 * This module is the narrow execution boundary.
 *
 * It does not reason.
 * It does not authorize.
 * It does not elevate privileges.
 * It does not modify Sentinel policy.
 * It does not manufacture evidence.
 *
 * Sentinel-1 must approve an intent before this fabric executes it.
 *
 * Core rules:
 *
 *   PROOF BEFORE TRUST
 *   RULES BEFORE REASONING
 *   DETERMINISM BEFORE AUTONOMY
 *
 * No fake capabilities.
 * No fake metrics.
 * No fake authorization.
 * No simulated execution presented as execution.
 */

import {
  ExecutionIntent,
  TruthState,
  AuthorityRole,
} from "./jarvis-contracts";

import {
  JarvisSentinelGate,
  SentinelGateResult,
} from "./jarvis-sentinel-gate";

/* -------------------------------------------------------------------------- */
/* Capability contracts                                                        */
/* -------------------------------------------------------------------------- */

export type CapabilityId =
  | "repository.inspect"
  | "file.read"
  | "pqc.polynomial"
  | "ntt.transform";

export type CapabilityStatus =
  | "IMPLEMENTED"
  | "UNIMPLEMENTED";

export type SideEffect =
  | "NONE"
  | "READ_FILESYSTEM"
  | "WRITE_FILESYSTEM"
  | "EXECUTE_PROCESS"
  | "NETWORK"
  | "CREDENTIAL_ACCESS"
  | "GIT_MUTATION";

export interface CapabilityDefinition<
  TInput = unknown,
  TOutput = unknown,
> {
  readonly id: CapabilityId;

  readonly description: string;

  readonly status: CapabilityStatus;

  readonly requiredRoles: readonly AuthorityRole[];

  readonly sideEffects: readonly SideEffect[];

  readonly inputSchema: string;

  readonly outputSchema: string;

  /**
   * Capability execution implementation.
   *
   * This is intentionally supplied by the registered capability.
   */
  readonly execute?: (
    input: TInput,
  ) => Promise<CapabilityResult<TOutput>>;
}

/* -------------------------------------------------------------------------- */
/* Capability execution result                                                */
/* -------------------------------------------------------------------------- */

export interface CapabilityResult<T = unknown> {
  readonly status:
    | "SUCCESS"
    | "FAILED"
    | "UNIMPLEMENTED";

  readonly truthState: TruthState;

  readonly evidence: readonly EvidenceRecord[];

  readonly output?: T;

  readonly error?: string;
}

export interface EvidenceRecord {
  readonly type:
    | "OBSERVATION"
    | "MEASUREMENT"
    | "ERROR"
    | "VERIFICATION";

  readonly source: string;

  readonly statement: string;

  readonly truthState: TruthState;

  readonly timestamp: string;
}

/* -------------------------------------------------------------------------- */
/* Fabric execution trace                                                     */
/* -------------------------------------------------------------------------- */

export type ExecutionStage =
  | "RECEIVED"
  | "CAPABILITY_LOOKUP"
  | "SENTINEL_EVALUATION"
  | "AUTHORIZATION_REQUIRED"
  | "EXECUTING"
  | "OBSERVED"
  | "VERIFIED"
  | "FAILED"
  | "DENIED";

export interface ExecutionTraceEntry {
  readonly stage: ExecutionStage;

  readonly timestamp: string;

  readonly detail: string;
}

export interface FabricExecutionResult<T = unknown> {
  readonly status:
    | "EXECUTED"
    | "DENIED"
    | "FAILED"
    | "UNIMPLEMENTED";

  readonly capability: CapabilityId;

  readonly truthState: TruthState;

  readonly sentinel: SentinelGateResult;

  readonly trace: readonly ExecutionTraceEntry[];

  readonly evidence: readonly EvidenceRecord[];

  readonly output?: T;

  readonly error?: string;
}

/* -------------------------------------------------------------------------- */
/* Capability registry                                                         */
/* -------------------------------------------------------------------------- */

export class JarvisExecutionFabric {
  private readonly capabilities = new Map<
    CapabilityId,
    CapabilityDefinition
  >();

  private readonly sentinel: JarvisSentinelGate;

  public constructor(
    sentinel: JarvisSentinelGate = new JarvisSentinelGate(),
  ) {
    this.sentinel = sentinel;
  }

  /**
   * Register a capability.
   *
   * Duplicate capability identifiers are rejected.
   *
   * This prevents accidental replacement of an approved execution
   * primitive at runtime.
   */
  public registerCapability(
    capability: CapabilityDefinition,
  ): void {
    if (!capability.id) {
      throw new Error("Capability ID is required.");
    }

    if (this.capabilities.has(capability.id)) {
      throw new Error(
        `Capability already registered: ${capability.id}`,
      );
    }

    if (
      capability.status === "IMPLEMENTED" &&
      typeof capability.execute !== "function"
    ) {
      throw new Error(
        `Implemented capability has no executable implementation: ${capability.id}`,
      );
    }

    if (
      capability.status === "UNIMPLEMENTED" &&
      capability.execute
    ) {
      throw new Error(
        `Unimplemented capability cannot expose an executor: ${capability.id}`,
      );
    }

    this.capabilities.set(
      capability.id,
      Object.freeze({
        ...capability,
        requiredRoles: Object.freeze([
          ...capability.requiredRoles,
        ]),
        sideEffects: Object.freeze([
          ...capability.sideEffects,
        ]),
      }),
    );
  }

  /**
   * Return an immutable capability description.
   */
  public describeCapability(
    id: CapabilityId,
  ): CapabilityDefinition | undefined {
    const capability = this.capabilities.get(id);

    if (!capability) {
      return undefined;
    }

    return Object.freeze({
      ...capability,
      requiredRoles: Object.freeze([
        ...capability.requiredRoles,
      ]),
      sideEffects: Object.freeze([
        ...capability.sideEffects,
      ]),
    });
  }

  /**
   * Enumerate registered capabilities.
   *
   * This describes the actual execution surface.
   */
  public listCapabilities(): readonly CapabilityDefinition[] {
    return Object.freeze(
      [...this.capabilities.values()].map(
        (capability) =>
          Object.freeze({
            ...capability,
            requiredRoles: Object.freeze([
              ...capability.requiredRoles,
            ]),
            sideEffects: Object.freeze([
              ...capability.sideEffects,
            ]),
          }),
      ),
    );
  }

  /**
   * Execute a previously registered capability.
   *
   * IMPORTANT:
   *
   * Sentinel evaluation occurs before capability execution.
   */
  public async execute<TInput, TOutput>(
    intent: ExecutionIntent,
    capabilityId: CapabilityId,
    input: TInput,
  ): Promise<FabricExecutionResult<TOutput>> {
    const trace: ExecutionTraceEntry[] = [];

    trace.push({
      stage: "RECEIVED",
      timestamp: new Date().toISOString(),
      detail: "Execution intent received by execution fabric.",
    });

    const capability =
      this.capabilities.get(capabilityId);

    trace.push({
      stage: "CAPABILITY_LOOKUP",
      timestamp: new Date().toISOString(),
      detail: capability
        ? `Capability ${capabilityId} located.`
        : `Capability ${capabilityId} not registered.`,
    });

    if (!capability) {
      const sentinelResult =
        this.sentinel.evaluate(intent);

      return {
        status: "UNIMPLEMENTED",
        capability: capabilityId,
        truthState: "UNIMPLEMENTED",
        sentinel: sentinelResult,
        trace: [
          ...trace,
          {
            stage: "FAILED",
            timestamp: new Date().toISOString(),
            detail:
              "Requested capability does not exist in the registered execution surface.",
          },
        ],
        evidence: [
          this.evidence(
            "ERROR",
            "jarvis-execution-fabric",
            `Capability ${capabilityId} is not registered.`,
            "UNIMPLEMENTED",
          ),
        ],
      };
    }

    trace.push({
      stage: "SENTINEL_EVALUATION",
      timestamp: new Date().toISOString(),
      detail:
        "Evaluating execution intent through Sentinel-1.",
    });

    const sentinelResult =
      this.sentinel.evaluate(intent);

    if (
      sentinelResult.decision !== "ALLOW" ||
      !sentinelResult.executionEligible
    ) {
      trace.push({
        stage: "DENIED",
        timestamp: new Date().toISOString(),
        detail:
          "Sentinel-1 denied execution eligibility.",
      });

      return {
        status: "DENIED",
        capability: capabilityId,
        truthState: sentinelResult.truthState,
        sentinel: sentinelResult,
        trace,
        evidence: [
          this.evidence(
            "ERROR",
            "sentinel-1",
            "Execution denied by deterministic policy boundary.",
            sentinelResult.truthState,
          ),
        ],
      };
    }

    trace.push({
      stage: "AUTHORIZATION_REQUIRED",
      timestamp: new Date().toISOString(),
      detail:
        "Sentinel eligibility passed; external authorization remains required.",
    });

    const authority = intent.authority ?? intent.authorization;

    /**
     * This fabric does not claim that a role string constitutes
     * authenticated identity.
     *
     * A protected caller must provide actual authorization context.
     *
     * The current intent model only establishes that authorization
     * is required.
     */
    if (!authority || !authority.role || !authority.authorizationRequired) {
      trace.push({
        stage: "DENIED",
        timestamp: new Date().toISOString(),
        detail:
          "Execution refused because authorization requirement was disabled or missing role.",
      });

      return {
        status: "DENIED",
        capability: capabilityId,
        truthState: intent.reasoningConclusion?.truthState ?? "UNKNOWN",
        sentinel: sentinelResult,
        trace,
        evidence: [
          this.evidence(
            "ERROR",
            "jarvis-execution-fabric",
            "Execution requires explicit authorization.",
            intent.reasoningConclusion?.truthState ?? "UNKNOWN",
          ),
        ],
      };
    }

    /**
     * Capability-specific role policy.
     *
     * Again, this is policy matching, not identity authentication.
     */
    if (
      capability.requiredRoles.length > 0 &&
      !capability.requiredRoles.includes(
        authority.role,
      )
    ) {
      trace.push({
        stage: "DENIED",
        timestamp: new Date().toISOString(),
        detail:
          "Intent authority does not satisfy capability role policy.",
      });

      return {
        status: "DENIED",
        capability: capabilityId,
        truthState: intent.reasoningConclusion?.truthState ?? "UNKNOWN",
        sentinel: sentinelResult,
        trace,
        evidence: [
          this.evidence(
            "ERROR",
            capabilityId,
            "Capability role policy rejected the requested authority.",
            intent.reasoningConclusion?.truthState ?? "UNKNOWN",
          ),
        ],
      };
    }

    /**
     * Never execute a capability advertised as unimplemented.
     */
    if (
      capability.status === "UNIMPLEMENTED" ||
      typeof capability.execute !== "function"
    ) {
      trace.push({
        stage: "FAILED",
        timestamp: new Date().toISOString(),
        detail:
          "Capability is declared but has no executable implementation.",
      });

      return {
        status: "UNIMPLEMENTED",
        capability: capabilityId,
        truthState: "UNIMPLEMENTED",
        sentinel: sentinelResult,
        trace,
        evidence: [
          this.evidence(
            "ERROR",
            capabilityId,
            "Capability is UNIMPLEMENTED.",
            "UNIMPLEMENTED",
          ),
        ],
      };
    }

    trace.push({
      stage: "EXECUTING",
      timestamp: new Date().toISOString(),
      detail:
        `Executing registered capability ${capabilityId}.`,
    });

    try {
      const result =
        await capability.execute(input);

      trace.push({
        stage:
          result.status === "SUCCESS"
            ? "OBSERVED"
            : "FAILED",
        timestamp: new Date().toISOString(),
        detail:
          result.status === "SUCCESS"
            ? "Capability returned an execution result."
            : "Capability returned a failure.",
      });

      if (result.status !== "SUCCESS") {
        return {
          status: "FAILED",
          capability: capabilityId,
          truthState: result.truthState,
          sentinel: sentinelResult,
          trace,
          evidence: result.evidence,
          error: result.error,
        };
      }

      /**
       * Execution output is not automatically VERIFIED.
       *
       * A capability may return OBSERVED, DERIVED, VERIFIED, etc.
       * The fabric preserves the supplied epistemic state.
       */
      if (
        result.evidence.some(
          (entry) =>
            entry.type === "VERIFICATION" &&
            entry.truthState === "VERIFIED",
        )
      ) {
        trace.push({
          stage: "VERIFIED",
          timestamp: new Date().toISOString(),
          detail:
            "Capability supplied explicit verification evidence.",
        });
      }

      return {
        status: "EXECUTED",
        capability: capabilityId,
        truthState: result.truthState,
        sentinel: sentinelResult,
        trace,
        evidence: result.evidence,
        output: result.output as TOutput,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown capability execution failure.";

      trace.push({
        stage: "FAILED",
        timestamp: new Date().toISOString(),
        detail: message,
      });

      return {
        status: "FAILED",
        capability: capabilityId,
        truthState: "FAILED",
        sentinel: sentinelResult,
        trace,
        evidence: [
          this.evidence(
            "ERROR",
            capabilityId,
            message,
            "FAILED",
          ),
        ],
        error: message,
      };
    }
  }

  /**
   * Construct an honest evidence record.
   *
   * No metric is inferred here.
   */
  private evidence(
    type: EvidenceRecord["type"],
    source: string,
    statement: string,
    truthState: TruthState,
  ): EvidenceRecord {
    return {
      type,
      source,
      statement,
      truthState,
      timestamp: new Date().toISOString(),
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Factory                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Construct an empty execution fabric.
 *
 * The registry starts empty intentionally.
 *
 * This prevents JARVIS from acquiring imaginary capabilities simply
 * because a capability name appears in an architecture document.
 */
export function createJarvisExecutionFabric(
  sentinel: JarvisSentinelGate = new JarvisSentinelGate(),
): JarvisExecutionFabric {
  return new JarvisExecutionFabric(sentinel);
}
