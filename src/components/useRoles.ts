'use client';

import { useEffect, useState } from 'react';
import { tokenStore } from '@/lib/tokenStore';

export type Role =
  | 'estudiante'
  | 'admin'
  | 'kardex'
  | 'encargado'
  | 'director';

function base64UrlToJson<T = any>(b64url: string): T {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(b64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );
  return JSON.parse(json);
}

function getRolesFromAccess(): Role[] {
  const tok = tokenStore.get();
  if (!tok) return [];

  const parts = tok.split('.');
  if (parts.length !== 3) return [];

  try {
    const payload = base64UrlToJson<{ roles?: string[] }>(parts[1]);
    const raw = (payload.roles ?? []).map((r) => r.toLowerCase());

    const allowed: Role[] = [];

    if (raw.includes('estudiante')) allowed.push('estudiante');
    if (raw.includes('admin')) allowed.push('admin');
    if (raw.includes('kardex')) allowed.push('kardex');
    if (raw.includes('encargado')) allowed.push('encargado');
    if (raw.includes('director')) allowed.push('director');

    return Array.from(new Set(allowed));
  } catch {
    return [];
  }
}

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);

  const refreshRoles = async () => {
    let r = getRolesFromAccess();
    if (r.length > 0) return setRoles(r);

    try {
      const res = await fetch('/api/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));

        if (data?.accessToken) tokenStore.set(data.accessToken);

        r = getRolesFromAccess();
        setRoles(r);
        return;
      }
    } catch {}

    setRoles([]);
  };

  useEffect(() => {
    refreshRoles();

    const onFocus = () => refreshRoles();
    window.addEventListener('focus', onFocus);

    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return roles;
}