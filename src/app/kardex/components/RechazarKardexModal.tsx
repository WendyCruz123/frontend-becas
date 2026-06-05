'use client';

import { useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export default function RechazarKardexModal({
  row,
  onClose,
  onSaved,
}: {
  row: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [observacion, setObservacion] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!observacion.trim()) return;

    setSaving(true);

    await fetchWithAuth(
      `${BACKEND}/kardex/solicitudes/${row.ID_paso_estudiante}/revisar`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: 'RECHAZADO',
          observacion,
        }),
      },
    );

    setSaving(false);
    onSaved();
  }

  const persona = row.postulacion.estudiante.persona;

  return (
    <div className="modal-overlay">
      <div className="modal-container modal--form-estudiante beca-modal">
        <button className="modal-close" onClick={onClose} type="button">
          ×
        </button>

        <div className="beca-modal-header">
          <span className="beca-modal-badge">Revisión Kardex</span>
          <h2>Rechazar requisito</h2>
          <p>Debe registrar una observación para el estudiante.</p>
        </div>

        <div className="modal-body">
          <div
            className="mb-4 rounded-2xl p-4 backdrop-blur-xl
                       border border-white/10
                       bg-gradient-to-br
                       from-cyan-100/70 via-sky-200/60 to-cyan-300/50
                       shadow-sm"
          >
            <div className="text-xs font-semibold text-slate-500">
              CI: {persona.ci}
            </div>

            <h3 className="mt-1 text-base font-black text-slate-800 uppercase leading-tight">
              {persona.nombre} {persona.apellido_paterno}{' '}
              {persona.apellido_materno}
            </h3>

            <div className="mt-4 rounded-xl bg-white/60 p-3">
              <div className="text-xs font-bold text-slate-500 uppercase">
                Requisito
              </div>
              <div className="font-bold text-slate-800">
                {row.pasoBeca.requisito.nombre}
              </div>
            </div>
          </div>

          <div className="form-group mt-3">
            <label>Observación de revisión</label>
            <textarea
              className="neo-input"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Ej. El documento presenta datos incompletos..."
            />
          </div>

          <div className="modal-footer grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              className="modal-btn secondary w-full"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              className="modal-btn primary w-full"
              type="button"
              onClick={submit}
              disabled={saving || !observacion.trim()}
            >
              {saving ? 'Guardando...' : 'Rechazar y notificar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}