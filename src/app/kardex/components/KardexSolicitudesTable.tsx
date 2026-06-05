'use client';

import { useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import RechazarKardexModal from './RechazarKardexModal';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export default function KardexSolicitudesTable({
  pendientes,
  revisadas,
  tab,
  setTab,
  onRefresh,
}: {
  pendientes: any[];
  revisadas: any[];
  tab: 'PENDIENTES' | 'REVISADAS';
  setTab: (value: 'PENDIENTES' | 'REVISADAS') => void;
  onRefresh: () => void;
}) {
  const [rechazar, setRechazar] = useState<any | null>(null);

  const rows = tab === 'PENDIENTES' ? pendientes : revisadas;

  async function legalizar(row: any) {
    await fetchWithAuth(
      `${BACKEND}/kardex/solicitudes/${row.ID_paso_estudiante}/revisar`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'LEGALIZADO' }),
      },
    );

    onRefresh();
  }
    async function pasarARevision(row: any) {
      await fetchWithAuth(
        `${BACKEND}/kardex/solicitudes/${row.ID_paso_estudiante}/pasar-revision`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      onRefresh();
    }

  return (
    <section className="mt-5">
      <div className="mb-6 flex w-full max-w-md rounded-2xl bg-cyan-100/70 p-2 shadow-inner">
        <button
          type="button"
          onClick={() => setTab('PENDIENTES')}
          className={`flex-1 rounded-xl px-5 py-3 text-sm font-black transition ${
            tab === 'PENDIENTES'
              ? 'bg-cyan-700 text-white shadow-lg'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          PENDIENTES
          <span className="ml-2 rounded-full bg-white/25 px-2 py-0.5 text-xs">
            {pendientes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab('REVISADAS')}
          className={`flex-1 rounded-xl px-5 py-3 text-sm font-black transition ${
            tab === 'REVISADAS'
              ? 'bg-cyan-700 text-white shadow-lg'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          NOTIFICADOS
          <span className="ml-2 rounded-full bg-white/25 px-2 py-0.5 text-xs">
            {revisadas.length}
          </span>
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="table-wrapper p-5 rounded-2xl">
          No hay solicitudes {tab === 'PENDIENTES' ? 'pendientes' : 'notificadas'}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {rows.map((row) => {
            const persona = row.postulacion.estudiante.persona;

            return (
              <div
                key={row.ID_paso_estudiante}
                className="rounded-2xl p-5 backdrop-blur-xl
                           border border-white/10
                           bg-gradient-to-br
                           from-cyan-100/70 via-sky-200/60 to-cyan-300/50
                           shadow-lg hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">
                      CI: {persona.ci}
                    </div>

                    <h3 className="mt-1 font-bold text-slate-800 leading-tight text-lg uppercase">
                      {persona.nombre} {persona.apellido_paterno}{' '}
                      {persona.apellido_materno}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                      {row.postulacion.beca.nombre}
                    </p>
                  </div>

                  <span className="inline-flex shrink-0 rounded-xl bg-white/75 px-3 py-1 text-xs font-black text-cyan-700 shadow-sm">
                    {row.estado_revision}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  <div className="rounded-xl bg-white/60 p-3">
                    <div className="text-xs font-bold text-slate-500 uppercase">
                      Beca
                    </div>
                    <div className="font-bold text-slate-800">
                      {row.postulacion.beca.nombre}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/60 p-3">
                    <div className="text-xs font-bold text-slate-500 uppercase">
                      Requisito
                    </div>
                    <div className="font-bold text-slate-800">
                      {row.pasoBeca.requisito.nombre}
                    </div>
                  </div>
                </div>

                {tab === 'REVISADAS' && (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl bg-white/60 p-3">
                      <div className="text-xs font-bold text-slate-500 uppercase">
                        Observación
                      </div>
                      <p className="mt-1 text-sm text-slate-700">
                        {row.observacion_revision || '—'}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/60 p-3">
                      <div className="text-xs font-bold text-slate-500 uppercase">
                        Fecha notificación
                      </div>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {row.fecha_revision
                          ? new Date(row.fecha_revision).toLocaleDateString(
                              'es-BO',
                            )
                          : '—'}
                      </p>
                    </div>
                  </div>
                )}

                {tab === 'PENDIENTES' && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {row.estado_revision === 'PENDIENTE_KARDEX' && (
                      <button
                        className="btn-action btn-active w-full sm:col-span-2"
                        onClick={() => pasarARevision(row)}
                      >
                        📥 Pasar a revisión
                      </button>
                    )}

                    {row.estado_revision === 'EN_REVISION_KARDEX' && (
                      <>
                        <button
                          className="btn-action btn-active w-full"
                          onClick={() => legalizar(row)}
                        >
                          ✅ Legalizado
                        </button>

                        <button
                          className="btn-action btn-delete w-full"
                          onClick={() => setRechazar(row)}
                        >
                          ❌ Rechazado
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {rechazar && (
        <RechazarKardexModal
          row={rechazar}
          onClose={() => setRechazar(null)}
          onSaved={() => {
            setRechazar(null);
            onRefresh();
          }}
        />
      )}
    </section>
  );
}