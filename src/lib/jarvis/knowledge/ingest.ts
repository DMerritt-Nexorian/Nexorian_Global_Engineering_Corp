import {createHash} from "node:crypto"; import {KnowledgeStore} from "./knowledge-store"; import {normalizeDocument} from "./normalizer"; import {KnowledgeDocument,KnowledgeChunk} from "./knowledge-types";
export class KnowledgeIngestor {
  constructor(private store:KnowledgeStore){}
  ingest(input:{title:string;content:string;source:any;uri?:string;domain?:string}){
    const d=normalizeDocument(input); this.store.putDocument(d);
    const parts=d.content.split(/\n{2,}/).map(x=>x.trim()).filter(Boolean);
    parts.forEach((text,index)=>{const terms=[...new Set((text.toLowerCase().match(/[a-z0-9][a-z0-9_-]{2,}/g)||[]))];
      const e={id:`ev-${createHash("sha256").update(d.id+index).digest("hex").slice(0,20)}`,source:d.source,uri:d.uri,observedAt:d.observedAt,contentHash:d.hash,level:1 as const};
      const c:KnowledgeChunk={id:`${d.id}-c${index}`,documentId:d.id,text,index,terms,evidence:e}; this.store.putChunk(c);
    }); return d;
  }
}
