import {createJarvisRuntime} from "./runtime"; import {planResearch} from "./research/question-planner";
export class JarvisCore {
 readonly runtime=createJarvisRuntime();
 research(question:string,domain="general"){return this.runtime.research.investigate(planResearch(question,domain)[0]);}
 ingest(input:Parameters<typeof this.runtime.ingest.ingest>[0]){return this.runtime.ingest.ingest(input);}
 status(){return {knowledgeChunks:this.runtime.store.allChunks().length,capabilities:this.runtime.capabilities.list().length,world:this.runtime.world.snapshot()};}
}
