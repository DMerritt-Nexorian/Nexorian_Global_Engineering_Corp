import {KnowledgeStore} from "./knowledge-store"; import {SearchHit} from "./knowledge-types";
export class HybridRetriever {
  constructor(private store:KnowledgeStore){}
  search(query:string,limit=8):SearchHit[]{
    const q=new Set((query.toLowerCase().match(/[a-z0-9][a-z0-9_-]{2,}/g)||[]));
    return this.store.allChunks().map(c=>{const overlap=c.terms.filter(t=>q.has(t)).length; const score=overlap/Math.max(1,q.size); return {chunk:c,score,method:"lexical" as const};})
      .filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,limit);
  }
}
