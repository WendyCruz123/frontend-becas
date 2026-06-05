'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import type { EtapaEncargado, OficinaOption } from '../types';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export function useEtapasEncargado() {
  const [pendientes, setPendientes] = useState<EtapaEncargado[]>([]);
  const [revisados, setRevisados] = useState<EtapaEncargado[]>([]);
  const [oficinas, setOficinas] = useState<OficinaOption[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);

    try {
      const r = await fetchWithAuth(`${BACKEND}/postulaciones/etapas/encargado`);
      const d = await r.json();

      setPendientes(Array.isArray(d?.pendientes) ? d.pendientes : []);
      setRevisados(Array.isArray(d?.revisados) ? d.revisados : []);
    } finally {
      setLoading(false);
    }
  }

  async function loadOficinas() {
    const r = await fetchWithAuth(`${BACKEND}/oficinas?limit=100`);
    const d = await r.json();

    setOficinas(d?.rows || d?.data?.rows || []);
  }

async function resolverEtapa(
  pasoEstudianteId: number,
  resultado: 'APROBADO' | 'REPROBADO' | 'ABANDONADO',
  payload: {
    nota?: number;
    fecha?: string;
    descripcion?: string;
    textoExtra?: string;
    oficinaRutaId?: number;
  },
) {
  const r = await fetchWithAuth(`${BACKEND}/postulaciones/etapas/resolver`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pasoEstudianteId,
      resultado,
      ...payload,
    }),
  });

  const d = await r.json();

  if (!r.ok) {
    const msg = Array.isArray(d?.message)
      ? d.message.join('\n')
      : typeof d?.message === 'string'
        ? d.message
        : 'No se pudo resolver la etapa.';

    throw new Error(msg);
  }

  await load();
  return d;
}

  useEffect(() => {
    load();
    loadOficinas();
  }, []);

  return {
    pendientes,
    revisados,
    oficinas,
    loading,
    load,
    resolverEtapa,
  };
}