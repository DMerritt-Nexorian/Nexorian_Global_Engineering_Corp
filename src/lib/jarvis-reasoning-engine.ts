/**
 * JARVIS Reasoning & Decision Engine
 * ====================================
 *
 * Nexorian Corporation
 *
 * Purpose:
 *   Transform objectives, constraints, world-state facts, evidence
 *   assessments, alternatives, and dependencies into structured,
 *   auditable reasoning results.
 *
 * Core principles:
 *
 *   PROOF BEFORE TRUST
 *   RULES BEFORE REASONING
 *   DETERMINISM BEFORE AUTONOMY
 *
 * This module performs structured reasoning.
 *
 * It does NOT:
 *   - execute tools
 *   - modify files
 *   - modify Git
 *   - access credentials
 *   - call external services
 *   - call an LLM
 *   - authorize consequential actions
 *   - claim that an inference is verified
 *
 * The output of this engine is a reasoning artifact.
 *
 * It is NOT an execution authorization.
 *
 * Sentinel-1 remains the enforcement boundary.
 */

import {
  Constraint,
  EvidenceRef,
  JarvisClaim,
  Objective,
  TruthState,
} from "./jarvis-contracts";

import {
  JarvisWorldModel,
  WorldFact,
} from "./jarvis-world-model";

import {
  JarvisEvidenceEngine,
  EvidenceStrength,
} from "./jarvis-evidence-engine";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ReasoningMode =
  | "DECOMPOSITION"
  | "COMPARISON"
  | "DIAGNOSIS"
  | "CAUSAL"
  | "PLANNING"
  | "VALIDATION"
  | "INVESTIGATION"
  | "DECISION";

export type ReasoningStatus =
  | "COMPLETE"
  | "PARTIAL"
  | "BLOCKED"
  | "CONFLICTED"
  | "INSUFFICIENT_EVIDENCE";

export interface ReasoningPremise {
  readonly id: string;
  readonly statement: string;
  readonly truthState: TruthState;
  readonly confidence: number;
  readonly evidence: readonly EvidenceRef[];
  readonly sourceFactIds: readonly string[];
}

export interface ReasoningAssumption {
  readonly id: string;
  readonly statement: string;
  readonly explicit: boolean;
  readonly verified: boolean;
  readonly consequenceIfFalse: string;
}

export interface ReasoningStep {
  readonly id: string;
  readonly description: string;
  readonly premises: readonly string[];
  readonly conclusion: string;
  readonly truthState: TruthState;
  readonly confidence: number;
  readonly evidence: readonly EvidenceRef[];
}

export interface ReasoningAlternative {
  readonly id: string;
  readonly description: string;
  readonly advantages: readonly string[];
  readonly disadvantages: readonly string[];
  readonly dependencies: readonly string[];
  readonly risks: readonly string[];
  readonly evidence: readonly EvidenceRef[];
  readonly truthState: TruthState;
}

export interface ReasoningDecision {
  readonly selectedAlternativeId?: string;
  readonly rationale: readonly string[];
  readonly rejectedAlternativeIds: readonly string[];
  readonly unresolvedQuestions: readonly string[];
}

export interface ReasoningResult {
  readonly id: string;
  readonly objectiveId?: string;
  readonly mode: ReasoningMode;
  readonly status: ReasoningStatus;

  readonly premises: readonly ReasoningPremise[];
  readonly assumptions: readonly ReasoningAssumption[];
  readonly steps: readonly ReasoningStep[];
  readonly alternatives: readonly ReasoningAlternative[];

  readonly decision?: ReasoningDecision;

  readonly conclusion: string;

  readonly truthState: TruthState;
  readonly confidence: number;

  readonly evidence: readonly EvidenceRef[];

  readonly blockers: readonly string[];
  readonly uncertainties: readonly string[];
  readonly contradictions: readonly string[];

  readonly requiresVerification: boolean;
  readonly executionAuthorizationRequired: boolean;
}

