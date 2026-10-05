import {ExecutionResult} from "../core/types"; import {SandboxRunner,validateCommand} from "./sandbox-runner";
export class TestOrchestrator {
 constructor(private runner:SandboxRunner){}
 async run(c:string,args:string[],cwd:string,timeoutMs=120000):Promise<ExecutionResult>{validateCommand(c);return this.runner.run(c,args,{cwd,timeoutMs});}
}
