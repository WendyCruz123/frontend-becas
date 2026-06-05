'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export interface Rol {
  ID_grupo_rol: number;
  nombre: string;
  descripcion?: string;
}

export function useRoles() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetchWithAuth(`${BACKEND}/grupo-rol`);
      const d = await r.json();
      if (Array.isArray(d?.rows)) setRoles(d.rows);
      else if (Array.isArray(d?.data?.rows)) setRoles(d.data.rows);
      else setRoles([]);
    } catch (err: unknown) {
  console.error(err);
  setError('Error al cargar roles');
} finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return { roles, loading, error, reload: load };
}
