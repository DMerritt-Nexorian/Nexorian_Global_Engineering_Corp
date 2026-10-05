/**
 * JARVIS PLAN ENGINE
 *
 * Converts an intended operation into a deterministic, inspectable execution plan.
 *
 * IMPORTANT:
 * - This module DOES NOT execute actions.
 * - This module DOES NOT grant authorization.
 * - This module DOES NOT bypass Sentinel.
 * - This module DOES NOT call an LLM.
 * - This module DOES NOT fabricate evidence.
 *
 * Architecture:
 *
 *   INTENT
 *      |
 *      v
 *   PLAN
 *      |
 *      v
 *   VALIDATION
 *      |
 *      v
 *   SENTINEL AUTHORIZATION
 *      |
 *      v
 *   EXECUTION FABRIC
 *      |
 *      v
 *   EVIDENCE
 *
 * The plan is an auditable intermediate representation between cognition
 * and execution.
 */
import { createHash } from "node:crypto";

/* -------------------------------------------------------------------------- */
/* Primitive types                                                             */
/* -------------------------------------------------------------------------- */
export type PlanTruthState =
  | "VERIFIED"
  | "OBSERVED"
  | "UNKNOWN"
  | "UNIMPLEMENTED";

export type PlanRisk =
  | "NONE"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type StepKind =
  | "READ"
  | "ANALYZE"
  | "COMPUTE"
  | "PROPOSE"
  | "WRITE"
  | "EXECUTE"
  | "VERIFY"
  | "ROLLBACK";

export type AuthorizationLevel =
  | "PUBLIC"
  | "DEVELOPER"
  | "FOUNDER";

export type EvidenceRequirement =
  | "NONE"
  | "OBSERVATION"
  | "MEASUREMENT"
  | "TEST"
  | "ARTIFACT"
  | "HUMAN_APPROVAL";

/* -------------------------------------------------------------------------- */
/* Resource budgets                                                           */
/* -------------------------------------------------------------------------- */
export interface ResourceBudget {
  /**
   * Maximum number of steps this plan may contain.
   */
  maxSteps: number;
  /**
   * Maximum execution time requested by the plan.
   *
   * This is a declared budget only.
   * An executor must enforce the actual timeout.
   */
  maxExecutionMs: number;
  /**
   * Maximum number of bytes the operation may read.
   */
  maxReadBytes: number;
  /**
   * Maximum number of bytes the operation may write.
   */
  maxWriteBytes: number;
  /**
   * Maximum number of external/tool calls.
   */
  maxToolCalls: number;
}

/* -------------------------------------------------------------------------- */
/* Preconditions / postconditions                                             */
/* -------------------------------------------------------------------------- */
export interface PlanCondition {
  id: string;
  description: string;
  /**
   * The truth status of the condition.
   *
   * JARVIS must not silently convert UNKNOWN into VERIFIED.
   */
  truthState: PlanTruthState;
  /**
   * Optional evidence reference.
   *
   * This is an identifier supplied by a real evidence-producing subsystem.
   * It is NOT evidence by itself.
   */
  evidenceRef?: string;
}

/* -------------------------------------------------------------------------- */
/* Capability declaration                                                      */
/* -------------------------------------------------------------------------- */
export interface RequiredCapability {
  /**
   * Stable capability identifier.
   *
   * Examples:
   *   "filesystem.read"
   *   "repository.inspect"
   *   "compiler.run"
   *
   * The capability registry, not this file, determines whether the
   * capability actually exists.
   */
  id: string;
  /**
   * Minimum authorization level required.
   */
  authorization: AuthorizationLevel;
  /**
   * Whether Sentinel must explicitly approve the capability before use.
   */
  sentinelApprovalRequired: boolean;
}

/* -------------------------------------------------------------------------- */
/* Evidence                                                                   */
/* -------------------------------------------------------------------------- */
export interface EvidenceRequirementSpec {
  type: EvidenceRequirement;
  description: string;
  /**
   * If true, the step must not be considered successful without this
   * evidence being produced by the actual executor/verifier.
   */
  required: boolean;
}

