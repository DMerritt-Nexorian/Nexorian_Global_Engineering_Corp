import * as fs from "fs";
import * as path from "path";
import { JarvisQueryRequest, JarvisQueryResponse, ProposedStateTransition } from "./types";
import { SentinelGuard } from "./sentinel-dagm";
import { executeNTTTransformation } from "./ntt-kernel";
import {
  generateExperimentalDsaKeypair,
  signExperimentalDsaMessage,
  verifyExperimentalDsaSignature,
  generateExperimentalKemKeypair,
  encapsulateExperimentalKem,
  decapsulateExperimentalKem,
  zeroizeSecretKeyHandle
} from "./pqc-kernel";
import { PORTAL_SURFACE, REGISTERED_PRODUCTS, publicProducts } from "./products-registry";

const ROOT = process.cwd();

function cost(start: number, cryptoOpsCount: number) {
  return {
    cpuMs: Date.now() - start,
    memoryMB: Math.round(process.memoryUsage().heapUsed / (1024 * 1024)),
    cryptoOpsCount,
    economicCost: "UNMEASURED" as const
  };
}

function confined(filepath: string): string | null {
  const safePath = path.resolve(ROOT, filepath);
  const rootWithSep = ROOT.endsWith(path.sep) ? ROOT : ROOT + path.sep;
  if (safePath !== ROOT && !safePath.startsWith(rootWithSep)) return null;
  return safePath;
}

