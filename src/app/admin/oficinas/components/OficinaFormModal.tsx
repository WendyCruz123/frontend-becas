'use client';

import '@/app/modal.css';
import { useEffect, useState } from 'react';
import { Oficina } from '../types';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

type Ruta360 = {
  id: string;
  nombre: string;
  slug: string;
};

type Props = {
  mode: 'create' | 'edit';
  row?: Oficina;
  onClose: () => void;
  onSaved: () => void;
};

export function OficinaFormModal({
  mode,
  row,
  onClose,
  onSaved,
}: Props) {
  const [nombre, setNombre] = useState(row?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(row?.descripcion ?? '');
  const [horario, setHorario] = useState(row?.horario_atencion ?? '');
  const [estado, setEstado] = useState(row?.estado_oficina ?? true);
  const [panorama, setPanorama] = useState(row?.panorama_route_slug ?? '');

  const [rutas, setRutas] = useState<Ruta360[]>([]);
  const [loadingRutas, setLoadingRutas] = useState(false);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function loadRutas() {
      try {
        setLoadingRutas(true);

        const r = await fetchWithAuth(`${BACKEND}/rutas360`);

        if (!r.ok) {
          throw new Error('No se pudieron cargar las rutas 360');
        }

        const data = await r.json();
        setRutas(data ?? []);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Error';
        setMsg(message);
      } finally {
        setLoadingRutas(false);
      }
    }

    loadRutas();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const payload = {
        nombre,
        descripcion: descripcion || undefined,
        horario_atencion: horario,
        estado_oficina: estado,
        panorama_route_slug: panorama || null,
      };

      const url =
        mode === 'create'
          ? `${BACKEND}/oficinas`
          : `${BACKEND}/oficinas/${row!.ID_oficina}`;

      const r = await fetchWithAuth(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d?.message || 'Error al guardar');
      }

      onSaved();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error';
      setMsg(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div
        className="
          modal-container modal--form-estudiante beca-modal
          w-[92vw] max-w-[560px]
          max-h-[90vh] overflow-y-auto
          rounded-[22px]
          sm:w-full
        "
      >
        <button className="modal-close" onClick={onClose} type="button">
          ×
        </button>

        <div className="beca-modal-header">
          <div>
            <span className="beca-modal-badge">Gestión de oficinas</span>
            <h2>{mode === 'create' ? 'Nueva oficina' : 'Editar oficina'}</h2>
            <p>Complete la información institucional de la oficina.</p>
          </div>
        </div>

        <div className="modal-body">
          <form onSubmit={submit} className="beca-form">
            <div className="form-group">
              <label>Nombre de la oficina</label>
              <input
                className="neo-input"
                placeholder="Ej. Dirección de carrera"
                value={nombre}
                onChange={(e) => setNombre(e.target.value.toUpperCase())}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                className="neo-input"
                placeholder="Detalle breve de la oficina o función principal."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Horario de atención</label>
              <input
                className="neo-input"
                placeholder="Ej. LUNES A VIERNES DE 08:30 A 16:30"
                value={horario}
                onChange={(e) => setHorario(e.target.value.toUpperCase())}
                required
              />
            </div>

            <div className="form-group">
              <label>Ruta 360° relacionada</label>
              <select
                className="neo-input"
                value={panorama}
                onChange={(e) => setPanorama(e.target.value)}
                disabled={loadingRutas}
              >
                <option value="">— Sin ruta 360° —</option>

                {rutas.map((r) => (
                  <option key={r.id} value={r.slug}>
                    {r.nombre}
                  </option>
                ))}
              </select>

              {loadingRutas && (
                <small style={{ color: '#64748b' }}>Cargando rutas 360°...</small>
              )}
            </div>

            <label className="status-check">
              <input
                type="checkbox"
                checked={estado}
                onChange={(e) => setEstado(e.target.checked)}
              />
              <span>
                <strong>Oficina activa</strong>
                <small>Disponible para ser mostrada en el sistema.</small>
              </span>
            </label>

            {msg && <p className="error-msg">{msg}</p>}

            <div
              className="
                modal-footer
                grid grid-cols-1 sm:grid-cols-2
                gap-3 sm:gap-4
              "
            >
              <button
                type="button"
                className="modal-btn secondary w-full"
                onClick={onClose}
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="modal-btn primary w-full"
                disabled={saving}
              >
                {saving
                  ? 'Guardando…'
                  : mode === 'create'
                    ? 'Registrar oficina'
                    : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}