/* -------------------------------------------------------------------------- */
/* Plan step                                                                  */
/* -------------------------------------------------------------------------- */
export interface JarvisPlanStep {
  id: string;
  kind: StepKind;
  description: string;
  /**
   * IDs of steps that must successfully complete before this step can run.
   */
  dependsOn: string[];
  /**
   * Capabilities required by this step.
   */
  capabilities: RequiredCapability[];
  /**
   * Preconditions that must be established before execution.
   */
  preconditions: PlanCondition[];
  /**
   * Conditions expected after successful execution.
   */
  postconditions: PlanCondition[];
  /**
   * Evidence expected from the real execution/verifier layer.
   */
  evidence: EvidenceRequirementSpec[];
  /**
   * Risk classification.
   *
   * Classification alone does not authorize anything.
   */
  risk: PlanRisk;
  /**
   * If true, execution must stop unless an actual rollback mechanism exists.
   */
  requiresRollback: boolean;
  /**
   * Whether this step can modify external state.
   */
  mutatesState: boolean;
}

/* -------------------------------------------------------------------------- */
/* Complete plan                                                              */
/* -------------------------------------------------------------------------- */
export interface JarvisPlan {
  /**
   * Stable schema version.
   */
  schemaVersion: "1.0";
  /**
   * Unique plan identifier.
   *
   * This identifies the plan instance and is not the integrity hash.
   */
  planId: string;
  /**
   * User/system objective from which the plan was derived.
   */
  objective: string;
  /**
   * Truth status of the objective itself.
   */
  objectiveTruthState: PlanTruthState;
  /**
   * Ordered execution steps.
   */
  steps: JarvisPlanStep[];
  /**
   * Required overall authorization level.
   */
  authorization: AuthorizationLevel;
  /**
   * Whether Sentinel approval is required.
   */
  sentinelApprovalRequired: boolean;
  /**
   * Resource constraints.
   */
  budget: ResourceBudget;
  /**
   * Plan creation timestamp.
   *
   * This value is metadata and is intentionally excluded from the
   * deterministic plan fingerprint.
   */
  createdAt: string;
  /**
   * Deterministic fingerprint of the canonical plan representation.
   */
  fingerprint?: string;
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */
export interface PlanValidationIssue {
  code:
    | "EMPTY_OBJECTIVE"
    | "NO_STEPS"
    | "TOO_MANY_STEPS"
    | "DUPLICATE_STEP_ID"
    | "UNKNOWN_DEPENDENCY"
    | "SELF_DEPENDENCY"
    | "DEPENDENCY_CYCLE"
    | "EMPTY_DESCRIPTION"
    | "INVALID_BUDGET"
    | "MUTATION_WITHOUT_AUTH"
    | "MUTATION_WITHOUT_SENTINEL"
    | "ROLLBACK_WITHOUT_MUTATION"
    | "UNKNOWN_REQUIRED_PRECONDITION"
    | "INVALID_STEP_CAPABILITY";
  message: string;
  stepId?: string;
}

export interface PlanValidationResult {
  valid: boolean;
  issues: PlanValidationIssue[];
  /**
   * Deterministic fingerprint is returned even for an invalid plan.
   *
   * This allows an external caller to identify exactly which plan was
   * evaluated without implying that the plan is executable.
   */
  fingerprint: string;
}

/* -------------------------------------------------------------------------- */
/* Canonicalization                                                            */
/* -------------------------------------------------------------------------- */
/**
 * Recursively canonicalize JSON-compatible data.
 *
 * Object keys are sorted so equivalent objects produce identical serialized
 * representations regardless of insertion order.
 */
function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (value !== null && typeof value === "object") {
    const object = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(object).sort()) {
      sorted[key] = canonicalize(object[key]);
    }
    return sorted;
  }
  return value;
}

/**
 * Build the exact representation used for fingerprinting.
 *
 * Dynamic metadata such as createdAt and the fingerprint itself are excluded.
 */
function canonicalPlanRepresentation(
  plan: JarvisPlan,
): Record<string, unknown> {
  return canonicalize({
    schemaVersion: plan.schemaVersion,
    planId: plan.planId,
    objective: plan.objective,
    objectiveTruthState: plan.objectiveTruthState,
    steps: plan.steps,
    authorization: plan.authorization,
    sentinelApprovalRequired: plan.sentinelApprovalRequired,
    budget: plan.budget,
  }) as Record<string, unknown>;
}

/**
 * Generate a deterministic SHA-256 fingerprint.
 *
 * This is an integrity/fingerprint mechanism.
 * It is NOT an authorization mechanism and does not prove execution.
 */
export function fingerprintPlan(plan: JarvisPlan): string {
  const canonical = JSON.stringify(canonicalPlanRepresentation(plan));
  return createHash("sha256")
    .update(canonical, "utf8")
    .digest("hex");
}

