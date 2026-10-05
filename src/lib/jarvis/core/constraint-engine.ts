export interface Constraint<T=unknown>{id:string; test:(value:T)=>boolean; reason:string;}
export class ConstraintEngine<T=unknown>{
  constructor(private constraints:Constraint<T>[]){}
  check(value:T){return this.constraints.filter(c=>!c.test(value)).map(c=>({id:c.id,reason:c.reason}));}
  satisfies(value:T){return this.check(value).length===0;}
}
