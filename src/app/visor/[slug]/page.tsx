'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

type Hotspot360 = {
  id: string;
  panoramaId: string;
  type: 'INFORMACION' | 'LINK';
  x: number;
  y: number;
  titulo?: string | null;
  contenido?: string | null;
  link?: {
    targetPanoramaId: string;
  } | null;
};

type Panorama360 = {
  id: string;
  name: string;
  fileUrl: string;
  es_portada: boolean;
  hotspots: Hotspot360[];
};

type Ruta360 = {
  id: string;
  nombre: string;
  slug: string;
  panoramas: Panorama360[];
};

export default function VisorPorRuta() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scenesRef = useRef<Record<string, any>>({});
  const historyRef = useRef<string[]>([]);
  const currentPanoRef = useRef<string | null>(null);

  const [ruta, setRuta] = useState<Ruta360 | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    async function loadRuta() {
      try {
        setError('');
        setReady(false);

        const r = await fetch(`${BACKEND}/rutas360/${slug}`, {
          cache: 'no-store',
        });

        if (!r.ok) {
          throw new Error('Ruta 360 no encontrada');
        }

        const data = await r.json();

        if (!data?.panoramas?.length) {
          throw new Error('La ruta no tiene panoramas registrados');
        }

        setRuta(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Error cargando ruta';
        setError(msg);
      }
    }

    if (slug) loadRuta();
  }, [slug]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !ruta) return;
    const rutaActual = ruta;
    let viewer: any = null;
    let destroyed = false;
    const cleanups: Array<() => void> = [];
    const scenes: Record<string, any> = {};

    container.innerHTML = '';
    historyRef.current = [];
    currentPanoRef.current = null;
    scenesRef.current = {};
    setCanGoBack(false);
    setReady(false);

    async function init() {
      try {
        const Marzipano = (await import('marzipano')).default;
        if (destroyed) return;

        const pixelRatio =
  typeof window !== 'undefined'
    ? Math.min(window.devicePixelRatio || 1, 1.2)
    : 1;

        viewer = new Marzipano.Viewer(container, {
          controls: { mouseViewMode: 'drag' },
          stage: { pixelRatio },
        });

        rutaActual.panoramas.forEach((pano) => {
          const imageUrl = pano.fileUrl.startsWith('http')
  ? pano.fileUrl
  : `${BACKEND}${pano.fileUrl}`;

const source = Marzipano.ImageUrlSource.fromString(imageUrl);
const isMobile =
  typeof window !== 'undefined' &&
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const geometry = new Marzipano.EquirectGeometry([
  { width: isMobile ? 2048 : 3000 },
]);
          const limiter = Marzipano.RectilinearView.limit.traditional(
            1500,
            (100 * Math.PI) / 180
          );

          const view = new Marzipano.RectilinearView(
            {
              yaw: 0,
              pitch: 0,
              fov: Math.PI / 2,
            },
            limiter
          );

          scenes[pano.id] = viewer.createScene({
            source,
            geometry,
            view,
            pinFirstLevel: true,
          });
        });

        scenesRef.current = scenes;

        rutaActual.panoramas.forEach((pano) => {
          const scene = scenes[pano.id];
          if (!scene) return;

          pano.hotspots?.forEach((h) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'mz-hotspot';

            const btn = document.createElement('button');
            btn.type = 'button';

            if (h.type === 'LINK') {
              btn.className = 'mz-link-btn';
              btn.innerHTML = `
                <span class="mz-link-icon">⮝</span>
                <span class="mz-link-label">${h.titulo || 'Continuar'}</span>
              `;

              btn.onclick = (ev) => {
                ev.stopPropagation();

                const targetId = h.link?.targetPanoramaId;
                if (!targetId || !scenes[targetId]) return;

                if (currentPanoRef.current) {
                  historyRef.current.push(currentPanoRef.current);
                  setCanGoBack(true);
                }

                currentPanoRef.current = targetId;

                scenes[targetId].switchTo({
                  transitionDuration: 700,
                });
              };
            } else {
              btn.className = 'mz-pin';
              btn.textContent = 'i';

              const card = document.createElement('div');
              card.className = 'mz-card';
              card.style.display = 'none';

              card.innerHTML = `
                <div class="mz-card-title">
                  <span>ℹ ${h.titulo || 'Información'}</span>
                  <button type="button" class="mz-card-close">✕</button>
                </div>
                <div class="mz-card-body">
                  ${h.contenido || 'Sin descripción registrada.'}
                </div>
              `;

              btn.onclick = (ev) => {
                ev.stopPropagation();
                card.style.display =
                  card.style.display === 'none' ? 'block' : 'none';
              };

              const close = card.querySelector('.mz-card-close');
              close?.addEventListener('click', (ev) => {
                ev.stopPropagation();
                card.style.display = 'none';
              });

              wrapper.appendChild(card);
            }

            wrapper.appendChild(btn);

            const hotspot = scene.hotspotContainer().createHotspot(wrapper, {
              yaw: h.x,
              pitch: h.y,
            });

            cleanups.push(() => {
              try {
                scene.hotspotContainer().destroyHotspot(hotspot);
              } catch {}
            });
          });
        });

        const style = document.createElement('style');
        style.innerHTML = `
          .mz-hotspot {
            position: absolute;
            transform: translate(-50%, -50%);
            pointer-events: auto;
            z-index: 20;
            font-family: Arial, sans-serif;
          }

          .mz-link-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            border: 0;
            background: rgba(17, 24, 39, .72);
            color: #fff;
            cursor: pointer;
            padding: 6px 14px 6px 6px;
            border-radius: 999px;
            box-shadow: 0 12px 35px rgba(0,0,0,.38);
            backdrop-filter: blur(10px);
            transition: transform .2s ease;
          }

          .mz-link-btn:hover {
            transform: scale(1.08);
          }

          .mz-link-icon {
            display: grid;
            place-items: center;
            width: 46px;
            height: 46px;
            border-radius: 999px;
            background: rgba(255,255,255,.96);
            color: #1f2937;
            border: 4px solid rgba(255,255,255,.45);
            font-weight: 900;
            font-size: 24px;
            line-height: 1;
            box-shadow: 0 8px 22px rgba(0,0,0,.35);
          }

          .mz-link-label {
            font-size: 15px;
            font-weight: 800;
            white-space: nowrap;
            text-shadow: 0 2px 8px rgba(0,0,0,.8);
          }

          .mz-pin {
            width: 46px;
            height: 46px;
            border-radius: 999px;
            border: 3px solid rgba(255,255,255,.9);
            background: rgba(255,255,255,.96);
            color: #047857;
            font-size: 24px;
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0 12px 30px rgba(0,0,0,.38);
            transition: transform .2s ease;
          }

          .mz-pin:hover {
            transform: scale(1.08);
          }

          .mz-card {
            position: absolute;
            top: -8px;
            left: 58px;
            width: 330px;
            padding: 14px;
            border-radius: 16px;
            background: rgba(10, 18, 30, .94);
            color: white;
            border: 1px solid rgba(255,255,255,.18);
            box-shadow: 0 18px 50px rgba(0,0,0,.48);
            backdrop-filter: blur(12px);
          }

          .mz-card-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            font-weight: 800;
            margin-bottom: 8px;
            color: #e0f2fe;
            font-size: 14px;
          }

          .mz-card-close {
            border: 0;
            background: rgba(255,255,255,.14);
            color: white;
            width: 26px;
            height: 26px;
            border-radius: 999px;
            cursor: pointer;
          }

          .mz-card-body {
            font-size: 13px;
            line-height: 1.55;
            color: #e5e7eb;
          }

          @media (max-width: 640px) {
            .mz-card {
              width: 255px;
              left: -105px;
              top: 58px;
            }

            .mz-link-label {
              display: none;
            }
          }
        `;
        document.head.appendChild(style);
        cleanups.push(() => {
  if (style.parentNode) {
    style.parentNode.removeChild(style);
  }
});

        const start =
          rutaActual.panoramas.find((p) => p.es_portada) ?? rutaActual.panoramas[0];

        currentPanoRef.current = start.id;

        scenes[start.id]?.switchTo({
          transitionDuration: 700,
        });

        setReady(true);

        setTimeout(() => viewer?.updateSize?.(), 300);
setTimeout(() => viewer?.updateSize?.(), 800);
setTimeout(() => viewer?.updateSize?.(), 1500);
      } catch (e) {
        console.error(e);
        setError('No se pudo iniciar el visor 360');
      }
    }

    init();

    return () => {
  destroyed = true;

  try {
    viewer?.destroy?.();
  } catch {}

  cleanups.forEach((fn) => {
    try {
      fn();
    } catch {}
  });
};
  }, [ruta]);

return (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      overflow: 'hidden',
    }}
  >
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        background: '#000',
      }}
    />
      {(!ready || error) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            zIndex: 1000,
            fontFamily: 'Arial, sans-serif',
            background: '#020617',
            textAlign: 'center',
            padding: 24,
          }}
        >
          {error || 'Cargando recorrido 360...'}
        </div>
      )}

      {ready && canGoBack && (
        <button
          type="button"
          onClick={() => {
            const previous = historyRef.current.pop();
            if (!previous) return;

            currentPanoRef.current = previous;
            setCanGoBack(historyRef.current.length > 0);

            scenesRef.current[previous]?.switchTo({
              transitionDuration: 700,
            });
          }}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1000,
            background: 'rgba(15,23,42,.88)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,.35)',
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 10px 30px rgba(0,0,0,.35)',
          }}
        >
          ← Volver
        </button>
      )}

      {ready && (
        <Link
          href="/"
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 1000,
            background: 'rgba(0,0,0,.75)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 8,
            textDecoration: 'none',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Salir
        </Link>
      )}
    </div>
  );
}