export interface ReasoningRequest {
  readonly id: string;
  readonly mode: ReasoningMode;
  readonly objective?: Objective;
  readonly constraints?: readonly Constraint[];
  readonly claims?: readonly JarvisClaim[];
  readonly question: string;
  readonly alternatives?: readonly ReasoningAlternative[];
  readonly requiredEvidenceStrength?: EvidenceStrength;
  readonly allowInference?: boolean;
}

export interface ComparisonScore {
  readonly alternativeId: string;
  readonly score: number;
  readonly reasons: readonly string[];
}

export interface CausalCandidate {
  readonly causeId: string;
  readonly description: string;
  readonly supportingFactIds: readonly string[];
  readonly contradictingFactIds: readonly string[];
  readonly confidence: number;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function clamp(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(1, value),
  );
}

function truthRank(
  state: TruthState,
): number {
  switch (state) {
    case "VERIFIED":
      return 7;

    case "DERIVED":
      return 6;

    case "OBSERVED":
      return 5;

    case "INFERRED":
      return 4;

    case "UNVERIFIED":
      return 3;

    case "EXPERIMENTAL":
      return 2;

    case "HYPOTHESIZED":
      return 1;

    case "UNKNOWN":
      return 0;

    case "UNIMPLEMENTED":
      return 0;

    case "STALE":
      return 1;

    case "CONFLICTING":
      return -1;

    case "FAILED":
      return -2;
  }
}

function strongestTruthState(
  states: readonly TruthState[],
): TruthState {
  if (states.length === 0) {
    return "UNKNOWN";
  }

  return states.reduce<TruthState>(
    (best, current) =>
      truthRank(current) > truthRank(best)
        ? current
        : best,
    "UNKNOWN",
  );
}

function uniqueStrings(
  values: readonly string[],
): string[] {
  return Array.from(
    new Set(values.filter(Boolean)),
  );
}

function collectEvidence(
  premises: readonly ReasoningPremise[],
): EvidenceRef[] {
  const result = new Map<string, EvidenceRef>();

  for (const premise of premises) {
    for (const evidence of premise.evidence) {
      const key =
        evidence.id ??
        JSON.stringify(evidence);

      if (!result.has(key)) {
        result.set(key, evidence);
      }
    }
  }

  return Array.from(result.values());
}

/* -------------------------------------------------------------------------- */
/* Reasoning Engine                                                           */
/* -------------------------------------------------------------------------- */

export class JarvisReasoningEngine {
  public constructor(
    private readonly worldModel: JarvisWorldModel,
    private readonly evidenceEngine: JarvisEvidenceEngine,
  ) {}

  /* ------------------------------------------------------------------------ */
  /* Main reasoning entry point                                               */
  /* ------------------------------------------------------------------------ */

