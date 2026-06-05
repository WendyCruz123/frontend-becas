'use client';

import type { OficinaOption, TipoMensajeEnvio } from '../../types';

type Props = {
  tipo: TipoMensajeEnvio;
  mensaje: string;
  oficinas: OficinaOption[];
  oficinaIdObservacion: string;

  usarDescripcion: boolean;
  descripcionEtapa: string;

  setTipo: (value: TipoMensajeEnvio) => void;
  setMensaje: (value: string) => void;
  setOficinaIdObservacion: (value: string) => void;

  setUsarDescripcion: (value: boolean) => void;
  setDescripcionEtapa: (value: string) => void;

  onEnviarClick: () => void;
};

export default function TipoActionsSinEtapas({
  tipo,
  mensaje,
  oficinas,
  oficinaIdObservacion,
  usarDescripcion,
  descripcionEtapa,
  setTipo,
  setMensaje,
  setOficinaIdObservacion,
  setUsarDescripcion,
  setDescripcionEtapa,
  onEnviarClick,
}: Props) {
  return (
    <section className="send-actions-card">
      <div className="mb-4 rounded-xl bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800">
        Flujo para becas sin etapas: revisión administrativa, remisión a DISBECT
        y resultado final.
      </div>

      <div className="send-type-grid">
        <button
          type="button"
          className={`send-type-btn ${tipo === 'OBSERVADO' ? 'active warning' : ''}`}
          onClick={() => setTipo('OBSERVADO')}
        >
          Observado
        </button>

        <button
          type="button"
          className={`send-type-btn ${tipo === 'REMITIDO_A_DISBECT' ? 'active success' : ''}`}
          onClick={() => setTipo('REMITIDO_A_DISBECT')}
        >
          Remitido a DISBECT
        </button>

        <button
          type="button"
          className={`send-type-btn ${tipo === 'NO_REMITIDO' ? 'active warning' : ''}`}
          onClick={() => setTipo('NO_REMITIDO')}
        >
          No remitido
        </button>

        <button
          type="button"
          className={`send-type-btn ${tipo === 'APROBADO' ? 'active success' : ''}`}
          onClick={() => setTipo('APROBADO')}
        >
          Aprobado
        </button>

        <button
          type="button"
          className={`send-type-btn ${tipo === 'REPROBADO' ? 'active warning' : ''}`}
          onClick={() => setTipo('REPROBADO')}
        >
          Reprobado
        </button>

        <button
          type="button"
          className={`send-type-btn ${tipo === 'PERSONALIZADO' ? 'active info' : ''}`}
          onClick={() => setTipo('PERSONALIZADO')}
        >
          Otro mensaje
        </button>
      </div>

      {tipo === 'OBSERVADO' && (
        <div className="send-message-box">
          <label>Oficina donde debe apersonarse</label>

          <select
            className="neo-input"
            value={oficinaIdObservacion}
            onChange={(e) => setOficinaIdObservacion(e.target.value)}
          >
            <option value="">Seleccione una oficina...</option>
            {oficinas.map((oficina) => (
              <option key={oficina.ID_oficina} value={oficina.ID_oficina}>
                {oficina.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {tipo === 'REMITIDO_A_DISBECT' && (
        <div className="send-message-box">
          <p className="text-sm font-semibold text-slate-600">
            Esta acción cambiará el estado a REMITIDO A DISBECT y enviará una
            notificación interna al estudiante.
          </p>
        </div>
      )}

      {tipo === 'NO_REMITIDO' && (
        <div className="send-message-box">
          <p className="text-sm font-semibold text-slate-600">
            Esta acción cerrará administrativamente el trámite como NO REMITIDO.
          </p>
        </div>
      )}

      {tipo === 'REPROBADO' && (
        <div className="send-message-box">
          <p className="text-sm font-semibold text-slate-600">
            Esta acción cambiará el estado final a REPROBADO.
          </p>

          <label className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={usarDescripcion}
              onChange={(e) => setUsarDescripcion(e.target.checked)}
            />
            Agregar descripción
          </label>

          {usarDescripcion && (
            <textarea
              rows={3}
              className="neo-input mt-2"
              placeholder="Motivo o descripción de la reprobación..."
              value={descripcionEtapa}
              onChange={(e) => setDescripcionEtapa(e.target.value)}
            />
          )}
        </div>
      )}

      {tipo === 'PERSONALIZADO' && (
        <div className="send-message-box">
          <label>Mensaje personalizado</label>
          <textarea
            placeholder="Escribe el mensaje personalizado..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows={4}
          />
        </div>
      )}

      <div className="institutional-footer">
        <button
          type="button"
          className="btn-institutional btn-primary"
          onClick={onEnviarClick}
        >
          Enviar notificación
        </button>
      </div>
    </section>
  );
}