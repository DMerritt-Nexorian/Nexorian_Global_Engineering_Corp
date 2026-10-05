import {Goal} from "./types";
export class GoalEngine {
  normalize(description:string, priority=0):Goal{return {id:`goal-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,description,constraints:[],successCriteria:[],priority};}
  unmet(goal:Goal, evidence:string[]){return goal.successCriteria.filter(x=>!evidence.includes(x));}
}
