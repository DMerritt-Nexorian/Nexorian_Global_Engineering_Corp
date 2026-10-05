import {KnowledgeDocument,KnowledgeChunk} from "./knowledge-types";
export class KnowledgeStore {
  private docs=new Map<string,KnowledgeDocument>(); private chunks=new Map<string,KnowledgeChunk>();
  putDocument(d:KnowledgeDocument){this.docs.set(d.id,d)}
  putChunk(c:KnowledgeChunk){this.chunks.set(c.id,c)}
  getDocument(id:string){return this.docs.get(id)}
  allChunks(){return [...this.chunks.values()]}
}
