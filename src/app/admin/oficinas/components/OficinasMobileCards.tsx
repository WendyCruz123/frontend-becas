'use client';

import { Oficina } from '../types';
import { OficinaEstadoBadge } from './OficinaEstadoBadge';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

type Props = {
  rows: Oficina[];
  loading: boolean;
  onEdit: (o: Oficina) => void;
  onRefresh: () => void;
};

export default function OficinasMobileCards({
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
    <div className="md:hidden space-y-4 mt-4">
      {loading ? (
        <div className="text-center py-6">Cargando…</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-6">Sin resultados</div>
      ) : (
        rows.map((o) => (
          <div
            key={o.ID_oficina}
            className="rounded-2xl p-4 table-wrapper"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-xs opacity-70">
                  ID #{o.ID_oficina}
                </div>
                <h3 className="font-semibold text-base">
                  {o.nombre}
                </h3>
                {o.descripcion && (
                  <p className="text-sm opacity-75 mt-1">
                    {o.descripcion}
                  </p>
                )}
              </div>

              <OficinaEstadoBadge active={o.estado_oficina} />
            </div>

            {/* INFO */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <div className="opacity-70 text-xs">Horario</div>
                <div>{o.horario_atencion}</div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="acciones">
              <button
                className="btn-action btn-edit"
                onClick={() => onEdit(o)}
              >
                ✏️ Editar
              </button>

              <button
                className={`btn-action ${
                  o.estado_oficina ? 'btn-inactive' : 'btn-active'
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
                  🌐 Ver 360°
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
