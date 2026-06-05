import type { EstadoReporteFiltro, ModoEstadoReporte } from '../types';
type Props = {
  year: number | '';
  searchEstudiante: string;
  searchBeca: string;
  fechaInicio: string;
  fechaFin: string;
  estadoFiltro: EstadoReporteFiltro;
  modoEstado: ModoEstadoReporte;
setModoEstado: (value: ModoEstadoReporte) => void;
  onChangeYear: (value: string) => void;
  onChangeSearchEstudiante: (value: string) => void;
  onChangeSearchBeca: (value: string) => void;
  setFechaInicio: (value: string) => void;
  setFechaFin: (value: string) => void;
  setEstadoFiltro: (value: EstadoReporteFiltro) => void;
  onLimpiar: () => void;
};

export function ReportesFilters({
  year,
  searchEstudiante,
  searchBeca,
  fechaInicio,
  fechaFin,
  estadoFiltro,
modoEstado,
setModoEstado,
  onChangeYear,
  onChangeSearchEstudiante,
  onChangeSearchBeca,
  setFechaInicio,
  setFechaFin,
  setEstadoFiltro,
  onLimpiar,
}: Props) {
const estados: { value: EstadoReporteFiltro; label: string }[] = [
  { value: 'TODOS', label: 'TODOS' },
  { value: 'EN_PROCESO', label: 'EN PROCESO' },
  { value: 'PENDIENTE', label: 'PENDIENTE' },
  { value: 'HABILITADO', label: 'HABILITADO' },
  { value: 'REMITIDO_A_DISBECT', label: 'REMITIDO A DISBECT' },
  { value: 'NO_REMITIDO', label: 'NO REMITIDO' },
  { value: 'OBSERVADO', label: 'OBSERVADO' },
  { value: 'APROBADO', label: 'APROBADO' },
  { value: 'REPROBADO', label: 'REPROBADO' },
  { value: 'ABANDONADO', label: 'ABANDONADO' },
];

  return (
    <div className="mb-7 rounded-2xl border border-cyan-100 bg-white/70 p-4 shadow-sm backdrop-blur">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <input
          type="number"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          placeholder="Año..."
          value={year}
          onChange={(e) => onChangeYear(e.target.value)}
        />

        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          placeholder="Nombre o CI..."
          value={searchEstudiante}
          onChange={(e) => onChangeSearchEstudiante(e.target.value)}
        />

        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          placeholder="Buscar por beca..."
          value={searchBeca}
          onChange={(e) => onChangeSearchBeca(e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs font-black uppercase tracking-wide text-slate-500">
            Fecha inicio
          </label>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-black uppercase tracking-wide text-slate-500">
            Fecha fin
          </label>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
          <button
          type="button"
          onClick={onLimpiar}
          className="rounded-xl border border-slate-400 bg-slate-300 px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-200"
        >
          LIMPIAR
        </button>
      </div>
<div className="mt-4 flex flex-wrap gap-2 rounded-2xl bg-slate-50 p-2">
  <button
    type="button"
    onClick={() => setModoEstado('ACTUAL')}
    className={`rounded-xl px-4 py-2 text-xs font-black transition ${
      modoEstado === 'ACTUAL'
        ? 'bg-cyan-700 text-white shadow-sm'
        : 'bg-white text-slate-700 hover:bg-slate-100'
    }`}
  >
    ESTADO ACTUAL
  </button>

  <button
    type="button"
    onClick={() => setModoEstado('HISTORICO')}
    className={`rounded-xl px-4 py-2 text-xs font-black transition ${
      modoEstado === 'HISTORICO'
        ? 'bg-cyan-700 text-white shadow-sm'
        : 'bg-white text-slate-700 hover:bg-slate-100'
    }`}
  >
    PASÓ POR ESE ESTADO
  </button>
</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {estados.map((estado) => (
  <button
    key={estado.value}
    type="button"
    onClick={() => setEstadoFiltro(estado.value)}
    className={`rounded-xl px-4 py-2 text-xs font-black transition ${
      estadoFiltro === estado.value
        ? 'bg-emerald-500 text-white shadow-sm'
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
    }`}
  >
    {estado.label}
  </button>
))}

      </div>
    </div>
  );
}