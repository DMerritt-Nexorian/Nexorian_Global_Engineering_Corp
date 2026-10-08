import { ProductCatalogItem } from "./types";

export type ImplementationStatus =
  | "IMPLEMENTED"
  | "EXPERIMENTAL"
  | "PARTIALLY_IMPLEMENTED"
  | "UNVERIFIED"
  | "NOT_IMPLEMENTED";

export type CommercialOffer = "NOT_OFFERED" | "INTERNAL_ONLY";

export interface ProductRegistryEntry extends ProductCatalogItem {
  implementationStatus: ImplementationStatus;
  commercialOffer: CommercialOffer;
  publicVisible: boolean;
  founderVisible: boolean;
  forSaleOrLease: false;
  demoRoute?: string;
  demoNote?: string;
  limitations: string;
  evidence: string;
}

/**
 * The portal repository is the operating surface. It is not a catalog product.
 * Prices are omitted because no approved commercial offer exists in this repository.
 */
export const REGISTERED_PRODUCTS: ProductRegistryEntry[] = [
  {
    id: "NEX-PQC",
    name: "Core Sec Post-Quantum Cryptography",
    repo: "CORE_SEC_PQC",
    category: "Cryptography",
    proposedStatus: "EXTERNAL VALIDATION REQUIRED",
    targetCustomer: "Not offered",
    licenseType: "Not issued from this portal",
    platforms: ["Unverified in this repository"],
    description: "Named cryptography repository. This portal does not contain a certified ML-KEM or ML-DSA implementation.",
    priceUSD: 0,
    implementationStatus: "EXPERIMENTAL",
    commercialOffer: "NOT_OFFERED",
    publicVisible: true,
    founderVisible: true,
    forSaleOrLease: false,
    demoRoute: "/demos/pqc",
    demoNote: "Portal demonstration of an experimental lattice polynomial kernel over F_12289. Not FIPS 203 or FIPS 204.",
    limitations: "Experimental only. Not certified. Remote repository contents were not verified by this build.",
    evidence: "Local module src/lib/pqc-kernel.ts. Remote repo CORE_SEC_PQC is not vendored here."
  },
  {
    id: "NEX-NTT",
    name: "Core Sec NTT",
    repo: "Core_Sec_NTT",
    category: "Finite-field arithmetic",
    proposedStatus: "EXTERNAL VALIDATION REQUIRED",
    targetCustomer: "Not offered",
    licenseType: "Not issued from this portal",
    platforms: ["TypeScript demonstration in this portal", "Rust repository not vendored"],
    description: "Number-theoretic transform work. This portal runs an N=8 demonstration over q=12289. The Rust repository is separate and contains Kani harnesses.",
    priceUSD: 0,
    implementationStatus: "EXPERIMENTAL",
    commercialOffer: "NOT_OFFERED",
    publicVisible: true,
    founderVisible: true,
    forSaleOrLease: false,
    demoRoute: "/demos/ntt",
    demoNote: "Deterministic forward and inverse NTT on an 8-coefficient polynomial. This is not the Rust core and is not a hardware accelerator.",
    limitations: "Demonstration size is N=8. Kani proofs live in Core_Sec_NTT, not in this portal repository.",
    evidence: "src/lib/ntt-kernel.ts recovers the input polynomial under the tests in this repository."
  },
  {
    id: "NEX-VITA",
    name: "Vita Crypto Wealth",
    repo: "Vita-Crypto-Wealth",
    category: "Separate repository",
    proposedStatus: "UNVERIFIED FROM THIS PORTAL",
    targetCustomer: "Not offered",
    licenseType: "Not issued from this portal",
    platforms: ["Unverified in this repository"],
    description: "Separate repository. This portal does not execute its contracts or payment flows.",
    priceUSD: 0,
    implementationStatus: "UNVERIFIED",
    commercialOffer: "NOT_OFFERED",
    publicVisible: true,
    founderVisible: true,
    forSaleOrLease: false,
    limitations: "No lease, no custody, and no execution from this application.",
    evidence: "Name and repository only. Contents were not verified by this build."
  },
  {
    id: "NEX-GTLM",
    name: "HD-GTLM",
    repo: "HD-GTLM",
    category: "Separate repository",
    proposedStatus: "DEVELOPMENT",
    targetCustomer: "Not offered",
    licenseType: "Not issued from this portal",
    platforms: ["Unverified in this repository"],
    description: "Named hardware-control repository. No RTL from that repository is built by this portal.",
    priceUSD: 0,
    implementationStatus: "UNVERIFIED",
    commercialOffer: "NOT_OFFERED",
    publicVisible: true,
    founderVisible: true,
    forSaleOrLease: false,
    limitations: "No artifact, checksum, or demonstration is published here.",
    evidence: "Catalog entry only."
  },
  {
    id: "NEX-GEN",
    name: "Core Gen",
    repo: "Core_Gen",
    category: "Separate repository",
    proposedStatus: "RESEARCH",
    targetCustomer: "Not offered",
    licenseType: "Not issued from this portal",
    platforms: ["Unverified in this repository"],
    description: "Named research repository. No genomic model runs in this portal.",
    priceUSD: 0,
    implementationStatus: "UNVERIFIED",
    commercialOffer: "NOT_OFFERED",
    publicVisible: true,
    founderVisible: true,
    forSaleOrLease: false,
    limitations: "No research license is issued by this application.",
    evidence: "Catalog entry only."
  },
  {
    id: "NEX-GLOBAL",
    name: "Core Global",
    repo: "CORE_GLOBAL",
    category: "Separate repository",
    proposedStatus: "DEVELOPMENT",
    targetCustomer: "Not offered",
    licenseType: "Not issued from this portal",
    platforms: ["Unverified in this repository"],
    description: "Named networking repository. This portal does not operate a mesh network.",
    priceUSD: 0,
    implementationStatus: "UNVERIFIED",
    commercialOffer: "NOT_OFFERED",
    publicVisible: true,
    founderVisible: true,
    forSaleOrLease: false,
    limitations: "No nodes, deployment, or lease.",
    evidence: "Catalog entry only."
  },
  {
    id: "NEX-TIME",
    name: "Core Quantum Time",
    repo: "Core_Quantum_Time",
    category: "Separate repository",
    proposedStatus: "RESEARCH",
    targetCustomer: "Not offered",
    licenseType: "Not issued from this portal",
    platforms: ["Unverified in this repository"],
    description: "Listed in the catalog markdown and absent from the previous code registry. No timing product runs here.",
    priceUSD: 0,
    implementationStatus: "UNVERIFIED",
    commercialOffer: "NOT_OFFERED",
    publicVisible: true,
    founderVisible: true,
    forSaleOrLease: false,
    limitations: "Not a quantum computer and not a leased product.",
    evidence: "PRODUCT_CATALOG.md entry only."
  },
  {
    id: "NEX-ICC",
    name: "Integrated Control Core",
    repo: "Integrated_Control_Core",
    category: "Separate repository",
    proposedStatus: "DEVELOPMENT",
    targetCustomer: "Not offered",
    licenseType: "Not issued from this portal",
    platforms: ["Unverified in this repository"],
    description: "Listed in the catalog markdown and absent from the previous code registry. No control runtime is included.",
    priceUSD: 0,
    implementationStatus: "UNVERIFIED",
    commercialOffer: "NOT_OFFERED",
    publicVisible: true,
    founderVisible: true,
    forSaleOrLease: false,
    limitations: "No industrial controller is operated by this portal.",
    evidence: "PRODUCT_CATALOG.md entry only."
  },
  {
    id: "NEX-BMS",
    name: "Solid State BMS",
    repo: "Solid_State_BMS",
    category: "Separate repository",
    proposedStatus: "DEVELOPMENT",
    targetCustomer: "Not offered",
    licenseType: "Not issued from this portal",
    platforms: ["Unverified in this repository"],
    description: "Named battery-management repository. No firmware image is served here.",
    priceUSD: 0,
    implementationStatus: "UNVERIFIED",
    commercialOffer: "NOT_OFFERED",
    publicVisible: true,
    founderVisible: true,
    forSaleOrLease: false,
    limitations: "No safety certification and no download.",
    evidence: "Catalog entry only."
  },
  {
    id: "NEX-AGRI",
    name: "Core Agri",
    repo: "CORE_AGRI",
    category: "Separate repository",
    proposedStatus: "DEVELOPMENT",
    targetCustomer: "Not offered",
    licenseType: "Not issued from this portal",
    platforms: ["Unverified in this repository"],
    description: "Named agricultural-systems repository. No device control is exposed here.",
    priceUSD: 0,
    implementationStatus: "UNVERIFIED",
    commercialOffer: "NOT_OFFERED",
    publicVisible: true,
    founderVisible: true,
    forSaleOrLease: false,
    limitations: "No field hardware is connected.",
    evidence: "Catalog entry only."
  },
  {
    id: "NEX-DAGM",
    name: "Sentinel policy gate",
    repo: "Nexorian_Global_Engineering_Corp",
    category: "Portal module",
    proposedStatus: "EXPERIMENTAL LOCAL MODULE",
    targetCustomer: "Not offered",
    licenseType: "Not a separate product",
    platforms: ["TypeScript, this repository"],
    description: "Local action gate used by Jarvis. It is a policy check in this repository, not a separate mesh product and not for lease.",
    priceUSD: 0,
    implementationStatus: "PARTIALLY_IMPLEMENTED",
    commercialOffer: "INTERNAL_ONLY",
    publicVisible: false,
    founderVisible: true,
    forSaleOrLease: false,
    limitations: "Role is taken from the request context. It is not authentication.",
    evidence: "src/lib/sentinel-dagm.ts"
  }
];

export const PORTAL_SURFACE = {
  id: "NEXORIAN-PORTAL",
  name: "Nexorian Global Engineering Corp",
  role: "Operating surface for this repository. Not an asset offered for sale or lease.",
  forSaleOrLease: false as const
};

export function getRegisteredProductById(id: string): ProductRegistryEntry | undefined {
  const key = id.toLowerCase();
  return REGISTERED_PRODUCTS.find(
    (p) => p.id.toLowerCase() === key || p.repo.toLowerCase() === key
  );
}

export function publicProducts(): ProductRegistryEntry[] {
  return REGISTERED_PRODUCTS.filter((p) => p.publicVisible && p.forSaleOrLease === false);
}
