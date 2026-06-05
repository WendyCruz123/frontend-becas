'use client';

import '@/app/modal.css';
import { useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export default function ModalCambiarPassword({
  onClose,
}: {
  onClose: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleChange() {
    if (newPassword !== confirm) {
      setMsg('⚠️ Las contraseñas nuevas no coinciden.');
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const res = await fetchWithAuth(`${BACKEND}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg('✅ Contraseña actualizada correctamente.');
      } else {
        setMsg(`⚠️ ${data.message || 'Error al cambiar contraseña'}`);
      }
    } catch {
      setMsg('❌ Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container relative">

        {/* Cerrar */}
        <span className="modal-close" onClick={onClose}>
          ✕
        </span>

        {/* Header */}
        <div className="modal-header">
          Cambiar contraseña
        </div>

        {/* Body */}
        <div className="modal-body space-y-3">

          <input
            type="password"
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/60 backdrop-blur-md
                       shadow-inner outline-none text-sm"

          />

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/60 backdrop-blur-md
                       shadow-inner outline-none text-sm"
          />

          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/60 backdrop-blur-md
                       shadow-inner outline-none text-sm"
          />

          {msg && (
            <p className="text-sm mt-2 text-slate-700">
              {msg}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="modal-btn secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            className="modal-btn primary"
            onClick={handleChange}
            disabled={loading}
          >
            {loading ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
