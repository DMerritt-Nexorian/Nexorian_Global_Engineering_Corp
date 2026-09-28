import { REGISTERED_PRODUCTS, ProductRegistryEntry } from './products-registry';

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

// Re-export canonical REGISTERED_PRODUCTS to prevent legacy imports of PRODUCTS from being outdated
export const PRODUCTS: ProductRegistryEntry[] = REGISTERED_PRODUCTS;
