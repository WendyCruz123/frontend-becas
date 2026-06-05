'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export function useRequisitosBeca(becaId: number) {
  const [pasos, setPasos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [ordenEdits, setOrdenEdits] = useState<Record<number, number>>({});

  const load = async () => {
    if (!becaId) return;
    setLoading(true);
    try {
      const r = await fetchWithAuth(`${BACKEND}/becas/${becaId}/requisitos`);
      const data = await r.json();
      setPasos(data || []);

      const map: Record<number, number> = {};
      (data || []).forEach((p: any) => (map[p.ID_pasosBeca] = p.orden));
      setOrdenEdits(map);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [becaId]);

  return {
    pasos,
    loading,
    error,
    ordenEdits,
    setOrdenEdits,
    reload: load,
  };
}
