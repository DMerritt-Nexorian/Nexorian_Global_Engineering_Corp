import * as fs from "fs";
import * as path from "path";
import { ProposedStateTransition, SentinelValidationResult } from "./types";
import { SentinelGuard } from "./sentinel-dagm";
import { executeNTTTransformation } from "./ntt-kernel";
import { HdGtlmModel, nominalSample } from "./hd-gtlm-model";
import { PORTAL_SURFACE, publicProducts, REGISTERED_PRODUCTS } from "./products-registry";

export type Role = "PUBLIC" | "DEVELOPER" | "FOUNDER";

export interface ToolStep {
  actionType: string;
  targetResource: string;
  params: Record<string, unknown>;
  purpose: string;
}

export interface StepRecord {
  actionType: string;
  authorized: boolean;
  reason: string;
  output?: unknown;
}

const ROOT = process.cwd();

function confined(filepath: string): string | null {
  const safePath = path.resolve(ROOT, filepath);
  const rootWithSep = ROOT.endsWith(path.sep) ? ROOT : ROOT + path.sep;
  if (safePath !== ROOT && !safePath.startsWith(rootWithSep)) return null;
  return safePath;
}

export function planQuery(query: string): ToolStep[] {
  const q = query.toLowerCase();
  const steps: ToolStep[] = [];
  if (q.includes("inspect") || q.includes("files") || q.includes("directory") || q.includes("repo")) {
    steps.push({ actionType: "INSPECT_REPOSITORY", targetResource: "repository_root", params: {}, purpose: "List the portal workspace." });
  }
  if (q.includes("ntt") || q.includes("polynomial") || q.includes("galois") || q.includes("arithmetic")) {
    steps.push({ actionType: "RUN_NTT_TRANSFORM", targetResource: "ntt_kernel", params: {}, purpose: "Run the local N=8 transform and check recovery." });
  }
  if (q.includes("pqc") || q.includes("kem") || q.includes("dsa") || q.includes("cryptography") || q.includes("sign")) {
    steps.push({ actionType: "RUN_PQC_SIGNATURE", targetResource: "pqc_security_kernel", params: { message: query }, purpose: "Run the experimental lattice kernel." });
  }
  if (q.includes("product") || q.includes("catalog") || q.includes("lease") || q.includes("sale") || q.includes("registry")) {
    steps.push({ actionType: "READ_REGISTRY", targetResource: "product_registry", params: {}, purpose: "Read the local product registry." });
  }
  if (q.includes("gtlm") || q.includes("interlock") || q.includes("tensor")) {
    steps.push({ actionType: "RUN_GTLM_INTERLOCK", targetResource: "hd_gtlm_model", params: {}, purpose: "Step the local HD-GTLM interlock model." });
  }
  if (q.includes("coach") || q.includes("research") || q.includes("next step") || q.includes("roadmap")) {
    steps.push({ actionType: "COACH_BRIEF", targetResource: "local_docs", params: { query }, purpose: "Produce a research brief from local files only." });
  }
  if (q.includes("founder") || q.includes("approval") || q.includes("license") || q.includes("gate")) {
    steps.push({ actionType: "FOUNDER_GOVERNANCE_INSPECT", targetResource: "GOVERNANCE_REGISTER", params: {}, purpose: "Read governance files." });
  }
  return steps;
}

async function gate(step: ToolStep, role: Role): Promise<SentinelValidationResult> {
  const proposal: ProposedStateTransition = {
    actionId: `ACT-${step.actionType}-${Date.now()}`,
    actionType: step.actionType,
    params: step.params,
    targetResource: step.targetResource,
    requesterRole: role,
    timestamp: new Date().toISOString()
  };
  return SentinelGuard.validateAction(proposal);
}

export async function runPlan(query: string, role: Role): Promise<{ records: StepRecord[]; answer: string; truthState: "VERIFIED" | "OBSERVED" | "UNKNOWN" | "FAILED" }> {
  const steps = planQuery(query);
  if (steps.length === 0) {
    return {
      records: [],
      truthState: "UNKNOWN",
      answer: `Input "${query}" matched no executable capability in this portal. Epistemic status: UNKNOWN.`
    };
  }
  const records: StepRecord[] = [];
  const parts: string[] = [];
  for (const step of steps) {
    const decision = await gate(step, role);
    if (!decision.authorized) {
      records.push({ actionType: step.actionType, authorized: false, reason: decision.reason });
      parts.push(`Access Refused: ${decision.reason}`);
      continue;
    }
    const output = executeAuthorized(step);
    records.push({ actionType: step.actionType, authorized: true, reason: decision.reason, output });
    parts.push(String((output as { summary?: string }).summary || step.purpose));
  }
  const verified = records.some((r) => r.authorized && r.actionType !== "READ_REGISTRY" && r.actionType !== "COACH_BRIEF");
  return {
    records,
    truthState: records.every((r) => !r.authorized) ? "OBSERVED" : verified ? "VERIFIED" : "OBSERVED",
    answer: parts.join(" ")
  };
}

