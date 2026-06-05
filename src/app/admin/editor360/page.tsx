'use client';

import { useEffect, useMemo, useState } from 'react';

import MarzipanoCanvas from './components/MarzipanoCanvas';
import PanoramasPanel from './components/PanoramasPanel';
import HotspotPanel from './components/HotspotPanel';
import RutasPanel from './components/RutasPanel';
import PanoramasStrip from './components/PanoramasStrip';
import { useRutas360 } from './hooks/useRutas360';
import { usePanoramas360 } from './hooks/usePanoramas360';

import { apiCreateHotspot, apiListHotspots } from '@/lib/visor360.api';

import type { CapturedPoint, Hotspot360 } from './types';

export default function Editor360Page() {
  const {
    rutas,
    selectedRuta,
    setSelectedRuta,
    loading,
    createRuta,
    deleteRuta,
  } = useRutas360();

  const {
    panoramas,
    currentPano,
    setCurrentPano,
    loadingPanos,
    createPanorama,
    deletePanorama,
  } = usePanoramas360(selectedRuta);

  const [hotspots, setHotspots] = useState<Hotspot360[]>([]);
  const [loadingHotspots, setLoadingHotspots] = useState(false);

  const [capturedPoint, setCapturedPoint] =
    useState<CapturedPoint | null>(null);

  async function loadHotspots() {
    if (!currentPano?.id) {
      setHotspots([]);
      return;
    }

    try {
      setLoadingHotspots(true);

      const data = await apiListHotspots(currentPano.id);

      setHotspots(data);
    } finally {
      setLoadingHotspots(false);
    }
  }

  useEffect(() => {
    loadHotspots();
  }, [currentPano?.id]);

  async function handleCreateInfo(data: {
    title: string;
    content: string;
    point: CapturedPoint;
  }) {
    if (!currentPano) return;

    await apiCreateHotspot({
      panoramaId: currentPano.id,
      type: 'INFORMACION',
      x: data.point.yaw,
      y: data.point.pitch,
      z: 0,
      icon: 'INFO',
      title: data.title,
      content: data.content,
    });

    await loadHotspots();
  }

  async function handleCreateLink(data: {
    title: string;
    targetPanoramaId: string;
    point: CapturedPoint;
  }) {
    if (!currentPano) return;

    await apiCreateHotspot({
      panoramaId: currentPano.id,
      type: 'LINK',
      x: data.point.yaw,
      y: data.point.pitch,
      z: 0,
      icon: 'FLECHA',
      title: data.title,
      targetPanoramaId: data.targetPanoramaId,
    });

    await loadHotspots();
  }

  const loadingAll =
    loading || loadingPanos || loadingHotspots;

  const currentRutaName = useMemo(() => {
    return selectedRuta?.nombre ?? 'Sin ruta seleccionada';
  }, [selectedRuta]);

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-6 text-slate-900 md:px-8">
      {/* CABECERA */}
      <section className="mb-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-700">
              Gestión de recorridos virtuales
            </p>

            <h1 className="text-3xl font-black tracking-tight text-[#10233f] md:text-4xl">
              Editor de Rutas 360°
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>Ruta actual:</span>

              <span className="rounded-full bg-emerald-50 px-3 py-1 font-black text-emerald-700 ring-1 ring-emerald-200">
                {currentRutaName}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#10233f] px-5 py-3 text-sm font-bold text-white shadow-lg">
            {panoramas.length} panoramas registrados
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="grid gap-6 xl:grid-cols-[360px_1fr_360px]">
        {/* IZQUIERDA */}
        <aside className="space-y-6">
          <RutasPanel
            rutas={rutas}
            selectedRuta={selectedRuta}
            loading={loading}
            onSelect={setSelectedRuta}
            onCreate={async ({ nombre, slug }) => {
              await createRuta({
                nombre,
                slug,
              });
            }}
            onDelete={deleteRuta}
          />

        </aside>

        {/* CENTRO */}
        <section className="min-w-0 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.07)]">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black text-[#10233f]">
                Vista panorámica 360°
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Haz clic sobre la imagen para capturar coordenadas del hotspot.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
              {currentPano?.name ?? 'Sin panorama seleccionado'}
            </div>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-950">
            <MarzipanoCanvas
              panorama={currentPano}
              hotspots={hotspots}
              onCapturePoint={setCapturedPoint}
              onGoToPanorama={(panoramaId) => {
                const pano = panoramas.find(
                  (p) => p.id === panoramaId
                );

                if (pano) {
                  setCurrentPano(pano);
                }
              }}
            />
          </div>
          <PanoramasStrip
            panoramas={panoramas}
            currentPano={currentPano}
            loading={loadingAll}
            disabled={!selectedRuta}
            onSelect={setCurrentPano}
            onCreate={createPanorama}
            onDelete={deletePanorama}
          />
          <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <strong>Consejo:</strong> selecciona un punto dentro del panorama y
            luego completa la información del hotspot en el panel derecho.
          </div>
        </section>

        {/* DERECHA */}
        <aside className="space-y-6">
          <HotspotPanel
            point={capturedPoint}
            currentPano={currentPano}
            panoramas={panoramas}
            loading={loadingAll}
            onCreateInfo={handleCreateInfo}
            onCreateLink={handleCreateLink}
          />

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.07)]">
            <h2 className="mb-3 text-lg font-black text-[#10233f]">
              Estado del editor
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-slate-500">
                  Rutas
                </span>

                <span className="font-black text-slate-800">
                  {rutas.length}
                </span>
              </div>

              <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-slate-500">
                  Panoramas
                </span>

                <span className="font-black text-slate-800">
                  {panoramas.length}
                </span>
              </div>

              <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-slate-500">
                  Hotspots
                </span>

                <span className="font-black text-slate-800">
                  {hotspots.length}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}