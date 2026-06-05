'use client';

import { useEffect, useMemo, useState } from 'react';
import { PostulacionDetalle } from '../types';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { getGestionForToday, getPeriodoPostulacionForToday } from '@/lib/gestion';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

// export function useTramite(estudianteId: number | null, becaId: number) {
//   const gestion = getGestionForToday();
//   const periodoActual = getPeriodoPostulacionForToday();
export function useTramite(
  estudianteId: number | null,
  becaId: number,
  gestion: string
) {

  const [tramite, setTramite] = useState<PostulacionDetalle | null>(null);
  const [tramiteActivoGlobal, setTramiteActivoGlobal] =
    useState<PostulacionDetalle | null>(null);
  const [abandonoRecuperable, setAbandonoRecuperable] =
    useState<PostulacionDetalle | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const [ultimaPostulacionGlobal, setUltimaPostulacionGlobal] =
  useState<PostulacionDetalle | null>(null);
  async function cargarDetalle(id: string) {
    const det = await fetchWithAuth(`${BACKEND}/postulaciones/${id}`);
    if (!det.ok) return null;
    return (await det.json()) as PostulacionDetalle;
  }

  async function load() {
    if (!estudianteId || !becaId) {
      setTramite(null);
      setTramiteActivoGlobal(null);
      setAbandonoRecuperable(null);
      setUltimaPostulacionGlobal(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1) Trámite específico de ESTA beca
      const qBeca = new URLSearchParams({
        usuarioId: String(estudianteId),
        gestion,
        becaId: String(becaId),
      });

      const rBeca = await fetchWithAuth(
        `${BACKEND}/postulaciones/activo?${qBeca.toString()}`
      );

      let tramiteBeca: PostulacionDetalle | null = null;

      if (rBeca.ok) {
        const text = await rBeca.text();
        const p = text ? JSON.parse(text) : null;

        if (p?.ID_postulacion) {
          tramiteBeca = await cargarDetalle(p.ID_postulacion);
        }
      }

      setTramite(tramiteBeca);

      // 2) Trámite activo global para bloquear si existe otra postulación activa
      const qGlobal = new URLSearchParams({
        usuarioId: String(estudianteId),
        gestion,
      });

      const rGlobal = await fetchWithAuth(
        `${BACKEND}/postulaciones/activo?${qGlobal.toString()}`
      );

      let global: PostulacionDetalle | null = null;

      if (rGlobal.ok) {
        const text = await rGlobal.text();
        const p = text ? JSON.parse(text) : null;

        if (p?.ID_postulacion) {
          global = await cargarDetalle(p.ID_postulacion);
        }
      }

      setTramiteActivoGlobal(global);
      const rUltima = await fetchWithAuth(
        `${BACKEND}/postulaciones/ultima/global?gestion=${gestion}`
      );

      let ultima: PostulacionDetalle | null = null;

      if (rUltima.ok) {
        const text = await rUltima.text();
        const p = text ? JSON.parse(text) : null;

        if (p?.ID_postulacion) {
          ultima = await cargarDetalle(p.ID_postulacion);
        }
      }

      setUltimaPostulacionGlobal(ultima);
      // 3) Trámite abandonado recuperable, aunque sea de otra beca
      const rAbandono = await fetchWithAuth(
        `${BACKEND}/postulaciones/abandono/recuperable?gestion=${gestion}`
      );

      let abandonado: PostulacionDetalle | null = null;

      if (rAbandono.ok) {
        const text = await rAbandono.text();
        const p = text ? JSON.parse(text) : null;

        if (p?.ID_postulacion) {
          abandonado = await cargarDetalle(p.ID_postulacion);
        }
      }

      setAbandonoRecuperable(abandonado);
    } catch (e) {
      console.error(e);
      setError('Error al cargar trámite');
      setTramite(null);
      setTramiteActivoGlobal(null);
      setAbandonoRecuperable(null);
      setUltimaPostulacionGlobal(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  // }, [estudianteId, becaId, gestion, periodoActual]);
}, [estudianteId, becaId, gestion]);
  const progreso = useMemo(() => {
    if (!tramite?.paso_estudiante?.length) return 0;

    const documentos = tramite.paso_estudiante.filter(
      (p: any) => p.pasoBeca?.requisito?.tipo_requisito !== 'ETAPA'
    );

    if (documentos.length === 0) return 0;

    return Math.round(
      (documentos.filter((p) => p.completado).length / documentos.length) * 100
    );
  }, [tramite]);

  function updatePasoLocal(pasoBecaId: number, completado: boolean) {
    setTramite((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        paso_estudiante: prev.paso_estudiante.map((pe) =>
          pe.pasoBecaId === pasoBecaId
            ? {
                ...pe,
                completado,
                fecha_completado: completado
                  ? new Date().toISOString()
                  : null,
              }
            : pe
        ),
      };
    });
  }

  return {
    tramite,
    tramiteActivoGlobal,
    ultimaPostulacionGlobal,
    abandonoRecuperable,
    loading,
    progreso,
    error,
    reload: load,
    updatePasoLocal,
  };
}