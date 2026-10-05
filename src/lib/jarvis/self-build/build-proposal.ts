import {BuildProposal} from "../core/types"; import {sha256} from "../core/canonical";
export function makeBuildProposal(p:Omit<BuildProposal,"id">):BuildProposal{return {...p,id:`proposal-${sha256(p).slice(0,20)}`};}
