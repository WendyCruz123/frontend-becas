'use client';

import type { EtapaEncargado } from '../types';

export function EtapaCard({
  etapa,
  onRevisar,
}: {
  etapa: EtapaEncargado;
  onRevisar?: () => void;
}) {
  const estado = etapa.estado_etapa;

  return (
    <div
      className="rounded-2xl p-5 backdrop-blur-xl
                 border border-white/10
                 bg-gradient-to-br
                 from-cyan-100/70 via-sky-200/60 to-cyan-300/50
                 shadow-lg hover:shadow-xl transition"
    >
      <div className="flex justify-between items-start gap-3 mb-4">
        <div>
          <div className="text-xs font-semibold text-slate-500">
            CI: {etapa.estudiante.ci}
          </div>

          <h3 className="mt-1 font-bold text-slate-800 leading-tight text-lg">
            {etapa.estudiante.nombre} {etapa.estudiante.apellido_paterno}{' '}
            {etapa.estudiante.apellido_materno}
          </h3>

          <p className="mt-1 text-sm text-slate-600 line-clamp-2">
            {etapa.beca.nombre}
          </p>
        </div>

        <span className="inline-flex shrink-0 rounded-xl bg-white/75 px-3 py-1 text-xs font-black text-cyan-700 shadow-sm">
          {estado}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
        <div className="rounded-xl bg-white/60 p-3">
          <div className="text-xs font-bold text-slate-500 uppercase">
            Gestión
          </div>
          <div className="font-bold text-slate-800">{etapa.beca.gestion}</div>
        </div>

        <div className="rounded-xl bg-white/60 p-3">
          <div className="text-xs font-bold text-slate-500 uppercase">
            Etapa
          </div>
          <div className="font-bold text-slate-800">
            {etapa.requisito.nombre}
          </div>
        </div>

        {etapa.nota !== null && etapa.nota !== undefined && (
          <div className="rounded-xl bg-white/60 p-3">
            <div className="text-xs font-bold text-slate-500 uppercase">
              Nota
            </div>
            <div className="font-bold text-slate-800">{etapa.nota}</div>
          </div>
        )}

        {etapa.fecha && (
          <div className="rounded-xl bg-white/60 p-3">
            <div className="text-xs font-bold text-slate-500 uppercase">
              Fecha
            </div>
            <div className="font-bold text-slate-800">
              {new Date(etapa.fecha).toLocaleDateString('es-BO')}
            </div>
          </div>
        )}
      </div>

      {(etapa.descripcion || etapa.texto_extra || etapa.oficina) && (
        <div className="mt-4 space-y-3">
          {etapa.descripcion && (
            <div className="rounded-xl bg-white/60 p-3">
              <div className="text-xs font-bold text-slate-500 uppercase">
                Descripción
              </div>
              <p className="mt-1 text-sm text-slate-700">
                {etapa.descripcion}
              </p>
            </div>
          )}

          {etapa.texto_extra && (
            <div className="rounded-xl bg-white/60 p-3">
              <div className="text-xs font-bold text-slate-500 uppercase">
                Detalle adicional
              </div>
              <p className="mt-1 text-sm text-slate-700">
                {etapa.texto_extra}
              </p>
            </div>
          )}

          {etapa.oficina && (
            <div className="rounded-xl bg-white/60 p-3">
              <div className="text-xs font-bold text-slate-500 uppercase">
                Oficina
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {etapa.oficina.nombre}
              </p>

              {etapa.oficina.horario_atencion && (
                <p className="mt-1 text-xs text-slate-600">
                  Horario: {etapa.oficina.horario_atencion}
                </p>
              )}
            </div>
          )}
        </div>
      )}

{onRevisar && (
  <button
    onClick={onRevisar}
    className="
      mt-4 w-full
      rounded-xl
      bg-emerald-500
      px-4 py-3
      text-sm font-bold text-white
      shadow-md
      transition
      hover:bg-emerald-600
      active:scale-[0.98]
    "
  >
    🔎 REVISAR ETAPA
  </button>
)}
    </div>
  );
}