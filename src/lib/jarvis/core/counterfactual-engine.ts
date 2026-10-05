export interface Counterfactual<T>{baseline:T; intervention:T; evaluate:(x:T)=>number;}
export class CounterfactualEngine {
  compare<T>(c:Counterfactual<T>){const a=c.evaluate(c.baseline),b=c.evaluate(c.intervention); return {baseline:a,intervention:b,delta:b-a};}
}
