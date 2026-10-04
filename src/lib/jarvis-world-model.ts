/**
 * JARVIS World Model
 * ===================
 *
 * Nexorian Corporation
 *
 * Purpose:
 *   Maintain a structured, evidence-aware representation of the entities,
 *   relationships, state, observations, claims, dependencies, authority,
 *   objectives, constraints, and uncertainty known to JARVIS.
 *
 * Design rules:
 *
 *   PROOF BEFORE TRUST
 *   RULES BEFORE REASONING
 *   DETERMINISM BEFORE AUTONOMY
 *
 * Important:
 *   This module does NOT perform external execution.
 *   This module does NOT call an LLM.
 *   This module does NOT access the filesystem, network, Git, databases,
 *   credentials, or external services.
 *
 * It is a deterministic state/model layer.
 *
 * The world model must never silently convert:
 *
 *   unknown       -> known
 *   inferred      -> verified
 *   hypothesized  -> verified
 *   observed      -> verified
 *   stale         -> current
 *   failed        -> successful
 *
 * External observations are data.
 * They are never authority by themselves.
 */

import {
  TruthState,
  EvidenceRef,
  JarvisClaim,
  WorldEntity,
  WorldRelationship,
  WorldState,
  Objective,
  Constraint,
} from "./jarvis-contracts";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface WorldObservation {
  readonly id: string;
  readonly timestamp: string;
  readonly source: string;
  readonly subjectId: string;
  readonly attribute: string;
  readonly value: unknown;
  readonly truthState: TruthState;
  readonly evidence: readonly EvidenceRef[];
  readonly confidence: number;
  readonly expiresAt?: string;
}

export interface WorldFact {
  readonly id: string;
  readonly subjectId: string;
  readonly attribute: string;
  readonly value: unknown;
  readonly truthState: TruthState;
  readonly evidence: readonly EvidenceRef[];
  readonly sourceObservationIds: readonly string[];
  readonly firstObservedAt: string;
  readonly lastVerifiedAt?: string;
  readonly staleAfter?: string;
}

export interface WorldDependency {
  readonly id: string;
  readonly fromId: string;
  readonly toId: string;
  readonly relation:
    | "REQUIRES"
    | "DEPENDS_ON"
    | "BLOCKED_BY"
    | "AFFECTS"
    | "PRODUCES"
    | "VERIFIES"
    | "INVALIDATES";
  readonly truthState: TruthState;
  readonly evidence: readonly EvidenceRef[];
}

export interface WorldConflict {
  readonly id: string;
  readonly subjectId: string;
  readonly attribute: string;
  readonly competingFactIds: readonly string[];
  readonly detectedAt: string;
  readonly reason: string;
}

export interface WorldQuery {
  readonly subjectId?: string;
  readonly attribute?: string;
  readonly truthStates?: readonly TruthState[];
  readonly minimumConfidence?: number;
  readonly includeStale?: boolean;
}

export interface WorldQueryResult {
  readonly facts: readonly WorldFact[];
  readonly observations: readonly WorldObservation[];
  readonly conflicts: readonly WorldConflict[];
}

export interface WorldModelSnapshot {
  readonly version: number;
  readonly generatedAt: string;
  readonly entities: readonly WorldEntity[];
  readonly relationships: readonly WorldRelationship[];
  readonly facts: readonly WorldFact[];
  readonly observations: readonly WorldObservation[];
  readonly dependencies: readonly WorldDependency[];
  readonly conflicts: readonly WorldConflict[];
  readonly objectives: readonly Objective[];
  readonly constraints: readonly Constraint[];
}

/* -------------------------------------------------------------------------- */
/* Internal state                                                              */
/* -------------------------------------------------------------------------- */

interface MutableWorldState {
  version: number;

  entities: Map<string, WorldEntity>;
  relationships: Map<string, WorldRelationship>;

  observations: Map<string, WorldObservation>;
  facts: Map<string, WorldFact>;

  dependencies: Map<string, WorldDependency>;
  conflicts: Map<string, WorldConflict>;

  objectives: Map<string, Objective>;
  constraints: Map<string, Constraint>;
}

/* -------------------------------------------------------------------------- */
/* Utility functions                                                           */
/* -------------------------------------------------------------------------- */

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeConfidence(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(1, value));
}

function isTerminalFailure(state: TruthState): boolean {
  return state === "FAILED";
}

function isStale(
  staleAfter: string | undefined,
  now: string,
): boolean {
  if (!staleAfter) {
    return false;
  }

  return Date.parse(now) >= Date.parse(staleAfter);
}

