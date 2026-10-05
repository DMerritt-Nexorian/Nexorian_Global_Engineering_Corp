/**
 * JARVIS / SENTINEL-1 CONTROL GATE
 *
 * File 6
 * src/lib/jarvis-sentinel-gate.ts
 *
 * Purpose:
 *   Deterministically validate an ExecutionIntent before it can reach
 *   an execution fabric.
 *
 * Architecture:
 *
 *   HUMAN
 *      ↓
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
 *   SENTINEL-1  ← THIS FILE
 *      ↓
 *   EXECUTION FABRIC
 *      ↓
 *   OBSERVATION
 *      ↓
 *   VERIFICATION
 *
 * Sentinel-1 is a control boundary.
 *
 * It does NOT:
 *   - execute tools
 *   - execute shell commands
 *   - modify files
 *   - access the network
 *   - access credentials
 *   - call an LLM
 *   - invent evidence
 *   - invent permissions
 *   - invent resource limits
 *   - upgrade epistemic truth
 *
 * It validates whether a compiled intent satisfies deterministic
 * execution-gating requirements.
 *
 * Rules:
 *   Proof Before Trust
 *   Rules Before Reasoning
 *   Determinism Before Autonomy
 *   No Bandaids
 *   Delete Complexity
 *   Resource Efficiency
 */

import {
  ExecutionIntent,
  ResourceBudget,
  TruthState,
  AuthorityRole,
} from "./jarvis-contracts";

export const SENTINEL_GATE_VERSION = "1.0.0";

/**
 * Sentinel policy decision.
 *
 * ALLOW means:
 *   The intent passed the deterministic gate.
 *
 * It does NOT mean:
 *   The action has executed.
 *
 * It does NOT mean:
 *   External authorization has been granted.
 *
 * DENY means:
 *   The intent must not proceed through the execution boundary.
 */
export type SentinelDecision =
  | "ALLOW"
  | "DENY";

/**
 * Deterministic denial reasons.
 */
export type SentinelDenialReason =
  | "INVALID_INTENT"
  | "MISSING_OBJECTIVE"
  | "MISSING_SCOPE"
  | "MISSING_AUTHORITY"
  | "AUTHORITY_NOT_PERMITTED"
  | "MISSING_PRECONDITIONS"
  | "MISSING_VERIFICATION"
  | "UNSAFE_TRUTH_STATE"
  | "CONFLICTING_REASONING"
  | "STALE_STATE"
  | "FAILED_REASONING"
  | "UNIMPLEMENTED_CAPABILITY"
  | "RESOURCE_LIMIT_MISSING"
  | "RESOURCE_LIMIT_INVALID"
  | "ROLLBACK_REQUIRED"
  | "POLICY_VIOLATION"
  | "INVARIANT_VIOLATION";

/**
 * Sentinel invariant.
 *
 * These are deterministic predicates.
 *
 * They do not perform execution.
 */
export interface SentinelInvariant {
  readonly id: string;
  readonly description: string;
  readonly required: boolean;
}

/**
 * Optional policy configuration.
 *
 * Defaults are intentionally conservative.
 */
export interface SentinelPolicy {
  readonly allowedRoles: readonly AuthorityRole[];

  /**
   * Whether inferred reasoning may reach the gate.
   *
   * This does NOT authorize inferred actions.
   * It only controls whether such an intent can be evaluated.
   */
  readonly allowInferredReasoning: boolean;

  /**
   * Whether experimental reasoning may reach the gate.
   *
   * Default should normally be false.
   */
  readonly allowExperimentalReasoning: boolean;

  /**
   * Whether every consequential intent requires a rollback plan.
   */
  readonly requireRollbackPlan: boolean;

  /**
   * Whether resource limits must be explicitly supplied.
   */
  readonly requireResourceBudget: boolean;

  /**
   * Deterministic invariant set.
   */
  readonly invariants: readonly SentinelInvariant[];
}

/**
 * Result of Sentinel evaluation.
 */
export interface SentinelGateResult {
  readonly decision: SentinelDecision;

  readonly reasons: readonly SentinelDenialReason[];

  readonly warnings: readonly string[];

  /**
   * Truth state is preserved, never upgraded.
   */
  readonly truthState: TruthState;

