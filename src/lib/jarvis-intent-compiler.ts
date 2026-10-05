/**
 * JARVIS Intent Compiler
 *
 * Purpose:
 *   Convert an auditable JarvisReasoningEngine result into a deterministic,
 *   machine-checkable ExecutionIntent.
 *
 * Architectural position:
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
 *   SENTINEL-1
 *      ↓
 *   EXECUTION FABRIC
 *
 * This module is NOT an authorization engine.
 * This module is NOT an execution engine.
 * This module is NOT an LLM.
 *
 * Sentinel-1 remains the authoritative execution gate.
 *
 * Rules:
 *   Proof Before Trust
 *   Rules Before Reasoning
 *   Determinism Before Autonomy
 *   No Bandaids
 *   Delete Complexity
 *   Resource Efficiency
 *
 * Important epistemic rule:
 *   A reasoning conclusion is not automatically a verified fact.
 *
 * Important security rule:
 *   Producing an ExecutionIntent does not authorize execution.
 */

import {
  Constraint,
  ExecutionIntent,
  Objective,
  Precondition,
  ExpectedEffect,
  ResourceBudget,
  RollbackPlan,
  TruthState,
  VerificationRequirement,
  AuthorityRole,
} from "./jarvis-contracts";

import {
  ReasoningResult,
  ReasoningRequest,
  ReasoningStatus,
} from "./jarvis-reasoning-engine";

/**
 * Compiler failure categories.
 */
export type IntentCompilationFailure =
  | "INVALID_REASONING_RESULT"
  | "BLOCKED_REASONING"
  | "CONFLICTED_REASONING"
  | "INSUFFICIENT_EVIDENCE"
  | "MISSING_OBJECTIVE"
  | "MISSING_SCOPE"
  | "MISSING_AUTHORITY"
  | "MISSING_SUCCESS_CRITERIA"
  | "UNSUPPORTED_TRUTH_STATE"
  | "MISSING_PRECONDITIONS"
  | "MISSING_VERIFICATION"
  | "UNSAFE_INTENT";

/**
 * Deterministic compilation result.
 */
export interface IntentCompilationResult {
  readonly compiled: boolean;

  /**
   * An intent exists only when compilation succeeds.
   */
  readonly intent?: ExecutionIntent;

  /**
   * Never hidden from the caller.
   */
  readonly failures: readonly IntentCompilationFailure[];

  readonly warnings: readonly string[];

  /**
   * Truth state of the compilation itself.
   *
   * Compilation does not upgrade the truth state of the underlying
   * reasoning conclusion.
   */
  readonly truthState: TruthState;

  /**
   * Whether Sentinel-1 must perform authorization before execution.
   *
   * This should remain true for consequential actions.
   */
  readonly authorizationRequired: boolean;

  /**
   * Evidence references carried forward from reasoning.
   */
  readonly evidenceRefs: readonly string[];

  /**
   * Deterministic compiler version.
   */
  readonly compilerVersion: string;
}

/**
 * Explicit compiler version.
 *
 * This is a schema/compiler identifier, not a software release claim.
 */
export const JARVIS_INTENT_COMPILER_VERSION = "1.0.0";

/**
 * Input to the compiler.
 */
export interface IntentCompilationRequest {
  readonly reasoning: ReasoningResult;

  /**
   * Original request is retained so the compiler can ensure that the
   * resulting intent remains attached to the actual objective.
   */
  readonly reasoningRequest?: ReasoningRequest;

  /**
   * Explicit execution scope.
   *
   * The compiler does not invent scope.
   */
  readonly scope: readonly string[];

  /**
   * Role proposed for the eventual authorization decision.
   *
   * This is a requirement passed to Sentinel, NOT authorization.
   */
  readonly authorityRole?: AuthorityRole;

  /**
   * Optional deterministic resource limits.
   *
   * The compiler must never invent resource measurements.
   */
  readonly resourceBudget?: ResourceBudget;

  /**
   * Preconditions supplied by the caller/system.
   *
   * The compiler does not manufacture environmental facts.
   */
  readonly preconditions?: readonly Precondition[];

  /**
   * Expected effects supplied by reasoning/planning.
   *
   * These describe intended state changes; they are not claims that
   * those changes have already happened.
   */
  readonly expectedEffects?: readonly ExpectedEffect[];

  /**
   * Verification requirements that must be satisfied after execution.
   */
  readonly verificationRequirements?: readonly VerificationRequirement[];

  /**
   * Rollback strategy.
   *
   * The compiler does not invent a rollback mechanism.
   */
  readonly rollbackPlan?: RollbackPlan;
}

/**
 * Intent Compiler.
 *
 * The compiler is intentionally stateless.
 *
 * No:
 *   - filesystem
 *   - network
 *   - database
 *   - credentials
 *   - Git
 *   - shell
 *   - LLM
 *   - tool execution
 *   - authorization
 */
