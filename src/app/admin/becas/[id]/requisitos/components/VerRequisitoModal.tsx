'use client';

import '@/app/modal.css';
import { useEffect, useMemo, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { nombreUsuario } from '../types';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

type Oficina = {
  ID_oficina: number;
  nombre: string;
  panorama_route_slug?: string | null;
};

export default function VerRequisitoModal({
  requisito,
  onClose,
}: {
  requisito: any;
  onClose: () => void;
}) {
  const [oficina, setOficina] = useState<Oficina | null>(null);
  const [loadingOficina, setLoadingOficina] = useState(false);

  const flujoLegalizacion = useMemo(() => {
    return [...(requisito?.legalizacion_flujo ?? [])].sort(
      (a: any, b: any) => Number(a.orden) - Number(b.orden),
    );
  }, [requisito]);

  useEffect(() => {
    setOficina(null);

    if (!requisito?.oficinaId) return;

    let cancelled = false;
    setLoadingOficina(true);

    fetchWithAuth(`${BACKEND}/oficinas/${requisito.oficinaId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('Oficina no disponible');
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setOficina(data);
      })
      .catch(() => {
        if (!cancelled) setOficina(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingOficina(false);
      });

    return () => {
      cancelled = true;
    };
  }, [requisito?.oficinaId]);

  function handleOverlayClick() {
    onClose();
  }

  function stopPropagation(e: React.MouseEvent) {
    e.stopPropagation();
  }

  function buildFileUrl(url?: string | null) {
    if (!url) return '#';

    if (url.startsWith('http://localhost:3000/uploads')) {
      return url.replace('http://localhost:3000', BACKEND);
    }

    if (url.startsWith('http')) return url;

    return `${BACKEND}${url.startsWith('/') ? url : `/${url}`}`;
  }

  function isWordFile(url?: string | null) {
    return !!url && /\.(doc|docx)$/i.test(url);
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="modal-container modal--form-estudiante"
        onClick={stopPropagation}
      >
        <span className="modal-close" onClick={onClose}>
          ✕
        </span>

        <div className="modal-header">📄 DETALLE DEL REQUISITO</div>

        <div className="modal-body space-y-3">
          <p>
            <b>Nombre:</b> {requisito?.nombre ?? '—'}
          </p>

          <p>
            <b>Tipo:</b>{' '}
            {requisito?.tipo_requisito === 'ETAPA'
              ? 'Requisito-etapa'
              : 'Documento'}
          </p>

          {requisito?.descripcion && (
            <p>
              <b>Descripción:</b> {requisito.descripcion}
            </p>
          )}

          {loadingOficina && (
            <p>
              <b>OFICINA:</b> Cargando…
            </p>
          )}

          {oficina && (
            <p>
              <b>OFICINA:</b>{' '}
              {oficina.panorama_route_slug ? (
                <button
                  className="neo-action-btn"
                  title="Ver recorrido 360°"
                  onClick={() =>
                    window.open(
                      `/visor/${oficina.panorama_route_slug}?oficinaId=${oficina.ID_oficina}`,
                      '_blank',
                    )
                  }
                >
                  🏢 {oficina.nombre}
                </button>
              ) : (
                <span className="neo-action-btn" style={{ cursor: 'default' }}>
                  🏢 {oficina.nombre}
                </span>
              )}
            </p>
          )}

          {requisito?.archivo_ejemplo_url && (
            <p>
              <b>DOCUMENTO:</b>{' '}
              <a
                className="neo-action-btn"
                href={buildFileUrl(requisito.archivo_ejemplo_url)}
                target={
                  isWordFile(requisito.archivo_ejemplo_url)
                    ? undefined
                    : '_blank'
                }
                rel="noopener noreferrer"
                download={isWordFile(requisito.archivo_ejemplo_url)}
              >
                {isWordFile(requisito.archivo_ejemplo_url)
                  ? '⬇️ Descargar Word'
                  : '📄 Ver documento'}
              </a>
            </p>
          )}

          {requisito?.url_externa && (
            <p>
              <b>URL:</b>{' '}
              <a
                className="neo-action-btn"
                href={requisito.url_externa}
                target="_blank"
                rel="noopener noreferrer"
              >
                🔗 Abrir enlace
              </a>
            </p>
          )}

          {requisito?.tipo_requisito === 'DOCUMENTO' &&
            requisito?.requiere_legalizacion && (
              <div className="info-box mt-3">
                <strong>Requiere legalización presencial</strong>

                <p className="mt-2">
                  Este requisito debe pasar por un flujo de revisión antes de
                  quedar legalizado para el estudiante.
                </p>

                <div className="mt-3">
                  <b>Flujo configurado:</b>

                  {flujoLegalizacion.length === 0 ? (
                    <p>— No tiene flujo configurado.</p>
                  ) : (
                    <div className="grid gap-2 mt-2">
                      {flujoLegalizacion.map((f: any, index: number) => (
                        <div key={f.id ?? `${f.usuarioId}-${index}`}>
                          {index + 1}. {nombreUsuario(f.usuario)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <b>Encargado final de entrega:</b>{' '}
                  {nombreUsuario(requisito?.entrega_final_usuario)}
                </div>
              </div>
            )}

          {requisito?.tipo_requisito === 'ETAPA' && (
            <div className="info-box mt-3">
              <strong>Configuración de etapa</strong>
              <p>Nota: {requisito.requiere_nota ? 'Sí' : 'No'}</p>
              <p>
                Fecha y descripción:{' '}
                {requisito.requiere_fecha_descripcion ? 'Sí' : 'No'}
              </p>
              <p>Ruta 360°: {requisito.requiere_ruta_360 ? 'Sí' : 'No'}</p>
              <p>Texto adicional: {requisito.requiere_otro ? 'Sí' : 'No'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}