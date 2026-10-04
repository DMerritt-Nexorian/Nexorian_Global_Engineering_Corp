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

export interface ProposedStateTransition {
  actionId: string;
  actionType: string;
  params: any;
  targetResource: string;
  requesterRole: 'PUBLIC' | 'DEVELOPER' | 'FOUNDER' | 'SYSTEM';
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

// Re-export JARVIS Core Contracts from jarvis-contracts.ts
export * from './jarvis-contracts';
