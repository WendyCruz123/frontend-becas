'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from './fetchWithAuth';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

type MeResp = {
  user?: {
    sub?: number;
    username?: string;
    roles?: string[];
    personaId?: number;

    nombre?: string | null;
    apellido_paterno?: string | null;
    apellido_materno?: string | null;
    ci?: string | null;
    celular?: string | null;
    ru?: number | null;
  };
};

export function useMe() {
  const [me, setMe] = useState<MeResp['user'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetchWithAuth(`${BACKEND}/usuario/me`);
        const d = await r.json().catch(() => ({}));
        if (alive) setMe(d?.user ?? null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Añadimos un campo calculado: isEstudiante
  const isEstudiante = !!me?.roles?.map(r => r.toLowerCase()).includes('estudiante');

  return { me, loading, isEstudiante };
}