export class JarvisIntentCompiler {
  /**
   * Compile a reasoning result into an ExecutionIntent.
   */
  public compile(
    request: IntentCompilationRequest,
  ): IntentCompilationResult {
    const failures: IntentCompilationFailure[] = [];
    const warnings: string[] = [];

    const reasoning = request.reasoning;

    if (!reasoning || typeof reasoning !== "object") {
      failures.push("INVALID_REASONING_RESULT");

      return this.failureResult(
        failures,
        warnings,
        "UNKNOWN",
      );
    }

    this.validateReasoningStatus(reasoning, failures);
    this.validateObjective(reasoning, request, failures);
    this.validateScope(request.scope, failures);
    this.validateAuthority(request.authorityRole, failures);
    this.validateSuccessCriteria(reasoning, failures);
    this.validatePreconditions(request.preconditions, failures);
    this.validateVerification(request.verificationRequirements, failures);

    const truthState = this.determineCompilationTruthState(reasoning);

    this.validateTruthState(truthState, failures);

    /**
     * Consequential execution requires an explicit verification path.
     *
     * We do not silently turn missing verification into permission to act.
     */
    if (
      request.expectedEffects &&
      request.expectedEffects.length > 0 &&
      (!request.verificationRequirements ||
        request.verificationRequirements.length === 0)
    ) {
      failures.push("MISSING_VERIFICATION");
    }

    /**
     * Never fabricate resource limits.
     *
     * If no resource budget exists, the intent can still be compiled,
     * but Sentinel must determine whether execution is permissible.
     */
    if (!request.resourceBudget) {
      warnings.push(
        "No resource budget supplied; execution resource limits remain unresolved and must be enforced by Sentinel-1.",
      );
    }

    /**
     * Do not compile an intent from an unsafe reasoning state.
     */
    if (failures.length > 0) {
      return this.failureResult(
        failures,
        warnings,
        truthState,
        reasoning,
      );
    }

    const objective = this.buildObjective(reasoning, request);

    if (!objective) {
      return this.failureResult(
        ["MISSING_OBJECTIVE"],
        warnings,
        truthState,
        reasoning,
      );
    }

    const intent = this.buildIntent(
      request,
      reasoning,
      objective,
    );

    return {
      compiled: true,
      intent,
      failures: [],
      warnings,
      truthState,
      authorizationRequired: true,
      evidenceRefs: this.collectEvidenceRefs(reasoning),
      compilerVersion: JARVIS_INTENT_COMPILER_VERSION,
    };
  }

  /**
   * Validate the reasoning state.
   */
  private validateReasoningStatus(
    reasoning: ReasoningResult,
    failures: IntentCompilationFailure[],
  ): void {
    switch (reasoning.status as ReasoningStatus) {
      case "BLOCKED":
        failures.push("BLOCKED_REASONING");
        break;

      case "CONFLICTED":
        failures.push("CONFLICTED_REASONING");
        break;

      case "INSUFFICIENT_EVIDENCE":
        failures.push("INSUFFICIENT_EVIDENCE");
        break;

      case "PARTIAL":
        /**
         * Partial reasoning is not automatically unsafe, but the compiler
         * will require explicit success criteria and verification.
         */
        break;

      case "COMPLETE":
        break;

      default:
        failures.push("INVALID_REASONING_RESULT");
        break;
    }
  }

  /**
   * Ensure the objective originates from reasoning rather than being
   * invented by the compiler.
   */
  private validateObjective(
    reasoning: ReasoningResult,
    request: IntentCompilationRequest,
    failures: IntentCompilationFailure[],
  ): void {
    const objective =
      reasoning.objective ??
      request.reasoningRequest?.objective;

    if (!objective) {
      failures.push("MISSING_OBJECTIVE");
    }
  }

  /**
   * Scope must be explicit.
   *
   * An empty scope means the compiler cannot establish what the intent
   * is allowed to affect.
   */
  private validateScope(
    scope: readonly string[],
    failures: IntentCompilationFailure[],
  ): void {
    if (!Array.isArray(scope) || scope.length === 0) {
      failures.push("MISSING_SCOPE");
      return;
    }

    const normalized = scope
      .map((value) => value.trim())
      .filter(Boolean);

    if (normalized.length === 0) {
      failures.push("MISSING_SCOPE");
    }
  }

  /**
   * Authority is a requirement, never an authorization decision.
   */
  private validateAuthority(
    authorityRole: AuthorityRole | undefined,
    failures: IntentCompilationFailure[],
  ): void {
    if (!authorityRole) {
      failures.push("MISSING_AUTHORITY");
    }
  }

  /**
   * Consequential intent must have a measurable/observable success
   * definition.
   */
  private validateSuccessCriteria(
    reasoning: ReasoningResult,
    failures: IntentCompilationFailure[],
  ): void {
    const objective = reasoning.objective;

    if (!objective) {
      return;
    }

    if (
      !objective.successCriteria ||
      objective.successCriteria.length === 0
    ) {
      failures.push("MISSING_SUCCESS_CRITERIA");
    }
  }

