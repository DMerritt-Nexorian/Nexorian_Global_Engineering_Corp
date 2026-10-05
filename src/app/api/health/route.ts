import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'UP',
      service: 'Nexorian Executive Web Portal',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}
