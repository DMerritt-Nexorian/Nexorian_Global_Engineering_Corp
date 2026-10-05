import {KnowledgeStore} from "./knowledge-store";
export class KnowledgeConsolidator {
  constructor(private store:KnowledgeStore){}
  deduplicate(){const seen=new Set<string>();let removed=0;for(const c of this.store.allChunks()){if(seen.has(c.evidence.contentHash))removed++;else seen.add(c.evidence.contentHash)}return {duplicateCount:removed};}
}