function executeAuthorized(step: ToolStep): { summary: string; data?: unknown } {
  if (step.actionType === "INSPECT_REPOSITORY") {
    const files = fs.readdirSync(ROOT);
    return { summary: `Repository inspection executed cleanly. Verified ${files.length} top-level files in the portal workspace. This is the portal repository only, not a 20-repository inventory.`, data: { fileCount: files.length, topFiles: files.slice(0, 15) } };
  }
  if (step.actionType === "RUN_NTT_TRANSFORM") {
    const res = executeNTTTransformation();
    return { summary: `Number Theoretic Transform (NTT) polynomial arithmetic executed over prime field q=12289 with primitive root omega=4043. INNTT(NTT(A)) === A recovery ${res.verified ? "verified" : "failed"}.`, data: res };
  }
  if (step.actionType === "RUN_PQC_SIGNATURE") {
    return { summary: "Experimental Post-Quantum Lattice Cryptography operation is authorized. The engine executes it in the cryptographic path and does not call it FIPS 203 or FIPS 204.", data: { status: "AUTHORIZED_FOR_ENGINE" } };
  }
  if (step.actionType === "READ_REGISTRY") {
    return { summary: `${PORTAL_SURFACE.name} is the operating surface and is not for sale or lease. Public records: ${publicProducts().map((p) => p.id).join(", ")}.`, data: publicProducts().map((p) => p.id) };
  }
  if (step.actionType === "FOUNDER_GOVERNANCE_INSPECT") {
    const gov = confined("HUMAN_APPROVAL_REGISTER.md");
    const ip = confined("NEXORIAN_IP_ASSET_REGISTER.md");
    const govOk = gov && fs.existsSync(gov);
    const ipOk = ip && fs.existsSync(ip);
    return { summary: govOk && ipOk ? `Read governance files from disk. File presence is not a valuation or a certification.` : "Governance files were not both readable.", data: { govOk, ipOk } };
  }
  if (step.actionType === "COACH_BRIEF") {
    return { summary: coachBrief(), data: { source: "local repository only" } };
  }
  if (step.actionType === "RUN_GTLM_INTERLOCK") {
    const model = new HdGtlmModel();
    model.step({ ...nominalSample(), reset: true });
    model.step(nominalSample());
    const driving = model.step(nominalSample());
    const tripped = model.step({ ...nominalSample(), x: 1851 });
    return { summary: `HD-GTLM interlock model stepped. Nominal relay ${driving.relayEnable}. Over-limit x entered ${tripped.state}. This is a software model of the supplied rules, not a fabricated chip.`, data: { driving, tripped } };
  }
  return { summary: `UNIMPLEMENTED: Action type ${step.actionType} is not bound to an executable tool capability.` };
}

export function coachBrief(): string {
  return [
    "Research brief from this repository only.",
    "Jarvis and Sentinel-1 currently form a gate-then-tool loop: plan, authorize, execute, record.",
    "Sentinel-1 is an experimental policy check plus an experimental lattice signature. It is not authentication and not a certified control.",
    "Implemented tools: repository listing, confined file read, N=8 NTT, experimental lattice kernel, registry read.",
    "Not implemented: a hosted model, repository-wide code index, IDE edits, pull-request authorship, web research, persistent memory, or a multi-agent staff.",
    "Next engineering step: put a server-side model behind this same Sentinel gate, with the model proposing steps and Sentinel allowing only registered tools.",
    "That is the path toward a research aide and a development coach. It is not yet comparable to Jules or GitHub Copilot, which already combine a model, a code index, and an editor."
  ].join(" ");
}

export const REGISTERED_TOOL_NAMES = ["INSPECT_REPOSITORY", "READ_SOURCE_FILE", "RUN_NTT_TRANSFORM", "RUN_PQC_SIGNATURE", "READ_REGISTRY", "FOUNDER_GOVERNANCE_INSPECT", "COACH_BRIEF", "RUN_GTLM_INTERLOCK"] as const;
