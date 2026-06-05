'use client';

import type { Postulacion } from '../types';

type Props = {
  rows: Postulacion[];
  loading: boolean;
};

export default function ReportesMobileCards({
  rows,
  loading,
}: Props) {
  return (
    <div className="md:hidden space-y-4 mt-4">
      {loading ? (
        <div className="text-center py-6">Cargando...</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-6">No se encontraron resultados.</div>
      ) : (
        rows.map((row) => (
          <div
            key={row.id}
            className="rounded-2xl p-4 table-wrapper"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-3 gap-3">
              <div>
                <h3 className="font-semibold text-base leading-tight">
                  {row.nombre} {row.apellido_paterno} {row.apellido_materno}
                </h3>
                <p className="text-sm opacity-75 mt-1">
                  CI: {row.ci}
                </p>
              </div>

              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(16, 185, 129, 0.18)',
                  color: '#059669',
                  whiteSpace: 'nowrap',
                }}
              >
                {row.estado}
              </span>
            </div>

            {/* INFO */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">

              <div>
                <div className="opacity-70 text-xs">Beca</div>
                <div>{row.beca_nombre}</div>
              </div>

              <div>
                <div className="opacity-70 text-xs">Tipo</div>
                <div>{row.beca_tipo}</div>
              </div>

              <div>
                <div className="opacity-70 text-xs">Fecha</div>
                <div>{new Date(row.fecha).toLocaleDateString('es-BO')}</div>
              </div>
            </div>

            {/* OBSERVACIÓN */}
            <div className="text-sm">
              <div className="opacity-70 text-xs mb-1">Observación</div>
              <div>
                {row.estado_observacion?.trim()
                  ? row.estado_observacion
                  : 'SIN OBSERVACION'}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}