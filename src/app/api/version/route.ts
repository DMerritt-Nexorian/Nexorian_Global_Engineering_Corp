import { NextResponse } from 'next/server';
import execSync from 'child_process';

export async function GET() {
  let commitHash = 'UNKNOWN';
  try {
    const { execSync } = require('child_process');
    commitHash = execSync('git rev-parse HEAD').toString().trim();
  } catch (err) {
    commitHash = process.env.DIGITALOCEAN_COMMIT_SHA || 'DIST_STATIC_BUILD';
  }

  return NextResponse.json({
    service: 'Nexorian Global Engineering Corp Executive Web Portal',
    version: '1.0.0-draft',
    commit: commitHash,
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    status: 'OPERATIONAL'
  });
}
