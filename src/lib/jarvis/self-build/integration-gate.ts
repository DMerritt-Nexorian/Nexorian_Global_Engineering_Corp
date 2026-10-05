import {BuildProposal} from "../core/types";
export interface GateDecision {allowed:boolean;reason:string;}
export function integrationGate(p:BuildProposal,testsPassed:boolean,securityPassed:boolean):GateDecision{
 if(p.risk==="high") return {allowed:false,reason:"High-risk self-built capabilities require explicit external authorization."};
 if(!testsPassed||!securityPassed)return {allowed:false,reason:"Verification gates failed."};
 return {allowed:true,reason:"Candidate passed supplied verification gates; production authorization remains separate."};
}
