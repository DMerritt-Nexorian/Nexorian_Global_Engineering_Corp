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
    description: 'Post-Quantum Cryptography suite implementing FIPS 203 (ML-KEM) & FIPS 204 (ML-DSA).',
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
    description: 'High-performance Number Theoretic Transform polynomial arithmetic core over prime moduli.',
    priceUSD: 25000,
    enterprisePriceUSD: 250000,
    buildStatus: 'ACCESS UNVERIFIED',
    demoRoute: '/demos/ntt',
    downloadArtifact: '/downloads/core-sec-ntt-rtl.tar.gz',
    sha256Checksum: 'f1e2d3c4b5a69887766554433221100f8e7d6c5b4a3928170615243342516071',
    sbomUrl: '/downloads/sbom-core-sec-ntt.json'
  },
  {
    id: 'NEX-DAGM',
    name: 'Nexorian DAGM Guardrail Mesh',
    repo: 'Nexorian_DAGM_Guardrail',
    category: 'AI Safety / Execution Control',
    proposedStatus: 'STATUS A — TECHNICALLY READY FOR HUMAN REVIEW',
    targetCustomer: 'AI Enterprise & Defense',
    licenseType: 'Proprietary Commercial',
    platforms: ['Rust', 'TypeScript'],
    description: 'Deterministic Autonomous Guardrail Mesh & Proof-Before-Trust Execution Kernel.',
    priceUSD: 15000,
    enterprisePriceUSD: 150000,
    buildStatus: 'SUCCESS',
    demoRoute: '/demos/pqc',
    downloadArtifact: '/downloads/nexorian-dagm-v1.0.0.tar.gz',
    sha256Checksum: 'b82d01e4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8a7c9',
    sbomUrl: '/downloads/sbom-nex-dagm.json'
  },
  {
    id: 'NEX-VITA',
    name: 'Vita Crypto Wealth Engine',
    repo: 'Vita-Crypto-Wealth',
    category: 'Web3 / FinTech',
    proposedStatus: 'STATUS B — CONDITIONAL RELEASE',
    targetCustomer: 'Crypto Wealth Managers',
    licenseType: 'Proprietary Commercial',
    platforms: ['Solidity', 'EVM', 'TypeScript'],
    description: 'Automated DeFi asset allocation and smart contract wealth management engine.',
    priceUSD: 9900,
    enterprisePriceUSD: 95000,
    buildStatus: 'ACCESS UNVERIFIED',
    downloadArtifact: '/downloads/vita-crypto-v1.0.0.tar.gz',
    sha256Checksum: 'c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8a7c9f82d01e4b3',
    sbomUrl: '/downloads/sbom-vita-crypto.json'
  },
  {
    id: 'NEX-GTLM',
    name: 'HD-GTLM Computational Engine',
    repo: 'HD-GTLM',
    category: 'Semiconductor IP / RTL',
    proposedStatus: 'STATUS D — DEVELOPMENT',
    targetCustomer: 'Semiconductor OEMs',
    licenseType: 'Commercial IP Licensing',
    platforms: ['SystemVerilog', 'Verilog', 'Rust'],
    description: 'High-determinism computational engine and hardware control RTL IP core.',
    priceUSD: 35000,
    enterprisePriceUSD: 350000,
    buildStatus: 'ACCESS UNVERIFIED',
    downloadArtifact: '/downloads/hd-gtlm-rtl-v1.0.0.tar.gz',
    sha256Checksum: 'd1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8a7c9f82d01e4b3c2',
    sbomUrl: '/downloads/sbom-hd-gtlm.json'
  },
  {
    id: 'NEX-GEN',
    name: 'Core Gen Bio-Intelligence System',
    repo: 'Core_Gen',
    category: 'Bio-AI / Genomic Engine',
    proposedStatus: 'STATUS E — RESEARCH / EXPERIMENTAL',
    targetCustomer: 'Biotech / Research Institutions',
    licenseType: 'Evaluation / Research License',
    platforms: ['Linux', 'Python', 'PyTorch', 'CUDA'],
    description: 'Bio-intelligence & genomic analysis autonomous computational framework.',
    priceUSD: 0,
    enterprisePriceUSD: 200000,
    buildStatus: 'ACCESS UNVERIFIED',
    downloadArtifact: '/downloads/core-gen-v1.0.0.tar.gz',
    sha256Checksum: 'e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8a7c9f82d01e4b3c2d1',
    sbomUrl: '/downloads/sbom-core-gen.json'
  },
  {
    id: 'NEX-GLOBAL',
    name: 'Core Global Autonomous Mesh Network',
    repo: 'CORE_GLOBAL',
    category: 'Infrastructure / Mesh Networking',
    proposedStatus: 'STATUS D — DEVELOPMENT',
    targetCustomer: 'Industrial / Telecom Enterprises',
    licenseType: 'Enterprise Commercial',
    platforms: ['Go', 'Rust', 'Linux', 'Docker'],
    description: 'Autonomous distributed mesh network & resilient global node architecture.',
    priceUSD: 8500,
    enterprisePriceUSD: 85000,
    buildStatus: 'ACCESS UNVERIFIED',
    downloadArtifact: '/downloads/core-global-v1.0.0.tar.gz',
    sha256Checksum: 'f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8a7c9f82d01e4b3c2d1e0',
    sbomUrl: '/downloads/sbom-core-global.json'
  },
  {
    id: 'NEX-BMS',
    name: 'Solid State BMS Controller',
    repo: 'Solid_State_BMS',
    category: 'Energy / Battery Management',
    proposedStatus: 'STATUS D — DEVELOPMENT',
    targetCustomer: 'EV & Energy Storage OEMs',
    licenseType: 'Proprietary Commercial',
    platforms: ['Embedded C', 'RTL', 'ARM Cortex'],
    description: 'Solid-state battery management system controller and safety firmware core.',
    priceUSD: 20000,
    enterprisePriceUSD: 220000,
    buildStatus: 'ACCESS UNVERIFIED',
    downloadArtifact: '/downloads/solid-state-bms-v1.0.0.tar.gz',
    sha256Checksum: 'a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8a7c9f82d01e4b3c2d1e0f9',
    sbomUrl: '/downloads/sbom-solid-state-bms.json'
  },
  {
    id: 'NEX-AGRI',
    name: 'Core Agri Autonomous Systems',
    repo: 'CORE_AGRI',
    category: 'AgTech / Embedded Control',
    proposedStatus: 'STATUS D — DEVELOPMENT',
    targetCustomer: 'Industrial Agriculture OEMs',
    licenseType: 'Proprietary Commercial',
    platforms: ['Python', 'C++', 'IoT Drivers', 'Linux'],
    description: 'Agricultural tech autonomous hardware & environmental control platform.',
    priceUSD: 7500,
    enterprisePriceUSD: 75000,
    buildStatus: 'ACCESS UNVERIFIED',
    downloadArtifact: '/downloads/core-agri-v1.0.0.tar.gz',
    sha256Checksum: 'b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8a7c9f82d01e4b3c2d1e0f9a8',
    sbomUrl: '/downloads/sbom-core-agri.json'
  }
];

export function getRegisteredProductById(id: string): ProductRegistryEntry | undefined {
  return REGISTERED_PRODUCTS.find(p => p.id.toUpperCase() === id.toUpperCase() || p.repo.toLowerCase() === id.toLowerCase());
}
