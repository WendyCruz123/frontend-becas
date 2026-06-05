'use client';

import type { OficinaOption, TipoMensajeEnvio } from '../../types';

type Props = {
  tipo: TipoMensajeEnvio;
  mensaje: string;
  oficinas: OficinaOption[];
  oficinaIdObservacion: string;

  usarFecha: boolean;
  usarNota: boolean;
  usarDescripcion: boolean;
  usarTextoExtra: boolean;

  fechaEtapa: string;
  notaEtapa: string;
  descripcionEtapa: string;
  textoExtraEtapa: string;

  setTipo: (value: TipoMensajeEnvio) => void;
  setMensaje: (value: string) => void;
  setOficinaIdObservacion: (value: string) => void;

  setUsarFecha: (value: boolean) => void;
  setUsarNota: (value: boolean) => void;
  setUsarDescripcion: (value: boolean) => void;
  setUsarTextoExtra: (value: boolean) => void;

  setFechaEtapa: (value: string) => void;
  setNotaEtapa: (value: string) => void;
  setDescripcionEtapa: (value: string) => void;
  setTextoExtraEtapa: (value: string) => void;

  onEnviarClick: () => void;
};

export default function TipoActionsConEtapas({
  tipo,
  mensaje,
  oficinas,
  oficinaIdObservacion,

  usarFecha,
  usarNota,
  usarDescripcion,
  usarTextoExtra,

  fechaEtapa,
  notaEtapa,
  descripcionEtapa,
  textoExtraEtapa,

  setTipo,
  setMensaje,
  setOficinaIdObservacion,

  setUsarFecha,
  setUsarNota,
  setUsarDescripcion,
  setUsarTextoExtra,

  setFechaEtapa,
  setNotaEtapa,
  setDescripcionEtapa,
  setTextoExtraEtapa,

  onEnviarClick,
}: Props) {
  return (
    <section className="send-actions-card">
      <div className="mb-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-800">
        Flujo para becas con etapas: aprobación documental, habilitación de
        etapa y resultado final.
      </div>

      <div className="send-type-grid">
        <button
          type="button"
          className={`send-type-btn ${
            tipo === 'OBSERVADO' ? 'active warning' : ''
          }`}
          onClick={() => setTipo('OBSERVADO')}
        >
          Observado
        </button>

        <button
          type="button"
          className={`send-type-btn ${
            tipo === 'APROBAR_DOCUMENTACION_ETAPAS' ? 'active success' : ''
          }`}
          onClick={() => setTipo('APROBAR_DOCUMENTACION_ETAPAS')}
        >
          Aprobar documentación y habilitar etapa
        </button>

        <button
          type="button"
          className={`send-type-btn ${
            tipo === 'APROBADO' ? 'active success' : ''
          }`}
          onClick={() => setTipo('APROBADO')}
        >
          Aprobado
        </button>

        <button
          type="button"
          className={`send-type-btn ${
            tipo === 'REPROBADO' ? 'active warning' : ''
          }`}
          onClick={() => setTipo('REPROBADO')}
        >
          Reprobado
        </button>

        <button
          type="button"
          className={`send-type-btn ${
            tipo === 'PERSONALIZADO' ? 'active info' : ''
          }`}
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

      {tipo === 'APROBAR_DOCUMENTACION_ETAPAS' && (
        <div className="send-message-box">
          <label>Oficina / recorrido 360° para la etapa</label>

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

          <label className="mt-3 block">Mensaje principal</label>
          <textarea
            className="neo-input"
            placeholder="Ej. Debe presentarse para el examen escrito."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows={3}
          />

          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={usarFecha}
                onChange={(e) => setUsarFecha(e.target.checked)}
              />
              Agregar fecha
            </label>

            {usarFecha && (
              <input
                type="date"
                className="neo-input"
                value={fechaEtapa}
                onChange={(e) => setFechaEtapa(e.target.value)}
              />
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={usarNota}
                onChange={(e) => setUsarNota(e.target.checked)}
              />
              Agregar nota
            </label>

            {usarNota && (
              <input
                type="number"
                className="neo-input"
                placeholder="Nota"
                value={notaEtapa}
                onChange={(e) => setNotaEtapa(e.target.value)}
              />
            )}

            <label className="flex items-center gap-2">
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
                className="neo-input"
                placeholder="Descripción adicional..."
                value={descripcionEtapa}
                onChange={(e) => setDescripcionEtapa(e.target.value)}
              />
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={usarTextoExtra}
                onChange={(e) => setUsarTextoExtra(e.target.checked)}
              />
              Agregar texto extra
            </label>

            {usarTextoExtra && (
              <textarea
                rows={3}
                className="neo-input"
                placeholder="Texto extra..."
                value={textoExtraEtapa}
                onChange={(e) => setTextoExtraEtapa(e.target.value)}
              />
            )}
          </div>
        </div>
      )}

      {tipo === 'REPROBADO' && (
        <div className="send-message-box">
          <p className="text-sm font-semibold text-slate-600">
            Esta acción cambiará el estado final de los estudiantes
            seleccionados a REPROBADO. La notificación llegará solo al sistema.
          </p>

          <label className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={usarNota}
              onChange={(e) => setUsarNota(e.target.checked)}
            />
            Agregar nota
          </label>

          {usarNota && (
            <input
              type="number"
              className="neo-input mt-2"
              placeholder="Nota"
              value={notaEtapa}
              onChange={(e) => setNotaEtapa(e.target.value)}
            />
          )}

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