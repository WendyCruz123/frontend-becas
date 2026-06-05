import { NextRequest, NextResponse } from "next/server";
const BACKEND = process.env.BACKEND_URL ?? "http://localhost:5000";

export async function POST(req: NextRequest) {
  // reenvía las cookies del navegador al backend
  const cookieHeader = req.headers.get("cookie") ?? "";
  const r = await fetch(`${BACKEND}/auth/logout`, {
    method: "POST",
    headers: { cookie: cookieHeader },
  });

  const setCookie = r.headers.get("set-cookie");
  const data = await r.json().catch(() => ({}));
  const next = NextResponse.json(data, { status: r.status });
  if (setCookie) next.headers.set("set-cookie", setCookie);
  return next;
}
