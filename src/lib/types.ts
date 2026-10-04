export interface ProductCatalogItem {
  id: string;
  name: string;
  repo: string;
  category: string;
  proposedStatus: string;
  targetCustomer: string;
  licenseType: string;
  platforms: string[];
  description: string;
  priceUSD: number;
}

export interface HumanApprovalEntry {
  approvalId: string;
  actionType: string;
  target: string;
  environment: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approver?: string;
  scope: string;
}

export interface EntitlementRecord {
  licenseId: string;
  customerId: string;
  productId: string;
  purchaseTimestamp: string;
  licenseType: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REFUNDED' | 'REVOKED';
  signature: string;
}

// ============================================================================
// JARVIS & SENTINEL-1 HONEST TYPES
// ============================================================================

export type EpistemicStatus =
  | 'VERIFIED'
  | 'UNVERIFIED'
  | 'OBSERVED'
  | 'DERIVED'
  | 'INFERRED'
  | 'HYPOTHESIZED'
  | 'UNKNOWN'
  | 'CONFLICTING'
  | 'STALE'
  | 'FAILED'
  | 'UNTESTED'
  | 'UNIMPLEMENTED';

export interface ProposedStateTransition {
  actionId: string;
  actionType: string;
  params: any;
  targetResource: string;
  requesterRole: 'PUBLIC' | 'DEVELOPER' | 'FOUNDER';
  timestamp: string;
}

export interface SentinelValidationResult {
  authorized: boolean;
  reason: string;
  invariantsSatisfied: boolean;
  authorizationToken?: string;
  signatureAuditId?: string;
  pqcAlgorithm?: string;
}

export interface JarvisQueryRequest {
  query: string;
  context?: 'PUBLIC' | 'FOUNDER' | 'DEVELOPER';
  sessionToken?: string;
}

export interface JarvisQueryResponse {
  answer: string;
  truthState: EpistemicStatus;
  evidenceLevel: string;
  evidenceDetails: string;
  governanceStatus: string;
  executionTrace?: {
    actionId: string;
    actionType: string;
    sentinelValidation: SentinelValidationResult;
    resultOutput?: any;
    executionTimeMs: number;
  }[];
  relatedProducts?: any[];
  cognitionCost: {
    cpuMs: number;
    memoryMB: number | 'UNMEASURED';
    cryptoOpsCount: number;
    economicCost: 'UNMEASURED';
  };
}