  public reason(
    request: ReasoningRequest,
  ): ReasoningResult {
    const premises: ReasoningPremise[] = [];
    const assumptions: ReasoningAssumption[] = [];
    const steps: ReasoningStep[] = [];

    const blockers: string[] = [];
    const uncertainties: string[] = [];
    const contradictions: string[] = [];

    /*
     * Convert explicit claims into evaluated premises.
     */
    for (const claim of request.claims ?? []) {
      const assessment =
        this.evidenceEngine.evaluateClaim({
          claim,
        });

      premises.push({
        id: `premise:${claim.id}`,
        statement:
          `${claim.subject}.${claim.predicate} = ${JSON.stringify(
            claim.value,
          )}`,
        truthState:
          assessment.truthState,
        confidence:
          assessment.confidence,
        evidence:
          assessment.supportingEvidence,
        sourceFactIds:
          assessment.contradictingFactIds,
      });

      if (
        assessment.assessment ===
        "CONTRADICTED"
      ) {
        contradictions.push(
          `Claim ${claim.id} is contradicted by existing world-model facts.`,
        );
      }

      if (
        assessment.assessment ===
        "UNKNOWN"
      ) {
        uncertainties.push(
          `Claim ${claim.id} is not established by the available evidence.`,
        );
      }

      if (
        assessment.assessment ===
        "PARTIALLY_SUPPORTED"
      ) {
        uncertainties.push(
          `Claim ${claim.id} is only partially supported.`,
        );
      }
    }

    /*
     * Pull relevant world state from the objective.
     */
    if (request.objective) {
      const objectiveFacts =
        this.findObjectiveFacts(
          request.objective,
        );

      for (const fact of objectiveFacts) {
        premises.push({
          id: `fact:${fact.id}`,
          statement:
            `${fact.subjectId}.${fact.attribute} = ${JSON.stringify(
              fact.value,
            )}`,
          truthState:
            fact.truthState,
          confidence:
            fact.evidence.length > 0
              ? 1
              : 0,
          evidence:
            fact.evidence,
          sourceFactIds: [fact.id],
        });
      }
    }

    /*
     * Constraints become explicit reasoning assumptions/conditions.
     */
    for (const constraint of request.constraints ?? []) {
      assumptions.push({
        id: `constraint:${constraint.id}`,
        statement:
          String(constraint.description),
        explicit: true,
        verified: true,
        consequenceIfFalse:
          "The proposed reasoning result may no longer satisfy the stated constraint.",
      });
    }

    /*
     * Explicitly identify unresolved assumptions.
     */
    if (premises.length === 0) {
      uncertainties.push(
        "No factual premises were supplied or discovered.",
      );
    }

    if (
      request.allowInference === false &&
      request.mode !== "VALIDATION"
    ) {
      uncertainties.push(
        "Inference has been disabled for this reasoning request.",
      );
    }

    /*
     * Generate mode-specific reasoning.
     */
    switch (request.mode) {
      case "DECOMPOSITION":
        this.decompose(
          request,
          premises,
          steps,
          uncertainties,
        );
        break;

      case "COMPARISON":
        this.compare(
          request,
          premises,
          steps,
          uncertainties,
        );
        break;

      case "DIAGNOSIS":
        this.diagnose(
          request,
          premises,
          steps,
          uncertainties,
          contradictions,
        );
        break;

      case "CAUSAL":
        this.causalReasoning(
          request,
          premises,
          steps,
          uncertainties,
        );
        break;

      case "PLANNING":
        this.planReasoning(
          request,
          premises,
          steps,
          uncertainties,
        );
        break;

      case "VALIDATION":
        this.validationReasoning(
          request,
          premises,
          steps,
          uncertainties,
          contradictions,
        );
        break;

      case "INVESTIGATION":
        this.investigationReasoning(
          request,
          premises,
          steps,
          uncertainties,
          contradictions,
        );
        break;

      case "DECISION":
        this.decisionReasoning(
          request,
          premises,
          steps,
          uncertainties,
        );
        break;
    }

    /*
     * Determine the epistemic level of the reasoning result.
     *
     * IMPORTANT:
     * Reasoning does not manufacture verification.
     */
    const premiseStates =
      premises.map(
        (premise) => premise.truthState,
      );

    const truthState =
      this.determineConclusionTruthState(
        premiseStates,
        contradictions,
        steps,
        request.allowInference !== false,
      );

    const confidence =
      this.calculateConfidence(
        premises,
        steps,
        contradictions,
      );

    const requiredEvidence =
      request.requiredEvidenceStrength;

    if (requiredEvidence) {
      const sufficient =
        this.evidenceSatisfiesThreshold(
          premises,
          requiredEvidence,
        );

      if (!sufficient) {
        blockers.push(
          `Available evidence does not meet the requested ${requiredEvidence} threshold.`,
        );
      }
    }

    const status =
      this.determineStatus(
        blockers,
        contradictions,
        uncertainties,
        premises,
      );

    const requiresVerification =
      truthState !== "VERIFIED";

    /*
     * Any result that could eventually lead to a consequential action
     * requires the Sentinel authorization boundary.
     */
    const executionAuthorizationRequired =
      request.mode === "PLANNING" ||
      request.mode === "DECISION";

    const conclusion =
      this.buildConclusion(
        request,
        status,
        truthState,
        contradictions,
        uncertainties,
      );

    return {
      id: request.id,
      objectiveId:
        request.objective?.id,

      mode: request.mode,
      status,

      premises,
      assumptions,
      steps,

      alternatives:
        request.alternatives ?? [],

      conclusion,

      truthState,
      confidence,

      evidence:
        collectEvidence(premises),

      blockers:
        uniqueStrings(blockers),

      uncertainties:
        uniqueStrings(uncertainties),

      contradictions:
        uniqueStrings(contradictions),

      requiresVerification,
      executionAuthorizationRequired,
    };
  }

