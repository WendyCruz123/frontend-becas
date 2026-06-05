'use client';

import { useRef, useState } from 'react';
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

export default function PanoramasStrip({
  panoramas,
  currentPano,
  loading,
  disabled,
  onSelect,
  onCreate,
  onDelete,
}: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | null) {
    if (!file || disabled || loading || uploading) return;

    const name = prompt('Nombre del panorama:')?.trim();
    if (!name) return;

    try {
      setUploading(true);

      const uploadedUrl = await apiUpload360Image(file);

      onCreate({
        name,
        fileUrl: uploadedUrl,
        es_portada: panoramas.length === 0,
      });
    } catch {
      alert('No se pudo subir la imagen.');
    } finally {
      setUploading(false);

      if (fileRef.current) {
        fileRef.current.value = '';
      }
    }
  }

  return (
    <section className="mt-5 min-w-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-wide text-[#10233f]">
          Panoramas de la ruta ({panoramas.length})
        </h3>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      <div className="w-full min-w-0 overflow-hidden">
        <div className="flex w-full max-w-full gap-3 overflow-x-auto overflow-y-hidden pb-3">
          {/* BOTÓN AGREGAR */}
          <button
            type="button"
            disabled={disabled || loading || uploading}
            onClick={() => fileRef.current?.click()}
            className="flex h-24 w-[130px] shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm font-black text-[#10233f] transition hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50"
          >
            <span className="mb-1 flex h-8 w-8 items-center justify-center rounded-full border border-blue-500 text-xl text-blue-600">
              +
            </span>
            {uploading ? 'Subiendo...' : 'Agregar'}
          </button>

          {panoramas.map((pano, index) => {
            const active = currentPano?.id === pano.id;

            return (
              <div
                key={pano.id}
                className={`group relative h-24 w-[130px] shrink-0 overflow-hidden rounded-2xl border transition ${
                  active
                    ? 'border-emerald-600 ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:border-emerald-400'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(pano)}
                  className="h-full w-full"
                >
                  <img
                    src={pano.fileUrl}
                    alt={pano.name}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-left">
                    <p className="truncate text-xs font-black text-white">
                      {index + 1}. {pano.name}
                    </p>

                    {pano.es_portada && (
                      <span className="mt-1 inline-block rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        Inicio
                      </span>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(pano.id)}
                  className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-black text-red-600 opacity-0 shadow transition hover:bg-red-600 hover:text-white group-hover:opacity-100"
                >
                  🗑
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}