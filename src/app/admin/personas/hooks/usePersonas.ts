'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { PersonaListItem } from '../types';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';


export function usePersonas(initialSearch = '') {
  const [data, setData] = useState<PersonaListItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetchWithAuth(`${BACKEND}/persona?limit=50&search=${encodeURIComponent(search)}`);
      const d = await r.json();
      if (d?.data?.rows) {
        setData(d.data.rows);
        setCount(d.data.count ?? 0);
      } else {
        setData([]);
        setCount(0);
      }
    } catch (err: unknown) {
  console.error(err);

  const message =
    err instanceof Error
      ? err.message
      : 'Error al cargar personas';

  setError(message);
} finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [search]);

  return { data, count, loading, error, setSearch, reload: load };
}