function canConflict(
  left: WorldFact,
  right: WorldFact,
): boolean {
  if (left.subjectId !== right.subjectId) {
    return false;
  }

  if (left.attribute !== right.attribute) {
    return false;
  }

  if (
    left.value === null ||
    right.value === null ||
    typeof left.value !== typeof right.value
  ) {
    return false;
  }

  return JSON.stringify(left.value) !== JSON.stringify(right.value);
}

/* -------------------------------------------------------------------------- */
/* World Model                                                                 */
/* -------------------------------------------------------------------------- */

export class JarvisWorldModel {
  private readonly state: MutableWorldState;

  public constructor() {
    this.state = {
      version: 0,

      entities: new Map(),
      relationships: new Map(),

      observations: new Map(),
      facts: new Map(),

      dependencies: new Map(),
      conflicts: new Map(),

      objectives: new Map(),
      constraints: new Map(),
    };
  }

  /* ------------------------------------------------------------------------ */
  /* Versioning                                                               */
  /* ------------------------------------------------------------------------ */

  public getVersion(): number {
    return this.state.version;
  }

  private advanceVersion(): void {
    this.state.version += 1;
  }

  /* ------------------------------------------------------------------------ */
  /* Entities                                                                  */
  /* ------------------------------------------------------------------------ */

  public upsertEntity(entity: WorldEntity): void {
    if (!entity.id) {
      throw new Error("World entity requires a non-empty id.");
    }

    this.state.entities.set(entity.id, clone(entity));
    this.advanceVersion();
  }

  public getEntity(id: string): WorldEntity | undefined {
    const entity = this.state.entities.get(id);

    return entity ? clone(entity) : undefined;
  }

  public listEntities(): readonly WorldEntity[] {
    return Array.from(this.state.entities.values()).map(clone);
  }

  /* ------------------------------------------------------------------------ */
  /* Relationships                                                             */
  /* ------------------------------------------------------------------------ */

  public upsertRelationship(
    relationship: WorldRelationship,
  ): void {
    if (!relationship.id) {
      throw new Error("World relationship requires a non-empty id.");
    }

    this.state.relationships.set(
      relationship.id,
      clone(relationship),
    );

    this.advanceVersion();
  }

  public getRelationship(
    id: string,
  ): WorldRelationship | undefined {
    const relationship = this.state.relationships.get(id);

    return relationship ? clone(relationship) : undefined;
  }

  public listRelationships(): readonly WorldRelationship[] {
    return Array.from(this.state.relationships.values()).map(clone);
  }

  /* ------------------------------------------------------------------------ */
  /* Observations                                                              */
  /* ------------------------------------------------------------------------ */

  public recordObservation(
    observation: WorldObservation,
  ): void {
    if (!observation.id) {
      throw new Error("World observation requires a non-empty id.");
    }

    if (!observation.subjectId) {
      throw new Error(
        "World observation requires a subjectId.",
      );
    }

    if (!observation.source) {
      throw new Error(
        "World observation requires a source.",
      );
    }

    if (!observation.attribute) {
      throw new Error(
        "World observation requires an attribute.",
      );
    }

    if (!Number.isFinite(Date.parse(observation.timestamp))) {
      throw new Error(
        "World observation timestamp must be a valid ISO timestamp.",
      );
    }

    if (
      observation.expiresAt &&
      !Number.isFinite(Date.parse(observation.expiresAt))
    ) {
      throw new Error(
        "World observation expiresAt must be a valid ISO timestamp.",
      );
    }

    const normalized: WorldObservation = {
      ...clone(observation),
      confidence: normalizeConfidence(observation.confidence),
      evidence: clone(observation.evidence),
    };

    this.state.observations.set(
      normalized.id,
      normalized,
    );

    this.advanceVersion();
  }

  public getObservation(
    id: string,
  ): WorldObservation | undefined {
    const observation = this.state.observations.get(id);

    return observation ? clone(observation) : undefined;
  }

  public listObservations(): readonly WorldObservation[] {
    return Array.from(this.state.observations.values()).map(clone);
  }

  /* ------------------------------------------------------------------------ */
  /* Facts                                                                     */
  /* ------------------------------------------------------------------------ */

  public assertFact(
    fact: WorldFact,
  ): void {
    if (!fact.id) {
      throw new Error("World fact requires a non-empty id.");
    }

    if (!fact.subjectId) {
      throw new Error("World fact requires a subjectId.");
    }

    if (!fact.attribute) {
      throw new Error("World fact requires an attribute.");
    }

    if (!Number.isFinite(Date.parse(fact.firstObservedAt))) {
      throw new Error(
        "World fact firstObservedAt must be a valid ISO timestamp.",
      );
    }

    const existingFacts = Array.from(
      this.state.facts.values(),
    ).filter(
      (existing) =>
        existing.id !== fact.id &&
        existing.subjectId === fact.subjectId &&
        existing.attribute === fact.attribute,
    );

    for (const existing of existingFacts) {
      if (canConflict(existing, fact)) {
        this.registerConflict({
          id: `conflict:${fact.id}:${existing.id}`,
          subjectId: fact.subjectId,
          attribute: fact.attribute,
          competingFactIds: [existing.id, fact.id],
          detectedAt: new Date().toISOString(),
          reason:
            "Two facts describe different values for the same subject and attribute.",
        });
      }
    }

    this.state.facts.set(
      fact.id,
      clone(fact),
    );

    this.advanceVersion();
  }

