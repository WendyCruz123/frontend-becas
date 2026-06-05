'use client';

import { Beca } from '../hooks/useBecas';
import { renderEstado, renderFechas } from './BecaHelpers';

export default function BecasTable({
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
    <div className="hidden md:block mt-5">
      {loading ? (
        <div className="text-center py-6">Cargando…</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-6">Sin resultados</div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
          {rows.map((b, i) => {
            const fechas = renderFechas(b);

            return (
              <div
                key={b.ID_beca}
                className="rounded-2xl p-5 backdrop-blur-xl
                           border border-white/10
                           bg-gradient-to-br
                           from-cyan-100/70 via-sky-200/60 to-cyan-300/50
                           shadow-lg hover:shadow-xl transition"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-xs text-slate-500">
                      #{offset + i + 1}
                    </div>

                    <h3 className="font-semibold text-slate-800 leading-tight">
                      {b.nombre.toUpperCase()}
                    </h3>

                    {/* 🔥 TIPO MEJORADO */}
                    <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-lg bg-white/70 text-cyan-700">
                      {b.tipo}
                    </span>
                  </div>

                  {renderEstado(b)}
                </div>

                {/* FECHAS */}
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-700 mb-4">
                  <div>
                    <div className="font-semibold">Inicio</div>
                    <div>{fechas.inicio}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Fin</div>
                    <div>{fechas.fin}</div>
                  </div>
                </div>

                {/* BOTONES */}
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
          })}
        </div>
      )}
    </div>
  );
}