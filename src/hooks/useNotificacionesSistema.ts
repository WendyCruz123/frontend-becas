'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export function useNotificacionesSistema() {
  const [noLeidas, setNoLeidas] = useState(0);

  async function load() {
    try {
      const r = await fetchWithAuth(`${BACKEND}/notificaciones-sistema/mias`);
      const data = await r.json();
      setNoLeidas(data.noLeidas || 0);
    } catch {
      setNoLeidas(0);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { noLeidas, reload: load };
}