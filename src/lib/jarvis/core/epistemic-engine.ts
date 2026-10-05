import { Evidence, Claim, TruthState } from "./types";
export class EpistemicEngine {
  private evidence=new Map<string,Evidence>(); private claims=new Map<string,Claim>();
  addEvidence(e:Evidence){this.evidence.set(e.id,e); return e.id;}
  addClaim(c:Claim){this.claims.set(c.id,c); return c.id;}
  evaluate(id:string): Claim|undefined {
    const c=this.claims.get(id); if(!c) return;
    const ev=c.evidenceIds.map(x=>this.evidence.get(x)).filter(Boolean) as Evidence[];
    if(!ev.length) return {...c,truth:"UNKNOWN"};
    const hasTest=ev.some(e=>e.source==="test" && e.level>=4);
    const hasRuntime=ev.some(e=>e.source==="runtime" && e.level>=3);
    const hasObserved=ev.some(e=>e.level>=2);
    let truth:TruthState=hasTest?"VERIFIED":hasRuntime||hasObserved?"OBSERVED":"INFERRED";
    if(ev.some(e=>e.level===0)) truth="UNKNOWN";
    return {...c,truth};
  }
  getEvidence(id:string){return this.evidence.get(id);}
}
