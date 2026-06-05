'use client';

type Props = {
  tipoBeca: string;
  setTipoBeca: (value: string) => void;

  estadoFiltro: string;
  setEstadoFiltro: (value: string) => void;

  searchBeca: string;
  searchEstudiante: string;

  setSearchBeca: (value: string) => void;
  setSearchEstudiante: (value: string) => void;

  onBuscar: () => void;
};

export default function EnviarMensajesFilters({
  tipoBeca,
  setTipoBeca,
  estadoFiltro,
  setEstadoFiltro,
  searchBeca,
  searchEstudiante,
  setSearchBeca,
  setSearchEstudiante,
  onBuscar,
}: Props) {
  const estadosDisponibles =
    tipoBeca === 'CON_ETAPAS'
      ? [
          {
            value: 'HABILITADO',
            label: 'Habilitados para etapas',
          },
          {
            value: 'APROBADO',
            label: 'Etapas aprobadas',
          },
          {
            value: 'REPROBADO',
            label: 'Etapas reprobadas',
          },
          {
            value: 'ABANDONADO',
            label: 'Etapas abandonadas',
          },
        ]
      : [
          {
            value: 'PENDIENTE',
            label: 'Pendientes',
          },
          {
            value: 'REMITIDO_A_DISBECT',
            label: 'Remitidos a DISBECT',
          },
          {
            value: 'NO_REMITIDO',
            label: 'No remitidos',
          },
          {
            value: 'APROBADO',
            label: 'Aprobados',
          },
          {
            value: 'REPROBADO',
            label: 'Reprobados',
          },
        ];

  return (
    <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setTipoBeca('SIN_ETAPAS')}
          className={`rounded-2xl px-5 py-3 text-sm font-black transition-all ${
            tipoBeca === 'SIN_ETAPAS'
              ? 'bg-cyan-700 text-white shadow-lg'
              : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          Becas SIN etapas
        </button>

        <button
          type="button"
          onClick={() => setTipoBeca('CON_ETAPAS')}
          className={`rounded-2xl px-5 py-3 text-sm font-black transition-all ${
            tipoBeca === 'CON_ETAPAS'
              ? 'bg-violet-700 text-white shadow-lg'
              : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          Becas CON etapas
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
            Estado
          </label>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold outline-none transition focus:border-cyan-600"
          >
            {estadosDisponibles.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
            Buscar estudiante
          </label>

          <input
            value={searchEstudiante}
            onChange={(e) => setSearchEstudiante(e.target.value)}
            placeholder="Nombre o CI..."
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold outline-none transition focus:border-cyan-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
            Buscar beca
          </label>

          <input
            value={searchBeca}
            onChange={(e) => setSearchBeca(e.target.value)}
            placeholder="Nombre de beca..."
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold outline-none transition focus:border-cyan-600"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={onBuscar}
            className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-black active:scale-[0.98]"
          >
            Buscar postulaciones
          </button>
        </div>
      </div>
    </div>
  );
}