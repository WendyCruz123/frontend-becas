'use client';
import type {
  TipoBecaNotificacion,
  EstadoFiltroNotificacion,
} from '../types';

export default function EnviarMensajesTipoBecaFilters({
  tipoBeca,
  setTipoBeca,
  estadoFiltro,
  setEstadoFiltro,
  searchEstudiante,
  setSearchEstudiante,
  searchBeca,
  setSearchBeca,
  onBuscar,
}: {
tipoBeca: TipoBecaNotificacion;
setTipoBeca: (value: TipoBecaNotificacion) => void;
  estadoFiltro: EstadoFiltroNotificacion;
  setEstadoFiltro: (value: EstadoFiltroNotificacion) => void;
  searchEstudiante: string;
  setSearchEstudiante: (v: string) => void;
  searchBeca: string;
  setSearchBeca: (v: string) => void;
  onBuscar: () => void;
}) {
  const estados =
    tipoBeca === 'CON_ETAPAS'
      ? (['PENDIENTE'] as EstadoFiltroNotificacion[])
      : (['PENDIENTE', 'REMITIDO_A_DISBECT'] as EstadoFiltroNotificacion[]);

  return (
    <section className="mb-7 rounded-2xl border border-cyan-100 bg-white/70 p-4 shadow-sm backdrop-blur">
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setTipoBeca('CON_ETAPAS');
            setEstadoFiltro('PENDIENTE');
          }}
          className={`rounded-xl px-5 py-3 text-sm font-black transition ${
            tipoBeca === 'CON_ETAPAS'
              ? 'bg-cyan-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          BECA CON ETAPAS
        </button>

        <button
          type="button"
          onClick={() => {
            setTipoBeca('SIN_ETAPAS');
            setEstadoFiltro('PENDIENTE');
          }}
          className={`rounded-xl px-5 py-3 text-sm font-black transition ${
            tipoBeca === 'SIN_ETAPAS'
              ? 'bg-cyan-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          BECA SIN ETAPAS
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          placeholder="Nombre completo o CI..."
          value={searchEstudiante}
          onChange={(e) => setSearchEstudiante(e.target.value)}
        />

        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          placeholder="Nombre de beca..."
          value={searchBeca}
          onChange={(e) => setSearchBeca(e.target.value)}
        />

        <button
          type="button"
          onClick={onBuscar}
          className="rounded-xl bg-cyan-700 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-cyan-800"
        >
          BUSCAR
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {estados.map((estado) => (
          <button
            key={estado}
            type="button"
            onClick={() => setEstadoFiltro(estado)}
            className={`rounded-xl px-4 py-2 text-xs font-black transition ${
              estadoFiltro === estado
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {estado === 'PENDIENTE' ? 'PENDIENTE' : 'REMITIDO A DISBECT'}
          </button>
        ))}
      </div>
    </section>
  );
}