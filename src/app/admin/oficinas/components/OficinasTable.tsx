'use client';

import { Oficina } from '../types';
import { OficinaEstadoBadge } from './OficinaEstadoBadge';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

type Props = {
  rows: Oficina[];
  loading: boolean;
  onEdit: (row: Oficina) => void;
  onRefresh: () => void;
};

export function OficinasTable({
  rows,
  loading,
  onEdit,
  onRefresh,
}: Props) {
  const remove = async (o: Oficina) => {
    if (!confirm(`Eliminar la oficina "${o.nombre}"?`)) return;

    const r = await fetchWithAuth(`${BACKEND}/oficinas/${o.ID_oficina}`, {
      method: 'DELETE',
    });

    if (r.ok) onRefresh();
  };

  const toggleEstado = async (o: Oficina) => {
    const r = await fetchWithAuth(`${BACKEND}/oficinas/${o.ID_oficina}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado_oficina: !o.estado_oficina }),
    });

    if (r.ok) onRefresh();
  };

  return (
    <div className="mt-5">
      {loading ? (
        <div className="text-center py-6">Cargando…</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-6">Sin resultados</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {rows.map((o) => (
            <div
              key={o.ID_oficina}
              className="rounded-2xl p-5 backdrop-blur-xl
                         border border-white/10
                         bg-gradient-to-br
                         from-cyan-100/70 via-sky-200/60 to-cyan-300/50
                         shadow-lg hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-xs text-slate-500">
                    #{o.ID_oficina}
                  </div>

                  <h3 className="font-semibold text-slate-800 leading-tight">
                    {o.nombre}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                    {o.descripcion || 'Sin descripción'}
                  </p>
                </div>

                <OficinaEstadoBadge active={o.estado_oficina} />
              </div>

              <div className="mb-4 text-sm text-slate-700">
                <div className="font-semibold">Horario</div>
                <div>{o.horario_atencion || 'No definido'}</div>
              </div>

              {o.panorama_route_slug && (
                <div className="mb-4">
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-lg bg-white/70 text-cyan-700">
                    Ruta 360°: {o.panorama_route_slug}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  className="btn-action btn-edit"
                  onClick={() => onEdit(o)}
                >
                  ✏️ Editar
                </button>

                <button
                  className={`btn-action ${
                    o.estado_oficina ? 'btn-active' : 'btn-inactive'
                  }`}
                  onClick={() => toggleEstado(o)}
                >
                  {o.estado_oficina ? '🔴 Desactivar' : '🟢 Activar'}
                </button>

                <button
                  className="btn-action btn-delete"
                  onClick={() => remove(o)}
                >
                  🗑 Eliminar
                </button>

                {o.panorama_route_slug && (
                  <button
                    className="btn-action btn-requisitos"
                    onClick={() =>
                      window.open(
                        `/visor/${o.panorama_route_slug}?oficinaId=${o.ID_oficina}`,
                        '_blank'
                      )
                    }
                  >
                    📷 Ver 360°
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}