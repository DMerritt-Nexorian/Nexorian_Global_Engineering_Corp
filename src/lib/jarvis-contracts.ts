/**
 * JARVIS CORE CONTRACTS
 *
 * Nexorian Global Engineering Corp.
 *
 * Purpose:
 *   Machine-checkable contracts shared by the JARVIS intelligence layer,
 *   Sentinel-1 control boundary, capability fabric, verification system,
 *   evidence system, and future controlled-learning system.
 *
 * Architectural principles:
 *
 *   PROOF BEFORE TRUST
 *   RULES BEFORE REASONING
 *   DETERMINISM BEFORE AUTONOMY
 *
 * This file contains DATA CONTRACTS ONLY.
 *
 * It must not:
 *   - execute commands
 *   - call an LLM
 *   - access the filesystem
 *   - access the network
 *   - modify repositories
 *   - contain fake execution
 *   - manufacture metrics
 *   - claim cryptographic compliance
 *
 * All execution belongs behind explicit capabilities and Sentinel-1
 * authorization.
 */

export const JARVIS_CONTRACT_VERSION = "1.0.0";

/* -------------------------------------------------------------------------- */
/* Truth / Epistemic State                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Describes the epistemic status of information.
 *
 * IMPORTANT:
 * TruthState is not a confidence score.
 *
 * A confidence score describes belief.
 * TruthState describes the evidence state.
 */
export type TruthState =
  | "VERIFIED"
  | "OBSERVED"
  | "DERIVED"
  | "INFERRED"
  | "HYPOTHESIZED"
  | "UNKNOWN"
  | "UNVERIFIED"
  | "UNIMPLEMENTED"
  | "CONFLICTING"
  | "STALE"
  | "FAILED"
  | "EXPERIMENTAL";

/**
 * Evidence supporting a claim, observation, decision, or verification result.
 */
export interface EvidenceRef {
  readonly id: string;

  /**
   * What produced the evidence.
   *
   * Examples:
   *   repository
   *   filesystem
   *   test-run
   *   build
   *   api
   *   user
   *   tool
   *   runtime
   */
  readonly sourceType: string;

  /**
   * Identifier of the source where applicable.
   *
   * Examples:
   *   file path
   *   commit SHA
   *   test name
   *   API request ID
   */
  readonly sourceId?: string;

  /**
   * Human-readable description of what was observed.
   */
  readonly description: string;

  readonly truthState: TruthState;

  readonly observedAt: string;

  /**
   * Optional cryptographic/content identifier.
   *
   * This is an identifier only. It must not be interpreted as proof
   * unless the associated verification procedure actually verifies it.
   */
  readonly contentHash?: string;
}

/**
 * A proposition known or proposed by JARVIS.
 */
export interface JarvisClaim {
  readonly id: string;

  readonly subject: string;
  readonly predicate: string;
  readonly value: unknown;

  readonly truthState: TruthState;

  readonly evidence: readonly EvidenceRef[];

  readonly createdAt: string;
  readonly lastVerifiedAt?: string;

  /**
   * Optional dependency graph references.
   *
   * If a claim depends on another claim becoming stale or invalid,
   * those dependencies can be represented here.
   */
  readonly dependsOn?: readonly string[];

  readonly confidence?: number;
}

/* -------------------------------------------------------------------------- */
/* World Model                                                               */
/* -------------------------------------------------------------------------- */

export interface WorldEntity {
  readonly id: string;

  readonly type: string;

  readonly properties: Readonly<Record<string, unknown>>;

  readonly truthState: TruthState;

  readonly evidence: readonly EvidenceRef[];
}

export interface WorldRelationship {
  readonly id: string;

  readonly sourceEntityId: string;

  readonly relation: string;

  readonly targetEntityId: string;

  readonly truthState: TruthState;

  readonly evidence: readonly EvidenceRef[];
}

export interface WorldState {
  readonly version: number;

  readonly generatedAt: string;

  readonly entities: readonly WorldEntity[];

  readonly relationships: readonly WorldRelationship[];

  readonly claims: readonly JarvisClaim[];
}

/* -------------------------------------------------------------------------- */
/* Objectives / Constraints                                                   */
/* -------------------------------------------------------------------------- */

export interface Objective {
  readonly id: string;

  readonly description: string;

  readonly priority: number;

  readonly successCriteria: readonly SuccessCriterion[];

