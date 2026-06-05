'use client';

type EstadoKardexFiltro = 'TODOS' | 'LEGALIZADOS' | 'RECHAZADOS';

export default function KardexSolicitudesFilters({
  busquedaNombre,
  setBusquedaNombre,
  busquedaBeca,
  setBusquedaBeca,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  estadoFiltro,
  setEstadoFiltro,
  mostrarEstado,
  onLimpiar,
}: {
  busquedaNombre: string;
  setBusquedaNombre: (value: string) => void;
  busquedaBeca: string;
  setBusquedaBeca: (value: string) => void;
  fechaInicio: string;
  setFechaInicio: (value: string) => void;
  fechaFin: string;
  setFechaFin: (value: string) => void;
  estadoFiltro: EstadoKardexFiltro;
  setEstadoFiltro: (value: EstadoKardexFiltro) => void;
  mostrarEstado: boolean;
  onLimpiar: () => void;
}) {
  return (
    <div className="mb-7 rounded-2xl border border-cyan-100 bg-white/70 p-4 shadow-sm backdrop-blur">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          value={busquedaNombre}
          onChange={(e) => setBusquedaNombre(e.target.value)}
          placeholder="Nombre o CI..."
        />

        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          value={busquedaBeca}
          onChange={(e) => setBusquedaBeca(e.target.value)}
          placeholder="Buscar por beca..."
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs font-black uppercase tracking-wide text-slate-500">
            Fecha inicio
          </label>

          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-black uppercase tracking-wide text-slate-500">
            Fecha fin
          </label>

          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={onLimpiar}
          className="w-full rounded-xl border border-slate-400 bg-slate-300 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200"
        >
          LIMPIAR
        </button>
      </div>

      {mostrarEstado && (
        <div className="mt-4 flex flex-wrap gap-2">
          {(['TODOS', 'LEGALIZADOS', 'RECHAZADOS'] as EstadoKardexFiltro[]).map(
            (estado) => (
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
                {estado}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}