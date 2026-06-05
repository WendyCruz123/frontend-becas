'use client';

import { useEffect, useRef } from 'react';
import type { CapturedPoint, Hotspot360, Panorama360 } from '../types';

type Props = {
  panorama: Panorama360 | null;
  hotspots: Hotspot360[];
  onCapturePoint: (point: CapturedPoint) => void;
  onGoToPanorama: (panoramaId: string) => void;
};

export default function MarzipanoCanvas({
  panorama,
  hotspots,
  onCapturePoint,
  onGoToPanorama,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onCaptureRef = useRef(onCapturePoint);
  const onGoToRef = useRef(onGoToPanorama);

  useEffect(() => {
    onCaptureRef.current = onCapturePoint;
  }, [onCapturePoint]);

  useEffect(() => {
    onGoToRef.current = onGoToPanorama;
  }, [onGoToPanorama]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !panorama) return;
    const pano = panorama;
    let viewer: any = null;
    let scene: any = null;
    let destroyed = false;
    const cleanups: Array<() => void> = [];


    async function init() {
      try {
        const Marzipano = (await import('marzipano')).default;

        if (destroyed || !container) return;

        const pixelRatio =
  typeof window !== 'undefined'
    ? Math.min(window.devicePixelRatio || 1, 1)
    : 1;

        viewer = new Marzipano.Viewer(container, {
          controls: {
            mouseViewMode: 'drag',
          },
          stage: {
            pixelRatio,
          },
        });

const imageUrl = pano.fileUrl.startsWith('http')
  ? pano.fileUrl
  : `${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000'}${pano.fileUrl}`;

const source = Marzipano.ImageUrlSource.fromString(imageUrl);

const geometry = new Marzipano.EquirectGeometry([{ width: 3000 }]);

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

        scene = viewer.createScene({
          source,
          geometry,
          view,
          pinFirstLevel: true,
        });

        hotspots.forEach((h) => {
          const wrapper = document.createElement('div');
          wrapper.style.position = 'relative';
          wrapper.style.display = 'flex';
          wrapper.style.alignItems = 'center';
          wrapper.style.justifyContent = 'center';
          wrapper.style.touchAction = 'manipulation';

          const btn = document.createElement('button');
          btn.type = 'button';
          btn.textContent = h.type === 'LINK' ? '⮝' : 'i';
          btn.style.width = '46px';
          btn.style.height = '46px';
          btn.style.borderRadius = '999px';
          btn.style.border = '3px solid white';
          btn.style.fontWeight = '900';
          btn.style.fontSize = '22px';
          btn.style.cursor = 'pointer';
          btn.style.color = h.type === 'LINK' ? '#0369a1' : '#0f766e';
          btn.style.background = 'linear-gradient(145deg, #ffffff, #e5e7eb)';
          btn.style.boxShadow =
            '8px 8px 18px rgba(0,0,0,.25), -5px -5px 12px rgba(255,255,255,.8)';
          btn.style.transition = 'all .25s ease';

          wrapper.appendChild(btn);

          if (h.type === 'INFORMACION') {
            const card = document.createElement('div');

            card.innerHTML = `
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                <div style="
                  width:34px;
                  height:34px;
                  border-radius:999px;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  background:linear-gradient(145deg,#ffffff,#e5e7eb);
                  box-shadow:inset 4px 4px 8px #d1d5db,inset -4px -4px 8px #ffffff;
                  color:#0f766e;
                  font-weight:900;
                  font-size:18px;
                ">i</div>
                <strong style="font-size:17px;color:#111827;line-height:1.2;">
                  ${h.titulo || 'Información'}
                </strong>
              </div>

              <p style="
                margin:0;
                color:#374151;
                font-size:14px;
                line-height:1.5;
                font-weight:500;
              ">
                ${h.contenido || 'Sin descripción registrada.'}
              </p>
            `;

            card.style.position = 'absolute';
            card.style.left = '58px';
            card.style.top = '-18px';
            card.style.width = '280px';
            card.style.maxWidth = '75vw';
            card.style.padding = '16px';
            card.style.borderRadius = '22px';
            card.style.background = 'rgba(255,255,255,.96)';
            card.style.backdropFilter = 'blur(14px)';
            card.style.border = '1px solid rgba(255,255,255,.9)';
            card.style.boxShadow =
              '14px 14px 35px rgba(0,0,0,.25), -8px -8px 20px rgba(255,255,255,.9)';
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px) scale(.96)';
            card.style.pointerEvents = 'none';
            card.style.transition = 'all .25s ease';
            card.style.zIndex = '9999';

            wrapper.appendChild(card);

            let visible = false;

            const showCard = () => {
              visible = true;
              btn.style.transform = 'scale(1.12)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            };

            const hideCard = () => {
              visible = false;
              btn.style.transform = 'scale(1)';
              card.style.opacity = '0';
              card.style.transform = 'translateY(10px) scale(.96)';
            };

            wrapper.onmouseenter = showCard;
            wrapper.onmouseleave = hideCard;

            wrapper.onclick = (ev) => {
              ev.stopPropagation();
              visible ? hideCard() : showCard();
            };

            wrapper.ontouchstart = (ev) => {
              ev.stopPropagation();
              visible ? hideCard() : showCard();
            };
          } else {
            wrapper.onclick = (ev) => {
              ev.stopPropagation();
              const targetId = h.link?.targetPanoramaId;
              if (targetId) onGoToRef.current(targetId);
            };

            wrapper.ontouchstart = (ev) => {
              ev.stopPropagation();
              const targetId = h.link?.targetPanoramaId;
              if (targetId) onGoToRef.current(targetId);
            };
          }

          const createdHotspot = scene.hotspotContainer().createHotspot(
            wrapper,
            {
              yaw: h.x,
              pitch: h.y,
            }
          );

          cleanups.push(() => {
            try {
              scene.hotspotContainer().destroyHotspot(createdHotspot);
            } catch {}
          });
        });

        const helper = document.createElement('div');
        helper.innerText = 'Haz clic en la imagen para capturar coordenadas';
        helper.style.position = 'absolute';
        helper.style.left = '16px';
        helper.style.bottom = '16px';
        helper.style.zIndex = '100';
        helper.style.background = 'rgba(15,23,42,.85)';
        helper.style.color = '#fff';
        helper.style.padding = '10px 14px';
        helper.style.borderRadius = '999px';
        helper.style.fontSize = '13px';
        helper.style.fontWeight = '700';
        helper.style.pointerEvents = 'none';
        container.appendChild(helper);

        cleanups.push(() => {
          try {
            helper.remove();
          } catch {}
        });

        const handleClick = (event: MouseEvent) => {
          const rect = container.getBoundingClientRect();

          const coords = view.screenToCoordinates({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });

          if (!coords) return;

          onCaptureRef.current({
            yaw: coords.yaw,
            pitch: coords.pitch,
          });

          helper.innerText = `Yaw: ${coords.yaw.toFixed(
            4
          )} | Pitch: ${coords.pitch.toFixed(4)}`;
        };

        container.addEventListener('click', handleClick);

        cleanups.push(() => {
          container.removeEventListener('click', handleClick);
        });

        scene.switchTo();

        setTimeout(() => {
          if (!destroyed && viewer?.updateSize) {
            viewer.updateSize();
          }
        }, 300);
      } catch (error) {
        console.error('Error Marzipano:', error);
      }
    }

    init();

    return () => {
      destroyed = true;
      cleanups.forEach((fn) => fn());

      try {
        viewer?.destroy?.();
      } catch {}
    };
  }, [panorama?.id, hotspots]);

  if (!panorama) {
    return (
      <div className="flex h-[72vh] items-center justify-center rounded-3xl bg-slate-950 text-white">
        Selecciona una ruta y un panorama 360°.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white bg-black shadow-lg">
      <div
        ref={containerRef}
        className="relative h-[72vh] w-full cursor-crosshair touch-none"
      />
    </div>
  );
}