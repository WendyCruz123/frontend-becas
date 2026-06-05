'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import type {
  EnviarMensajeRow,
  EstadoFiltroNotificacion,
  ResumenEnvioResponse,
  TipoBecaNotificacion,
  TipoMensajeEnvio,
} from '../types';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export function useEnviarMensajes() {
  const [rows, setRows] = useState<EnviarMensajeRow[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const [tipoBeca, setTipoBeca] =
    useState<TipoBecaNotificacion>('CON_ETAPAS');

  const [estadoFiltro, setEstadoFiltro] =
    useState<EstadoFiltroNotificacion>('PENDIENTE');

  const [searchBeca, setSearchBeca] = useState('');
  const [searchEstudiante, setSearchEstudiante] = useState('');

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState<TipoMensajeEnvio>('');
  const [confirmar, setConfirmar] = useState(false);

  const limit = 12;
  const totalPages = Math.ceil(count / limit);

  async function loadData() {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set('offset', String(page * limit));
      params.set('limit', String(limit));
      params.set('estado', estadoFiltro);
      params.set('tipoBeca', tipoBeca);

      if (searchEstudiante.trim()) {
        params.set('searchEstudiante', searchEstudiante.trim());
      }

      if (searchBeca.trim()) {
        params.set('searchBeca', searchBeca.trim());
      }

      const res = await fetchWithAuth(
        `${BACKEND}/postulaciones/admin?${params.toString()}`,
      );

      const data = await res.json();

      setRows(data.rows || []);
      setCount(data.count || 0);
    } catch (err) {
      console.error('Error cargando postulaciones:', err);
      setRows([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, tipoBeca, estadoFiltro]);

  function buscar() {
    setPage(0);
    loadData();
  }

  function toggleSeleccion(id: string) {
    setSelectedIds((prev) =>
      prev.includes(String(id))
        ? prev.filter((x) => x !== String(id))
        : [...prev, String(id)],
    );
  }

  const selectedRows = useMemo(
    () => rows.filter((r) => selectedIds.includes(String(r.id))),
    [rows, selectedIds],
  );

  const firstSelected = selectedRows[0];

  const becaConfirmacion = firstSelected?.beca_nombre || 'No definida';
  const gestionConfirmacion = firstSelected?.gestion || 'No definida';

  const tipoConfirmacion =
    tipo === 'OBSERVADO'
      ? 'OBSERVADO'
      : tipo === 'APROBADO'
        ? 'APROBADO'
        : tipo === 'REPROBADO'
          ? 'REPROBADO'
          : tipo === 'PERSONALIZADO'
            ? 'PERSONALIZADO'
            : tipo === 'APROBAR_DOCUMENTACION_ETAPAS'
              ? 'APROBAR DOCUMENTACIÓN Y HABILITAR ETAPA'
              : tipo === 'REMITIDO_A_DISBECT'
                ? 'REMITIDO A DISBECT'
                : tipo === 'NO_REMITIDO'
                  ? 'NO REMITIDO'
                  : 'No definido';

  function abrirConfirmacion() {
    if (!selectedIds.length) {
      alert('Selecciona al menos un estudiante');
      return;
    }

    if (!tipo) {
      alert('Debes elegir un tipo de mensaje.');
      return;
    }

    if (!firstSelected?.beca_id || !firstSelected?.gestion) {
      alert('Debe enviar mensajes por beca y gestión.');
      return;
    }

    setConfirmar(true);
  }

  async function enviarMensajes(
    oficinaIdObservacion?: string,
    datosEtapa?: {
      nota?: number;
      fecha?: string;
      descripcion?: string;
      textoExtra?: string;
      oficinaRutaId?: number;
    },
  ) {
    if (!selectedIds.length) {
      alert('Selecciona al menos un estudiante');
      return;
    }

    if (!tipo) {
      alert('Debes elegir un tipo de mensaje.');
      return;
    }

    try {
      if (tipo === 'REMITIDO_A_DISBECT' || tipo === 'NO_REMITIDO') {
        let ok = 0;
        let fallaron = 0;

        for (const id of selectedIds) {
          const res = await fetchWithAuth(
            `${BACKEND}/postulaciones/admin/${id}/estado-administrativo`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                estado: tipo,
                observacion:
                  tipo === 'REMITIDO_A_DISBECT'
                    ? 'La carpeta fue remitida a DISBECT para revisión administrativa.'
                    : 'La carpeta no logró ser remitida a DISBECT.',
              }),
            },
          );

          if (res.ok) ok++;
          else fallaron++;
        }

        alert(`Estados procesados.\n\nCorrectos: ${ok}\nFallaron: ${fallaron}`);
        setConfirmar(false);
        setSelectedIds([]);
        setTipo('');
        await loadData();
        return;
      }

      if (tipo === 'APROBAR_DOCUMENTACION_ETAPAS') {
        let ok = 0;
        let fallaron = 0;

        for (const id of selectedIds) {
          const res = await fetchWithAuth(
            `${BACKEND}/postulaciones/admin/${id}/aprobar-documentacion-etapas`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                oficinaRutaId: datosEtapa?.oficinaRutaId,
                fecha: datosEtapa?.fecha,
                nota: datosEtapa?.nota,
                descripcion:
                  datosEtapa?.descripcion ||
                  mensaje ||
                  'Su documentación fue aprobada y se habilitó la siguiente etapa.',
                textoExtra: datosEtapa?.textoExtra,
              }),
            },
          );

          if (res.ok) ok++;
          else fallaron++;
        }

        alert(`Documentación procesada.\n\nAprobados: ${ok}\nFallaron: ${fallaron}`);
        setConfirmar(false);
        setSelectedIds([]);
        setTipo('');
        setMensaje('');
        await loadData();
        return;
      }

      const first =
        rows.find((r) => selectedIds.includes(String(r.id))) || rows[0];

      const body: any = {
        becaId: first.beca_id,
        gestion: first.gestion,
        tipo:
          tipo === 'OBSERVADO'
            ? 'OBSERVACION'
            : tipo === 'APROBADO' || tipo === 'REPROBADO'
              ? 'ESTADO'
              : 'PERSONALIZADO',
        subTipo: tipo === 'REPROBADO' ? 'REPROBADO' : 'APROBADO',
        idsSeleccionados: selectedIds,
        mensajePersonalizado:
          tipo === 'PERSONALIZADO' ? mensaje || 'Mensaje institucional.' : '',
        ...(tipo === 'OBSERVADO' && {
          oficinaIdObservacion: Number(oficinaIdObservacion),
        }),
        ...(tipo === 'REPROBADO' && {
          nota: datosEtapa?.nota,
          descripcion: datosEtapa?.descripcion,
        }),
      };

      const res = await fetchWithAuth(`${BACKEND}/postulaciones/notif`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data: ResumenEnvioResponse = await res.json();

      if (!res.ok) {
        throw new Error(data?.mensaje || 'Error en el envío.');
      }

      alert(
        `${data.mensaje}\n\nSeleccionados: ${data.seleccionados}\nNotificados: ${data.notificados}\nFallaron: ${data.fallaron}`,
      );

      setConfirmar(false);
      setSelectedIds([]);
      setTipo('');
      setMensaje('');
      await loadData();
    } catch (err) {
      console.error('Error al enviar mensajes:', err);
      alert('Error al enviar mensajes. Revisa la consola.');
    }
  }

  return {
    rows,
    count,
    loading,
    page,
    setPage,

    tipoBeca,
    setTipoBeca,
    estadoFiltro,
    setEstadoFiltro,

    searchBeca,
    setSearchBeca,
    searchEstudiante,
    setSearchEstudiante,

    selectedIds,
    mensaje,
    setMensaje,
    tipo,
    setTipo,
    confirmar,
    setConfirmar,
    limit,
    totalPages,

    toggleSeleccion,
    loadData,
    buscar,
    abrirConfirmacion,
    enviarMensajes,

    becaConfirmacion,
    gestionConfirmacion,
    tipoConfirmacion,
  };
}