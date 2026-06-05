'use client';

import { useState } from 'react';
import type { EtapaEncargado, OficinaOption } from '../types';

type ResultadoEtapa = 'APROBADO' | 'REPROBADO' | 'ABANDONADO';

export function EtapaRevisionModal({
  etapa,
  oficinas,
  onClose,
  onResolver,
}: {
  etapa: EtapaEncargado | null;
  oficinas: OficinaOption[];
  onClose: () => void;
  onResolver: (
    resultado: ResultadoEtapa,
    payload: {
      nota?: number;
      fecha?: string;
      descripcion?: string;
      textoExtra?: string;
      oficinaRutaId?: number;
    },
  ) => Promise<void>;
}) {
  const [nota, setNota] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [textoExtra, setTextoExtra] = useState('');
  const [oficinaRutaId, setOficinaRutaId] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmacion, setConfirmacion] = useState<ResultadoEtapa | null>(null);

  if (!etapa) return null;

  const nombreCompleto = [
    etapa.estudiante.nombre,
    etapa.estudiante.apellido_paterno,
    etapa.estudiante.apellido_materno,
  ]
    .filter(Boolean)
    .join(' ');

  const oficinaSeleccionada = oficinas.find(
    (o) => String(o.ID_oficina) === oficinaRutaId,
  );

  const payloadPreview = {
    nota: nota ? Number(nota) : undefined,
    fecha: fecha || undefined,
    descripcion: descripcion || undefined,
    textoExtra: textoExtra || undefined,
    oficinaRutaId: oficinaRutaId ? Number(oficinaRutaId) : undefined,
  };

  function abrirConfirmacion(resultado: ResultadoEtapa) {
    setConfirmacion(resultado);
  }

  async function confirmarResolucion() {
    if (!confirmacion) return;

    setSaving(true);

    try {
      await onResolver(confirmacion, payloadPreview);
      setConfirmacion(null);
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al revisar etapa.');
    } finally {
      setSaving(false);
    }
  }

  function colorResultado(resultado: ResultadoEtapa) {
    if (resultado === 'APROBADO') return 'text-emerald-700 bg-emerald-100';
    if (resultado === 'REPROBADO') return 'text-red-700 bg-red-100';
    return 'text-amber-700 bg-amber-100';
  }

  function textoResultado(resultado: ResultadoEtapa) {
    if (resultado === 'APROBADO') return 'APROBAR ETAPA';
    if (resultado === 'REPROBADO') return 'REPROBAR ETAPA';
    return 'MARCAR COMO ABANDONADO';
  }

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-container modal--form-estudiante beca-modal">
          <button className="modal-close" onClick={onClose} type="button">
            ×
          </button>

          <div className="beca-modal-header">
            <span className="beca-modal-badge">Revisión de etapa</span>

            <h2>{etapa.requisito.nombre}</h2>

            <p>Estudiante: {nombreCompleto}</p>
          </div>

          <div className="modal-body">
            <div
              className="mb-4 rounded-2xl p-4 backdrop-blur-xl
                         border border-white/10
                         bg-gradient-to-br
                         from-cyan-100/70 via-sky-200/60 to-cyan-300/50
                         shadow-sm"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="text-xs font-semibold text-slate-500">
                    CI: {etapa.estudiante.ci}
                  </div>

                  <h3 className="mt-1 text-base font-black text-slate-800 uppercase leading-tight">
                    {nombreCompleto}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    {etapa.beca.nombre}
                  </p>
                </div>

                <span className="inline-flex shrink-0 rounded-xl bg-white/75 px-3 py-1 text-xs font-black text-cyan-700 shadow-sm">
                  {etapa.estado_etapa}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-white/60 p-3">
                  <div className="text-xs font-bold text-slate-500 uppercase">
                    Gestión
                  </div>
                  <div className="font-bold text-slate-800">
                    {etapa.beca.gestion}
                  </div>
                </div>

                <div className="rounded-xl bg-white/60 p-3">
                  <div className="text-xs font-bold text-slate-500 uppercase">
                    Etapa
                  </div>
                  <div className="font-bold text-slate-800">
                    {etapa.requisito.nombre}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {etapa.requisito.requiere_nota && (
                <div className="send-message-box">
                  <label>Nota</label>
                  <input
                    className="neo-input"
                    type="number"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    placeholder="Ej. 85"
                  />
                </div>
              )}

              {etapa.requisito.requiere_fecha_descripcion && (
                <>
                  <div className="send-message-box">
                    <label>Fecha</label>
                    <input
                      className="neo-input"
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                    />
                  </div>

                  <div className="send-message-box">
                    <label>Descripción</label>
                    <textarea
                      className="neo-input"
                      rows={3}
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Detalle de la etapa..."
                    />
                  </div>
                </>
              )}

              {etapa.requisito.requiere_ruta_360 && (
                <div className="send-message-box">
                  <label>Oficina / recorrido 360°</label>
                  <select
                    className="neo-input"
                    value={oficinaRutaId}
                    onChange={(e) => setOficinaRutaId(e.target.value)}
                  >
                    <option value="">Seleccione una oficina...</option>
                    {oficinas.map((o) => (
                      <option key={o.ID_oficina} value={o.ID_oficina}>
                        {o.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {etapa.requisito.requiere_otro && (
                <div className="send-message-box">
                  <label>Información adicional</label>
                  <textarea
                    className="neo-input"
                    rows={3}
                    value={textoExtra}
                    onChange={(e) => setTextoExtra(e.target.value)}
                    placeholder="Observación adicional..."
                  />
                </div>
              )}
            </div>

            <div className="modal-footer grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                className="modal-btn secondary w-full"
                type="button"
                disabled={saving}
                onClick={() => abrirConfirmacion('REPROBADO')}
              >
                REPROBAR
              </button>

              <button
                className="modal-btn primary w-full"
                type="button"
                disabled={saving}
                onClick={() => abrirConfirmacion('APROBADO')}
              >
                APROBAR
              </button>

              <button
                className="modal-btn secondary w-full sm:col-span-2"
                type="button"
                disabled={saving}
                onClick={() => abrirConfirmacion('ABANDONADO')}
              >
                ABANDONADO
              </button>
            </div>
          </div>
        </div>
      </div>

      {confirmacion && (
        <div className="modal-overlay z-[9999]">
          <div className="modal-container max-w-[520px] rounded-[24px]">
            <div className="beca-modal-header">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${colorResultado(confirmacion)}`}>
                {textoResultado(confirmacion)}
              </span>

              <h2>Confirmar revisión de etapa</h2>

              <p>
                Revise cuidadosamente los datos antes de guardar el resultado.
              </p>
            </div>

            <div className="modal-body space-y-4">
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4">
                <p className="text-xs font-black uppercase text-cyan-700">
                  Estudiante
                </p>
                <p className="mt-1 font-black text-slate-800 uppercase">
                  {nombreCompleto}
                </p>
                <p className="text-sm font-semibold text-slate-500">
                  CI: {etapa.estudiante.ci}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white p-3">
                  <p className="text-xs font-black uppercase text-slate-400">
                    Beca
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {etapa.beca.nombre}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-3">
                  <p className="text-xs font-black uppercase text-slate-400">
                    Etapa
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {etapa.requisito.nombre}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="mb-2 text-xs font-black uppercase text-slate-500">
                  Datos registrados
                </p>

                <div className="space-y-1 text-sm text-slate-700">
                  <p>
                    <strong>Resultado:</strong> {confirmacion}
                  </p>

                  {etapa.requisito.requiere_nota && (
                    <p>
                      <strong>Nota:</strong> {nota || 'No registrada'}
                    </p>
                  )}

                  {etapa.requisito.requiere_fecha_descripcion && (
                    <>
                      <p>
                        <strong>Fecha:</strong> {fecha || 'No registrada'}
                      </p>
                      <p>
                        <strong>Descripción:</strong>{' '}
                        {descripcion || 'No registrada'}
                      </p>
                    </>
                  )}

                  {etapa.requisito.requiere_ruta_360 && (
                    <p>
                      <strong>Oficina / recorrido:</strong>{' '}
                      {oficinaSeleccionada?.nombre || 'No seleccionado'}
                    </p>
                  )}

                  {etapa.requisito.requiere_otro && (
                    <p>
                      <strong>Información adicional:</strong>{' '}
                      {textoExtra || 'No registrada'}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
                Esta acción guardará el resultado de la etapa y notificará al estudiante según el flujo configurado.
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="modal-btn secondary w-full"
                  disabled={saving}
                  onClick={() => setConfirmacion(null)}
                >
                  No estoy seguro
                </button>

                <button
                  type="button"
                  className="modal-btn primary w-full"
                  disabled={saving}
                  onClick={confirmarResolucion}
                >
                  {saving ? 'Guardando...' : 'Sí, estoy seguro'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}