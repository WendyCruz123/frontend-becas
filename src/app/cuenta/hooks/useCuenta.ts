'use client';

import { useEffect, useState } from 'react';
import { useMe } from '@/lib/useMe';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export function useCuenta() {
  const { me, loading } = useMe();
  const [persona, setPersona] = useState<any>(null);
  const [estudiante, setEstudiante] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!me?.personaId) return;

    (async () => {
      try {
        const r1 = await fetchWithAuth(
          `${BACKEND}/persona/${me.personaId}`
        );
        const d1 = await r1.json();

        const r2 = await fetchWithAuth(
          `${BACKEND}/estudiante/me/${me.personaId}`
        );
        const d2 = await r2.json();

        setPersona(d1?.data ?? null);
        setEstudiante(d2?.data ?? null);
      } catch (e) {
        console.error(e);
        setError('No se pudieron cargar los datos.');
      }
    })();
  }, [me?.personaId]);

  return { loading, persona, estudiante, error };
}
