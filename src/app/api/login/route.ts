import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:5000";
const LOGIN_PATH = process.env.BACKEND_LOGIN_PATH ?? "/auth/login";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const r = await fetch(`${BACKEND}${LOGIN_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data: any;
    try { data = await r.json(); } catch { data = { message: `Backend ${r.status} ${r.statusText}` }; }

    // 👇 copiar Set-Cookie del backend a la respuesta de Next
    const setCookie = r.headers.get("set-cookie");
    const next = NextResponse.json(data, { status: r.status });
    if (setCookie) next.headers.set("set-cookie", setCookie);
    return next;
  } catch {
    return NextResponse.json({ message: "No se pudo conectar al backend" }, { status: 502 });
  }
}
