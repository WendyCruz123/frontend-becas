'use client';

import { useEffect, useState } from 'react';
import type { Postulacion } from '../types';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

type Props = {
  open: boolean;
  row: Postulacion | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function EditPostulacionModal({
  open,
  row,
  onClose,
  onSaved,
}: Props) {
  const [gestion, setGestion] = useState('');
  const [estado, setEstado] = useState('');
  const [estadoObservacion, setEstadoObservacion] = useState('');
  const [observacion, setObservacion] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (row) {
      setGestion(row.gestion ?? '');
      setEstado(row.estado ?? '');
      setEstadoObservacion(row.estado_observacion ?? '');
      setObservacion(row.observacion ?? '');
    }
  }, [row]);

  if (!open || !row) return null;

    async function handleSave() {
    if (!row) return;

    const id = row.id;

    try {
        setSaving(true);

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

        const res = await fetchWithAuth(
        `${BACKEND}/postulaciones/admin/${id}`,
        {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            gestion,
            estado,
            estado_observacion: estadoObservacion,
            observacion,
            }),
        },
        );

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'No se pudo actualizar la postulación');
      }

      onSaved();
      onClose();
    } catch (error: any) {
      alert(error.message || 'Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white text-gray-900 w-full max-w-lg rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold mb-1">Editar postulación</h2>

        <p className="text-sm text-gray-500 mb-5">
          {row.nombre} {row.apellido_paterno} {row.apellido_materno} - CI {row.ci}
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Gestión</label>
            <input
              value={gestion}
              onChange={(e) => setGestion(e.target.value)}
              className="w-full mt-1 border rounded-xl px-3 py-2"
              placeholder="Ej: 2026-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full mt-1 border rounded-xl px-3 py-2"
            >
              <option value="EN_PROCESO">EN_PROCESO</option>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="OBSERVADO">OBSERVADO</option>
              <option value="APROBADO">APROBADO</option>
              <option value="REPROBADO">REPROBADO</option>
              <option value="ABANDONADO">ABANDONADO</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Estado observación</label>
            <select
              value={estadoObservacion}
              onChange={(e) => setEstadoObservacion(e.target.value)}
              className="w-full mt-1 border rounded-xl px-3 py-2"
            >
              <option value="sin observacion">sin observacion</option>
              <option value="OBSERVADO">OBSERVADO</option>
              <option value="NO OBSERVADO">NO OBSERVADO</option>
              <option value="archivado">archivado</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Observación</label>
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              className="w-full mt-1 border rounded-xl px-3 py-2 min-h-24"
              placeholder="Detalle de observación..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border"
            disabled={saving}
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}