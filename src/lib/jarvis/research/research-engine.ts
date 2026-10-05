import {ResearchQuestion} from "../core/types"; import {HybridRetriever} from "../knowledge/retriever";
export class ResearchEngine {
  constructor(private retriever:HybridRetriever){}
  investigate(q:ResearchQuestion){return this.retriever.search([q.question,...q.terms].join(" "),10);}
}
