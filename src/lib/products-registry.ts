import { ProductCatalogItem } from './types';

export interface ProductRegistryEntry extends ProductCatalogItem {
  buildStatus: 'SUCCESS' | 'PENDING' | 'ACCESS UNVERIFIED';
  demoRoute?: string;
  downloadArtifact?: string;
  sha256Checksum?: string;
  sbomUrl?: string;
  enterprisePriceUSD: number;
}

export const REGISTERED_PRODUCTS: ProductRegistryEntry[] = [
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
    priceUSD: 4999,
    enterprisePriceUSD: 45000,
    buildStatus: 'SUCCESS',
    demoRoute: '/demos/pqc',
    downloadArtifact: '/downloads/nexorian-portal-v1.0.0-staging.tar.gz',
    sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sbomUrl: '/downloads/sbom-nex-portal.json'
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
    description: 'Post-Quantum Cryptography library implementing FIPS 203 (ML-KEM) & FIPS 204 (ML-DSA).',
    priceUSD: 12500,
    enterprisePriceUSD: 120000,
    buildStatus: 'ACCESS UNVERIFIED',
    demoRoute: '/demos/pqc',
    downloadArtifact: '/downloads/core-sec-pqc-v1.0.0.tar.gz',
    sha256Checksum: 'a7c9f82d01e4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8',
    sbomUrl: '/downloads/sbom-core-sec-pqc.json'
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
    priceUSD: 25000,
    enterprisePriceUSD: 250000,
    buildStatus: 'ACCESS UNVERIFIED',
    demoRoute: '/demos/ntt',
    downloadArtifact: '/downloads/core-sec-ntt-rtl.tar.gz',
    sha256Checksum: 'f1e2d3c4b5a69887766554433221100f8e7d6c5b4a3928170615243342516071',
    sbomUrl: '/downloads/sbom-core-sec-ntt.json'
  }
];
