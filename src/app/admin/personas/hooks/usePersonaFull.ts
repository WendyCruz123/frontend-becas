'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { PersonaFull } from '../types';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export function usePersonaFull(id?: number) {
  const [data, setData] = useState<PersonaFull | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setData(null);
      return;
    }

    let mounted = true;
    setLoading(true);

    fetchWithAuth(`${BACKEND}/persona/${id}`)
      .then(r => r.json())
      .then(d => {
        if (mounted) setData(d.data); // ✅ AQUÍ ESTÁ EL FIX
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  return { data, loading };
}
