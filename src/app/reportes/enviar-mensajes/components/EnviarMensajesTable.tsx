'use client'

import type { EnviarMensajeRow } from '../types'

type Props = {
  rows: EnviarMensajeRow[]
  loading: boolean
  selectedIds: string[]
  onToggleSeleccion: (id: string) => void
}

export default function EnviarMensajesTable({
  rows,
  loading,
  selectedIds,
  onToggleSeleccion,
}: Props) {
  return (
    <div className="table-wrapper hidden md:block">
      <table>
        <thead>
          <tr>
            <th>✔</th>
            <th>Nombre completo</th>
            <th>CI</th>
            <th>Beca</th>
            <th>Tipo</th>
            <th>Observación</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7}>Cargando...</td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={7}>No se encontraron resultados.</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(String(r.id))}
                    onChange={() => onToggleSeleccion(String(r.id))}
                  />
                </td>
                <td>{`${r.nombre} ${r.apellido_paterno} ${r.apellido_materno}`}</td>
                <td>{r.ci}</td>
                <td>{r.beca_nombre}</td>
                <td>{r.beca_tipo}</td>
                <td>{r.estado_observacion || 'SIN OBSERVACIÓN'}</td>
                <td>{r.estado}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}