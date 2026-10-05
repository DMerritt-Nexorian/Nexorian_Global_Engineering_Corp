import {Hypothesis} from "./types";
export class HypothesisEngine {
  rank(items:Hypothesis[]){return [...items].sort((a,b)=>b.score-a.score);}
  compare(a:Hypothesis,b:Hypothesis){return {winner:a.score===b.score?"tie":a.score>b.score?a.id:b.id, delta:Math.abs(a.score-b.score)};}
}
