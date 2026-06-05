'use client';

import { useState } from 'react';
import { LegalizacionItem } from '../types';
import { nombreEstudiante } from '../utils';

export default function RechazarLegalizacionModal({
  item,
  onClose,
  onSubmit,
}: {
  item: LegalizacionItem;
  onClose: () => void;
  onSubmit: (observacion: string) => void;
}) {
  const [observacion, setObservacion] = useState('');

  return (
    <div className="modal-overlay">
      <div className="modal-container modal--form-estudiante beca-modal">
        <button className="modal-close" onClick={onClose} type="button">
          ×
        </button>

        <div className="beca-modal-header">
          <span className="beca-modal-badge">Legalización presencial</span>
          <h2>Rechazar requisito</h2>
          <p>Debe registrar una observación para el estudiante.</p>
        </div>

        <div className="modal-body">
          <div
            className="mb-4 rounded-2xl border border-white/10
                       bg-gradient-to-br from-cyan-100/70 via-sky-200/60 to-cyan-300/50
                       p-4 shadow-sm backdrop-blur-xl"
          >
            <div className="text-xs font-semibold text-slate-500">
              CI: {item.estudiante.ci}
            </div>

            <h3 className="mt-1 text-base font-black uppercase leading-tight text-slate-800">
              {nombreEstudiante(item.estudiante)}
            </h3>

            <div className="mt-4 rounded-xl bg-white/60 p-3">
              <div className="text-xs font-bold uppercase text-slate-500">
                Requisito
              </div>
              <div className="font-bold text-slate-800">
                {item.requisito.nombre}
              </div>
            </div>
          </div>

          <div className="form-group mt-3">
            <label>Observación de rechazo</label>
            <textarea
              className="neo-input"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Ej. El documento presenta datos incompletos..."
            />
          </div>

          <div className="modal-footer grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <button className="modal-btn secondary w-full" type="button" onClick={onClose}>
              Cancelar
            </button>

            <button
              className="modal-btn primary w-full"
              type="button"
              onClick={() => onSubmit(observacion)}
              disabled={!observacion.trim()}
            >
              Rechazar y notificar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}