  /**
   * Authorization remains an explicit requirement.
   */
  readonly authorizationRequired: boolean;

  /**
   * Whether the intent is eligible to enter an execution fabric.
   *
   * This is intentionally distinct from "executed".
   */
  readonly executionEligible: boolean;

  readonly checkedInvariants: readonly string[];

  readonly passedInvariants: readonly string[];

  readonly failedInvariants: readonly string[];

  readonly policyVersion: string;

  readonly gateVersion: string;
}

/**
 * Default Sentinel policy.
 *
 * This policy is deliberately conservative.
 */
export const DEFAULT_SENTINEL_POLICY: SentinelPolicy = {
  allowedRoles: [
    "FOUNDER",
    "DEVELOPER",
  ],

  allowInferredReasoning: false,

  allowExperimentalReasoning: false,

  requireRollbackPlan: false,

  requireResourceBudget: false,

  invariants: [
    {
      id: "S1-OBJECTIVE",
      description: "Intent must contain an explicit objective.",
      required: true,
    },
    {
      id: "S1-SCOPE",
      description: "Intent must contain an explicit execution scope.",
      required: true,
    },
    {
      id: "S1-AUTHORITY",
      description: "Intent must contain an explicit authority requirement.",
      required: true,
    },
    {
      id: "S1-VERIFICATION",
      description: "Intent must contain a post-execution verification path.",
      required: true,
    },
    {
      id: "S1-NO-TRUTH-UPGRADE",
      description:
        "Sentinel must never upgrade the epistemic state of the intent.",
      required: true,
    },
  ],
};

/**
 * Sentinel-1 deterministic control gate.
 *
 * Stateless by design.
 */
export class JarvisSentinelGate {
  private readonly policy: SentinelPolicy;

  public constructor(
    policy: SentinelPolicy = DEFAULT_SENTINEL_POLICY,
  ) {
    this.policy = policy;
  }

  /**
   * Evaluate an intent.
   *
   * This method performs no side effects.
   */
  public evaluate(
    intent: ExecutionIntent | undefined,
  ): SentinelGateResult {
    const reasons: SentinelDenialReason[] = [];
    const warnings: string[] = [];

    const checkedInvariants = this.policy.invariants.map(
      (invariant) => invariant.id,
    );

    const passedInvariants: string[] = [];
    const failedInvariants: string[] = [];

    if (!intent) {
      return this.deny(
        ["INVALID_INTENT"],
        warnings,
        "UNKNOWN",
        checkedInvariants,
        passedInvariants,
        ["INVALID_INTENT"],
      );
    }

    const truthState = intent.reasoningConclusion?.truthState ?? "UNKNOWN";

    this.checkObjective(
      intent,
      reasons,
      passedInvariants,
      failedInvariants,
    );

    this.checkScope(
      intent,
      reasons,
      passedInvariants,
      failedInvariants,
    );

    this.checkAuthority(
      intent,
      reasons,
      passedInvariants,
      failedInvariants,
    );

    this.checkTruthState(
      intent,
      reasons,
      warnings,
    );

    this.checkVerification(
      intent,
      reasons,
      passedInvariants,
      failedInvariants,
    );

    this.checkRollback(
      intent,
      reasons,
      warnings,
    );

    this.checkResources(
      intent.resourceBudget,
      reasons,
      warnings,
    );

    this.checkInvariants(
      intent,
      passedInvariants,
      failedInvariants,
      reasons,
    );

    const uniqueReasons = [...new Set(reasons)];

    if (uniqueReasons.length > 0) {
      return this.deny(
        uniqueReasons,
        warnings,
        truthState,
        checkedInvariants,
        passedInvariants,
        failedInvariants,
      );
    }

    /**
     * Passing the deterministic gate does not authorize execution.
     *
     * It only establishes execution eligibility under this policy.
     */
    return {
      decision: "ALLOW",
      reasons: [],
      warnings,
      truthState,
      authorizationRequired: true,
      executionEligible: true,
      checkedInvariants,
      passedInvariants,
      failedInvariants,
      policyVersion: "1.0.0",
      gateVersion: SENTINEL_GATE_VERSION,
    };
  }