export class JarvisEngine {
  public static readSourceFile(filepath: string): { success: boolean; content?: string; error?: string } {
    try {
      const safePath = confined(filepath);
      if (!safePath) return { success: false, error: "Access denied: Path traversal outside repository root." };
      const stat = fs.statSync(safePath);
      if (!stat.isFile()) return { success: false, error: "Path is not a file." };
      if (stat.size > 200_000) return { success: false, error: "File exceeds the 200 KB read limit." };
      return { success: true, content: fs.readFileSync(safePath, "utf8") };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  public static async executeAction(
    actionType: string,
    params: any,
    requesterRole: "PUBLIC" | "DEVELOPER" | "FOUNDER" = "DEVELOPER"
  ): Promise<{ success: boolean; message: string; auditId: string; result?: any }> {
    const actionId = `ACT-DIR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const proposal: ProposedStateTransition = {
      actionId,
      actionType,
      params,
      targetResource: "system_action_bus",
      requesterRole,
      timestamp: new Date().toISOString()
    };
    const sentinelVal = await SentinelGuard.validateAction(proposal);
    if (!sentinelVal.authorized) return { success: false, message: sentinelVal.reason, auditId: actionId };

    if (actionType === "INSPECT_REPOSITORY") {
      const target = confined(params?.dirPath || ".");
      if (!target) return { success: false, message: "Access denied: Path traversal outside repository root.", auditId: actionId };
      try {
        const files = fs.readdirSync(target);
        return {
          success: true,
          message: `Inspected directory ${target}, found ${files.length} items.`,
          auditId: actionId,
          result: { path: target, fileCount: files.length, files: files.slice(0, 20) }
        };
      } catch (e: any) {
        return { success: false, message: `Failed to inspect directory: ${e.message}`, auditId: actionId };
      }
    }

    if (actionType === "READ_SOURCE_FILE") {
      const res = this.readSourceFile(params?.filepath || "");
      return {
        success: res.success,
        message: res.success ? `Read file ${params?.filepath} successfully.` : `File read failed: ${res.error}`,
        auditId: actionId,
        result: res.content ? { sizeBytes: res.content.length } : null
      };
    }

    if (actionType === "RUN_NTT_TRANSFORM") {
      const inputPoly = params?.poly || [12, 45, 102, 3, 0, 89, 500, 120];
      const res = executeNTTTransformation(inputPoly);
      return {
        success: res.verified,
        message: res.verified ? "NTT Forward/Inverse transform verified over F_12289." : "NTT recovery failed.",
        auditId: actionId,
        result: res
      };
    }

    if (actionType === "RUN_PQC_SIGNATURE") {
      const kp = await generateExperimentalDsaKeypair();
      const sig = await signExperimentalDsaMessage(kp.secretKeyHandle, params?.message || "DEFAULT_MESSAGE");
      const ver = await verifyExperimentalDsaSignature(
        kp.publicKeyHex,
        params?.message || "DEFAULT_MESSAGE",
        sig.signatureHex,
        kp.secretKeyHandle
      );
      zeroizeSecretKeyHandle(kp.secretKeyHandle);
      return {
        success: ver.verified,
        message: ver.verified ? "Experimental Lattice Signature verified." : "Signature verification failed.",
        auditId: actionId,
        result: { publicKeyHex: kp.publicKeyHex, signatureHex: sig.signatureHex, verified: ver.verified }
      };
    }

    return {
      success: false,
      message: `UNIMPLEMENTED: Action type ${actionType} is not bound to an executable tool capability.`,
      auditId: actionId
    };
  }

  public static async processQuery(req: JarvisQueryRequest): Promise<JarvisQueryResponse> {
    const startTime = Date.now();
    const q = (req.query || "").trim();
    const lowerQ = q.toLowerCase();
    const role = req.context === "FOUNDER" ? "FOUNDER" : req.context === "DEVELOPER" ? "DEVELOPER" : "PUBLIC";
    let cryptoOpsCount = 0;
    const executionTrace: any[] = [];

    await SentinelGuard.initializeIdentity();

    if (lowerQ.includes("inspect") || lowerQ.includes("files") || lowerQ.includes("repo") || lowerQ.includes("directory")) {
      const proposal: ProposedStateTransition = {
        actionId: `ACT-INSPECT-${Date.now()}`,
        actionType: "INSPECT_REPOSITORY",
        params: {},
        targetResource: "repository_root",
        requesterRole: role,
        timestamp: new Date().toISOString()
      };
      const sentinelVal = await SentinelGuard.validateAction(proposal);
      cryptoOpsCount++;
      if (sentinelVal.authorized) {
        const files = fs.readdirSync(ROOT);
        executionTrace.push({
          actionId: proposal.actionId,
          actionType: proposal.actionType,
          sentinelValidation: sentinelVal,
          resultOutput: { path: ROOT, fileCount: files.length, topFiles: files.slice(0, 15) },
          executionTimeMs: Date.now() - startTime
        });
        return {
          answer: `Repository inspection executed cleanly. Verified ${files.length} top-level files in the portal workspace. This is the portal repository only, not a 20-repository inventory.`,
          truthState: "VERIFIED",
          evidenceLevel: "LEVEL 3",
          evidenceDetails: `fs.readdirSync recorded ${files.length} items.`,
          governanceStatus: sentinelVal.reason,
          executionTrace,
          relatedProducts: publicProducts(),
          cognitionCost: cost(startTime, cryptoOpsCount)
        };
      }
    }

    if (lowerQ.includes("pqc") || lowerQ.includes("sign") || lowerQ.includes("kem") || lowerQ.includes("dsa") || lowerQ.includes("cryptography")) {
      const isKem = lowerQ.includes("kem");
      const actionType = isKem ? "RUN_PQC_ENCAPSULATION" : "RUN_PQC_SIGNATURE";
      const proposal: ProposedStateTransition = {
        actionId: `ACT-PQC-${Date.now()}`,
        actionType,
        params: { message: q },
        targetResource: "pqc_security_kernel",
        requesterRole: role,
        timestamp: new Date().toISOString()
      };
      const sentinelVal = await SentinelGuard.validateAction(proposal);
      cryptoOpsCount += 2;
      if (sentinelVal.authorized) {
        let output: any;
        if (isKem) {
          const kp = await generateExperimentalKemKeypair();
          const enc = await encapsulateExperimentalKem(kp.publicKeyHex);
          const dec = await decapsulateExperimentalKem(kp.secretKeyHandle, enc.result.ciphertextHex, enc.rawSharedSecret, false);
          output = { publicKeyHex: kp.publicKeyHex, ciphertextHex: enc.result.ciphertextHex, sharedSecretMatch: dec.sharedSecretMatch };
          zeroizeSecretKeyHandle(kp.secretKeyHandle);
        } else {
          const kp = await generateExperimentalDsaKeypair();
          const sig = await signExperimentalDsaMessage(kp.secretKeyHandle, `JARVIS DIRECTIVE: ${q}`);
          const ver = await verifyExperimentalDsaSignature(kp.publicKeyHex, `JARVIS DIRECTIVE: ${q}`, sig.signatureHex, kp.secretKeyHandle);
          output = { publicKeyHex: kp.publicKeyHex, signatureHex: sig.signatureHex, verified: ver.verified };
          zeroizeSecretKeyHandle(kp.secretKeyHandle);
        }
        executionTrace.push({
          actionId: proposal.actionId,
          actionType,
          sentinelValidation: sentinelVal,
          resultOutput: output,
          executionTimeMs: Date.now() - startTime
        });
        return {
          answer: `Experimental Post-Quantum Lattice Cryptography operation (${actionType}) executed over F_12289. This is not FIPS 203 or FIPS 204, and it is not a certification.`,
          truthState: "VERIFIED",
          evidenceLevel: "LEVEL 3",
          evidenceDetails: `Local experimental kernel completed ${actionType}. Secret handle zeroized.`,
          governanceStatus: sentinelVal.reason,
          executionTrace,
          relatedProducts: REGISTERED_PRODUCTS.filter((p) => p.id === "NEX-NTT" || p.id === "NEX-PQC"),
          cognitionCost: cost(startTime, cryptoOpsCount)
        };
      }
    }

    if (lowerQ.includes("ntt") || lowerQ.includes("galois") || lowerQ.includes("arithmetic") || lowerQ.includes("polynomial")) {
      const proposal: ProposedStateTransition = {
        actionId: `ACT-NTT-${Date.now()}`,
        actionType: "RUN_NTT_TRANSFORM",
        params: { poly: [12, 45, 102, 3, 0, 89, 500, 120] },
        targetResource: "ntt_kernel",
        requesterRole: role,
        timestamp: new Date().toISOString()
      };
      const sentinelVal = await SentinelGuard.validateAction(proposal);
      cryptoOpsCount++;
      if (sentinelVal.authorized) {
        const inputPoly = [12, 45, 102, 3, 0, 89, 500, 120];
        const res = executeNTTTransformation(inputPoly);
        executionTrace.push({
          actionId: proposal.actionId,
          actionType: proposal.actionType,
          sentinelValidation: sentinelVal,
          resultOutput: res,
          executionTimeMs: Date.now() - startTime
        });
        return {
          answer: `Number Theoretic Transform (NTT) polynomial arithmetic executed over prime field q=12289 with primitive root omega=4043. INNTT(NTT(A)) === A recovery ${res.verified ? "verified" : "failed"}.`,
          truthState: res.verified ? "VERIFIED" : "FAILED",
          evidenceLevel: "LEVEL 3",
          evidenceDetails: "Exact polynomial recovery checked by the local N=8 kernel.",
          governanceStatus: sentinelVal.reason,
          executionTrace,
          relatedProducts: REGISTERED_PRODUCTS.filter((p) => p.id === "NEX-NTT" || p.id === "NEX-PQC"),
          cognitionCost: cost(startTime, cryptoOpsCount)
        };
      }
    }

    if (lowerQ.includes("founder") || lowerQ.includes("gate") || lowerQ.includes("approval") || lowerQ.includes("dennis") || lowerQ.includes("license")) {
      const proposal: ProposedStateTransition = {
        actionId: `ACT-GOV-${Date.now()}`,
        actionType: "FOUNDER_GOVERNANCE_INSPECT",
        params: {},
        targetResource: "GOVERNANCE_REGISTER",
        requesterRole: role,
        timestamp: new Date().toISOString()
      };
      const sentinelVal = await SentinelGuard.validateAction(proposal);
      cryptoOpsCount++;
      if (!sentinelVal.authorized) {
        return {
          answer: `Access Refused: ${sentinelVal.reason}`,
          truthState: "OBSERVED",
          evidenceLevel: "LEVEL 1",
          evidenceDetails: "Refusal enforced by Sentinel-1 role-based policy.",
          governanceStatus: sentinelVal.reason,
          cognitionCost: cost(startTime, cryptoOpsCount)
        };
      }
      const gov = this.readSourceFile("HUMAN_APPROVAL_REGISTER.md");
      const ip = this.readSourceFile("NEXORIAN_IP_ASSET_REGISTER.md");
      if (gov.success && ip.success) {
        return {
          answer: `Read HUMAN_APPROVAL_REGISTER.md (${gov.content!.length} bytes) and NEXORIAN_IP_ASSET_REGISTER.md (${ip.content!.length} bytes). File presence is not approval of a sale, a valuation, or a certification.`,
          truthState: "VERIFIED",
          evidenceLevel: "LEVEL 3",
          evidenceDetails: "Disk read of the two governance files succeeded. Contents were not treated as legal approval.",
          governanceStatus: sentinelVal.reason,
          relatedProducts: publicProducts(),
          cognitionCost: cost(startTime, cryptoOpsCount)
        };
      }
      return {
        answer: "Governance files were not both readable.",
        truthState: "UNVERIFIED",
        evidenceLevel: "LEVEL 1",
        evidenceDetails: "HUMAN_APPROVAL_REGISTER.md or NEXORIAN_IP_ASSET_REGISTER.md not verified on disk.",
        governanceStatus: sentinelVal.reason,
        cognitionCost: cost(startTime, cryptoOpsCount)
      };
    }

    const product = REGISTERED_PRODUCTS.find((p) => lowerQ.includes(p.id.toLowerCase()) || lowerQ.includes(p.name.toLowerCase()) || lowerQ.includes(p.repo.toLowerCase()));
    if (product || lowerQ.includes("catalog") || lowerQ.includes("product") || lowerQ.includes("lease") || lowerQ.includes("for sale")) {
      const rows = (product ? [product] : publicProducts()).map(
        (p) => `${p.id}: ${p.name}. Status ${p.implementationStatus}. Offer: not for sale or lease. ${p.limitations}`
      );
      return {
        answer: `${PORTAL_SURFACE.name} is the operating surface and is not for sale or lease. ${rows.join(" ")}`,
        truthState: "OBSERVED",
        evidenceLevel: "LEVEL 2",
        evidenceDetails: "Answer assembled from src/lib/products-registry.ts. Remote repositories were not queried.",
        governanceStatus: "READ_ONLY_REGISTRY",
        relatedProducts: product ? [product] : publicProducts(),
        cognitionCost: cost(startTime, 0)
      };
    }

    if (lowerQ.includes("what can you") || lowerQ.includes("capabilit") || lowerQ === "help" || lowerQ.includes("jarvis")) {
      return {
        answer: "Jarvis in this portal can inspect this repository, read a confined text file, run the local N=8 NTT, and run the experimental lattice kernel. It cannot certify cryptography, lease software, move money, open a shell, or speak for repositories that are not vendored here. Epistemic status for anything outside those tools: UNKNOWN.",
        truthState: "OBSERVED",
        evidenceLevel: "LEVEL 2",
        evidenceDetails: "Capability list matches executeAction bindings in jarvis-engine.ts.",
        governanceStatus: "READ_ONLY_QUERY",
        relatedProducts: publicProducts(),
        cognitionCost: cost(startTime, 0)
      };
    }

    return {
      answer: `Input "${q}" matched no executable capability in this portal. Epistemic status: UNKNOWN.`,
      truthState: "UNKNOWN",
      evidenceLevel: "LEVEL 0",
      evidenceDetails: "No repository inspection, NTT, experimental kernel, registry, or governance binding matched the query.",
      governanceStatus: "SENTINEL-1 PASSED: READ_ONLY_QUERY",
      relatedProducts: publicProducts().slice(0, 3),
      cognitionCost: cost(startTime, 0)
    };
  }
}