  readonly createdAt: string;
}

export interface Constraint {
  readonly id: string;

  readonly description: string;

  readonly type:
    | "SECURITY"
    | "AUTHORIZATION"
    | "RESOURCE"
    | "COMPATIBILITY"
    | "SAFETY"
    | "PERFORMANCE"
    | "DATA_INTEGRITY"
    | "REVERSIBILITY"
    | "USER_DEFINED"
    | "SYSTEM";

  readonly mandatory: boolean;
}

export interface SuccessCriterion {
  readonly id: string;

  readonly description: string;

  /**
   * A criterion must ultimately be connected to observable evidence
   * before the overall objective can be marked VERIFIED.
   */
  readonly verificationRequired: boolean;
}

/* -------------------------------------------------------------------------- */
/* Capabilities                                                               */
/* -------------------------------------------------------------------------- */

export type CapabilityRisk =
  | "READ_ONLY"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type SideEffect =
  | "NONE"
  | "FILESYSTEM"
  | "PROCESS"
  | "NETWORK"
  | "REPOSITORY"
  | "DATABASE"
  | "DEPLOYMENT"
  | "EXTERNAL_SYSTEM";

export interface CapabilityDescriptor {
  readonly id: string;

  readonly version: string;

  readonly description: string;

  readonly inputSchema: string;

  readonly outputSchema: string;

  readonly risk: CapabilityRisk;

  readonly sideEffects: readonly SideEffect[];

  /**
   * Whether identical inputs and state are expected to produce
   * deterministic results.
   */
  readonly deterministic: boolean;

  /**
   * Whether the capability provides a safe rollback mechanism.
   */
  readonly reversible: boolean;

  /**
   * Permissions required before execution.
   */
  readonly requiredPermissions: readonly string[];

  /**
   * How successful execution can be verified.
   */
  readonly verificationMethods: readonly string[];
}

/* -------------------------------------------------------------------------- */
/* Execution Intent                                                           */
/* -------------------------------------------------------------------------- */

/**
 * This is the central JARVIS intermediate representation.
 *
 * JARVIS reasoning must eventually compile into an ExecutionIntent
 * before consequential capabilities are invoked.
 *
 * The LLM/reasoning system does NOT directly receive unrestricted
 * execution authority.
 */
export interface ExecutionIntent {
  readonly id: string;

  readonly createdAt: string;

  readonly objectiveId: string;

  readonly description: string;

  readonly capabilityId: string;

  readonly capabilityVersion: string;

  readonly input: unknown;

  readonly preconditions: readonly Precondition[];

  readonly expectedEffects: readonly ExpectedEffect[];

  readonly constraints: readonly Constraint[];

  readonly authorization: AuthorizationRequirement;

  readonly resourceBudget: ResourceBudget;

  readonly verificationPlan: readonly VerificationRequirement[];

  readonly rollbackPlan?: RollbackPlan;

  /**
   * Intent provenance.
   *
   * This identifies which reasoning/plan generated the executable intent.
   */
  readonly generatedFrom?: string;
}

export interface Precondition {
  readonly id: string;

  readonly description: string;

  readonly requiredTruthState?: TruthState;

  readonly evidence?: readonly EvidenceRef[];
}

export interface ExpectedEffect {
  readonly id: string;

  readonly description: string;

  /**
   * Expected state transition.
   *
   * This is descriptive until verified against actual observed state.
   */
  readonly before?: unknown;

  readonly after?: unknown;
}

/* -------------------------------------------------------------------------- */
/* Authorization                                                              */
/* -------------------------------------------------------------------------- */

export type AuthorityRole =
  | "PUBLIC"
  | "DEVELOPER"
  | "FOUNDER"
  | "SYSTEM";

export interface AuthorizationRequirement {
  readonly requiredRole: AuthorityRole;

  readonly capabilityId: string;

  readonly reason: string;

  readonly approvalRequired: boolean;

  readonly humanApprovalRequired: boolean;
}

/**
 * Sentinel produces an authorization decision.
 *
 * This contract does not specify the cryptographic mechanism.
 * The implementation must use only genuine cryptographic primitives
 * that are actually present and verified in the repository.
 */
export interface AuthorizationDecision {
  readonly decision:
    | "AUTHORIZED"
    | "DENIED"
    | "REQUIRES_HUMAN"
    | "UNKNOWN";

