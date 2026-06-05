import { NextResponse, NextRequest } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:5000";

export async function POST(req: NextRequest) {
  // Reenvía la cookie que trae el navegador al backend
  const cookieHeader = req.headers.get("cookie") ?? "";

  const r = await fetch(`${BACKEND}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // muy importante para que el backend reciba el refresh_token
      cookie: cookieHeader,
    },
  });
  const data = await r.json().catch(() => ({}));
  const next = NextResponse.json(data, { status: r.status });
  // si algún día activas rotación y el backend enviara un nuevo Set-Cookie,
  // lo copiamos a la respuesta (ahora no será necesario, pero queda listo).
  const setCookie = r.headers.get("set-cookie");
  if (setCookie) next.headers.set("set-cookie", setCookie);
  return next;
}