  public getFact(
    id: string,
  ): WorldFact | undefined {
    const fact = this.state.facts.get(id);

    return fact ? clone(fact) : undefined;
  }

  public listFacts(): readonly WorldFact[] {
    return Array.from(this.state.facts.values()).map(clone);
  }

  /* ------------------------------------------------------------------------ */
  /* Claims                                                                    */
  /* ------------------------------------------------------------------------ */

  /**
   * A claim is converted into a fact only when its truth state permits
   * representation as an asserted world-state item.
   *
   * This method does NOT upgrade the claim's truth state.
   */
  public ingestClaim(
    claim: JarvisClaim,
  ): void {
    const subjectId = claim.subject;

    if (!subjectId) {
      throw new Error(
        "A world-model claim requires a subject.",
      );
    }

    this.assertFact({
      id: `claim:${claim.id}`,
      subjectId,
      attribute: claim.predicate,
      value: clone(claim.value),
      truthState: claim.truthState,
      evidence: clone(claim.evidence),
      sourceObservationIds: [],
      firstObservedAt: new Date().toISOString(),
    });
  }

  /* ------------------------------------------------------------------------ */
  /* Dependencies                                                              */
  /* ------------------------------------------------------------------------ */

  public upsertDependency(
    dependency: WorldDependency,
  ): void {
    if (!dependency.id) {
      throw new Error(
        "World dependency requires a non-empty id.",
      );
    }

    if (!dependency.fromId || !dependency.toId) {
      throw new Error(
        "World dependency requires fromId and toId.",
      );
    }

    this.state.dependencies.set(
      dependency.id,
      clone(dependency),
    );

    this.advanceVersion();
  }

  public listDependencies(): readonly WorldDependency[] {
    return Array.from(
      this.state.dependencies.values(),
    ).map(clone);
  }

  /* ------------------------------------------------------------------------ */
  /* Conflicts                                                                 */
  /* ------------------------------------------------------------------------ */

  private registerConflict(
    conflict: WorldConflict,
  ): void {
    this.state.conflicts.set(
      conflict.id,
      clone(conflict),
    );
  }

  public listConflicts(): readonly WorldConflict[] {
    return Array.from(
      this.state.conflicts.values(),
    ).map(clone);
  }

  public hasUnresolvedConflicts(): boolean {
    return this.state.conflicts.size > 0;
  }

  /* ------------------------------------------------------------------------ */
  /* Objectives and constraints                                               */
  /* ------------------------------------------------------------------------ */

  public upsertObjective(
    objective: Objective,
  ): void {
    if (!objective.id) {
      throw new Error(
        "Objective requires a non-empty id.",
      );
    }

    this.state.objectives.set(
      objective.id,
      clone(objective),
    );

    this.advanceVersion();
  }

  public upsertConstraint(
    constraint: Constraint,
  ): void {
    if (!constraint.id) {
      throw new Error(
        "Constraint requires a non-empty id.",
      );
    }

    this.state.constraints.set(
      constraint.id,
      clone(constraint),
    );

    this.advanceVersion();
  }

  public listObjectives(): readonly Objective[] {
    return Array.from(
      this.state.objectives.values(),
    ).map(clone);
  }

  public listConstraints(): readonly Constraint[] {
    return Array.from(
      this.state.constraints.values(),
    ).map(clone);
  }

  /* ------------------------------------------------------------------------ */
  /* Query                                                                     */
  /* ------------------------------------------------------------------------ */