  /**
   * Preconditions must be explicit when supplied.
   *
   * The compiler does not invent environmental assumptions.
   */
  private validatePreconditions(
    preconditions: readonly Precondition[] | undefined,
    failures: IntentCompilationFailure[],
  ): void {
    if (preconditions === undefined) {
      failures.push("MISSING_PRECONDITIONS");
      return;
    }

    if (!Array.isArray(preconditions)) {
      failures.push("MISSING_PRECONDITIONS");
    }
  }

  /**
   * Every consequential intent needs a post-execution verification path.
   */
  private validateVerification(
    requirements: readonly VerificationRequirement[] | undefined,
    failures: IntentCompilationFailure[],
  ): void {
    if (
      !requirements ||
      !Array.isArray(requirements) ||
      requirements.length === 0
    ) {
      failures.push("MISSING_VERIFICATION");
    }
  }

  /**
   * The compiler does not upgrade epistemic state.
   */
  private determineCompilationTruthState(
    reasoning: ReasoningResult,
  ): TruthState {
    if (reasoning.status === "CONFLICTED") {
      return "CONFLICTING";
    }

    if (reasoning.status === "BLOCKED") {
      return "FAILED";
    }

    if (reasoning.status === "INSUFFICIENT_EVIDENCE") {
      return "UNKNOWN";
    }

    /**
     * Planning and decision conclusions commonly remain DERIVED or
     * INFERRED. Preserve that state.
     */
    return reasoning.conclusion.truthState;
  }

  /**
   * Reject states that cannot support intent compilation.
   *
   * IMPORTANT:
   *   INFERRED is not converted to VERIFIED.
   *   EXPERIMENTAL is not converted to VERIFIED.
   *   UNVERIFIED is not converted to VERIFIED.
   */
  private validateTruthState(
    truthState: TruthState,
    failures: IntentCompilationFailure[],
  ): void {
    switch (truthState) {
      case "CONFLICTING":
      case "FAILED":
      case "UNKNOWN":
      case "STALE":
      case "UNVERIFIED":
      case "UNIMPLEMENTED":
        failures.push("UNSUPPORTED_TRUTH_STATE");
        break;

      case "VERIFIED":
      case "OBSERVED":
      case "DERIVED":
      case "INFERRED":
      case "HYPOTHESIZED":
      case "EXPERIMENTAL":
        /**
         * These states may participate in planning, but Sentinel must
         * independently determine whether execution is permissible.
         */
        break;

      default:
        failures.push("UNSUPPORTED_TRUTH_STATE");
        break;
    }
  }

  /**
   * Construct the objective without changing its epistemic meaning.
   */
  private buildObjective(
    reasoning: ReasoningResult,
    request: IntentCompilationRequest,
  ): Objective | undefined {
    return reasoning.objective ?? request.reasoningRequest?.objective;
  }

  /**
   * Build the actual machine-checkable intent.
   *
   * No authorization occurs here.
   */
  private buildIntent(
    request: IntentCompilationRequest,
    reasoning: ReasoningResult,
    objective: Objective,
  ): ExecutionIntent {
    const constraints: readonly Constraint[] =
      objective.constraints ?? [];

    return {
      objective,
      scope: [...request.scope],
      constraints,
      preconditions: [...(request.preconditions ?? [])],
      expectedEffects: [...(request.expectedEffects ?? [])],
      authorization: {
        role: request.authorityRole!,
        authorizationRequired: true,
      },
      resourceBudget: request.resourceBudget,
      verificationRequirements: [
        ...(request.verificationRequirements ?? []),
      ],
      rollbackPlan: request.rollbackPlan,
      reasoningConclusion: {
        truthState: reasoning.conclusion.truthState,
        confidence: reasoning.conclusion.confidence,
        evidenceRefs: this.collectEvidenceRefs(reasoning),
      },
    };
  }

  /**
   * Extract evidence references without creating new evidence.
   */
  private collectEvidenceRefs(
    reasoning: ReasoningResult,
  ): readonly string[] {
    const refs = new Set<string>();

    for (const premise of reasoning.premises ?? []) {
      for (const ref of premise.evidenceRefs ?? []) {
        if (typeof ref === "string" && ref.length > 0) {
          refs.add(ref);
        }
      }
    }

    for (const step of reasoning.steps ?? []) {
      for (const ref of step.evidenceRefs ?? []) {
        if (typeof ref === "string" && ref.length > 0) {
          refs.add(ref);
        }
      }
    }

    for (const ref of reasoning.conclusion.evidenceRefs ?? []) {
      if (typeof ref === "string" && ref.length > 0) {
        refs.add(ref);
      }
    }

    return [...refs].sort();
  }

  /**
   * Construct deterministic failure output.
   */
  private failureResult(
    failures: readonly IntentCompilationFailure[],
    warnings: readonly string[],
    truthState: TruthState,
    reasoning?: ReasoningResult,
  ): IntentCompilationResult {
    return {
      compiled: false,
      failures: [...new Set(failures)],
      warnings: [...warnings],
      truthState,
      authorizationRequired: true,
      evidenceRefs: reasoning
        ? this.collectEvidenceRefs(reasoning)
        : [],
      compilerVersion: JARVIS_INTENT_COMPILER_VERSION,
    };
  }
}
