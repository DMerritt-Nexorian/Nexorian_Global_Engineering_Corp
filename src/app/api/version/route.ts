
import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  let commit = process.env.DIGITALOCEAN_COMMIT_SHA || "UNKNOWN";
  try {
    commit = execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    commit = process.env.DIGITALOCEAN_COMMIT_SHA || "DIST_STATIC_BUILD";
  }
  return NextResponse.json({
    service: "Nexorian Global Engineering Corp portal",
    version: "1.1.0-portal",
    commit,
    environment: process.env.NODE_ENV || "production",
    saleOrLease: false,
    timestamp: new Date().toISOString()
  });
}
