'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  apiCreatePanorama,
  apiDeletePanorama,
  apiListPanoramas,
} from '@/lib/visor360.api';
import type { Panorama360, Ruta360 } from '../types';

export function usePanoramas360(selectedRuta: Ruta360 | null) {
  const [panoramas, setPanoramas] = useState<Panorama360[]>([]);
  const [currentPano, setCurrentPano] = useState<Panorama360 | null>(null);
  const [loadingPanos, setLoadingPanos] = useState(false);
  const [msgPano, setMsgPano] = useState<string | null>(null);

  const loadPanoramas = useCallback(async () => {
    if (!selectedRuta?.id) {
      setPanoramas([]);
      setCurrentPano(null);
      return;
    }

    try {
      setLoadingPanos(true);
      const data = await apiListPanoramas(selectedRuta.id);
      setPanoramas(data);

      setCurrentPano((prev) => {
        if (!prev) return data[0] ?? null;
        return data.find((p: Panorama360) => p.id === prev.id) ?? data[0] ?? null;
      });
    } catch {
      setMsgPano('No se pudieron cargar los panoramas.');
    } finally {
      setLoadingPanos(false);
    }
  }, [selectedRuta?.id]);

  const createPanorama = useCallback(
  async (data: {
    name: string;
    fileUrl: string;
    es_portada?: boolean;
    }) => {
      if (!selectedRuta?.id) {
        setMsgPano('Primero selecciona una ruta.');
        return;
      }

      try {
        setLoadingPanos(true);

        await apiCreatePanorama({
          rutaId: selectedRuta.id,
          name: data.name,
          fileUrl: data.fileUrl,
          publicado: true,
          es_portada: data.es_portada ?? false,
        });

        await loadPanoramas();
        setMsgPano('Panorama agregado correctamente.');
      } catch {
        setMsgPano('No se pudo agregar el panorama.');
      } finally {
        setLoadingPanos(false);
      }
    },
    [selectedRuta?.id, loadPanoramas]
  );

  const deletePanorama = useCallback(
    async (id: string) => {
      const ok = confirm(
        '¿Eliminar este panorama? También se eliminarán sus hotspots.'
      );
      if (!ok) return;

      try {
        setLoadingPanos(true);
        await apiDeletePanorama(id);
        await loadPanoramas();
        setMsgPano('Panorama eliminado correctamente.');
      } catch {
        setMsgPano('No se pudo eliminar el panorama.');
      } finally {
        setLoadingPanos(false);
      }
    },
    [loadPanoramas]
  );

  useEffect(() => {
    loadPanoramas();
  }, [loadPanoramas]);

  return {
    panoramas,
    currentPano,
    setCurrentPano,
    loadingPanos,
    msgPano,
    setMsgPano,
    loadPanoramas,
    createPanorama,
    deletePanorama,
  };
}