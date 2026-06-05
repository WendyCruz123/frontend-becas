import React from 'react';
import { PasoPorBeca, PasoEstudiante } from '../types';

export function RequisitoCard({
  paso,
  checked,
  estadoRevision,
  estadoEtapa,
  onToggle,
  children,
  disabled,
  esEtapa,
}: {
  paso: PasoPorBeca;
  checked: boolean;
  estadoRevision?: string;
  estadoEtapa?: PasoEstudiante['estado_etapa'];
  onToggle: (v: boolean) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  esEtapa?: boolean;
}) {
  const r = paso.requisito;

  const colores = ['#00a99d', '#0077c8', '#5b3db8', '#e67e22', '#0ea5e9'];
  const color = esEtapa ? '#94a3b8' : colores[(paso.orden - 1) % colores.length];

const pendienteKardex = estadoRevision === 'PENDIENTE_LEGALIZACION';
const enRevisionKardex = estadoRevision === 'EN_REVISION';
  const rechazado = estadoRevision === 'RECHAZADO';
  const legalizado = estadoRevision === 'LEGALIZADO';

  const etapaBloqueada = esEtapa && estadoEtapa === 'BLOQUEADO';
  const etapaRevision = esEtapa && estadoEtapa === 'EN_REVISION';
  const etapaAprobada = esEtapa && estadoEtapa === 'APROBADO';
  const etapaReprobada = esEtapa && estadoEtapa === 'REPROBADO';
  const etapaAbandonada = esEtapa && estadoEtapa === 'ABANDONADO';

  const etapaMarcada =
    etapaRevision || etapaAprobada || etapaReprobada || etapaAbandonada;

  const kardexMarcado =
    pendienteKardex || enRevisionKardex || legalizado || rechazado;

  return (
    <article
      className={`
        req-card
        ${!esEtapa && (checked || legalizado) && !r.requiere_legalizacion
          ? 'req-card-complete'
          : ''}

        ${legalizado ? 'req-card-complete' : ''}
        ${!esEtapa &&
        r.requiere_legalizacion &&
        !legalizado
          ? 'req-card-legalizacion'
          : ''}
        ${rechazado ? 'req-card-rechazado' : ''}
        ${etapaBloqueada ? 'req-card-etapa-bloqueada' : ''}
        ${etapaRevision ? 'req-card-etapa-habilitada' : ''}
        ${etapaAprobada ? 'req-card-etapa-aprobada' : ''}
        ${etapaReprobada ? 'req-card-etapa-reprobada' : ''}
        ${etapaAbandonada ? 'req-card-etapa-reprobada' : ''}
      `}
      style={{ '--accent': color } as React.CSSProperties}
    >
      <div className="req-card-accent" />

      <div className="req-card-header">
        <div className="req-step-circle">
          {String(paso.orden).padStart(2, '0')}
        </div>

        <div className="req-card-info">
          <h3>{r.nombre}</h3>

          {esEtapa && estadoEtapa === 'BLOQUEADO' && (
            <small className="req-kardex-pending">
              🔒 Etapa bloqueada hasta la aprobación
            </small>
          )}

          {esEtapa && estadoEtapa === 'EN_REVISION' && (
            <small className="req-kardex-pending">
              ⏳ Etapa en revisión por el encargado
            </small>
          )}

          {esEtapa && estadoEtapa === 'APROBADO' && (
            <small className="req-kardex-ok">
              ✅ Etapa aprobada por el encargado
            </small>
          )}

          {esEtapa && estadoEtapa === 'REPROBADO' && (
            <small className="req-kardex-rejected">
              ❌ Etapa reprobada por el encargado
            </small>
          )}

          {esEtapa && estadoEtapa === 'ABANDONADO' && (
            <small className="req-kardex-rejected">
              🚫 Etapa marcada como abandonada
            </small>
          )}

          {!esEtapa && r.requiere_legalizacion && (
            <small className="req-legalizacion-warning">
              ⏱ Tiempo demora estimado: {r.dias_estimados_legalizacion
                ? `${r.dias_estimados_legalizacion} días hábiles`
                : '3 a 4 días hábiles'}
            </small>
          )}
          {pendienteKardex && (
            <small className="req-kardex-pending">
              📌 Pendiente de entrega física para legalización
            </small>
          )}

          {enRevisionKardex && (
            <small className="req-kardex-pending">
              ⏳ Documento en revisión institucional
            </small>
          )}

          {legalizado && (
            <small className="req-kardex-ok">
              ✅ Documento legalizado
            </small>
          )}

          {rechazado && (
            <small className="req-kardex-rejected">
              ⚠️ Documento rechazado. Debe regularizar.
            </small>
          )}
        </div>

        <div className="req-card-right">
          <input
            className="req-checkbox"
            type="checkbox"
            checked={esEtapa ? etapaMarcada : checked || kardexMarcado}
            disabled={
              disabled ||
              r.requiere_legalizacion ||
              pendienteKardex ||
              enRevisionKardex ||
              legalizado ||
              rechazado ||
              etapaRevision ||
              etapaAprobada ||
              etapaReprobada ||
              etapaAbandonada
            }
            onChange={(e) => {
              if (
                disabled ||
                r.requiere_legalizacion ||
                pendienteKardex ||
                enRevisionKardex ||
                legalizado ||
                rechazado ||
                etapaRevision ||
                etapaAprobada ||
                etapaReprobada ||
                etapaAbandonada
              ) {
                return;
              }

              onToggle(e.target.checked);
            }}
          />
        </div>
      </div>

      {children}
    </article>
  );
}