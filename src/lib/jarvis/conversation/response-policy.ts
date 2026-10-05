export interface ResponsePolicy {maxClaims:number;requireEvidenceForActions:boolean;proactive:boolean;}
export const conservativeResponsePolicy:ResponsePolicy={maxClaims:12,requireEvidenceForActions:true,proactive:true};
