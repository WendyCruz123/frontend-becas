import { tokenStore } from "./tokenStore";

async function refreshAccessToken(): Promise<string | null> {
  try {
    const r = await fetch("/api/refresh", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" } });
    if (!r.ok) return null;
    const data = await r.json().catch(() => ({}));
    if (data?.accessToken) { tokenStore.set(data.accessToken); return data.accessToken; }
    return null;
  } catch { return null; }
}

export async function fetchWithAuth(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = tokenStore.get();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(input, { ...init, headers, credentials: "include" });
  if (res.status !== 401) return res;

  const newToken = await refreshAccessToken();
  if (!newToken) return res;

  const retryHeaders = new Headers(init.headers || {});
  retryHeaders.set("Authorization", `Bearer ${newToken}`);
  return fetch(input, { ...init, headers: retryHeaders, credentials: "include" });
}
