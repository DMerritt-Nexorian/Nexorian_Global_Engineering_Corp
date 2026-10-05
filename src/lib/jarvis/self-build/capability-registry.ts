import {Capability} from "../core/types";
export class CapabilityRegistry {private map=new Map<string,Capability>(); register(c:Capability){this.map.set(c.id,c)} get(id:string){return this.map.get(id)} list(){return [...this.map.values()]}}
