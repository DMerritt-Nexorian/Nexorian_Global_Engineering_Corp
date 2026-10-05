import {Goal,Hypothesis,WorldState} from "./types";
export class ReasoningEngine {
  analyze(goal:Goal, world:WorldState):{known:number;unknown:number;contradicted:number;hypotheses:Hypothesis[]}{
    const claims=world.claims;
    const known=claims.filter(c=>c.truth==="VERIFIED"||c.truth==="OBSERVED").length;
    const unknown=claims.filter(c=>c.truth==="UNKNOWN"||c.truth==="INFERRED").length;
    const contradicted=claims.filter(c=>c.truth==="CONTRADICTED").length;
    return {known,unknown,contradicted,hypotheses:[]};
  }
}
