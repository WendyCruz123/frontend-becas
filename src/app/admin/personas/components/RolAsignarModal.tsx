'use client';

import '@/app/modal.css';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import toast from 'react-hot-toast';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

type Rol = {
  ID_grupo_rol: number;
  nombre: string;
};

type Asignacion = {
  ID_grupo_usuario: number;
  grupoRolId: number;
  grupo_rol: { nombre: string };
  fecha_inicio: string;
  fecha_fin?: string | null;
};

export default function RolAsignarModal({
  usuarioId,
  nombrePersona,
  onClose,
}: {
  usuarioId: number;
  nombrePersona: string;
  onClose: () => void;
}) {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [rolId, setRolId] = useState<number | ''>('');
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [r1, r2] = await Promise.all([
          fetchWithAuth(`${BACKEND}/usuario/${usuarioId}/roles`),
          fetchWithAuth(`${BACKEND}/grupo-rol`),
        ]);

        setAsignaciones(await r1.json());
        const d2 = await r2.json();
        setRoles(d2?.rows || d2?.data?.rows || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [usuarioId]);

  async function asignar() {
    if (!rolId || !inicio) {
      toast.error('Selecciona rol y fecha de inicio');
      return;
    }

    setSaving(true);
    try {
      const r = await fetchWithAuth(
        `${BACKEND}/usuario/${usuarioId}/roles`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roles: [
              {
                grupoRolId: rolId,
                fecha_inicio: inicio,
                fecha_fin: fin || null,
              },
            ],
          }),
        }
      );

      if (!r.ok) throw new Error('Error al asignar rol');
      setAsignaciones(await r.json());
      setRolId('');
      setInicio('');
      setFin('');
    } finally {
      setSaving(false);
    }
  }

  async function eliminar(grupoRolId: number) {
    if (!confirm('¿Eliminar este rol?')) return;
    await fetchWithAuth(
      `${BACKEND}/usuario/${usuarioId}/roles/${grupoRolId}`,
      { method: 'DELETE' }
    );
    setAsignaciones((a) =>
      a.filter((r) => r.grupoRolId !== grupoRolId)
    );
  }

return (
  <div className="modal-overlay">
    <div className="
      modal-container modal--form-estudiante beca-modal
      w-[92vw] max-w-[560px]
      max-h-[90vh] overflow-y-auto
      rounded-[22px]
      sm:w-full
    ">
      <button className="modal-close" onClick={onClose} type="button">
        ×
      </button>

      <div className="beca-modal-header">
        <div>
          <span className="beca-modal-badge">Gestión de roles</span>
          <h2>Roles de usuario</h2>
          <p>{nombrePersona}</p>
        </div>
      </div>

      <div className="modal-body">
        {loading ? (
          <p className="info-box">Cargando roles…</p>
        ) : (
          <div className="beca-form">
            <div className="info-box">
              <span className="info-label">Asignar nuevo rol</span>

              <div className="form-group">
                <label>Rol institucional</label>
                <select
                  className="neo-input"
                  value={rolId}
                  onChange={(e) => setRolId(Number(e.target.value))}
                >
                  <option value="">— Selecciona rol —</option>
                  {roles.map((r) => (
                    <option key={r.ID_grupo_rol} value={r.ID_grupo_rol}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-grid grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="form-group">
                  <label>Fecha de inicio</label>
                  <input
                    type="date"
                    className="neo-input"
                    value={inicio}
                    onChange={(e) => setInicio(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Fecha de fin</label>
                  <input
                    type="date"
                    className="neo-input"
                    value={fin}
                    onChange={(e) => setFin(e.target.value)}
                  />
                </div>
              </div>

              <button
                className="modal-btn primary w-full"
                onClick={asignar}
                disabled={saving}
              >
                {saving ? 'Guardando…' : 'Asignar rol'}
              </button>
            </div>

            <div className="info-box">
              <span className="info-label">Roles actuales</span>

              {asignaciones.length === 0 ? (
                <p className="empty-role-text">No tiene roles asignados.</p>
              ) : (
                <div className="roles-current-list">
                  {asignaciones.map((r) => (
                    <div key={r.ID_grupo_usuario} className="role-current-card">
                      <div>
                        <strong>{r.grupo_rol.nombre}</strong>
                        <small>
                          {r.fecha_inicio.split('T')[0]} →{' '}
                          {r.fecha_fin ? r.fecha_fin.split('T')[0] : 'Sin fecha fin'}
                        </small>
                      </div>

                      <button
                        className="role-delete-btn"
                        onClick={() => eliminar(r.grupoRolId)}
                        title="Eliminar rol"
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer grid grid-cols-1">
              <button
                type="button"
                className="modal-btn secondary w-full"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