  readonly intentId: string;

  readonly authorizedRole?: AuthorityRole;

  readonly reason: string;

  readonly evaluatedAt: string;

  readonly evidence: readonly EvidenceRef[];
}

/* -------------------------------------------------------------------------- */
/* Resource Budget                                                            */
/* -------------------------------------------------------------------------- */

export interface ResourceBudget {
  /**
   * These are limits, not fabricated measurements.
   *
   * An absent value means no explicit budget was supplied.
   */
  readonly maxWallTimeMs?: number;

  readonly maxCpuTimeMs?: number;

  readonly maxMemoryBytes?: number;

  readonly maxNetworkBytes?: number;

  readonly maxOperations?: number;
}

/**
 * Actual resource observations are represented separately from budgets.
 */
export interface ResourceObservation {
  readonly wallTimeMs?: number;

  readonly cpuTimeMs?: number;

  readonly memoryBytes?: number;

  readonly networkBytes?: number;

  readonly operations?: number;

  readonly measurementState:
    | "MEASURED"
    | "PARTIAL"
    | "UNMEASURED";
}

/* -------------------------------------------------------------------------- */
/* Consequence Analysis                                                       */
/* -------------------------------------------------------------------------- */

export interface ConsequenceAssessment {
  readonly intentId: string;

  readonly status:
    | "ASSESSED"
    | "PARTIAL"
    | "UNKNOWN"
    | "UNIMPLEMENTED";

  readonly affectedEntities: readonly string[];

  readonly affectedCapabilities: readonly string[];

  readonly securityImplications: readonly string[];

  readonly reversibility:
    | "REVERSIBLE"
    | "PARTIALLY_REVERSIBLE"
    | "IRREVERSIBLE"
    | "UNKNOWN";

  readonly resourceObservation?: ResourceObservation;

  readonly requiredAuthorization: AuthorizationRequirement;

  readonly evidence: readonly EvidenceRef[];
}

/* -------------------------------------------------------------------------- */
/* Verification                                                               */
/* -------------------------------------------------------------------------- */

export type VerificationStatus =
  | "VERIFIED"
  | "FAILED"
  | "PARTIAL"
  | "UNKNOWN"
  | "UNVERIFIED";

export interface VerificationRequirement {
  readonly id: string;

  readonly description: string;

  readonly method: string;

  readonly mandatory: boolean;
}

export interface VerificationResult {
  readonly id: string;

  readonly intentId: string;

  readonly status: VerificationStatus;

  readonly description: string;

  readonly expected: unknown;

  readonly observed: unknown;

  readonly discrepancies: readonly Discrepancy[];

  readonly evidence: readonly EvidenceRef[];

  readonly resourceObservation?: ResourceObservation;

  readonly verifiedAt: string;
}

export interface Discrepancy {
  readonly description: string;

  readonly severity:
    | "INFO"
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";
}

/* -------------------------------------------------------------------------- */
/* Rollback                                                                   */
/* -------------------------------------------------------------------------- */

export interface RollbackPlan {
  readonly available: boolean;

  readonly description: string;

  readonly requiredCapability?: string;

  readonly verificationRequired: boolean;
}

/* -------------------------------------------------------------------------- */
/* Execution Result                                                           */
/* -------------------------------------------------------------------------- */

export type ExecutionStatus =
  | "COMPLETED"
  | "FAILED"
  | "PARTIAL"
  | "DENIED"
  | "BLOCKED"
  | "CANCELLED"
  | "UNKNOWN";

export interface ExecutionResult<T = unknown> {
  readonly id: string;

  readonly intentId: string;

  readonly status: ExecutionStatus;

  readonly output?: T;

  readonly error?: ExecutionError;

  readonly observedEffects: readonly ExpectedEffect[];

  readonly evidence: readonly EvidenceRef[];

  readonly resourceObservation?: ResourceObservation;

  readonly startedAt: string;

  readonly completedAt: string;
}

export interface ExecutionError {
  readonly category:
    | "AUTHORIZATION"
    | "VALIDATION"
    | "CAPABILITY"
    | "ENVIRONMENT"
    | "DEPENDENCY"
    | "RESOURCE"
    | "EXECUTION"
    | "VERIFICATION"
    | "UNKNOWN";

  readonly message: string;

  /**
   * Do not place secrets, credentials, tokens, or raw sensitive inputs here.
   */
  readonly safeDetails?: Readonly<Record<string, unknown>>;
}

