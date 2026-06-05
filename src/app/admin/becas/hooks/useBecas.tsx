'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export type Beca = {
  ID_beca: number;
  nombre: string;
  tipo: string;
  cupos?: number | null;
  detalle?: string;
  imagen?: string | null;
  estado: boolean;
  fecha_inicio: string;
  fecha_fin: string | null;
  periodo_bloqueo?: 'ANUAL' | 'SEMESTRAL';
};

type PageResp = {
  count: number;
  rows: Beca[];
};

export function useBecas() {
  const [rows, setRows] = useState<Beca[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const page = Math.floor(offset / limit) + 1;
  const pages = useMemo(
    () => Math.max(1, Math.ceil(count / limit)),
    [count, limit]
  );

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const qs = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
        search: search.trim(),
        include: 'none',
      });

      const r = await fetchWithAuth(`${BACKEND}/becas?${qs}`);
      if (!r.ok) throw new Error('No se pudo cargar becas');

      const data: PageResp = await r.json();
      setRows(data.rows);
      setCount(data.count);
    } catch (e: unknown) {
  const message = e instanceof Error ? e.message : 'Error';
  setError(message);
} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [limit, offset]);
  const toggleEstado = async (b: Beca) => {
  if (!confirm(`¿${b.estado ? 'Desactivar' : 'Activar'} beca "${b.nombre}"?`))
    return;

  const r = await fetchWithAuth(
    `${BACKEND}/becas/${b.ID_beca}/estado`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: !b.estado }),
    }
  );

  if (r.ok) load();
};

const remove = async (b: Beca) => {
  if (!confirm(`Eliminar definitivamente "${b.nombre}"?`)) return;

  const r = await fetchWithAuth(
    `${BACKEND}/becas/${b.ID_beca}`,
    { method: 'DELETE' }
  );

  if (r.ok) load();
};


return {
  rows,
  count,
  search,
  setSearch,
  limit,
  setLimit,
  offset,
  setOffset,
  loading,
  error,
  page,
  pages,
  load,
  toggleEstado, // 👈
  remove,       // 👈
};

}
