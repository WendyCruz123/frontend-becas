'use client';

import { PersonaListItem } from '../types';

export default function PersonasMobileCards({
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
    <div className="md:hidden space-y-4">
      {rows.map((p) => (
        <div
          key={p.ID_persona}
          className="table-wrapper p-4 rounded-2xl"
        >
          {/* NOMBRE */}
          <div className="mb-2">
            <strong className="text-base">
              {p.nombre} {p.apellido_paterno} {p.apellido_materno}
            </strong>
          </div>

          {/* DATOS */}
          <div className="text-sm space-y-1 opacity-90">
            <p>
              <strong>CI:</strong> {p.ci}
            </p>

            {(() => {
              const estudiante = Array.isArray(p.estudiante)
                ? p.estudiante[0]
                : p.estudiante;

              return (
                <p>
                  <strong>RU:</strong> {estudiante?.ru ?? p.ru ?? '—'}
                </p>
              );
            })()}

            <p>
              <strong>Celular:</strong> {p.celular ?? '—'}
            </p>

            <p>
              <strong>Correo:</strong> {p.correo_electronico}
            </p>

            <p>
              <strong>Roles:</strong>{' '}
              {p.usuario ? (
                <span className="badge">Asignado</span>
              ) : (
                <span className="opacity-60">—</span>
              )}
            </p>
          </div>

          {/* ACCIONES */}
          <div className="acciones mt-4 flex gap-2 flex-wrap">
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
        </div>
      ))}
    </div>
  );
}
