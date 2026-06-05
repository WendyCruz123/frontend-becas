import { useState } from 'react';
import { PasoPorBeca, Oficina, PostulacionDetalle } from '../types';
import { RequisitoCard } from './RequisitoCard';
import { generarCartaDirectorDocx } from '../utils/generarCartaDirectorDocx';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export function RequisitosList({
  pasos,
  oficinas,
  tramite,
  beca,
  estudiante,
  onToggle,
  estado,
}: {
  pasos: PasoPorBeca[];
  oficinas: Record<number, Oficina>;
  tramite: PostulacionDetalle | null;
  beca: any;
  estudiante: any;
  onToggle: (pasoBecaId: number, v: boolean) => void | Promise<void>;
  estado?: string;
}) {
  const [recomendacion, setRecomendacion] = useState<PasoPorBeca | null>(null);

  const pasosDocumentos = pasos.filter(
  (p) => p.requisito.tipo_requisito !== 'ETAPA'
);

const completados = pasosDocumentos.filter((p) =>
  tramite?.paso_estudiante.find(
    (pe) => pe.pasoBecaId === p.ID_pasosBeca
  )?.completado
).length;

const total = pasosDocumentos.length;
const todosCompletados = total > 0 && completados === total;

  async function toggleTodos(v: boolean) {
    if (!tramite) return;

    for (const p of pasosDocumentos) {
      if (p.requisito.requiere_legalizacion) continue;

      const checked =
        tramite.paso_estudiante.find(
          (pe) => pe.pasoBecaId === p.ID_pasosBeca
        )?.completado ?? false;

      if (checked !== v) {
        await onToggle(p.ID_pasosBeca, v);
      }
    }
  }

  function buildFileUrl(url?: string | null) {
    if (!url) return '#';
    if (url.startsWith('http')) return url;
    return `${BACKEND}${url.startsWith('/') ? url : `/${url}`}`;
  }

  function isWordFile(url?: string | null) {
    return !!url && /\.(doc|docx)$/i.test(url);
  }

  return (
    <>
      {tramite && total > 0 && (
        <div className="req-toolbar">
          <span>
            Requisitos completados: <strong>{completados}/{total}</strong>
          </span>

          <button
            type="button"
            className="req-select-all-btn"
            disabled={estado !== 'EN_PROCESO'}
            onClick={() => toggleTodos(!todosCompletados)}
          >
            {todosCompletados ? 'Deseleccionar todos' : 'Seleccionar todos'}
          </button>
        </div>
      )}

      <div className="req-list">
        {pasos.map((p) => {
          const r = p.requisito;
          const esEtapa = r.tipo_requisito === 'ETAPA';
          const nombreReq = r.nombre.toLowerCase();
          const esCartaDirector =
            nombreReq.includes('carta') && nombreReq.includes('director');
          const oficina = r.oficinaId ? oficinas[r.oficinaId] : null;

          const pasoEstudiante = tramite?.paso_estudiante.find(
            (pe) => pe.pasoBecaId === p.ID_pasosBeca
          );

          const checked = pasoEstudiante?.completado ?? false;
          const estadoRevision = pasoEstudiante?.estado_revision;
          const estadoEtapa = pasoEstudiante?.estado_etapa ?? null;
          const oficinaEtapa = pasoEstudiante?.oficinaRuta ?? null;
          return (
            <RequisitoCard
              key={p.ID_pasosBeca}
              paso={p}
              checked={checked}
              estadoRevision={estadoRevision}
              estadoEtapa={estadoEtapa}
              esEtapa={esEtapa}
              disabled={
                esEtapa ||
                r.requiere_legalizacion ||
                estado !== 'EN_PROCESO'
              }
              onToggle={(v) => {
                if (esEtapa || r.requiere_legalizacion) return;
                onToggle(p.ID_pasosBeca, v);
              }}
            >
              <div className="req-actions">
                <button
                  className="req-btn"
                  type="button"
                  onClick={() => setRecomendacion(p)}
                >
                  Recomendación
                </button>
                {!esEtapa && r.archivo_ejemplo_url && (
                  <button
                    className="req-btn"
                    onClick={() => {
                      const url = buildFileUrl(r.archivo_ejemplo_url);

                      if (isWordFile(r.archivo_ejemplo_url)) {
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = '';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        return;
                      }

                      window.open(url, '_blank');
                    }}
                  >
                    {isWordFile(r.archivo_ejemplo_url)
                      ? 'Descargar Word'
                      : 'Ver ejemplo'}
                  </button>
                )}

                {!esEtapa && r.url_externa && (
                  <button
                    className="req-btn"
                    onClick={() => window.open(r.url_externa!, '_blank')}
                  >
                    Enlace de descarga
                  </button>
                )}

                {!esEtapa && oficina?.panorama_route_slug && (
                  <button
                    className="req-btn"
                    onClick={() =>
                      window.location.href = `/visor/${oficina.panorama_route_slug}`
                    }
                  >
                    Ir a Oficina
                  </button>
                )}
                {esEtapa && oficinaEtapa?.panorama_route_slug && (
                  <button
                    className="req-btn"
                    type="button"
                    onClick={() =>
                      window.location.href = `/visor/${oficinaEtapa.panorama_route_slug}`
                    }
                  >
                    Ir a Oficina
                  </button>
                )}

                {!esEtapa && esCartaDirector && (
                  <button
                    className="req-btn"
                    onClick={() =>
                      generarCartaDirectorDocx({
                        estudiante,
                        beca,
                      })
                    }
                  >
                    Generar carta Word
                  </button>
                )}
              </div>
            </RequisitoCard>
          );
        })}
      </div>

      {recomendacion && (
        <div className="modal-overlay">
          <div className="modal-container modal--form-estudiante beca-modal">
            <button
              className="modal-close"
              onClick={() => setRecomendacion(null)}
              type="button"
            >
              ×
            </button>

            <div className="beca-modal-header">
              <span className="beca-modal-badge">Recomendación</span>
              <h2>{recomendacion.requisito.nombre}</h2>
              <p>Información importante sobre este requisito.</p>
            </div>

            <div className="modal-body">
              <div
                style={{
                  maxHeight: '55vh',
                  overflowY: 'auto',
                  paddingRight: 8,
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                  color: '#334155',
                  fontSize: 15,
                }}
              >
                {recomendacion.requisito.descripcion?.trim()
                  ? recomendacion.requisito.descripcion
                  : 'Este requisito aún no tiene una descripción o recomendación registrada.'}
              </div>

              <div className="modal-footer">
                <button
                  className="modal-btn primary w-full"
                  type="button"
                  onClick={() => setRecomendacion(null)}
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}