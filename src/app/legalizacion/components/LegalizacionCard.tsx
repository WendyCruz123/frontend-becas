'use client';

import { LegalizacionAccion, LegalizacionItem } from '../types';
import { estadoLabel, fechaLlegada, nombreEstudiante } from '../utils';

export default function LegalizacionCard({
  item,
  onAccion,
  onRechazar,
}: {
  item: LegalizacionItem;
  onAccion: (id: number, accion: LegalizacionAccion) => void;
  onRechazar: (item: LegalizacionItem) => void;
}) {
  const esPendiente = item.estado === 'PENDIENTE_LEGALIZACION';
  const esRevision = item.estado === 'EN_REVISION' && !item.es_entrega_final;
  const esEntrega = item.es_entrega_final && item.estado === 'LEGALIZADO';

  return (
    <div
      className="rounded-2xl p-5 backdrop-blur-xl
                 border border-white/10
                 bg-gradient-to-br
                 from-cyan-100/70 via-sky-200/60 to-cyan-300/50
                 shadow-lg hover:shadow-xl transition"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-500">
            CI: {item.estudiante.ci}
          </div>

          <h3 className="mt-1 text-lg font-bold uppercase leading-tight text-slate-800">
            {nombreEstudiante(item.estudiante)}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
            {item.beca.nombre}
          </p>
        </div>

        <span className="inline-flex shrink-0 rounded-xl bg-white/75 px-3 py-1 text-xs font-black text-cyan-700 shadow-sm">
          {estadoLabel(item.estado)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2">
        <div className="rounded-xl bg-white/60 p-3">
          <div className="text-xs font-bold uppercase text-slate-500">
            Beca
          </div>
          <div className="font-bold text-slate-800">{item.beca.nombre}</div>
        </div>

        <div className="rounded-xl bg-white/60 p-3">
          <div className="text-xs font-bold uppercase text-slate-500">
            Gestión
          </div>
          <div className="font-bold text-slate-800">{item.beca.gestion}</div>
        </div>

        <div className="rounded-xl bg-white/60 p-3 sm:col-span-2">
          <div className="text-xs font-bold uppercase text-slate-500">
            Requisito
          </div>
          <div className="font-bold text-slate-800">{item.requisito.nombre}</div>
        </div>

        <div className="rounded-xl bg-white/60 p-3">
          <div className="text-xs font-bold uppercase text-slate-500">
            Fecha llegada
          </div>
          <div className="font-semibold text-slate-700">
            {fechaLlegada(item)
              ? new Date(fechaLlegada(item)).toLocaleString('es-BO', {
                  timeZone: 'America/La_Paz',
                  hour12: false,
                })
              : '—'}
          </div>
        </div>

        <div className="rounded-xl bg-white/60 p-3">
          <div className="text-xs font-bold uppercase text-slate-500">
            Orden flujo
          </div>
          <div className="font-semibold text-slate-700">{item.orden}</div>
        </div>
      </div>

      {item.observacion && (
        <div className="mt-4 rounded-xl bg-white/60 p-3">
          <div className="text-xs font-bold uppercase text-slate-500">
            Observación
          </div>
          <p className="mt-1 text-sm text-slate-700">{item.observacion}</p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {esPendiente && (
          <button
            className="btn-action btn-active w-full sm:col-span-2"
            onClick={() => onAccion(item.id, 'pasar-revision')}
          >
            📥 Pasar a revisión
          </button>
        )}

        {esRevision && (
          <>
            <button
              className="btn-action btn-active w-full"
              onClick={() => onAccion(item.id, 'legalizar')}
            >
              ✅ Legalizar
            </button>

            <button
              className="btn-action btn-delete w-full"
              onClick={() => onRechazar(item)}
            >
              ❌ Rechazar
            </button>
          </>
        )}

        {esEntrega && (
          <>
            <button
              className="btn-action btn-active w-full"
              onClick={() => onAccion(item.id, 'entregar')}
            >
              📦 Entregar
            </button>

            <button
              className="btn-action btn-delete w-full"
              onClick={() => onRechazar(item)}
            >
              ❌ Rechazar
            </button>
          </>
        )}
      </div>
    </div>
  );
}