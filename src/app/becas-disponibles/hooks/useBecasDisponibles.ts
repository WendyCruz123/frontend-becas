'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { BecaRow } from '../types';
import { useMe } from '@/lib/useMe';
import { getGestionForToday } from '@/lib/gestion';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

const ESTADOS_VISIBLES_POST_VENCIMIENTO = [
  'PENDIENTE',
  'HABILITADO',
  'REMITIDO_A_DISBECT',
];

export function useBecasDisponibles(modo: 'vigentes' | 'historial' = 'vigentes') {
  const { me, loading: loadingMe } = useMe();
  const gestion = getGestionForToday();

  const [rows, setRows] = useState<BecaRow[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [limit] = useState(12);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const page = Math.floor(offset / limit) + 1;

  const pages = useMemo(
    () => Math.max(1, Math.ceil(count / limit)),
    [count, limit]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(0);
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (loadingMe) return;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const qs = new URLSearchParams({
          limit: String(limit),
          offset: String(offset),
          search: debouncedSearch.trim(),
        });

        if (modo === 'historial') {
          if (!me?.sub) {
            setRows([]);
            setCount(0);
            return;
          }

          qs.set('usuarioId', String(me.sub));
        }

        const url =
          modo === 'historial'
            ? `${BACKEND}/becas/mis-registros/historial?${qs.toString()}`
            : `${BACKEND}/becas/filtro/vigentes/list?${qs.toString()}`;

        const r = await fetchWithAuth(url);

        if (!r.ok) {
          const d = await r.json().catch(() => ({}));
          throw new Error(d.message || 'No se pudo cargar las becas');
        }

        const data = (await r.json()) as {
          count: number;
          rows: BecaRow[];
        };

        let finalRows = data.rows || [];
        let finalCount = data.count || 0;

        if (modo === 'vigentes' && me?.sub) {
          const qActivo = new URLSearchParams({
            usuarioId: String(me.sub),
            gestion,
          });

          const rActivo = await fetchWithAuth(
            `${BACKEND}/postulaciones/activo?${qActivo.toString()}`
          );

          if (rActivo.ok) {
            const text = await rActivo.text();
            const tramite = text ? JSON.parse(text) : null;

            if (
              tramite?.beca &&
              ESTADOS_VISIBLES_POST_VENCIMIENTO.includes(tramite.estado)
            ) {
              const yaExiste = finalRows.some(
                (b) => b.ID_beca === tramite.beca.ID_beca
              );

              if (!yaExiste) {
                finalRows = [tramite.beca, ...finalRows];
                finalCount += 1;
              }
            }
          }
        }

        setRows(finalRows);
        setCount(finalCount);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [offset, debouncedSearch, modo, me?.sub, loadingMe, gestion, limit]);

  return {
    rows,
    search,
    setSearch,
    loading,
    error,
    page,
    pages,
    prev: () => setOffset(Math.max(0, offset - limit)),
    next: () => setOffset(offset + limit),
  };
}