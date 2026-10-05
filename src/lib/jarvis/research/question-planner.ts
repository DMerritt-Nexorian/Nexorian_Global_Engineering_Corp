import {ResearchQuestion} from "../core/types";
export function planResearch(question:string,domain="general"):ResearchQuestion[]{return question.split(/[?!.]\s*/).filter(Boolean).map((q,i)=>({id:`rq-${i}`,question:q.trim(),domain,terms:[...new Set((q.toLowerCase().match(/[a-z0-9][a-z0-9_-]{2,}/g)||[]))]}));}
