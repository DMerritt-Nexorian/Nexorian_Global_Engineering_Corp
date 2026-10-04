import { NextResponse } from 'next/server';
import { JarvisEngine } from '@/lib/jarvis-engine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body.query || '';
    const context = body.context || 'PUBLIC';
    const sessionToken = body.sessionToken;

    const response = await JarvisEngine.processQuery({
      query,
      context,
      sessionToken
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json(
      {
        answer: 'JARVIS Execution Error',
        truthState: 'FAILED',
        evidenceLevel: 'LEVEL 0',
        evidenceDetails: err.message,
        governanceStatus: 'EXECUTION_EXCEPTION',
        cognitionCost: { cpuMs: 0, memoryMB: 0, cryptoOpsCount: 0, totalCostUSD: 0 }
      },
      { status: 500 }
    );
  }
}
