'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export function useDashboardStats() {
  const [becasTotal, setBecasTotal] = useState(0);
  const [becasDisponibles, setBecasDisponibles] = useState(0);
  const [postuladosAno, setPostuladosAno] = useState(0);

  useEffect(() => {
    const load = async () => {
      const year = new Date().getFullYear();

      const r1 = await fetchWithAuth(`${BACKEND}/becas`);
      const r2 = await fetchWithAuth(`${BACKEND}/becas/filtro/vigentes/list`);
      const r3 = await fetchWithAuth(
        `${BACKEND}/postulaciones/stats/estudiantes-unicos?year=${year}`
      );

      setBecasTotal((await r1.json()).count ?? 0);
      setBecasDisponibles((await r2.json()).count ?? 0);
      setPostuladosAno((await r3.json()).count ?? 0);
    };

    load();
  }, []);

  return {
    becasTotal,
    becasDisponibles,
    postuladosAno,
  };
}
