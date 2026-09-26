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

export const PRODUCTS: ProductCatalogItem[] = [
  {
    id: 'NEX-PORTAL',
    name: 'Nexorian Executive Web Portal & VDR',
    repo: 'Nexorian_Global_Engineering_Corp',
    category: 'Web Platform / Data Room',
    proposedStatus: 'STATUS A — TECHNICALLY READY FOR HUMAN REVIEW',
    targetCustomer: 'Enterprise / Investors',
    licenseType: 'Proprietary Commercial',
    platforms: ['Node.js', 'Next.js', 'WASM'],
    description: 'Production Web Portal, 3D WebGL Jarvis entity, and air-gapped Virtual Data Room.',
    priceUSD: 4999
  },
  {
    id: 'NEX-PQC',
    name: 'Core Sec Post-Quantum Cryptography',
    repo: 'CORE_SEC_PQC',
    category: 'Security / Cryptography',
    proposedStatus: 'STATUS C — EXTERNAL VALIDATION REQUIRED',
    targetCustomer: 'Defense / Financial Enterprise',
    licenseType: 'Proprietary Commercial',
    platforms: ['Linux', 'Windows', 'WASM'],
    description: 'Post-Quantum Cryptography library implementing FIPS 203/204 algorithms.',
    priceUSD: 12500
  },
  {
    id: 'NEX-NTT',
    name: 'Core Sec NTT Accelerator',
    repo: 'Core_Sec_NTT',
    category: 'Cryptographic Hardware/SW',
    proposedStatus: 'STATUS C — EXTERNAL VALIDATION REQUIRED',
    targetCustomer: 'Chip Designers / Security OEMs',
    licenseType: 'Commercial IP Licensing',
    platforms: ['Verilog', 'RTL', 'C++'],
    description: 'High-performance Number Theoretic Transform hardware acceleration core.',
    priceUSD: 25000
  }
];
