'use client'

import type { EnviarMensajeRow } from '../types'

type Props = {
  rows: EnviarMensajeRow[]
  loading: boolean
  selectedIds: string[]
  onToggleSeleccion: (id: string) => void
}

export default function EnviarMensajesMobileCards({
  rows,
  loading,
  selectedIds,
  onToggleSeleccion,
}: Props) {
  return (
    <div className="md:hidden space-y-4 mt-4">
      {loading ? (
        <div className="text-center py-6">Cargando...</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-6">No se encontraron resultados.</div>
      ) : (
        rows.map((r) => (
          <div key={r.id} className="rounded-2xl p-4 table-wrapper">
            <div className="flex justify-between items-start mb-3 gap-3">
              <div>
                <div className="text-xs opacity-70">Postulación #{r.id}</div>
                <h3 className="font-semibold text-base leading-tight">
                  {r.nombre} {r.apellido_paterno} {r.apellido_materno}
                </h3>
                <p className="text-sm opacity-75 mt-1">CI: {r.ci}</p>
              </div>

              <input
                type="checkbox"
                checked={selectedIds.includes(String(r.id))}
                onChange={() => onToggleSeleccion(String(r.id))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <div className="opacity-70 text-xs">Beca</div>
                <div>{r.beca_nombre}</div>
              </div>

              <div>
                <div className="opacity-70 text-xs">Tipo</div>
                <div>{r.beca_tipo}</div>
              </div>

              <div>
                <div className="opacity-70 text-xs">Gestión</div>
                <div>{r.gestion}</div>
              </div>

              <div>
                <div className="opacity-70 text-xs">Estado</div>
                <div>{r.estado}</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}