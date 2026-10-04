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
        requestId: `REQ-ERR-${Date.now()}`,
        status: 'FAILED',
        answer: 'JARVIS Execution Error',
        truthState: 'FAILED',
        trace: [],
        evidence: [],
        failure: {
          category: 'EXECUTION_FAILURE',
          description: err.message,
          evidence: [],
          confidence: 1,
          recoveryOptions: []
        },
        cognitionCost: { cpuMs: 0, memoryBytes: 0, cryptoOpsCount: 0, economicCost: 'UNMEASURED' }
      },
      { status: 500 }
    );
  }
}
