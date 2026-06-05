'use client';

import { useState } from 'react';
import type { Panorama360 } from '../types';
import { apiUpload360Image } from '@/lib/visor360.api';

type Props = {
  panoramas: Panorama360[];
  currentPano: Panorama360 | null;
  loading: boolean;
  disabled: boolean;
  onSelect: (pano: Panorama360) => void;
  onCreate: (data: {
    name: string;
    fileUrl: string;
    es_portada?: boolean;
  }) => void;
  onDelete: (id: string) => void;
};

export default function PanoramasPanel({
  loading,
  disabled,
  onCreate,
}: Props) {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [esPortada, setEsPortada] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert('Selecciona una imagen 360.');
      return;
    }

    try {
      const uploadedUrl = await apiUpload360Image(file);

      onCreate({
        name: name.trim() || 'Panorama 360°',
        fileUrl: uploadedUrl,
        es_portada: esPortada,
      });

      setName('');
      setFile(null);
      setEsPortada(false);
    } catch {
      alert('No se pudo subir la imagen.');
    }
  }

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.07)]">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-xl text-emerald-700">
          🖼️
        </div>

        <div>
          <h2 className="text-lg font-black text-[#10233f]">
            Agregar panorama
          </h2>
          <p className="text-xs text-slate-500">
            Sube imágenes 360° para la ruta seleccionada.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del panorama"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          disabled={disabled || loading}
        />

        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => {
            const selected = e.target.files?.[0] ?? null;
            setFile(selected);
          }}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
          disabled={disabled || loading}
        />

        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={esPortada}
            onChange={(e) => setEsPortada(e.target.checked)}
            disabled={disabled || loading}
          />
          Usar como inicio de la ruta
        </label>

        <button
          type="submit"
          disabled={disabled || loading}
          className="w-full rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-md transition hover:bg-emerald-800 disabled:opacity-50"
        >
          Agregar panorama
        </button>
      </form>
    </section>
  );
}