import { Edge,Node,Claim,WorldState } from "./types"; import {sha256} from "./canonical";
export class WorldModel {
  private nodes=new Map<string,Node>(); private edges=new Map<string,Edge>(); private claims=new Map<string,Claim>();
  upsertNode(n:Node){this.nodes.set(n.id,n)}; upsertEdge(e:Edge){this.edges.set(e.id,e)}; upsertClaim(c:Claim){this.claims.set(c.id,c)}
  snapshot(asOf=new Date().toISOString()):WorldState {
    const s={nodes:[...this.nodes.values()],edges:[...this.edges.values()],claims:[...this.claims.values()],asOf};
    return {...s,fingerprint:sha256(s)};
  }
  related(id:string){return [...this.edges.values()].filter(e=>e.from===id||e.to===id);}
}