  /* ------------------------------------------------------------------------ */
  /* Objective decomposition                                                  */
  /* ------------------------------------------------------------------------ */

  private decompose(
    request: ReasoningRequest,
    premises: ReasoningPremise[],
    steps: ReasoningStep[],
    uncertainties: string[],
  ): void {
    if (!request.objective) {
      uncertainties.push(
        "Decomposition requires an explicit objective.",
      );
      return;
    }

    const objective =
      request.objective;

    steps.push({
      id: `step:${request.id}:objective`,
      description:
        "Establish the objective that the system is attempting to satisfy.",
      premises:
        premises.map(
          (premise) => premise.id,
        ),
      conclusion:
        String(objective.description),
      truthState: "VERIFIED",
      confidence: 1,
      evidence: [],
    });

    if (
      request.constraints &&
      request.constraints.length > 0
    ) {
      steps.push({
        id: `step:${request.id}:constraints`,
        description:
          "Identify constraints that bound the objective.",
        premises: [],
        conclusion:
          `${request.constraints.length} explicit constraint(s) bound the objective.`,
        truthState: "VERIFIED",
        confidence: 1,
        evidence: [],
      });
    }

    if (
      objective.successCriteria &&
      objective.successCriteria.length > 0
    ) {
      steps.push({
        id: `step:${request.id}:success`,
        description:
          "Identify the conditions that constitute successful completion.",
        premises: [],
        conclusion:
          `${objective.successCriteria.length} success criterion/criteria identified.`,
        truthState: "VERIFIED",
        confidence: 1,
        evidence: [],
      });
    } else {
      uncertainties.push(
        "The objective has no explicit success criteria.",
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Alternative comparison                                                   */
  /* ------------------------------------------------------------------------ */

  private compare(
    request: ReasoningRequest,
    premises: ReasoningPremise[],
    steps: ReasoningStep[],
    uncertainties: string[],
  ): void {
    const alternatives =
      request.alternatives ?? [];

    if (alternatives.length === 0) {
      uncertainties.push(
        "No alternatives were supplied for comparison.",
      );
      return;
    }

    for (const alternative of alternatives) {
      const unresolvedRisks =
        alternative.risks.length;

      const advantages =
        alternative.advantages.length;

      const disadvantages =
        alternative.disadvantages.length;

      const score =
        advantages -
        disadvantages -
        unresolvedRisks;

      steps.push({
        id:
          `step:${request.id}:compare:${alternative.id}`,
        description:
          `Evaluate alternative ${alternative.id}.`,
        premises:
          premises.map(
            (premise) => premise.id,
          ),
        conclusion:
          `Structured comparison score: ${score}.`,
        truthState:
          alternative.truthState,
        confidence:
          alternative.evidence.length > 0
            ? 0.75
            : 0.25,
        evidence:
          alternative.evidence,
      });
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Diagnosis                                                                */
  /* ------------------------------------------------------------------------ */

  private diagnose(
    request: ReasoningRequest,
    premises: ReasoningPremise[],
    steps: ReasoningStep[],
    uncertainties: string[],
    contradictions: string[],
  ): void {
    if (premises.length === 0) {
      uncertainties.push(
        "Diagnosis cannot establish a cause without observations or facts.",
      );
      return;
    }

    for (const premise of premises) {
      steps.push({
        id:
          `step:${request.id}:diagnose:${premise.id}`,
        description:
          "Evaluate whether this premise is relevant to the reported condition.",
        premises: [premise.id],
        conclusion:
          premise.statement,
        truthState:
          premise.truthState,
        confidence:
          premise.confidence,
        evidence:
          premise.evidence,
      });
    }

    if (contradictions.length > 0) {
      uncertainties.push(
        "Contradictory evidence prevents a single definitive diagnosis.",
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Causal reasoning                                                         */
  /* ------------------------------------------------------------------------ */

  private causalReasoning(
    request: ReasoningRequest,
    premises: ReasoningPremise[],
    steps: ReasoningStep[],
    uncertainties: string[],
  ): void {
    if (premises.length < 2) {
      uncertainties.push(
        "Causal reasoning requires multiple premises or observations.",
      );
      return;
    }

    for (
      let index = 0;
      index < premises.length - 1;
      index++
    ) {
      const cause =
        premises[index];

      const effect =
        premises[index + 1];

      steps.push({
        id:
          `step:${request.id}:causal:${index}`,
        description:
          "Evaluate a candidate relationship between two established premises.",
        premises: [
          cause.id,
          effect.id,
        ],
        conclusion:
          `${cause.statement} may relate to ${effect.statement}.`,
        truthState: "INFERRED",
        confidence:
          Math.min(
            cause.confidence,
            effect.confidence,
          ) * 0.5,
        evidence: [
          ...cause.evidence,
          ...effect.evidence,
        ],
      });
    }

    uncertainties.push(
      "Causal relationships are hypotheses unless independently established.",
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Planning reasoning                                                       */
  /* ------------------------------------------------------------------------ */

  private planReasoning(
    request: ReasoningRequest,
    premises: ReasoningPremise[],
    steps: ReasoningStep[],
    uncertainties: string[],
  ): void {
    if (!request.objective) {
      uncertainties.push(
        "Planning requires an explicit objective.",
      );
      return;
    }

    steps.push({
      id:
        `step:${request.id}:plan:objective`,
      description:
        "Translate the objective into a bounded planning problem.",
      premises:
        premises.map(
          (premise) => premise.id,
        ),
      conclusion:
        "A candidate execution plan may be constructed only after objective, constraints, dependencies, and verification requirements are established.",
      truthState:
        "DERIVED",
      confidence:
        premises.length > 0
          ? 0.75
          : 0.5,
      evidence:
        collectEvidence(premises),
    });

    uncertainties.push(
      "No execution should occur from reasoning alone; a separate execution intent and Sentinel authorization are required.",
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Validation reasoning                                                     */
  /* ------------------------------------------------------------------------ */

  private validationReasoning(
    request: ReasoningRequest,
    premises: ReasoningPremise[],
    steps: ReasoningStep[],
    uncertainties: string[],
    contradictions: string[],
  ): void {
    if (premises.length === 0) {
      uncertainties.push(
        "Nothing is available to validate.",
      );
      return;
    }

    for (const premise of premises) {
      steps.push({
        id:
          `step:${request.id}:validation:${premise.id}`,
        description:
          "Determine whether the premise satisfies the available epistemic requirements.",
        premises: [premise.id],
        conclusion:
          premise.truthState === "VERIFIED"
            ? "Premise is verified."
            : "Premise requires additional verification.",
        truthState:
          premise.truthState,
        confidence:
          premise.confidence,
        evidence:
          premise.evidence,
      });
    }

    if (contradictions.length > 0) {
      uncertainties.push(
        "Validation is incomplete because contradictory evidence exists.",
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Investigation                                                             */
  /* ------------------------------------------------------------------------ */

  private investigationReasoning(
    request: ReasoningRequest,
    premises: ReasoningPremise[],
    steps: ReasoningStep[],
    uncertainties: string[],
    contradictions: string[],
  ): void {
    const facts =
      this.worldModel.listFacts();

    if (facts.length === 0) {
      uncertainties.push(
        "The world model contains no facts to investigate.",
      );
      return;
    }

    for (const fact of facts) {
      steps.push({
        id:
          `step:${request.id}:investigate:${fact.id}`,
        description:
          "Inspect the provenance and epistemic state of a world-model fact.",
        premises: [],
        conclusion:
          `${fact.subjectId}.${fact.attribute} has truth state ${fact.truthState}.`,
        truthState:
          fact.truthState,
        confidence:
          fact.evidence.length > 0
            ? 1
            : 0,
        evidence:
          fact.evidence,
      });
    }

    if (contradictions.length > 0) {
      uncertainties.push(
        "Investigation identified contradictory information.",
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Decision reasoning                                                       */
  /* ------------------------------------------------------------------------ */

  private decisionReasoning(
    request: ReasoningRequest,
    premises: ReasoningPremise[],
    steps: ReasoningStep[],
    uncertainties: string[],
  ): void {
    const alternatives =
      request.alternatives ?? [];

    if (alternatives.length === 0) {
      uncertainties.push(
        "A decision requires at least one candidate alternative.",
      );
      return;
    }

    for (const alternative of alternatives) {
      steps.push({
        id:
          `step:${request.id}:decision:${alternative.id}`,
        description:
          `Evaluate decision candidate ${alternative.id}.`,
        premises:
          premises.map(
            (premise) => premise.id,
          ),
        conclusion:
          alternative.description,
        truthState:
          alternative.truthState,
        confidence:
          alternative.evidence.length > 0
            ? 0.75
            : 0.25,
        evidence:
          alternative.evidence,
      });
    }

    uncertainties.push(
      "A reasoning decision is not execution authorization.",
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Objective fact discovery                                                 */
  /* ------------------------------------------------------------------------ */

  private findObjectiveFacts(
    objective: Objective,
  ): readonly WorldFact[] {
    const facts =
      this.worldModel.listFacts();

    const objectiveText =
      String(objective.description)
        .toLowerCase();

    return facts.filter((fact) => {
      const subject =
        fact.subjectId.toLowerCase();

      const attribute =
        fact.attribute.toLowerCase();

      return (
        objectiveText.includes(subject) ||
        objectiveText.includes(attribute)
      );
    });
  }

  /* ------------------------------------------------------------------------ */
  /* Truth-state determination                                                */
  /* ------------------------------------------------------------------------ */

  private determineConclusionTruthState(
    premiseStates: readonly TruthState[],
    contradictions: readonly string[],
    steps: readonly ReasoningStep[],
    inferenceAllowed: boolean,
  ): TruthState {
    if (contradictions.length > 0) {
      return "CONFLICTING";
    }

    if (premiseStates.length === 0) {
      return "UNKNOWN";
    }

    if (
      premiseStates.some(
        (state) => state === "FAILED",
      )
    ) {
      return "FAILED";
    }

    if (
      premiseStates.every(
        (state) => state === "VERIFIED",
      )
    ) {
      /*
       * Even when all premises are verified, the resulting reasoning
       * conclusion is not automatically a verified external fact.
       *
       * A deterministic logical transformation can be DERIVED.
       */
      return "DERIVED";
    }

    if (
      inferenceAllowed &&
      steps.some(
        (step) =>
          step.truthState === "INFERRED",
      )
    ) {
      return "INFERRED";
    }

    return strongestTruthState(
      premiseStates,
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Confidence                                                                */
  /* ------------------------------------------------------------------------ */

  private calculateConfidence(
    premises: readonly ReasoningPremise[],
    steps: readonly ReasoningStep[],
    contradictions: readonly string[],
  ): number {
    if (premises.length === 0) {
      return 0;
    }

    const premiseConfidence =
      premises.reduce(
        (total, premise) =>
          total + premise.confidence,
        0,
      ) / premises.length;

    const stepConfidence =
      steps.length === 0
        ? premiseConfidence
        : steps.reduce(
            (total, step) =>
              total + step.confidence,
            0,
          ) / steps.length;

    const contradictionPenalty =
      contradictions.length > 0
        ? 0.5
        : 1;

    return clamp(
      Math.min(
        premiseConfidence,
        stepConfidence,
      ) * contradictionPenalty,
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Evidence threshold                                                       */
  /* ------------------------------------------------------------------------ */

  private evidenceSatisfiesThreshold(
    premises: readonly ReasoningPremise[],
    threshold: EvidenceStrength,
  ): boolean {
    const requiredRank =
      this.evidenceStrengthRank(
        threshold,
      );

    if (premises.length === 0) {
      return false;
    }

    return premises.every(
      (premise) =>
        this.evidenceStrengthForPremise(
          premise,
        ) >= requiredRank,
    );
  }

  private evidenceStrengthForPremise(
    premise: ReasoningPremise,
  ): number {
    if (
      premise.truthState === "VERIFIED" &&
      premise.evidence.length > 0
    ) {
      return 4;
    }

    if (
      premise.truthState === "DERIVED" &&
      premise.evidence.length > 0
    ) {
      return 3;
    }

    if (
      premise.truthState === "OBSERVED" &&
      premise.evidence.length > 0
    ) {
      return 2;
    }

    if (premise.evidence.length > 0) {
      return 1;
    }

    return 0;
  }

  private evidenceStrengthRank(
    strength: EvidenceStrength,
  ): number {
    switch (strength) {
      case "NONE":
        return 0;

      case "WEAK":
        return 1;

      case "MODERATE":
        return 2;

      case "STRONG":
        return 3;

      case "DECISIVE":
        return 4;
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Status                                                                    */
  /* ------------------------------------------------------------------------ */

  private determineStatus(
    blockers: readonly string[],
    contradictions: readonly string[],
    uncertainties: readonly string[],
    premises: readonly ReasoningPremise[],
  ): ReasoningStatus {
    if (contradictions.length > 0) {
      return "CONFLICTED";
    }

    if (blockers.length > 0) {
      return "BLOCKED";
    }

    if (premises.length === 0) {
      return "INSUFFICIENT_EVIDENCE";
    }

    if (uncertainties.length > 0) {
      return "PARTIAL";
    }

    return "COMPLETE";
  }

  /* ------------------------------------------------------------------------ */
  /* Conclusion                                                                */
  /* ------------------------------------------------------------------------ */

  private buildConclusion(
    request: ReasoningRequest,
    status: ReasoningStatus,
    truthState: TruthState,
    contradictions: readonly string[],
    uncertainties: readonly string[],
  ): string {
    if (contradictions.length > 0) {
      return (
        `Reasoning for "${request.question}" cannot produce a single reliable conclusion because contradictory evidence exists.`
      );
    }

    if (
      status === "INSUFFICIENT_EVIDENCE"
    ) {
      return (
        `Insufficient evidence exists to answer "${request.question}" reliably.`
      );
    }

    if (
      status === "BLOCKED"
    ) {
      return (
        `Reasoning for "${request.question}" is blocked by unmet requirements.`
      );
    }

    if (
      truthState === "INFERRED"
    ) {
      return (
        `A reasoned inference can be produced for "${request.question}", but it is not verification.`
      );
    }

    if (
      uncertainties.length > 0
    ) {
      return (
        `A partial reasoning result can be produced for "${request.question}", but unresolved uncertainty remains.`
      );
    }

    return (
      `Structured reasoning completed for "${request.question}".`
    );
  }
}
