'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  apiCreateRuta360,
  apiDeleteRuta360,
  apiListRutas360,
} from '@/lib/visor360.api';
import type { Ruta360 } from '../types';
import { makeSlug } from '../utils/slug';

export function useRutas360() {
  const [rutas, setRutas] = useState<Ruta360[]>([]);
  const [selectedRuta, setSelectedRuta] = useState<Ruta360 | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const loadRutas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiListRutas360();
      setRutas(data);

      setSelectedRuta((prev) => {
        if (!prev) return data[0] ?? null;
        return data.find((r: Ruta360) => r.id === prev.id) ?? data[0] ?? null;
      });
    } catch {
      setMsg('No se pudieron cargar las rutas 360.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRuta = useCallback(
    async (data: { nombre: string; slug?: string }) => {
      const cleanName = data.nombre.trim();

      if (!cleanName) {
        setMsg('Escribe el nombre de la ruta.');
        return;
      }

      try {
        setLoading(true);

        const created = await apiCreateRuta360({
          nombre: cleanName,
          slug: data.slug?.trim() || makeSlug(cleanName),
        });

        await loadRutas();
        setSelectedRuta(created);
        setMsg('Ruta 360 creada correctamente.');
      } catch {
        setMsg('No se pudo crear la ruta. Puede que el nombre ya exista.');
      } finally {
        setLoading(false);
      }
    },
    [loadRutas]
  );
  const deleteRuta = useCallback(
    async (id: string) => {
      const ok = confirm(
        '¿Eliminar esta ruta 360? También se eliminarán sus panoramas y hotspots.'
      );

      if (!ok) return;

      try {
        setLoading(true);
        await apiDeleteRuta360(id);
        await loadRutas();
        setMsg('Ruta 360 eliminada correctamente.');
      } catch {
        setMsg('No se pudo eliminar la ruta 360.');
      } finally {
        setLoading(false);
      }
    },
    [loadRutas]
  );

  useEffect(() => {
    loadRutas();
  }, [loadRutas]);

  return {
    rutas,
    selectedRuta,
    setSelectedRuta,
    loading,
    msg,
    setMsg,
    loadRutas,
    createRuta,
    deleteRuta,
  };
}