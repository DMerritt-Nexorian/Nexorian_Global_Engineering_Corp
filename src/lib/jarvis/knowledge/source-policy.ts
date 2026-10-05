import {SourceKind} from "../core/types";
export interface SourcePolicy {allowed:SourceKind[]; minEvidenceLevel:number;}
export function sourceAllowed(policy:SourcePolicy,source:SourceKind,level:number){return policy.allowed.includes(source)&&level>=policy.minEvidenceLevel;}
