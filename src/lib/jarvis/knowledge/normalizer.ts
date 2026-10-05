import {sha256} from "../core/canonical"; import {KnowledgeDocument} from "./knowledge-types";
export function normalizeDocument(input:{title:string;content:string;source:any;uri?:string;domain?:string}):KnowledgeDocument{
  const content=input.content.replace(/\r\n/g,"\n").replace(/[ \t]+/g," ").trim();
  return {id:`doc-${sha256({title:input.title,content}).slice(0,20)}`,title:input.title,content,source:input.source,uri:input.uri,hash:sha256(content),observedAt:new Date().toISOString(),domain:input.domain};
}
