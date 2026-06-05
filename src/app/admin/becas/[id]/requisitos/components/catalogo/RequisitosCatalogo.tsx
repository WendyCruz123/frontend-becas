'use client';

import '@/app/cuenta/estilos/academicos.css';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import AttachRequisitoModal from '../AttachRequisitoModal';
import RequisitoFormModal from '../RequisitoFormModal';
import '@/app/tablas.css';
import RequisitosTable from './RequisitosTable';
import RequisitosMobileCards from './RequisitosMobileCards';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export type Requisito = {
  ID_paso: number;
  nombre: string;
  descripcion?: string | null;
  archivo_ejemplo_url?: string | null;
  url_externa?: string | null;
  requiere_legalizacion?: boolean;
  dias_estimados_legalizacion?: number | null;
  tipo_requisito?: 'DOCUMENTO' | 'ETAPA';
  requiere_nota?: boolean;
  requiere_fecha_descripcion?: boolean;
  requiere_ruta_360?: boolean;
  requiere_otro?: boolean;

  oficinaId?: number | null;
  oficina?: { ID_oficina: number; nombre: string } | null;

  encargados?: any[];
  entrega_final_usuarioId?: number | null;
  entrega_final_usuario?: any;
  legalizacion_flujo?: any[];
};

type FormState =
  | null
  | { mode: 'create' }
  | { mode: 'edit'; row: Requisito };

export default function RequisitosCatalogo({
  becaId,
  becaNombre,
  onAttached,
}: {
  becaId: number;
  becaNombre: string;
  onAttached: () => void;
}) {
  const [rows, setRows] = useState<Requisito[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [attach, setAttach] = useState<Requisito | null>(null);
  const [showForm, setShowForm] = useState<FormState>(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const url =
        `${BACKEND}/requisitos` +
        (search.trim()
          ? `?search=${encodeURIComponent(search.trim())}`
          : '');

      const r = await fetchWithAuth(url);
      const data = await r.json();
      setRows(Array.isArray(data) ? data : []);
    }catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Error inesperado';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (

    <section className="modal-academicos">
       {/* ===== TÍTULO ===== */}
      <h2 className="dashboard-title">Catálogo de requisitos</h2>

      {/* Buscador + botones */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 14,
          flexWrap: 'wrap',
        }}
      >

        <input
          className="input-busqueda"
          placeholder="Buscar requisito..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
        />

        <button className="btn-outline" onClick={load}>
          Buscar
        </button>

        <button
          className="btn-primary"
          onClick={() => setShowForm({ mode: 'create' })}
        >
          ➕ Nuevo requisito
        </button>
      </div>
<RequisitosTable
  rows={rows}
  onAttach={setAttach}
  onEdit={(r) => setShowForm({ mode: 'edit', row: r })}
/>

<RequisitosMobileCards
  rows={rows}
  onAttach={setAttach}
  onEdit={(r) => setShowForm({ mode: 'edit', row: r })}
/>
      {error && <p style={{ marginTop: 12, color: '#b00020' }}>{error}</p>}

      {/* Modal crear/editar */}
      {showForm?.mode === 'create' && (
        <RequisitoFormModal
          mode="create"
          onClose={() => setShowForm(null)}
          onSaved={() => {
            setShowForm(null);
            load();
          }}
        />
      )}

      {showForm?.mode === 'edit' && (
        <RequisitoFormModal
          mode="edit"
          row={showForm.row}
          onClose={() => setShowForm(null)}
          onSaved={() => {
            setShowForm(null);
            load();
          }}
        />
      )}

      {/* Modal añadir a beca */}
      {attach && (
        <AttachRequisitoModal
          becaId={becaId}
          becaNombre={becaNombre} // ← aquí pasas el nombre real
          requisito={attach}
          onClose={() => setAttach(null)}
          onAttached={() => {
            setAttach(null);
            onAttached();
          }}
        />
      )}

    </section>
  );
}
 
