export type TruthState = "VERIFIED" | "OBSERVED" | "INFERRED" | "UNKNOWN" | "CONTRADICTED" | "UNIMPLEMENTED";
export type EvidenceLevel = 0|1|2|3|4|5|6;
export type SourceKind = "user"|"repository"|"file"|"web"|"github"|"test"|"runtime"|"derived";
export type NodeKind = "entity"|"concept"|"event"|"state"|"artifact"|"claim"|"capability";
export interface Evidence { id:string; source:SourceKind; uri?:string; observedAt:string; contentHash:string; level:EvidenceLevel; excerpt?:string; metadata?:Record<string,unknown>; }
export interface Claim { id:string; subject:string; predicate:string; object:string; truth:TruthState; confidence:number; evidenceIds:string[]; createdAt:string; }
export interface Node { id:string; kind:NodeKind; label:string; attributes:Record<string,unknown>; }
export interface Edge { id:string; from:string; relation:string; to:string; weight:number; evidenceIds:string[]; }
export interface WorldState { nodes:Node[]; edges:Edge[]; claims:Claim[]; asOf:string; fingerprint:string; }
export interface Goal { id:string; description:string; constraints:string[]; successCriteria:string[]; priority:number; }
export interface Hypothesis { id:string; statement:string; assumptions:string[]; supportingEvidence:string[]; opposingEvidence:string[]; score:number; }
export interface ResearchQuestion { id:string; question:string; domain:string; terms:string[]; }
export interface Capability { id:string; name:string; version:string; description:string; risk:"low"|"medium"|"high"; enabled:boolean; }
export interface CapabilityGap { goalId:string; missing:string[]; rationale:string; }
export interface BuildProposal { id:string; capability:string; rationale:string; files:string[]; tests:string[]; acceptance:string[]; risk:"low"|"medium"|"high"; }
export interface ExecutionResult { ok:boolean; status:string; stdout?:string; stderr?:string; exitCode?:number; evidence:Evidence[]; }
