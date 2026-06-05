'use client';

import type { EnviarMensajeRow } from '../types';

export default function EnviarMensajesCards({
  rows,
  loading,
  selectedIds,
  onToggleSeleccion,
}: {
  rows: EnviarMensajeRow[];
  loading: boolean;
  selectedIds: string[];
  onToggleSeleccion: (id: string) => void;
}) {
  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm">Cargando...</div>;
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center font-bold text-slate-600 shadow-sm">
        No se encontraron postulaciones.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {rows.map((r) => (
        <article
          key={r.id}
          className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-sky-50 to-white p-5 shadow-md transition hover:shadow-lg"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-slate-500">
                CI: {r.ci}
              </p>

              <h3 className="mt-1 text-lg font-black uppercase leading-tight text-slate-800">
                {r.nombre} {r.apellido_paterno} {r.apellido_materno}
              </h3>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {r.beca_nombre}
              </p>
            </div>

            <input
              type="checkbox"
              checked={selectedIds.includes(String(r.id))}
              onChange={() => onToggleSeleccion(String(r.id))}
              className="h-5 w-5 accent-cyan-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/80 p-3">
              <p className="text-xs font-black uppercase text-slate-500">Tipo</p>
              <p className="font-bold text-slate-800">{r.beca_tipo}</p>
            </div>

            <div className="rounded-2xl bg-white/80 p-3">
              <p className="text-xs font-black uppercase text-slate-500">
                Gestión
              </p>
              <p className="font-bold text-slate-800">{r.gestion}</p>
            </div>

            <div className="rounded-2xl bg-white/80 p-3">
              <p className="text-xs font-black uppercase text-slate-500">
                Estado
              </p>
              <p className="font-bold text-cyan-800">{r.estado}</p>
            </div>

            <div className="rounded-2xl bg-white/80 p-3">
              <p className="text-xs font-black uppercase text-slate-500">
                Observación
              </p>
              <p className="font-bold text-slate-800">
                {r.estado_observacion || 'SIN OBSERVACIÓN'}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}