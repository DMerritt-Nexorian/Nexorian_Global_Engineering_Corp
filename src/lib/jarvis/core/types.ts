export type TruthState =
  | "OBSERVED"
  | "VERIFIED"
  | "DERIVED"
  | "CONTRADICTED"
  | "UNVERIFIED"
  | "EXISTING"
  | "TARGET";

export interface Node {
  id: string;
  kind: string;
  label: string;
  attributes: Record<string, unknown>;
}

export interface Edge {
  id: string;
  from: string;
  relation: string;
  to: string;
  weight: number;
  evidenceIds: string[];
}

export interface Claim {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  truth: TruthState;
  confidence: number;
  evidenceIds: string[];
  createdAt: string;
}

export interface WorldState {
  nodes: Node[];
  edges: Edge[];
  claims: Claim[];
  asOf: string;
  fingerprint: string;
}
