import {GitHubClient} from "./github-client";
export class PullRequestWorkflow {
 constructor(private gh:GitHubClient){}
 async create(owner:string,repo:string,head:string,base:string,title:string,body:string){
  return this.gh.request(`/repos/${owner}/${repo}/pulls`,{method:"POST",body:JSON.stringify({title,head,base,body}),headers:{"Content-Type":"application/json"}});
 }
}
