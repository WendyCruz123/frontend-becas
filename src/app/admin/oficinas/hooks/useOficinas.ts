'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { Oficina, PageResp } from '../types';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export function useOficinas() {
  const [rows, setRows] = useState<Oficina[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async (params: {
    limit: number;
    offset: number;
    search: string;
  }) => {
    setLoading(true);
    setError('');
    try {
      const qs = new URLSearchParams({
        limit: String(params.limit),
        offset: String(params.offset),
        search: params.search,
      });

      const r = await fetchWithAuth(`${BACKEND}/oficinas?${qs}`);
      if (!r.ok) throw new Error('No se pudo cargar oficinas');

      const data: PageResp = await r.json();
      setRows(data.rows ?? []);
      setCount(data.count ?? 0);
    } catch (e: unknown) {
  const message = e instanceof Error ? e.message : 'Error';
  setError(message);
} finally {
      setLoading(false);
    }
  };

  return { rows, count, loading, error, load };
}
