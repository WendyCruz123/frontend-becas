'use client';

import { useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { Requisito } from './catalogo/RequisitosCatalogo';
import '@/app/modal.css';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export default function AttachRequisitoModal({
  becaId,
  becaNombre,
  requisito,
  onClose,
  onAttached,
}: {
  becaId: number;
  becaNombre: string;
  requisito: Requisito;
  onClose: () => void;
  onAttached: () => void;
}) {
  const [orden, setOrden] = useState(1);
  const [saving, setSaving] = useState(false);

  async function attach() {
    setSaving(true);

    try {
      const r = await fetchWithAuth(
        `${BACKEND}/becas/${becaId}/requisitos`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requisitoId: requisito.ID_paso,
            estado: true,
          }),
        }
      );

      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d?.message || 'No se pudo añadir');
      }

      onAttached();
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Error';

      alert(message);
    } finally {
      setSaving(false);
    }
  }

return (
  <div className="modal-overlay">
    <div className="
      modal-container modal--form-estudiante beca-modal
      w-[92vw] max-w-[520px]
      max-h-[90vh] overflow-y-auto
      rounded-[22px]
      sm:w-full
    ">
      <button className="modal-close" onClick={onClose} type="button">
        ×
      </button>

      <div className="beca-modal-header">
        <div>
          <span className="beca-modal-badge">Gestión de requisitos</span>
          <h2>Añadir requisito</h2>
          <p>Asocie este requisito a la beca seleccionada.</p>
        </div>
      </div>

      <div className="modal-body">
        <div className="beca-form">
          <div className="info-box">
            <span className="info-label">Requisito seleccionado</span>
            <strong>{requisito.nombre}</strong>

            <span className="info-label mt-3">Beca destino</span>
            <strong>{becaNombre}</strong>
          </div>


          <div className="
            modal-footer
            grid grid-cols-1 sm:grid-cols-2
            gap-3 sm:gap-4
          ">
            <button
              type="button"
              className="modal-btn secondary w-full"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="modal-btn primary w-full"
              onClick={attach}
              disabled={saving}
            >
              {saving ? 'Añadiendo…' : 'Añadir requisito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
