'use client';

import { LegalizacionVista, OrdenFecha } from '../types';

export default function LegalizacionFilters({
  busquedaEstudiante,
  setBusquedaEstudiante,
  busquedaCi,
  setBusquedaCi,
  busquedaGestion,
  setBusquedaGestion,
  busquedaBeca,
  setBusquedaBeca,
  vista,
  setVista,
  ordenFecha,
  setOrdenFecha,
  onLimpiar,
}: {
  busquedaEstudiante: string;
  setBusquedaEstudiante: (v: string) => void;
  busquedaCi: string;
  setBusquedaCi: (v: string) => void;
  busquedaGestion: string;
  setBusquedaGestion: (v: string) => void;
  busquedaBeca: string;
  setBusquedaBeca: (v: string) => void;
  vista: LegalizacionVista;
  setVista: (v: LegalizacionVista) => void;
  ordenFecha: OrdenFecha;
  setOrdenFecha: (v: OrdenFecha) => void;
  onLimpiar: () => void;
}) {
  const vistas: LegalizacionVista[] = [
    'PENDIENTES',
    'EN_REVISION',
    'ENTREGA',
    'LEGALIZADOS',
    'ENTREGADOS',
    'RECHAZADOS',
    'TODOS',
    ];

  return (
    <div className="mb-7 rounded-2xl border border-cyan-100 bg-white/70 p-4 shadow-sm backdrop-blur">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          value={busquedaEstudiante}
          onChange={(e) => setBusquedaEstudiante(e.target.value)}
          placeholder="Nombre completo..."
        />

        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          value={busquedaCi}
          onChange={(e) => setBusquedaCi(e.target.value)}
          placeholder="Cédula de identidad..."
        />

        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          value={busquedaGestion}
          onChange={(e) => setBusquedaGestion(e.target.value)}
          placeholder="Año / gestión..."
        />

        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          value={busquedaBeca}
          onChange={(e) => setBusquedaBeca(e.target.value)}
          placeholder="Nombre de beca..."
        />

        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          value={ordenFecha}
          onChange={(e) => setOrdenFecha(e.target.value as OrdenFecha)}
        >
          <option value="DESC">Más recientes primero</option>
          <option value="ASC">Más antiguos primero</option>
        </select>

        <button
          type="button"
          onClick={onLimpiar}
          className="w-full rounded-xl border border-slate-400 bg-slate-300 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200"
        >
          LIMPIAR
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {vistas.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVista(v)}
            className={`rounded-xl px-4 py-2 text-xs font-black transition ${
              vista === v
                ? 'bg-cyan-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {v === 'PENDIENTES' && 'PENDIENTES'}
            {v === 'EN_REVISION' && 'EN REVISIÓN'}
            {v === 'ENTREGA' && 'ENTREGA'}
            {v === 'LEGALIZADOS' && 'LEGALIZADOS'}
            {v === 'ENTREGADOS' && 'ENTREGADOS'}
            {v === 'RECHAZADOS' && 'RECHAZADOS'}
            {v === 'TODOS' && 'TODOS'}
          </button>
        ))}
      </div>
    </div>
  );
}