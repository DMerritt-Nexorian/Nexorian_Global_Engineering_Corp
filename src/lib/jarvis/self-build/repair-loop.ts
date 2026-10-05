import {ExecutionResult} from "../core/types";
export interface RepairStrategy {repair(previous:ExecutionResult,attempt:number):Promise<void>;}
export class RepairLoop {constructor(private maxAttempts=3){} async run(exec:()=>Promise<ExecutionResult>,repair:RepairStrategy){let last=await exec();for(let i=1;i<=this.maxAttempts&&!last.ok;i++){await repair.repair(last,i);last=await exec()}return last;}}
