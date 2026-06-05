'use client';

import { useState } from 'react';
import { FaInfoCircle, FaLocationArrow } from 'react-icons/fa';
import type { CapturedPoint, Panorama360 } from '../types';

type Props = {
  point: CapturedPoint | null;
  currentPano: Panorama360 | null;
  panoramas: Panorama360[];
  loading: boolean;
  onCreateInfo: (data: {
    title: string;
    content: string;
    point: CapturedPoint;
  }) => void;
  onCreateLink: (data: {
    title: string;
    targetPanoramaId: string;
    point: CapturedPoint;
  }) => void;
};

export default function HotspotPanel({
  point,
  currentPano,
  panoramas,
  loading,
  onCreateInfo,
  onCreateLink,
}: Props) {
  const [mode, setMode] = useState<'INFO' | 'LINK'>('INFO');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetPanoramaId, setTargetPanoramaId] = useState('');

  const targetOptions = panoramas.filter((p) => p.id !== currentPano?.id);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!point) {
      alert('Primero haz clic en el panorama para capturar coordenadas.');
      return;
    }

    if (!currentPano) {
      alert('Selecciona un panorama.');
      return;
    }

    if (mode === 'INFO') {
      onCreateInfo({
        title: title.trim() || 'Información',
        content: content.trim(),
        point,
      });
    } else {
      if (!targetPanoramaId) {
        alert('Selecciona el panorama destino.');
        return;
      }

      onCreateLink({
        title: title.trim() || 'Ir al siguiente ambiente',
        targetPanoramaId,
        point,
      });
    }

    setTitle('');
    setContent('');
    setTargetPanoramaId('');
  }

  return (
    <section className="rounded-3xl border border-white/70 bg-white p-5 shadow-lg">
      <h2 className="mb-4 text-xl font-black text-slate-800">
        Hotspots
      </h2>

      <div className="mb-4 rounded-2xl bg-slate-100 p-3 text-sm text-slate-700">
        {point ? (
          <>
            <p>
              <b>Yaw:</b> {point.yaw.toFixed(4)}
            </p>
            <p>
              <b>Pitch:</b> {point.pitch.toFixed(4)}
            </p>
          </>
        ) : (
          <p>Haz clic en el panorama para capturar coordenadas.</p>
        )}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode('INFO')}
          className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-black ${
            mode === 'INFO'
              ? 'bg-emerald-700 text-white'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          <FaInfoCircle />
          Información
        </button>

        <button
          type="button"
          onClick={() => setMode('LINK')}
          className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-black ${
            mode === 'LINK'
              ? 'bg-sky-700 text-white'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          <FaLocationArrow />
          Ruta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={
            mode === 'INFO'
              ? 'Título de información'
              : 'Texto del botón de ruta'
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          disabled={loading || !currentPano}
        />

        {mode === 'INFO' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Descripción"
            className="min-h-[120px] w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            disabled={loading || !currentPano}
          />
        ) : (
          <select
            value={targetPanoramaId}
            onChange={(e) => setTargetPanoramaId(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            disabled={loading || !currentPano}
          >
            <option value="">Selecciona panorama destino</option>
            {targetOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          disabled={loading || !currentPano || !point}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-bold text-white disabled:opacity-50"
        >
          Guardar hotspot
        </button>
      </form>
    </section>
  );
}