  /**
   * Objective validation.
   */
  private checkObjective(
    intent: ExecutionIntent,
    reasons: SentinelDenialReason[],
    passed: string[],
    failed: string[],
  ): void {
    if (!intent.objective) {
      reasons.push("MISSING_OBJECTIVE");
      failed.push("S1-OBJECTIVE");
      return;
    }

    passed.push("S1-OBJECTIVE");
  }

  /**
   * Scope validation.
   */
  private checkScope(
    intent: ExecutionIntent,
    reasons: SentinelDenialReason[],
    passed: string[],
    failed: string[],
  ): void {
    if (
      !Array.isArray(intent.scope) ||
      intent.scope.length === 0 ||
      intent.scope.every(
        (value) =>
          typeof value !== "string" ||
          value.trim().length === 0,
      )
    ) {
      reasons.push("MISSING_SCOPE");
      failed.push("S1-SCOPE");
      return;
    }

    passed.push("S1-SCOPE");
  }

  /**
   * Authority validation.
   *
   * This validates the requested authority role against policy.
   *
   * It does NOT prove that the caller actually possesses that role.
   *
   * Actual identity/credential verification belongs to the protected
   * authorization layer surrounding Sentinel.
   */
  private checkAuthority(
    intent: ExecutionIntent,
    reasons: SentinelDenialReason[],
    passed: string[],
    failed: string[],
  ): void {
    const authority = intent.authority ?? intent.authorization;

    if (!authority || !authority.role) {
      reasons.push("MISSING_AUTHORITY");
      failed.push("S1-AUTHORITY");
      return;
    }

    if (!authority.authorizationRequired) {
      reasons.push("POLICY_VIOLATION");
      failed.push("S1-AUTHORITY");
      return;
    }

    if (!this.policy.allowedRoles.includes(authority.role)) {
      reasons.push("AUTHORITY_NOT_PERMITTED");
      failed.push("S1-AUTHORITY");
      return;
    }

    passed.push("S1-AUTHORITY");
  }

  /**
   * Epistemic validation.
   *
   * Sentinel never upgrades truth.
   */
  private checkTruthState(
    intent: ExecutionIntent,
    reasons: SentinelDenialReason[],
    warnings: string[],
  ): void {
    const state = intent.reasoningConclusion?.truthState ?? "UNKNOWN";

    switch (state) {
      case "VERIFIED":
      case "OBSERVED":
      case "DERIVED":
        return;

      case "INFERRED":
        if (!this.policy.allowInferredReasoning) {
          reasons.push("UNSAFE_TRUTH_STATE");
          return;
        }

        warnings.push(
          "Intent depends on inferred reasoning; explicit policy permits evaluation, but this does not constitute verification.",
        );
        return;

      case "EXPERIMENTAL":
        if (!this.policy.allowExperimentalReasoning) {
          reasons.push("UNSAFE_TRUTH_STATE");
          return;
        }

        warnings.push(
          "Intent depends on experimental reasoning; this remains experimental.",
        );
        return;

      case "HYPOTHESIZED":
        reasons.push("UNSAFE_TRUTH_STATE");
        return;

      case "UNKNOWN":
        reasons.push("UNSAFE_TRUTH_STATE");
        return;

      case "UNVERIFIED":
        reasons.push("UNSAFE_TRUTH_STATE");
        return;

      case "UNIMPLEMENTED":
        reasons.push("UNIMPLEMENTED_CAPABILITY");
        return;

      case "CONFLICTING":
        reasons.push("CONFLICTING_REASONING");
        return;

      case "STALE":
        reasons.push("STALE_STATE");
        return;

      case "FAILED":
        reasons.push("FAILED_REASONING");
        return;

      default:
        reasons.push("UNSAFE_TRUTH_STATE");
    }
  }

  /**
   * Verification must exist before consequential execution can pass.
   */
  private checkVerification(
    intent: ExecutionIntent,
    reasons: SentinelDenialReason[],
    passed: string[],
    failed: string[],
  ): void {
    const requirements = intent.verificationRequirements ?? intent.verificationPlan;

    if (
      !Array.isArray(requirements) ||
      requirements.length === 0
    ) {
      reasons.push("MISSING_VERIFICATION");
      failed.push("S1-VERIFICATION");
      return;
    }

    passed.push("S1-VERIFICATION");
  }

