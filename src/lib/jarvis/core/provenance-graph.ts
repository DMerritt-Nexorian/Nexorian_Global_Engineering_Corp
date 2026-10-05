import {Evidence,Claim} from "./types";
export class ProvenanceGraph {
  private evidence=new Map<string,Evidence>(); private claims=new Map<string,Claim>();
  addEvidence(e:Evidence){this.evidence.set(e.id,e)}
  addClaim(c:Claim){this.claims.set(c.id,c)}
  lineage(claimId:string){const c=this.claims.get(claimId); return c?c.evidenceIds.map(id=>this.evidence.get(id)).filter(Boolean):[]}
}
