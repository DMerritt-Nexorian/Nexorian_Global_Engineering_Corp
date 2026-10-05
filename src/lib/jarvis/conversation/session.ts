export interface Turn {role:"user"|"assistant"|"system";content:string;at:string;}
export class SessionState {private turns:Turn[]=[]; add(role:Turn["role"],content:string){this.turns.push({role,content,at:new Date().toISOString()})} recent(n=20){return this.turns.slice(-n)}}
