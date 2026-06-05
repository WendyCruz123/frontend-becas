'use client';

import { Beca } from '../hooks/useBecas';
import { renderEstado, renderFechas } from './BecaHelpers';

export default function BecasMobileCards({
  rows,
  offset,
  loading,
  onEdit,
  onToggleEstado,
  onDelete,
  onRequisitos,
}: {
  rows: Beca[];
  offset: number;
  loading: boolean;
  onEdit: (b: Beca) => void;
  onToggleEstado: (b: Beca) => void;
  onDelete: (b: Beca) => void;
  onRequisitos: (b: Beca) => void;
}) {
  return (
    <div className="md:hidden space-y-4 mt-4">
      {loading ? (
        <div className="text-center py-6">Cargando…</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-6">Sin resultados</div>
      ) : (
        rows.map((b, i) => {
          const fechas = renderFechas(b);

          return (
            <div
              key={b.ID_beca}
              className="rounded-2xl p-4 backdrop-blur-xl
                         border border-white/40
                         bg-gradient-to-br
                         from-cyan-100/60 via-sky-100/50 to-cyan-200/40
                         shadow-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xs text-slate-500">
                    #{offset + i + 1}
                  </div>
                  <h3 className="font-semibold text-slate-800">
                    {b.nombre}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {b.tipo}
                  </p>
                </div>

                {renderEstado(b)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-slate-700 mb-3">
                <div>
                  <div className="font-semibold">Inicio</div>
                  <div>{fechas.inicio}</div>
                </div>
                <div>
                  <div className="font-semibold">Fin</div>
                  <div>{fechas.fin}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  className="btn-action btn-edit"
                  onClick={() => onEdit(b)}
                >
                  ✏️ Editar
                </button>

                <button
                  className={`btn-action ${
                    b.estado ? 'btn-active' : 'btn-inactive'
                  }`}
                  onClick={() => onToggleEstado(b)}
                >
                  {b.estado ? '🔴 Desactivar' : '🟢 Activar'}
                </button>

                <button
                  className="btn-action btn-delete"
                  onClick={() => onDelete(b)}
                >
                  🗑 Eliminar
                </button>

                <button
                  className="btn-action btn-requisitos"
                  onClick={() => onRequisitos(b)}
                >
                  📁 Requisitos
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