  /**
   * Rollback validation.
   */
  private checkRollback(
    intent: ExecutionIntent,
    reasons: SentinelDenialReason[],
    warnings: string[],
  ): void {
    if (!this.policy.requireRollbackPlan) {
      return;
    }

    if (!intent.rollbackPlan) {
      reasons.push("ROLLBACK_REQUIRED");
      return;
    }

    warnings.push(
      "Rollback plan supplied and accepted for policy evaluation.",
    );
  }

  /**
   * Resource validation.
   *
   * Sentinel never invents resource measurements.
   */
  private checkResources(
    budget: ResourceBudget | undefined,
    reasons: SentinelDenialReason[],
    warnings: string[],
  ): void {
    if (!budget) {
      if (this.policy.requireResourceBudget) {
        reasons.push("RESOURCE_LIMIT_MISSING");
      } else {
        warnings.push(
          "No explicit resource budget supplied; no resource limit has been invented.",
        );
      }

      return;
    }

    if (!this.isValidResourceBudget(budget)) {
      reasons.push("RESOURCE_LIMIT_INVALID");
      return;
    }
  }

  /**
   * Validate supplied resource limits without estimating them.
   */
  private isValidResourceBudget(
    budget: ResourceBudget,
  ): boolean {
    const candidate = budget as Record<string, unknown>;

    for (const value of Object.values(candidate)) {
      if (typeof value === "number") {
        if (!Number.isFinite(value) || value < 0) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Verify the required Sentinel invariants.
   */
  private checkInvariants(
    intent: ExecutionIntent,
    passed: string[],
    failed: string[],
    reasons: SentinelDenialReason[],
  ): void {
    for (const invariant of this.policy.invariants) {
      let satisfied = false;

      switch (invariant.id) {
        case "S1-OBJECTIVE":
          satisfied = Boolean(intent.objective);
          break;

        case "S1-SCOPE":
          satisfied =
            Array.isArray(intent.scope) &&
            intent.scope.length > 0;
          break;

        case "S1-AUTHORITY":
          satisfied =
            Boolean(intent.authority ?? intent.authorization) &&
            (intent.authority?.authorizationRequired === true ||
             (typeof intent.authorization === 'object' && intent.authorization !== null && 'authorizationRequired' in intent.authorization && intent.authorization.authorizationRequired === true));
          break;

        case "S1-VERIFICATION":
          satisfied =
            (Array.isArray(intent.verificationRequirements) && intent.verificationRequirements.length > 0) ||
            (Array.isArray(intent.verificationPlan) && intent.verificationPlan.length > 0);
          break;

        case "S1-NO-TRUTH-UPGRADE":
          /**
           * The gate has no operation that mutates the truth state.
           *
           * This invariant is therefore satisfied by construction.
           */
          satisfied = true;
          break;

        default:
          /**
           * Unknown invariants cannot be assumed satisfied.
           */
          satisfied = false;
          break;
      }

      if (satisfied) {
        if (!passed.includes(invariant.id)) {
          passed.push(invariant.id);
        }
      } else {
        if (!failed.includes(invariant.id)) {
          failed.push(invariant.id);
        }

        if (invariant.required) {
          reasons.push("INVARIANT_VIOLATION");
        }
      }
    }
  }

  /**
   * Construct a deterministic denial result.
   */
  private deny(
    reasons: readonly SentinelDenialReason[],
    warnings: readonly string[],
    truthState: TruthState,
    checkedInvariants: readonly string[],
    passedInvariants: readonly string[],
    failedInvariants: readonly string[],
  ): SentinelGateResult {
    return {
      decision: "DENY",
      reasons: [...new Set(reasons)],
      warnings: [...warnings],
      truthState,
      authorizationRequired: true,
      executionEligible: false,
      checkedInvariants: [...checkedInvariants],
      passedInvariants: [...new Set(passedInvariants)],
      failedInvariants: [...new Set(failedInvariants)],
      policyVersion: "1.0.0",
      gateVersion: SENTINEL_GATE_VERSION,
    };
  }
}