  public query(
    query: WorldQuery = {},
  ): WorldQueryResult {
    const now = new Date().toISOString();

    const facts = Array.from(
      this.state.facts.values(),
    ).filter((fact) => {
      if (
        query.subjectId &&
        fact.subjectId !== query.subjectId
      ) {
        return false;
      }

      if (
        query.attribute &&
        fact.attribute !== query.attribute
      ) {
        return false;
      }

      if (
        query.truthStates &&
        !query.truthStates.includes(fact.truthState)
      ) {
        return false;
      }

      if (
        query.minimumConfidence !== undefined &&
        query.minimumConfidence > 0 &&
        fact.evidence.length === 0
      ) {
        return false;
      }

      if (
        !query.includeStale &&
        isStale(fact.staleAfter, now)
      ) {
        return false;
      }

      return true;
    });

    const observations = Array.from(
      this.state.observations.values(),
    ).filter((observation) => {
      if (
        query.subjectId &&
        observation.subjectId !== query.subjectId
      ) {
        return false;
      }

      if (
        query.attribute &&
        observation.attribute !== query.attribute
      ) {
        return false;
      }

      if (
        query.truthStates &&
        !query.truthStates.includes(
          observation.truthState,
        )
      ) {
        return false;
      }

      if (
        query.minimumConfidence !== undefined &&
        observation.confidence <
          normalizeConfidence(query.minimumConfidence)
      ) {
        return false;
      }

      if (
        !query.includeStale &&
        isStale(observation.expiresAt, now)
      ) {
        return false;
      }

      return true;
    });

    const conflicts = Array.from(
      this.state.conflicts.values(),
    ).filter((conflict) => {
      if (
        query.subjectId &&
        conflict.subjectId !== query.subjectId
      ) {
        return false;
      }

      if (
        query.attribute &&
        conflict.attribute !== query.attribute
      ) {
        return false;
      }

      return true;
    });

    return {
      facts: facts.map(clone),
      observations: observations.map(clone),
      conflicts: conflicts.map(clone),
    };
  }

  /* ------------------------------------------------------------------------ */
  /* Truth-state inspection                                                   */
  /* ------------------------------------------------------------------------ */

  public getTruthState(
    subjectId: string,
    attribute: string,
  ): TruthState {
    const candidates = Array.from(
      this.state.facts.values(),
    ).filter(
      (fact) =>
        fact.subjectId === subjectId &&
        fact.attribute === attribute,
    );

    if (candidates.length === 0) {
      return "UNKNOWN";
    }

    if (
      candidates.some(
        (fact) => isTerminalFailure(fact.truthState),
      )
    ) {
      return "FAILED";
    }

    if (
      candidates.some(
        (fact) => fact.truthState === "CONFLICTING",
      )
    ) {
      return "CONFLICTING";
    }

    const priority: readonly TruthState[] = [
      "VERIFIED",
      "OBSERVED",
      "DERIVED",
      "INFERRED",
      "HYPOTHESIZED",
      "EXPERIMENTAL",
      "STALE",
      "UNVERIFIED",
      "UNIMPLEMENTED",
      "UNKNOWN",
    ];

    for (const state of priority) {
      if (
        candidates.some(
          (fact) => fact.truthState === state,
        )
      ) {
        return state;
      }
    }

    return "UNKNOWN";
  }

  /* ------------------------------------------------------------------------ */
  /* Evidence integrity                                                       */
  /* ------------------------------------------------------------------------ */

  public hasEvidence(
    subjectId: string,
    attribute: string,
  ): boolean {
    const facts = Array.from(
      this.state.facts.values(),
    ).filter(
      (fact) =>
        fact.subjectId === subjectId &&
        fact.attribute === attribute,
    );

    return facts.some(
      (fact) => fact.evidence.length > 0,
    );
  }

  public hasVerifiedEvidence(
    subjectId: string,
    attribute: string,
  ): boolean {
    const facts = Array.from(
      this.state.facts.values(),
    ).filter(
      (fact) =>
        fact.subjectId === subjectId &&
        fact.attribute === attribute,
    );

    return facts.some(
      (fact) =>
        fact.truthState === "VERIFIED" &&
        fact.evidence.length > 0,
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Snapshot                                                                  */
  /* ------------------------------------------------------------------------ */

  public snapshot(): WorldModelSnapshot {
    return {
      version: this.state.version,
      generatedAt: new Date().toISOString(),

      entities: this.listEntities(),
      relationships: this.listRelationships(),

      facts: this.listFacts(),
      observations: this.listObservations(),

      dependencies: this.listDependencies(),
      conflicts: this.listConflicts(),

      objectives: this.listObjectives(),
      constraints: this.listConstraints(),
    };
  }

  /* ------------------------------------------------------------------------ */
  /* Import/export                                                             */
  /* ------------------------------------------------------------------------ */

  public exportState(): WorldState {
    return {
      version: this.state.version,
      generatedAt: new Date().toISOString(),
      entities: this.listEntities(),
      relationships: this.listRelationships(),
      claims: []
    };
  }

  public clear(): void {
    this.state.entities.clear();
    this.state.relationships.clear();

    this.state.observations.clear();
    this.state.facts.clear();

    this.state.dependencies.clear();
    this.state.conflicts.clear();

    this.state.objectives.clear();
    this.state.constraints.clear();

    this.advanceVersion();
  }
}
