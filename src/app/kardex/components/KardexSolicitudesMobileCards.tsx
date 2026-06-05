'use client';

import { fetchWithAuth } from '@/lib/fetchWithAuth';
import RechazarKardexModal from './RechazarKardexModal';
import { useState } from 'react';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

type Props = {
  rows: any[];
  tab: 'PENDIENTES' | 'REVISADAS';
  onRefresh: () => void;
};

export default function KardexSolicitudesMobileCards({
  rows,
  tab,
  onRefresh,
}: Props) {
  const [rechazar, setRechazar] = useState<any | null>(null);

  async function legalizar(row: any) {
    await fetchWithAuth(
      `${BACKEND}/kardex/solicitudes/${row.ID_paso_estudiante}/revisar`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'LEGALIZADO' }),
      }
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
    <div className="md:hidden space-y-4 mt-4">
      {rows.length === 0 ? (
        <div className="text-center py-6 table-wrapper">
          No hay solicitudes {tab === 'PENDIENTES' ? 'pendientes' : 'revisadas'}.
        </div>
      ) : (
        rows.map((row) => {
          const persona = row.postulacion.estudiante.persona;

          return (
            <div
              key={row.ID_paso_estudiante}
              className="rounded-2xl p-4 table-wrapper"
            >
              <div className="flex justify-between items-start gap-3 mb-3">
                <div>
                  <div className="text-xs opacity-70">Estudiante</div>
                  <h3 className="font-semibold text-base leading-tight">
                    {persona.nombre} {persona.apellido_paterno}{' '}
                    {persona.apellido_materno}
                  </h3>
                  <p className="text-sm opacity-75 mt-1">CI: {persona.ci}</p>
                </div>

                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{
                    background:
                      row.estado_revision === 'LEGALIZADO'
                        ? '#dcfce7'
                        : row.estado_revision === 'RECHAZADO'
                        ? '#fee2e2'
                        : '#e0f2fe',
                    color:
                      row.estado_revision === 'LEGALIZADO'
                        ? '#166534'
                        : row.estado_revision === 'RECHAZADO'
                        ? '#991b1b'
                        : '#075985',
                  }}
                >
                  {row.estado_revision}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm mb-4">
                <div>
                  <div className="opacity-70 text-xs">Beca</div>
                  <div className="font-medium">{row.postulacion.beca.nombre}</div>
                </div>

                <div>
                  <div className="opacity-70 text-xs">Requisito</div>
                  <div className="font-medium">
                    {row.pasoBeca.requisito.nombre}
                  </div>
                </div>

                {tab === 'REVISADAS' && (
                  <>
                    <div>
                      <div className="opacity-70 text-xs">Observación</div>
                      <div>{row.observacion_revision || '—'}</div>
                    </div>

                    <div>
                      <div className="opacity-70 text-xs">Fecha revisión</div>
                      <div>
                        {row.fecha_revision
                          ? new Date(row.fecha_revision).toLocaleDateString(
                              'es-BO'
                            )
                          : '—'}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {tab === 'PENDIENTES' && (
  <div className="acciones">
    {row.estado_revision === 'PENDIENTE_KARDEX' && (
      <button
        className="btn-action btn-active"
        onClick={() => pasarARevision(row)}
      >
        📥 Pasar a revisión
      </button>
    )}

    {row.estado_revision === 'EN_REVISION_KARDEX' && (
      <>
        <button
          className="btn-action btn-active"
          onClick={() => legalizar(row)}
        >
          ✅ Legalizar
        </button>

        <button
          className="btn-action btn-delete"
          onClick={() => setRechazar(row)}
        >
          ❌ Rechazar
        </button>
      </>
    )}
  </div>
)}
            </div>
          );
        })
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
    </div>
  );
}