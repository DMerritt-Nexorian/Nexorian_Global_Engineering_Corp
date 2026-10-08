
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "READY",
    service: "Nexorian portal",
    checks: {
      database: "NOT_CONFIGURED",
      payments: "NOT_CONNECTED",
      pqcKernel: "EXPERIMENTAL_LOCAL",
      nttKernel: "LOCAL_N8"
    },
    timestamp: new Date().toISOString()
  });
}
