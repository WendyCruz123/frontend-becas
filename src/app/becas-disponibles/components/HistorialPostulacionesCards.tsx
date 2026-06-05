'use client';

import { useState } from 'react';
import { BecaRow, HistorialEstadoItem } from '../types';
import { formatDate, formatDateTime } from '../utils';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import BotonVolverDashboard from '@/components/BotonVolverDashboard';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export function HistorialPostulacionesCards({ rows }: { rows: BecaRow[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<BecaRow | null>(null);
  const [historial, setHistorial] = useState<HistorialEstadoItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function abrirDetalle(row: BecaRow) {
    if (!row.ID_postulacion) return;

    setSelected(row);
    setOpen(true);
    setLoading(true);

    try {
      const r = await fetchWithAuth(
        `${BACKEND}/postulaciones/${row.ID_postulacion}/historial-estados`
      );

      const data = await r.json();
      setHistorial(data.historial || []);
    } catch {
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {rows.map((r, index) => (
          <article
            key={r.ID_postulacion ?? `${r.ID_beca}-${index}`}
            className="
              rounded-3xl border border-white/40
              bg-gradient-to-br from-cyan-100/60 via-white/70 to-sky-100/60
              p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]
              backdrop-blur-xl
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-700">
                  Registro de postulación
                </p>

                <h3 className="mt-2 text-lg font-black uppercase text-slate-800">
                  {r.nombre}
                </h3>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {r.tipo}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  r.estado_postulacion === 'APROBADO'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {r.estado_postulacion}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <Dato label="Nombre completo" value={r.nombre_completo || '—'} />
              <Dato label="Cédula de identidad" value={r.ci || '—'} />
              <Dato label="Inicio beca" value={formatDate(r.fecha_inicio) || '—'} />
              <Dato label="Fin beca" value={formatDate(r.fecha_fin) || '—'} />
              <Dato label="Fecha postulación" value={formatDateTime(r.fecha_postulacion)} />
              <Dato label="Observación" value={r.estado_observacion || r.observacion || '—'} />
            </div>

            <button
              type="button"
              onClick={() => abrirDetalle(r)}
              className="
                mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-700 to-sky-600
                px-5 py-3 text-sm font-black uppercase tracking-wide text-white
                shadow-lg shadow-cyan-900/20 transition
                hover:from-cyan-800 hover:to-sky-700 active:scale-[0.98]
              "
            >
              👁 Ver detalle
            </button>
          </article>
        ))}
      </div>

      {open && selected && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.35)]">
            <div className="flex items-start justify-between bg-gradient-to-r from-cyan-800 to-sky-700 p-6 text-white">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-100">
                  Detalle del historial
                </p>
                <h2 className="mt-2 text-xl font-black uppercase">
                  {selected.nombre}
                </h2>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-full bg-white/15 px-3 py-1 text-2xl font-bold hover:bg-white/25"
              >
                ×
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <Dato label="Nombre completo" value={selected.nombre_completo || '—'} />
                <Dato label="Cédula de identidad" value={selected.ci || '—'} />
                <Dato label="Beca" value={selected.nombre} />
                <Dato label="Tipo" value={selected.tipo} />
                <Dato label="Inicio beca" value={formatDate(selected.fecha_inicio) || '—'} />
                <Dato label="Fin beca" value={formatDate(selected.fecha_fin) || '—'} />
                <Dato label="Fecha postulación" value={formatDateTime(selected.fecha_postulacion)} />
                <Dato label="Estado" value={selected.estado_postulacion || '—'} />
                <Dato label="Observación" value={selected.estado_observacion || selected.observacion || '—'} />
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">
                  Cambios de estado
                </h3>

                {loading ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center font-semibold text-slate-500">
                    Cargando historial...
                  </div>
                ) : historial.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center font-semibold text-slate-500">
                    Sin historial registrado.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historial.map((h, i) => (
                      <div
                        key={`${h.estado}-${h.fecha}-${i}`}
                        className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4"
                      >
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <span className="font-black uppercase text-slate-800">
                            {h.estado}
                          </span>
                          <span className="text-sm font-semibold text-cyan-700">
                            {formatDateTime(h.fecha)}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-600">
                          Acción: {h.accion}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Dato({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white/80 p-3">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-700">{value}</p>
    </div>
  );
}