/* -------------------------------------------------------------------------- */
/* Failure Diagnosis                                                          */
/* -------------------------------------------------------------------------- */

export type FailureCategory =
  | "REASONING_FAILURE"
  | "DATA_FAILURE"
  | "ASSUMPTION_FAILURE"
  | "TOOL_FAILURE"
  | "AUTHORIZATION_FAILURE"
  | "ENVIRONMENT_FAILURE"
  | "CODE_FAILURE"
  | "TEST_FAILURE"
  | "DEPENDENCY_FAILURE"
  | "RESOURCE_FAILURE"
  | "EXTERNAL_SERVICE_FAILURE"
  | "SPECIFICATION_FAILURE"
  | "VERIFICATION_FAILURE"
  | "UNKNOWN_FAILURE";

export interface FailureDiagnosis {
  readonly category: FailureCategory;

  readonly description: string;

  readonly evidence: readonly EvidenceRef[];

  readonly confidence: number;

  readonly recoveryOptions: readonly RecoveryOption[];
}

export interface RecoveryOption {
  readonly description: string;

  readonly reversible: boolean;

  readonly requiredAuthorization: AuthorizationRequirement;

  readonly expectedRisk: CapabilityRisk;
}

/* -------------------------------------------------------------------------- */
/* Execution Trace                                                            */
/* -------------------------------------------------------------------------- */

export type TraceStage =
  | "REQUEST"
  | "UNDERSTAND"
  | "INSPECT"
  | "REASON"
  | "PLAN"
  | "CONSEQUENCE"
  | "AUTHORIZE"
  | "EXECUTE"
  | "OBSERVE"
  | "VERIFY"
  | "REPORT";

export interface ExecutionTraceEvent {
  readonly id: string;

  readonly executionId: string;

  readonly stage: TraceStage;

  readonly timestamp: string;

  readonly description: string;

  readonly truthState: TruthState;

  readonly evidence: readonly EvidenceRef[];

  readonly capabilityId?: string;

  readonly intentId?: string;

  readonly authorizationDecision?: AuthorizationDecision;

  readonly verificationResult?: VerificationResult;
}

/* -------------------------------------------------------------------------- */
/* JARVIS Response                                                            */
/* -------------------------------------------------------------------------- */

export interface JarvisQueryRequest {
  query: string;
  context?: AuthorityRole;
  sessionToken?: string;
}

export interface JarvisResponse {
  readonly requestId: string;

  readonly status:
    | "COMPLETED"
    | "PARTIAL"
    | "REFUSED"
    | "FAILED"
    | "UNKNOWN";

  readonly answer: unknown;

  readonly truthState: TruthState;

  readonly trace: readonly ExecutionTraceEvent[];

  readonly evidence: readonly EvidenceRef[];

  readonly verification?: VerificationResult;

  readonly failure?: FailureDiagnosis;

  readonly cognitionCost: {
    cpuMs: number;
    memoryBytes?: number;
    cryptoOpsCount: number;
    economicCost: "UNMEASURED";
  };
}

/* -------------------------------------------------------------------------- */
/* Utility Constructors                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Creates a bounded confidence value.
 *
 * This is intentionally the only confidence normalization helper in this
 * contract layer. Confidence is not allowed to replace evidence.
 */
export function normalizeConfidence(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (value <= 0) {
    return 0;
  }

  if (value >= 1) {
    return 1;
  }

  return value;
}

/**
 * Determines whether a truth state can support a VERIFIED claim.
 *
 * Only direct verification is accepted.
 */
export function isVerifiedTruthState(
  truthState: TruthState
): boolean {
  return truthState === "VERIFIED";
}

/**
 * Determines whether execution evidence is sufficient to make a
 * positive verification claim.
 *
 * This deliberately requires an explicit verification result.
 */
export function isVerifiedResult(
  result: VerificationResult | undefined
): boolean {
  return result?.status === "VERIFIED";
}

/**
 * Prevents callers from treating unimplemented or unknown functionality
 * as successful execution.
 */
export function isExecutableTruthState(
  truthState: TruthState
): boolean {
  return (
    truthState !== "UNKNOWN" &&
    truthState !== "UNVERIFIED" &&
    truthState !== "UNIMPLEMENTED" &&
    truthState !== "FAILED"
  );
}
