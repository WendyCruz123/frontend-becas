'use client';

import { useRouter } from 'next/navigation';
import { BecaRow } from '../types';
import { formatDate } from '../utils';

export function BecaCard({ beca }: { beca: BecaRow }) {
  const router = useRouter();

  const inicio = formatDate(beca.fecha_inicio);
  const fin = formatDate(beca.fecha_fin);
  const dias = diasRestantes(beca.fecha_fin);

  const alertaFin = dias !== null && dias <= 10 && dias >= 0;
  const vencida = dias !== null && dias < 0;

  function diasRestantes(fechaFin?: string | null) {
    if (!fechaFin) return null;

    const hoy = new Date();
    const fin = new Date(fechaFin);

    hoy.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);

    const diffMs = fin.getTime() - hoy.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  return (
    <article
  className="
    group relative overflow-hidden rounded-[28px]

    border border-white/30
    bg-white/50
    backdrop-blur-md

    shadow-[0_18px_45px_rgba(15,23,42,0.08)]

    transition-all duration-300
    hover:-translate-y-1
    hover:bg-white/78
    hover:shadow-[0_24px_60px_rgba(14,116,144,0.16)]

  "
>
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cyan-700 via-sky-500 to-cyan-400" />

      <div className="p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div
            className="
              flex h-14 w-14 shrink-0 items-center justify-center
              rounded-2xl bg-cyan-50 text-2xl shadow-inner
              ring-1 ring-cyan-100
            "
          >
            🎓
          </div>

          <span
            className="
              rounded-full border border-cyan-200 bg-cyan-50
              px-3 py-1 text-xs font-bold uppercase tracking-wide
              text-cyan-800
            "
          >
            {beca.tipo}
          </span>
        </div>

        <h3
          className="
            min-h-[56px] text-lg font-black uppercase leading-tight
            tracking-tight text-slate-800
          "
        >
          {beca.nombre}
        </h3>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-800">
          🎯 Cupos: {beca.cupos ?? 'No definido'}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase text-slate-400">
              Inicio
            </p>
            <p className="mt-1 font-bold text-slate-700">
              {inicio ?? '—'}
            </p>
          </div>

          <div
            className={`
              rounded-2xl border p-3
              ${
                alertaFin || vencida
                  ? 'border-red-200 bg-red-50'
                  : 'border-slate-100 bg-slate-50'
              }
            `}
          >
            <p
              className={`
                text-xs font-bold uppercase
                ${alertaFin || vencida ? 'text-red-500' : 'text-slate-400'}
              `}
            >
              Fin
            </p>

            <p
              className={`
                mt-1 font-bold
                ${alertaFin || vencida ? 'text-red-700' : 'text-slate-700'}
              `}
            >
              {fin ?? '—'}
            </p>
          </div>
        </div>

        <div className="mt-4 min-h-[28px]">
  {beca.estado_postulacion ? (
    <p
      className={`
        inline-flex items-center rounded-full px-3 py-1 text-xs font-bold
        ${
          beca.estado_postulacion === 'APROBADO'
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-red-100 text-red-700'
        }
      `}
    >
      {beca.estado_postulacion === 'APROBADO' ? '✅ ' : '❌ '}
      Estado: {beca.estado_postulacion}
    </p>
  ) : (
    <>
      {dias !== null && !vencida && (
        <p className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${alertaFin ? 'bg-red-100 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {alertaFin ? '⚠️ ' : '✅ '}
          Quedan {dias} días para postular
        </p>
      )}

      {vencida && (
        <p className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
          Convocatoria vencida
        </p>
      )}
    </>
  )}
</div>

        <button
          className="
            mt-6 w-full rounded-2xl
            bg-gradient-to-r from-cyan-700 to-sky-600
            px-5 py-3 text-sm font-black uppercase tracking-wide text-white
            shadow-lg shadow-cyan-900/20
            transition-all duration-300
            hover:from-cyan-800 hover:to-sky-700 hover:shadow-xl
            active:scale-[0.98]
          "
          onClick={() => router.push(`/becas-disponibles/${beca.ID_beca}`)}
        >
          VER BECA
        </button>
      </div>
    </article>
  );
}