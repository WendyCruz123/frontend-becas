'use client';

import { useState } from 'react';
import type { Ruta360 } from '../types';
import { makeSlug } from '../utils/slug';

type Props = {
  rutas: Ruta360[];
  selectedRuta: Ruta360 | null;
  loading: boolean;
  onSelect: (ruta: Ruta360) => void;
  onCreate: (data: { nombre: string; slug: string }) => void;
  onDelete: (id: string) => void;
};

export default function RutasPanel({
  rutas,
  selectedRuta,
  loading,
  onSelect,
  onCreate,
  onDelete,
}: Props) {
  const [nombre, setNombre] = useState('');
  const [slug, setSlug] = useState('');

  function handleNombreChange(value: string) {
    setNombre(value);
    setSlug(makeSlug(value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nombre.trim() || !slug.trim()) {
      alert('Escribe el nombre y el slug de la ruta.');
      return;
    }

    onCreate({
      nombre: nombre.trim(),
      slug: slug.trim(),
    });

    setNombre('');
    setSlug('');
  }

  return (
    <section className="space-y-6">
      {/* CREAR RUTA */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.07)]">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-xl text-emerald-700">
            🧭
          </div>

          <div>
            <h2 className="text-lg font-black text-[#10233f]">
              Crear nueva ruta
            </h2>
            <p className="text-xs text-slate-500">
              Registra un recorrido institucional.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-sm font-bold text-slate-700">
            Nombre de la ruta
          </label>
          <input
            value={nombre}
            onChange={(e) => handleNombreChange(e.target.value)}
            placeholder="Ej: Aula 404"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />

          <label className="block text-sm font-bold text-slate-700">
            Slug identificador
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(makeSlug(e.target.value))}
            placeholder="Ej: aula_404"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-md transition hover:bg-emerald-800 disabled:opacity-50"
          >
            Crear ruta
          </button>
        </form>
      </div>

      {/* RUTAS CREADAS */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.07)]">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-xl text-emerald-700">
            ☰
          </div>

          <div>
            <h2 className="text-lg font-black text-[#10233f]">
              Rutas creadas
            </h2>
            <p className="text-xs text-slate-500">
              Selecciona una ruta para editar.
            </p>
          </div>
        </div>

        <div className="max-h-[430px] space-y-3 overflow-auto pr-1">
          {rutas.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              Todavía no hay rutas creadas.
            </div>
          )}

          {rutas.map((ruta) => {
            const active = selectedRuta?.id === ruta.id;

            return (
              <article
                key={ruta.id}
                className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition ${
                  active
                    ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(ruta)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        active ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    />

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-black text-[#10233f]">
                        {ruta.nombre}
                      </h3>
                      <p className="truncate text-xs text-slate-500">
                        {ruta.slug}
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(ruta.id)}
                  className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-600 hover:text-white"
                >
                  🗑
                </button>
              </article>
            );
          })}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Selecciona una ruta para editar su contenido 360°.
        </div>
      </div>
    </section>
  );
}