/* -------------------------------------------------------------------------- */
/* Dependency graph                                                            */
/* -------------------------------------------------------------------------- */
function containsDependencyCycle(steps: JarvisPlanStep[]): boolean {
  const graph = new Map<string, string[]>();
  for (const step of steps) {
    graph.set(step.id, step.dependsOn);
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  function visit(id: string): boolean {
    if (visiting.has(id)) {
      return true;
    }
    if (visited.has(id)) {
      return false;
    }
    visiting.add(id);
    const dependencies = graph.get(id) ?? [];
    for (const dependency of dependencies) {
      if (visit(dependency)) {
        return true;
      }
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  }
  for (const step of steps) {
    if (visit(step.id)) {
      return true;
    }
  }
  return false;
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */
export function validateJarvisPlan(
  plan: JarvisPlan,
): PlanValidationResult {
  const issues: PlanValidationIssue[] = [];
  const fingerprint = fingerprintPlan(plan);
  if (plan.objective.trim().length === 0) {
    issues.push({
      code: "EMPTY_OBJECTIVE",
      message: "Plan objective cannot be empty.",
    });
  }
  if (plan.steps.length === 0) {
    issues.push({
      code: "NO_STEPS",
      message: "A plan must contain at least one step.",
    });
  }
  if (
    !Number.isInteger(plan.budget.maxSteps) ||
    plan.budget.maxSteps <= 0 ||
    !Number.isInteger(plan.budget.maxExecutionMs) ||
    plan.budget.maxExecutionMs <= 0 ||
    !Number.isInteger(plan.budget.maxReadBytes) ||
    plan.budget.maxReadBytes < 0 ||
    !Number.isInteger(plan.budget.maxWriteBytes) ||
    plan.budget.maxWriteBytes < 0 ||
    !Number.isInteger(plan.budget.maxToolCalls) ||
    plan.budget.maxToolCalls < 0
  ) {
    issues.push({
      code: "INVALID_BUDGET",
      message: "Plan contains an invalid resource budget.",
    });
  }
  if (plan.steps.length > plan.budget.maxSteps) {
    issues.push({
      code: "TOO_MANY_STEPS",
      message:
        `Plan contains ${plan.steps.length} steps but budget allows only ` +
        `${plan.budget.maxSteps}.`,
    });
  }
  const stepIds = new Set<string>();
  for (const step of plan.steps) {
    if (step.id.trim().length === 0) {
      issues.push({
        code: "DUPLICATE_STEP_ID",
        message: "Every plan step must have a non-empty unique ID.",
      });
      continue;
    }
    if (stepIds.has(step.id)) {
      issues.push({
        code: "DUPLICATE_STEP_ID",
        message: `Duplicate step ID: ${step.id}.`,
        stepId: step.id,
      });
    }
    stepIds.add(step.id);
    if (step.description.trim().length === 0) {
      issues.push({
        code: "EMPTY_DESCRIPTION",
        message: "Plan step description cannot be empty.",
        stepId: step.id,
      });
    }
    for (const dependency of step.dependsOn) {
      if (dependency === step.id) {
        issues.push({
          code: "SELF_DEPENDENCY",
          message: `Step ${step.id} depends on itself.`,
          stepId: step.id,
        });
      } else if (!plan.steps.some((candidate) => candidate.id === dependency)) {
        issues.push({
          code: "UNKNOWN_DEPENDENCY",
          message:
            `Step ${step.id} references unknown dependency ${dependency}.`,
          stepId: step.id,
        });
      }
    }
    for (const capability of step.capabilities) {
      if (capability.id.trim().length === 0) {
        issues.push({
          code: "INVALID_STEP_CAPABILITY",
          message: "A capability ID cannot be empty.",
          stepId: step.id,
        });
      }
    }
    if (step.mutatesState) {
      if (plan.authorization === "PUBLIC") {
        issues.push({
          code: "MUTATION_WITHOUT_AUTH",
          message:
            `Mutating step ${step.id} cannot be authorized at PUBLIC level.`,
          stepId: step.id,
        });
      }
      if (!plan.sentinelApprovalRequired) {
        issues.push({
          code: "MUTATION_WITHOUT_SENTINEL",
          message:
            `Mutating step ${step.id} requires Sentinel approval.`,
          stepId: step.id,
        });
      }
      if (!step.capabilities.some((capability) => capability.sentinelApprovalRequired)) {
        issues.push({
          code: "MUTATION_WITHOUT_SENTINEL",
          message:
            `Mutating step ${step.id} declares no Sentinel-approved capability.`,
          stepId: step.id,
        });
      }
    }
    if (step.requiresRollback && !step.mutatesState) {
      issues.push({
        code: "ROLLBACK_WITHOUT_MUTATION",
        message:
          `Step ${step.id} requires rollback but does not declare state mutation.`,
        stepId: step.id,
      });
    }
    for (const condition of step.preconditions) {
      if (
        condition.truthState === "UNKNOWN" &&
        condition.description.trim().length > 0
      ) {
        issues.push({
          code: "UNKNOWN_REQUIRED_PRECONDITION",
          message:
            `Step ${step.id} has an UNKNOWN precondition: ` +
            `${condition.description}`,
          stepId: step.id,
        });
      }
    }
  }
  if (containsDependencyCycle(plan.steps)) {
    issues.push({
      code: "DEPENDENCY_CYCLE",
      message: "Plan dependency graph contains a cycle.",
    });
  }
  return {
    valid: issues.length === 0,
    issues,
    fingerprint,
  };
}

/* -------------------------------------------------------------------------- */
/* Plan construction                                                           */
/* -------------------------------------------------------------------------- */
export interface CreatePlanInput {
  planId: string;
  objective: string;
  objectiveTruthState?: PlanTruthState;
  steps: JarvisPlanStep[];
  authorization: AuthorizationLevel;
  sentinelApprovalRequired: boolean;
  budget: ResourceBudget;
}

/**
 * Construct and fingerprint a plan.
 *
 * This function intentionally does not throw for ordinary validation failure.
 * Callers can construct the plan, validate it, and decide what to do next.
 */
export function createJarvisPlan(input: CreatePlanInput): JarvisPlan {
  const plan: JarvisPlan = {
    schemaVersion: "1.0",
    planId: input.planId,
    objective: input.objective,
    objectiveTruthState:
      input.objectiveTruthState ?? "UNKNOWN",
    steps: input.steps,
    authorization: input.authorization,
    sentinelApprovalRequired:
      input.sentinelApprovalRequired,
    budget: input.budget,
    createdAt: new Date().toISOString(),
  };
  plan.fingerprint = fingerprintPlan(plan);
  return plan;
}

/* -------------------------------------------------------------------------- */
/* Deterministic execution ordering                                            */
/* -------------------------------------------------------------------------- */
/**
 * Return steps in dependency-safe topological order.
 *
 * This does not execute the steps.
 */
export function getExecutionOrder(
  plan: JarvisPlan,
): JarvisPlanStep[] {
  const validation = validateJarvisPlan(plan);
  if (!validation.valid) {
    throw new Error(
      `Cannot determine execution order for invalid plan: ` +
        validation.issues.map((issue) => issue.message).join("; "),
    );
  }
  const remaining = new Map(
    plan.steps.map((step) => [step.id, step]),
  );
  const completed = new Set<string>();
  const ordered: JarvisPlanStep[] = [];
  while (remaining.size > 0) {
    let progress = false;
    for (const [id, step] of remaining) {
      const dependenciesSatisfied = step.dependsOn.every((dependency) =>
        completed.has(dependency),
      );
      if (!dependenciesSatisfied) {
        continue;
      }
      ordered.push(step);
      completed.add(id);
      remaining.delete(id);
      progress = true;
    }
    if (!progress) {
      throw new Error(
        "Unable to produce deterministic execution order.",
      );
    }
  }
  return ordered;
}

/* -------------------------------------------------------------------------- */
/* Sentinel handoff                                                            */
/* -------------------------------------------------------------------------- */
/**
 * Produce the minimum deterministic authorization envelope required by
 * Sentinel.
 *
 * This function DOES NOT authorize the plan.
 *
 * Sentinel remains the authority that decides whether execution may proceed.
 */
export interface SentinelPlanEnvelope {
  planId: string;
  planFingerprint: string;
  authorization: AuthorizationLevel;
  sentinelApprovalRequired: boolean;
  mutatingStepIds: string[];
  requiredCapabilities: string[];
}

export function createSentinelPlanEnvelope(
  plan: JarvisPlan,
): SentinelPlanEnvelope {
  const fingerprint = fingerprintPlan(plan);
  const mutatingStepIds = plan.steps
    .filter((step) => step.mutatesState)
    .map((step) => step.id);
  const requiredCapabilities = Array.from(
    new Set(
      plan.steps.flatMap((step) =>
        step.capabilities.map((capability) => capability.id),
      ),
    ),
  ).sort();
  return {
    planId: plan.planId,
    planFingerprint: fingerprint,
    authorization: plan.authorization,
    sentinelApprovalRequired:
      plan.sentinelApprovalRequired,
    mutatingStepIds,
    requiredCapabilities,
  };
}
