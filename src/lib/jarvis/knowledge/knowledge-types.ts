import {Evidence,SourceKind} from "../core/types";
export interface KnowledgeDocument {id:string;title:string;source:SourceKind;uri?:string;content:string;hash:string;observedAt:string;domain?:string;metadata?:Record<string,unknown>;}
export interface KnowledgeChunk {id:string;documentId:string;text:string;index:number;terms:string[];evidence:Evidence;}
export interface SearchHit {chunk:KnowledgeChunk;score:number;method:"lexical"|"semantic"|"hybrid";}
export interface EmbeddingProvider {embed(text:string):Promise<number[]>;}
