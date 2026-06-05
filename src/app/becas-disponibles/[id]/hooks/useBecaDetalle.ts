'use client';

import { useEffect, useState } from 'react';
import { BecaResumen, PasoPorBeca, Oficina } from '../types';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export function useBecaDetalle(becaId: number) {
  const [beca, setBeca] = useState<BecaResumen | null>(null);
  const [pasos, setPasos] = useState<PasoPorBeca[]>([]);
  const [oficinas, setOficinas] = useState<Record<number, Oficina>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const rBeca = await fetchWithAuth(`${BACKEND}/becas/${becaId}`);
        const b = await rBeca.json();
        setBeca(b);

        const rPasos = await fetchWithAuth(
          `${BACKEND}/becas/${becaId}/requisitos`
        );
        const lista: PasoPorBeca[] = await rPasos.json();
        setPasos(lista);

        const oficinaIds = Array.from(
          new Set(
            lista
              .map((p) => p.requisito.oficinaId)
              .filter((v): v is number => typeof v === 'number')
          )
        );

        if (oficinaIds.length) {
          const res = await Promise.all(
            oficinaIds.map((id) =>
              fetchWithAuth(`${BACKEND}/oficinas/${id}`).then((r) =>
                r.json()
              )
            )
          );
          const map: Record<number, Oficina> = {};
          res.forEach((o) => (map[o.ID_oficina] = o));
          setOficinas(map);
        }
      } catch (e: unknown) {
  const message = e instanceof Error ? e.message : 'Error';
  setError(message);
} finally {
        setLoading(false);
      }
    })();
  }, [becaId]);

  return { beca, pasos, oficinas, loading, error };
}
