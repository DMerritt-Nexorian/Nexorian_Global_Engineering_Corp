/**
 * JARVIS Evidence & Epistemic Reasoning Engine
 * ==============================================
 *
 * Nexorian Corporation
 *
 * Purpose:
 *   Evaluate evidence and determine what JARVIS may legitimately conclude
 *   from the current world model.
 *
 * Core principles:
 *
 *   PROOF BEFORE TRUST
 *   RULES BEFORE REASONING
 *   DETERMINISM BEFORE AUTONOMY
 *
 * This module is deliberately deterministic.
 *
 * It does NOT:
 *   - call an LLM
 *   - browse the network
 *   - execute tools
 *   - modify source code
 *   - modify Git
 *   - access credentials
 *   - manufacture evidence
 *   - manufacture confidence
 *   - promote unsupported claims to VERIFIED
 *
 * The purpose is not to make JARVIS "sound intelligent."
 *
 * The purpose is to prevent JARVIS from treating weak information as fact.
 */

import {
  EvidenceRef,
  JarvisClaim,
  TruthState,
} from "./jarvis-contracts";

import {
  JarvisWorldModel,
  WorldFact,
  WorldObservation,
} from "./jarvis-world-model";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type EvidenceStrength =
  | "NONE"
  | "WEAK"
  | "MODERATE"
  | "STRONG"
  | "DECISIVE";

export type EpistemicAssessment =
  | "SUPPORTED"
  | "PARTIALLY_SUPPORTED"
  | "UNSUPPORTED"
  | "CONTRADICTED"
  | "UNKNOWN"
  | "STALE";

export interface EvidenceAssessment {
  readonly claimId: string;
  readonly assessment: EpistemicAssessment;
  readonly truthState: TruthState;
  readonly evidenceStrength: EvidenceStrength;
  readonly confidence: number;
  readonly supportingEvidence: readonly EvidenceRef[];
  readonly contradictingFactIds: readonly string[];
  readonly reasoning: readonly string[];
  readonly missingEvidence: readonly string[];
}

export interface EvidenceRequirement {
  readonly id: string;
  readonly description: string;
  readonly required: boolean;
  readonly minimumTruthState?: TruthState;
  readonly minimumEvidenceStrength?: EvidenceStrength;
}

export interface ClaimEvaluationRequest {
  readonly claim: JarvisClaim;
  readonly requirements?: readonly EvidenceRequirement[];
}

export interface InferencePremise {
  readonly id: string;
  readonly subject: string;
  readonly predicate: string;
  readonly object: unknown;
  readonly truthState: TruthState;
  readonly evidence: readonly EvidenceRef[];
}

export interface InferenceRule {
  readonly id: string;
  readonly description: string;
  readonly premises: readonly InferencePremise[];
  readonly conclusion: InferencePremise;
}

export interface InferenceResult {
  readonly ruleId: string;
  readonly applied: boolean;
  readonly conclusion?: InferencePremise;
  readonly confidence: number;
  readonly reasoning: readonly string[];
  readonly blockers: readonly string[];
}

export interface EpistemicSummary {
  verified: number;
  observed: number;
  derived: number;
  inferred: number;
  hypothesized: number;
  experimental: number;
  unknown: number;
  unverified: number;
  stale: number;
  conflicting: number;
  failed: number;
  unimplemented: number;
}

export interface ReasoningConclusion {
  readonly conclusion: string;
  readonly truthState: TruthState;
  readonly confidence: number;
  readonly evidence: readonly EvidenceRef[];
  readonly basis: readonly string[];
  readonly limitations: readonly string[];
  readonly requiresVerification: boolean;
}

/* -------------------------------------------------------------------------- */
/* Truth ordering                                                             */
/* -------------------------------------------------------------------------- */

