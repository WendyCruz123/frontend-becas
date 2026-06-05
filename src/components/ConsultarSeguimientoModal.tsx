'use client';

import { useState } from 'react';
import {
  FaCheckCircle,
  FaClock,
  FaRoute,
  FaTimes,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaHourglassHalf,
  FaPaperPlane,
  FaFolderOpen,
  FaTimesCircle,
  FaFlagCheckered,
  FaRegCircle,
} from 'react-icons/fa';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

type HistorialEstado = {
  estado: string;
  fecha: string | null;
  accion: string;
  descripcion?: string | null;
};

type EtapaSeguimiento = {
  nombre: string;
  descripcion_requisito?: string | null;
  estado_etapa?: string | null;
  completado: boolean;
  nota?: number | null;
  fecha?: string | null;
  descripcion?: string | null;
  texto_extra?: string | null;
  ruta360?: {
    oficinaId: number;
    nombre: string;
    slug?: string | null;
  } | null;
};

type SeguimientoResponse = {
  codigo_seguimiento: string;
  estado_general: string;
  mensaje_estado?: string;
  gestion: string;
  beca: {
    nombre: string;
    tipo: string;
  };
  historial_estados?: HistorialEstado[];
  etapas: EtapaSeguimiento[];
};

function formatearFecha(fecha?: string | null) {
  if (!fecha) return 'Pendiente';
  return new Date(fecha).toLocaleString('es-BO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function getEstadoInfo(estado: string, activo: boolean) {
  const e = estado.toUpperCase();

  if (['REPROBADO', 'ABANDONADO', 'NO_REMITIDO'].includes(e)) {
    return {
      icono: <FaTimesCircle />,
      punto: 'border-red-500 text-red-600 bg-red-50',
      linea: 'bg-red-400',
      badge: 'bg-red-100 text-red-700',
      titulo: 'text-red-800',
    };
  }

  if (e === 'OBSERVADO') {
    return {
      icono: <FaExclamationTriangle />,
      punto: 'border-amber-500 text-amber-600 bg-amber-50',
      linea: 'bg-amber-400',
      badge: 'bg-amber-100 text-amber-700',
      titulo: 'text-amber-800',
    };
  }

  if (!activo) {
    return {
      icono: <FaRegCircle />,
      punto: 'border-slate-200 text-slate-300 bg-white',
      linea: 'bg-slate-200',
      badge: 'bg-slate-100 text-slate-500',
      titulo: 'text-slate-400',
    };
  }

  const iconos: Record<string, React.ReactNode> = {
    EN_PROCESO: <FaFolderOpen />,
    PENDIENTE: <FaHourglassHalf />,
    HABILITADO: <FaClipboardCheck />,
    REMITIDO_A_DISBECT: <FaPaperPlane />,
    APROBADO: <FaFlagCheckered />,
  };

  return {
    icono: iconos[e] ?? <FaCheckCircle />,
    punto: 'border-emerald-500 text-emerald-600 bg-emerald-50',
    linea: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
    titulo: 'text-slate-800',
  };
}

function nombreEstado(estado: string) {
  const mapa: Record<string, string> = {
    EN_PROCESO: 'En proceso',
    PENDIENTE: 'Pendiente',
    HABILITADO: 'Habilitado',
    REMITIDO_A_DISBECT: 'Remitido a DISBECT',
    NO_REMITIDO: 'No remitido',
    OBSERVADO: 'Observado',
    APROBADO: 'Aprobado',
    REPROBADO: 'Reprobado',
    ABANDONADO: 'Abandonado',
  };

  return mapa[estado] || estado;
}

function descripcionEstado(estado: string) {
  const mapa: Record<string, string> = {
    EN_PROCESO: 'El estudiante inició su trámite.',
    PENDIENTE: 'El trámite fue finalizado y espera revisión administrativa.',
    HABILITADO: 'La documentación fue aprobada y se habilitaron etapas.',
    REMITIDO_A_DISBECT: 'La carpeta fue remitida para revisión administrativa.',
    NO_REMITIDO: 'La carpeta no fue remitida y el trámite fue cerrado.',
    OBSERVADO: 'El trámite tiene una observación administrativa.',
    APROBADO: 'La postulación fue aprobada.',
    REPROBADO: 'La postulación fue reprobada.',
    ABANDONADO: 'El trámite fue abandonado.',
  };

  return mapa[estado] || 'Cambio registrado en el trámite.';
}

function getEtapaVisual(etapa: EtapaSeguimiento) {
  const estado = etapa.estado_etapa?.toUpperCase() || '';

  if (estado === 'APROBADO') {
    return {
      icono: <FaCheckCircle />,
      badge: 'bg-emerald-100 text-emerald-700',
      punto: 'border-emerald-500 text-emerald-600 bg-emerald-50',
      titulo: 'text-slate-800',
      texto: 'APROBADO',
    };
  }

  if (estado === 'REPROBADO' || estado === 'ABANDONADO') {
    return {
      icono: <FaTimesCircle />,
      badge: 'bg-red-100 text-red-700',
      punto: 'border-red-500 text-red-600 bg-red-50',
      titulo: 'text-red-800',
      texto: estado,
    };
  }

  if (estado === 'EN_REVISION') {
    return {
      icono: <FaClock />,
      badge: 'bg-cyan-100 text-cyan-700',
      punto: 'border-cyan-500 text-cyan-600 bg-cyan-50',
      titulo: 'text-slate-800',
      texto: 'EN REVISIÓN',
    };
  }

  return {
    icono: <FaRegCircle />,
    badge: 'bg-slate-100 text-slate-500',
    punto: 'border-slate-200 text-slate-300 bg-white',
    titulo: 'text-slate-400',
    texto: estado || 'BLOQUEADO',
  };
}

export default function ConsultarSeguimientoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<SeguimientoResponse | null>(null);
  const [error, setError] = useState('');

  if (!open) return null;

  async function consultar() {
    if (!codigo.trim()) {
      setError('Debe ingresar el código de seguimiento.');
      return;
    }

    setLoading(true);
    setError('');
    setResultado(null);

    try {
      const res = await fetch(
        `${BACKEND}/postulaciones/seguimiento/${encodeURIComponent(
          codigo.trim(),
        )}`,
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || data?.mensaje || 'No se encontró el trámite.',
        );
      }

      setResultado(data);
    } catch (err: any) {
      setError(err.message || 'Error al consultar el seguimiento.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 px-3 backdrop-blur-sm">
      <div className="relative w-full max-w-[860px] overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.35)]">
        <button
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-md transition hover:bg-red-50 hover:text-red-600"
          onClick={onClose}
          type="button"
        >
          <FaTimes />
        </button>

        <div className="max-h-[88vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-800 px-6 py-6 text-white sm:px-8">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-cyan-100">
              Seguimiento institucional
            </span>

            <h2 className="mt-3 text-2xl font-black uppercase leading-tight sm:text-3xl">
              Estado de su trámite
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-50/90">
              Consulte el avance general de su postulación y las etapas
              registradas por la institución.
            </p>
          </div>

          <div className="px-5 py-5 sm:px-8">
            <label className="text-sm font-black uppercase tracking-wide text-slate-700">
              Código de seguimiento
            </label>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                className="min-h-[48px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold uppercase text-slate-800 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="Ej. BEC-2026-6MOJU"
              />

              <button
                type="button"
                className="min-h-[48px] rounded-2xl bg-cyan-700 px-6 text-sm font-black uppercase text-white shadow-lg shadow-cyan-900/20 transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={consultar}
                disabled={loading}
              >
                {loading ? 'Consultando...' : 'Consultar'}
              </button>
            </div>

            {error && (
              <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </p>
            )}

            {resultado && (
              <div className="mt-6 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700">
                        {resultado.beca.tipo}
                      </p>

                      <h3 className="mt-1 text-xl font-black uppercase text-slate-800">
                        {resultado.beca.nombre}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Código:{' '}
                        <strong className="text-slate-800">
                          {resultado.codigo_seguimiento}
                        </strong>
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                      Gestión: {resultado.gestion}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3">
                    <p className="text-sm font-black uppercase text-cyan-900">
                      Estado general: {nombreEstado(resultado.estado_general)}
                    </p>

                    {resultado.mensaje_estado && (
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {resultado.mensaje_estado}
                      </p>
                    )}
                  </div>
                </div>

                {(resultado.historial_estados?.length ?? 0) > 0 && (
                  <div className="px-5 py-6">
                    <h4 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                      Línea de tiempo del trámite
                    </h4>

                    <div className="relative">
                      {resultado.historial_estados!.map((item, index) => {
                        const isLast =
                          index === resultado.historial_estados!.length - 1;

                        const info = getEstadoInfo(item.estado, true);

                        return (
                          <div
                            key={`${item.estado}-${index}`}
                            className="relative flex gap-4 pb-7 last:pb-0"
                          >
                            {!isLast && (
                              <div
                                className={`absolute left-[25px] top-[54px] h-[calc(100%-48px)] w-[4px] rounded-full ${info.linea}`}
                              />
                            )}

                            <div
                              className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[5px] text-xl ${info.punto}`}
                            >
                              {info.icono}
                            </div>

                            <div className="min-w-0 flex-1 border-b border-dashed border-slate-200 pb-5">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <h5
                                  className={`text-lg font-black uppercase ${info.titulo}`}
                                >
                                  {nombreEstado(item.estado)}
                                </h5>

                                <span
                                  className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-black uppercase ${info.badge}`}
                                >
                                  {item.estado}
                                </span>
                              </div>

                              <p className="mt-1 text-sm font-bold text-slate-500">
                                {formatearFecha(item.fecha)}
                              </p>

                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {item.descripcion ||
                                  descripcionEstado(item.estado)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {resultado.etapas?.length > 0 && (
                  <div className="border-t border-slate-200 bg-slate-50/70 px-5 py-6">
                    <h4 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                      Etapas de evaluación
                    </h4>

                    <div className="space-y-4">
                      {resultado.etapas.map((etapa, index) => {
                        const visual = getEtapaVisual(etapa);

                        return (
                          <div
                            key={`${etapa.nombre}-${index}`}
                            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                          >
                            <div className="flex gap-4">
                              <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-[4px] text-lg ${visual.punto}`}
                              >
                                {visual.icono}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                  <h5
                                    className={`text-lg font-black uppercase ${visual.titulo}`}
                                  >
                                    {etapa.nombre}
                                  </h5>

                                  <span
                                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-black uppercase ${visual.badge}`}
                                  >
                                    {visual.texto}
                                  </span>
                                </div>

                                {etapa.fecha && (
                                  <p className="mt-2 text-sm font-bold text-slate-500">
                                    Fecha: {formatearFecha(etapa.fecha)}
                                  </p>
                                )}

                                {etapa.nota !== null &&
                                  etapa.nota !== undefined && (
                                    <p className="mt-2 text-sm font-semibold text-slate-600">
                                      Nota: {etapa.nota}
                                    </p>
                                  )}

                                {etapa.descripcion && (
                                  <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {etapa.descripcion}
                                  </p>
                                )}

                                {etapa.texto_extra && (
                                  <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {etapa.texto_extra}
                                  </p>
                                )}

                                {etapa.ruta360?.slug && (
                                  <button
                                    type="button"
                                    className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-black text-white shadow-md transition hover:bg-emerald-700"
                                    onClick={() =>
                                      window.open(
                                        `/visor/${etapa.ruta360?.slug}`,
                                        '_blank',
                                      )
                                    }
                                  >
                                    <FaRoute />
                                    Ver recorrido 360° de{' '}
                                    {etapa.ruta360.nombre}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}