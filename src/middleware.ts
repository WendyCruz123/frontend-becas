import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
 // protege /dashboard y /admin
  if (
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/becas-disponibles") &&
    !pathname.startsWith("/kardex") &&
    !pathname.startsWith("/encargado") &&
    !pathname.startsWith("/notificaciones")
  ) {
    return NextResponse.next();
  }
  // Si NO hay cookie refresh_token, redirige ya desde el edge
  const hasRefresh = req.cookies.get("refresh_token");
  if (!hasRefresh) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("login", "true");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
  "/dashboard/:path*",
  "/admin/:path*",
  "/becas-disponibles/:path*",
  "/kardex/:path*",
  "/encargado/:path*",
  "/notificaciones/:path*"
],
};