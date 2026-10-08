
import { NextResponse } from "next/server";
import { JarvisEngine } from "@/lib/jarvis-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = typeof body.query === "string" ? body.query.slice(0, 2000) : "";
    const context = body.context === "FOUNDER" || body.context === "DEVELOPER" ? body.context : "PUBLIC";
    if (!query.trim()) {
      return NextResponse.json({ answer: "Empty query.", truthState: "FAILED", evidenceLevel: "LEVEL 0", evidenceDetails: "No query.", governanceStatus: "REJECTED", cognitionCost: { cpuMs: 0, memoryMB: 0, cryptoOpsCount: 0, economicCost: "UNMEASURED" } }, { status: 400 });
    }
    const response = await JarvisEngine.processQuery({ query, context });
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json(
      {
        answer: "Jarvis could not complete the request.",
        truthState: "FAILED",
        evidenceLevel: "LEVEL 0",
        evidenceDetails: "Execution exception. Internal detail withheld.",
        governanceStatus: "EXECUTION_EXCEPTION",
        cognitionCost: { cpuMs: 0, memoryMB: 0, cryptoOpsCount: 0, economicCost: "UNMEASURED" }
      },
      { status: 500 }
    );
  }
}
