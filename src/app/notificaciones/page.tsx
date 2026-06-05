'use client';

import { useEffect, useState } from 'react';
import TopBarShell from '@/components/TopBarShell';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

type Notificacion = {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: string;
  leido: boolean;
  url?: string | null;
  createdAt: string;
};

export default function NotificacionesPage() {
  const [rows, setRows] = useState<Notificacion[]>([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await fetchWithAuth(`${BACKEND}/notificaciones-sistema/mias`);
    const data = await r.json();

    setRows(data.rows || []);
    setNoLeidas(data.noLeidas || 0);
    setLoading(false);
  }

  async function marcarTodas() {
    await fetchWithAuth(`${BACKEND}/notificaciones-sistema/leidas-todas`, {
      method: 'PATCH',
    });
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <TopBarShell>
      <main className="px-5 pb-6 pt-0 -mt-40 md:mt-0 md:p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="dashboard-title">Notificaciones</h2>

          {noLeidas > 0 && (
            <button className="btn-outline" onClick={marcarTodas}>
              Marcar todas como leídas
            </button>
          )}
        </div>

        {loading ? (
          <p>Cargando notificaciones...</p>
        ) : rows.length === 0 ? (
          <div className="table-wrapper p-6 rounded-2xl">
            No tienes notificaciones.
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map((n) => (
              <article
                key={n.id}
                className={`
                  rounded-2xl p-4 border shadow-sm
                  ${n.leido ? 'bg-white/50 border-white/50' : 'bg-cyan-50 border-cyan-300'}
                `}
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800">
                      {n.tipo === 'SUCCESS' ? '✅ ' : n.tipo === 'WARNING' ? '⚠️ ' : '🔔 '}
                      {n.titulo}
                    </h3>

                    <p className="text-sm text-slate-600 mt-1">
                      {n.mensaje}
                    </p>

                    <small className="text-slate-400">
                      {new Date(n.createdAt).toLocaleString('es-BO')}
                    </small>
                  </div>

                  {!n.leido && (
                    <span className="text-xs font-bold text-cyan-700">
                      Nuevo
                    </span>
                  )}
                </div>

                {n.url && (
                  <button
                    className="btn-action btn-requisitos mt-3"
                    onClick={() => window.location.href = n.url!}
                  >
                    Ver detalle
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </TopBarShell>
  );
}