import {createHash} from "node:crypto";
export interface Artifact {path:string;content:string;}
export function manifest(artifacts:Artifact[]){return artifacts.map(a=>({path:a.path,sha256:createHash("sha256").update(a.content).digest("hex"),bytes:Buffer.byteLength(a.content)}));}