const TRUTH_RANK: Readonly<Record<TruthState, number>> = {
  UNKNOWN: 0,
  HYPOTHESIZED: 1,
  EXPERIMENTAL: 2,
  UNVERIFIED: 3,
  INFERRED: 4,
  OBSERVED: 5,
  DERIVED: 6,
  VERIFIED: 7,
  CONFLICTING: -1,
  STALE: 2,
  FAILED: -2,
  UNIMPLEMENTED: 0,
};

function rankTruthState(
  state: TruthState,
): number {
  return TRUTH_RANK[state];
}

/* -------------------------------------------------------------------------- */
/* Evidence helpers                                                           */
/* -------------------------------------------------------------------------- */

function clampConfidence(
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

function evidenceStrengthRank(
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

function truthStateFromStrength(
  strength: EvidenceStrength,
): TruthState {
  switch (strength) {
    case "NONE":
      return "UNKNOWN";

    case "WEAK":
      return "UNVERIFIED";

    case "MODERATE":
      return "OBSERVED";

    case "STRONG":
      return "DERIVED";

    case "DECISIVE":
      return "VERIFIED";
  }
}

function determineEvidenceStrength(
  facts: readonly WorldFact[],
  observations: readonly WorldObservation[],
): EvidenceStrength {
  const verifiedFacts = facts.filter(
    (fact) =>
      fact.truthState === "VERIFIED" &&
      fact.evidence.length > 0,
  );

  if (verifiedFacts.length > 0) {
    return "DECISIVE";
  }

  const derivedFacts = facts.filter(
    (fact) =>
      fact.truthState === "DERIVED" &&
      fact.evidence.length > 0,
  );

  if (derivedFacts.length > 0) {
    return "STRONG";
  }

  const observedFacts = facts.filter(
    (fact) =>
      fact.truthState === "OBSERVED" &&
      fact.evidence.length > 0,
  );

  if (observedFacts.length > 0) {
    return "MODERATE";
  }

  if (
    observations.some(
      (observation) =>
        observation.evidence.length > 0,
    )
  ) {
    return "WEAK";
  }

  return "NONE";
}

function collectEvidence(
  facts: readonly WorldFact[],
  observations: readonly WorldObservation[],
): EvidenceRef[] {
  const result: EvidenceRef[] = [];

  for (const fact of facts) {
    result.push(...fact.evidence);
  }

  for (const observation of observations) {
    result.push(...observation.evidence);
  }

  const unique = new Map<string, EvidenceRef>();

  for (const evidence of result) {
    const key =
      evidence.id ??
      JSON.stringify(evidence);

    if (!unique.has(key)) {
      unique.set(key, evidence);
    }
  }

  return Array.from(unique.values());
}

/* -------------------------------------------------------------------------- */
/* Evidence Engine                                                            */
/* -------------------------------------------------------------------------- */

export class JarvisEvidenceEngine {
  public constructor(
    private readonly worldModel: JarvisWorldModel,
  ) {}

  /* ------------------------------------------------------------------------ */
  /* Claim evaluation                                                         */
  /* ------------------------------------------------------------------------ */

  public evaluateClaim(
    request: ClaimEvaluationRequest,
  ): EvidenceAssessment {
    const {
      claim,
      requirements = [],
    } = request;

    const query = this.worldModel.query({
      subjectId: claim.subject,
      attribute: claim.predicate,
      includeStale: true,
    });

    const matchingFacts = query.facts.filter(
      (fact) =>
        JSON.stringify(fact.value) ===
        JSON.stringify(claim.value),
    );

    const contradictingFacts = query.facts.filter(
      (fact) =>
        JSON.stringify(fact.value) !==
        JSON.stringify(claim.value),
    );

    const strength = determineEvidenceStrength(
      matchingFacts,
      query.observations,
    );

    const evidence = collectEvidence(
      matchingFacts,
      query.observations,
    );

    const reasoning: string[] = [];
    const missingEvidence: string[] = [];

    if (matchingFacts.length === 0) {
      reasoning.push(
        "No matching world-model fact supports the claim.",
      );
    }

    if (contradictingFacts.length > 0) {
      reasoning.push(
        "The world model contains one or more facts that contradict the claim.",
      );
    }

    if (evidence.length === 0) {
      missingEvidence.push(
        "At least one traceable evidence source is required.",
      );
    }

    for (const requirement of requirements) {
      if (
        requirement.minimumTruthState !== undefined
      ) {
        const sufficientTruth =
          matchingFacts.some(
            (fact) =>
              rankTruthState(fact.truthState) >=
              rankTruthState(
                requirement.minimumTruthState!,
              ),
          );

        if (!sufficientTruth) {
          missingEvidence.push(
            requirement.description,
          );
        }
      }

      if (
        requirement.minimumEvidenceStrength !==
        undefined
      ) {
        if (
          evidenceStrengthRank(strength) <
          evidenceStrengthRank(
            requirement.minimumEvidenceStrength,
          )
        ) {
          missingEvidence.push(
            requirement.description,
          );
        }
      }
    }

    let assessment: EpistemicAssessment;

    if (contradictingFacts.length > 0) {
      assessment = "CONTRADICTED";
    } else if (matchingFacts.length === 0) {
      assessment = "UNKNOWN";
    } else if (
      matchingFacts.some(
        (fact) => fact.truthState === "STALE",
      )
    ) {
      assessment = "STALE";
    } else if (
      requirements.length > 0 &&
      missingEvidence.length > 0
    ) {
      assessment = "PARTIALLY_SUPPORTED";
    } else {
      assessment = "SUPPORTED";
    }

    const strongestTruthState =
      matchingFacts.reduce<TruthState>(
        (current, fact) =>
          rankTruthState(fact.truthState) >
          rankTruthState(current)
            ? fact.truthState
            : current,
        "UNKNOWN",
      );

    const confidence = clampConfidence(
      matchingFacts.length === 0
        ? 0
        : matchingFacts.reduce(
            (total, fact) =>
              total +
              (fact.evidence.length > 0
                ? 1
                : 0),
            0,
          ) / matchingFacts.length,
    );

    return {
      claimId: claim.id,
      assessment,
      truthState:
        assessment === "CONTRADICTED"
          ? "CONFLICTING"
          : strongestTruthState,
      evidenceStrength: strength,
      confidence,
      supportingEvidence: evidence,
      contradictingFactIds:
        contradictingFacts.map(
          (fact) => fact.id,
        ),
      reasoning,
      missingEvidence,
    };
  }

  /* ------------------------------------------------------------------------ */
  /* Requirement checking                                                     */
  /* ------------------------------------------------------------------------ */

  public satisfyRequirements(
    assessment: EvidenceAssessment,
    requirements: readonly EvidenceRequirement[],
  ): boolean {
    for (const requirement of requirements) {
      if (!requirement.required) {
        continue;
      }

      if (
        requirement.minimumTruthState !==
        undefined &&
        rankTruthState(assessment.truthState) <
          rankTruthState(
            requirement.minimumTruthState,
          )
      ) {
        return false;
      }

      if (
        requirement.minimumEvidenceStrength !==
        undefined &&
        evidenceStrengthRank(
          assessment.evidenceStrength,
        ) <
          evidenceStrengthRank(
            requirement.minimumEvidenceStrength,
          )
      ) {
        return false;
      }
    }

    return (
      assessment.assessment === "SUPPORTED"
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Inference                                                                */
  /* ------------------------------------------------------------------------ */

  public evaluateInference(
    rule: InferenceRule,
  ): InferenceResult {
    const blockers: string[] = [];
    const reasoning: string[] = [];

    for (const premise of rule.premises) {
      const query = this.worldModel.query({
        subjectId: premise.subject,
        attribute: premise.predicate,
      });

      const matching = query.facts.filter(
        (fact) =>
          JSON.stringify(fact.value) ===
            JSON.stringify(
              premise.object,
            ) &&
          fact.truthState ===
            premise.truthState,
      );

      if (matching.length === 0) {
        blockers.push(
          `Premise not established: ${premise.subject}.${premise.predicate}`,
        );
      } else {
        reasoning.push(
          `Premise established: ${premise.subject}.${premise.predicate}`,
        );
      }
    }

    if (blockers.length > 0) {
      return {
        ruleId: rule.id,
        applied: false,
        confidence: 0,
        reasoning,
        blockers,
      };
    }

    const premiseConfidence =
      rule.premises.length === 0
        ? 0
        : rule.premises.reduce(
            (total, premise) => {
              const query =
                this.worldModel.query({
                  subjectId:
                    premise.subject,
                  attribute:
                    premise.predicate,
                });

              const matching =
                query.facts.filter(
                  (fact) =>
                    JSON.stringify(
                      fact.value,
                    ) ===
                      JSON.stringify(
                        premise.object,
                      ) &&
                    fact.truthState ===
                      premise.truthState,
                );

              return (
                total +
                (matching.length > 0
                  ? 1
                  : 0)
              );
            },
            0,
          ) / rule.premises.length;

    const conclusion: InferencePremise = {
      ...rule.conclusion,
      truthState: "INFERRED",
      evidence: rule.premises.flatMap(
        (premise) => premise.evidence,
      ),
    };

    reasoning.push(
      `Inference rule "${rule.id}" satisfied all premises.`,
    );

    return {
      ruleId: rule.id,
      applied: true,
      conclusion,
      confidence: clampConfidence(
        premiseConfidence,
      ),
      reasoning,
      blockers: [],
    };
  }

  /* ------------------------------------------------------------------------ */
  /* Epistemic summary                                                        */
  /* ------------------------------------------------------------------------ */

  public summarize(): EpistemicSummary {
    const facts =
      this.worldModel.listFacts();

    const summary: EpistemicSummary = {
      verified: 0,
      observed: 0,
      derived: 0,
      inferred: 0,
      hypothesized: 0,
      experimental: 0,
      unknown: 0,
      unverified: 0,
      stale: 0,
      conflicting: 0,
      failed: 0,
      unimplemented: 0,
    };

    for (const fact of facts) {
      switch (fact.truthState) {
        case "VERIFIED":
          summary.verified++;
          break;

        case "OBSERVED":
          summary.observed++;
          break;

        case "DERIVED":
          summary.derived++;
          break;

        case "INFERRED":
          summary.inferred++;
          break;

        case "HYPOTHESIZED":
          summary.hypothesized++;
          break;

        case "EXPERIMENTAL":
          summary.experimental++;
          break;

        case "UNKNOWN":
          summary.unknown++;
          break;

        case "UNVERIFIED":
          summary.unverified++;
          break;

        case "STALE":
          summary.stale++;
          break;

        case "CONFLICTING":
          summary.conflicting++;
          break;

        case "FAILED":
          summary.failed++;
          break;

        case "UNIMPLEMENTED":
          summary.unimplemented++;
          break;
      }
    }

    return summary;
  }

  /* ------------------------------------------------------------------------ */
  /* Conclusion construction                                                  */
  /* ------------------------------------------------------------------------ */

  public constructConclusion(
    assessment: EvidenceAssessment,
    conclusion: string,
  ): ReasoningConclusion {
    const limitations = [
      ...assessment.missingEvidence,
    ];

    if (
      assessment.assessment ===
      "CONTRADICTED"
    ) {
      limitations.push(
        "The world model contains contradictory evidence.",
      );
    }

    if (
      assessment.assessment === "UNKNOWN"
    ) {
      limitations.push(
        "The available world model does not establish the conclusion.",
      );
    }

    const requiresVerification =
      assessment.truthState !== "VERIFIED";

    return {
      conclusion,
      truthState: assessment.truthState,
      confidence: assessment.confidence,
      evidence:
        assessment.supportingEvidence,
      basis: assessment.reasoning,
      limitations,
      requiresVerification,
    };
  }
}
