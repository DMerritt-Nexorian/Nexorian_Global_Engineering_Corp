import {GitHubClient} from "./github-client";
export class RepoWorkflow {
 constructor(private gh:GitHubClient){}
 async repo(owner:string,repo:string){return this.gh.request(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);}
 async issues(owner:string,repo:string){return this.gh.request(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues?state=open&per_page=30`);}
}
