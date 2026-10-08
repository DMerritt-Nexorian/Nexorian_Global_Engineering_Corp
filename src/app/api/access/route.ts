
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const expected = process.env.FOUNDER_ACCESS_TOKEN;
  const form = await request.formData().catch(() => null);
  const token = String(form?.get("token") || "");
  const url = new URL("/", request.url);
  if (!expected || token !== expected) {
    url.pathname = "/founder";
    url.searchParams.set("access", "refused");
    return NextResponse.redirect(url, 303);
  }
  const response = NextResponse.redirect(new URL("/founder", request.url), 303);
  response.cookies.set("nex_founder", expected, { httpOnly: true, sameSite: "lax", secure: url.protocol === "https:", path: "/" });
  return response;
}
