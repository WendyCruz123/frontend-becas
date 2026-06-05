'use client';

import { PersonaListItem } from '../types';

export default function PersonasTable({
  rows,
  onEdit,
  onRoles,
  onDelete,
}: {
  rows: PersonaListItem[];
  onEdit: (p: PersonaListItem) => void;
  onRoles: (p: PersonaListItem) => void;
  onDelete: (p: PersonaListItem) => void;
}) {
  return (
    <div className="hidden md:block table-wrapper">
      <table>
        <thead>
          <tr>
            <th>CI</th>
            <th>Nombre completo</th>
            <th>Registro Universitario</th>
            <th>Celular</th>
            <th>Correo electrónico</th>
            <th>Roles</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((p) => {
            const estudiante = Array.isArray(p.estudiante)
              ? p.estudiante[0]
              : p.estudiante;

            return (
              <tr key={p.ID_persona}>
                <td>{p.ci}</td>

                <td>
                  {p.nombre} {p.apellido_paterno} {p.apellido_materno}
                </td>

                <td>{estudiante?.ru ?? '—'}</td>

                <td>{p.celular ?? '—'}</td>

                <td>{p.correo_electronico}</td>

                <td>
                  {p.usuario ? (
                    <span className="badge">Asignado</span>
                  ) : (
                    <span className="opacity-60">—</span>
                  )}
                </td>

                <td>
                  <div className="acciones">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => onEdit(p)}
                    >
                      ✏️ Editar
                    </button>

                    <button
                      className="btn-action btn-requisitos"
                      onClick={() => onRoles(p)}
                    >
                      👤 Roles
                    </button>

                    <button
                      className="btn-action btn-delete"
                      onClick={() => onDelete(p)}
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}