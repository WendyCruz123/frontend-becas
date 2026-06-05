'use client';

import { useState } from 'react';
import { useBecasDisponibles } from './hooks/useBecasDisponibles';
import { BuscadorBecas } from './components/BuscadorBecas';
import { BecasGrid } from './components/BecasGrid';
import { Paginacion } from './components/Paginacion';

export default function BecasDisponiblesPage() {
  const [modo, setModo] = useState<'vigentes' | 'historial'>('vigentes');

  const {
    rows,
    search,
    setSearch,
    loading,
    error,
    page,
    pages,
    prev,
    next,
  } = useBecasDisponibles(modo);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between rounded-[28px] border border-white/30 bg-white/50 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-md">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-700">
              {modo === 'vigentes' ? 'Convocatorias vigentes' : 'Historial académico'}
            </span>

            <h2 className="mt-2 text-2xl font-black uppercase text-slate-800 sm:text-3xl">
              {modo === 'vigentes' ? 'Becas disponibles' : 'Mis registros de postulaciones'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setModo(modo === 'vigentes' ? 'historial' : 'vigentes')}
            className="rounded-2xl border border-cyan-200 bg-white px-5 py-3 text-sm font-black uppercase text-cyan-800 shadow-sm transition hover:bg-cyan-50"
          >
            {modo === 'vigentes' ? 'Mis registros de postulaciones' : 'Ver becas disponibles'}
          </button>
        </div>

        <BuscadorBecas value={search} onChange={setSearch} />

        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-600">
            Cargando...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-center font-semibold text-red-700">
            {error}
          </div>
        )}

        {!loading && rows.length === 0 && !error && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-500">
            {modo === 'vigentes'
              ? 'No hay becas vigentes.'
              : 'No tiene registros aprobados o reprobados.'}
          </div>
        )}

       {!loading && rows.length > 0 && <BecasGrid rows={rows} modo={modo} />}

        {!loading && rows.length > 0 && (
          <Paginacion page={page} pages={pages} onPrev={prev} onNext={next} />
        )}
      </div>
    </div>
  );
}