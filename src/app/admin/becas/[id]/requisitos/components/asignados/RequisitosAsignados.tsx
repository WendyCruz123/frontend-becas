'use client';

import '@/app/cuenta/estilos/datos.css';
import { useEffect, useState } from 'react';
import { useRequisitosBeca } from '../../hooks/useRequisitosBeca';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

import RequisitosAsignadosTable from './RequisitosAsignadosTable';
import RequisitosAsignadosMobileCards from './RequisitosAsignadosMobileCards';
import VerRequisitoModal from '../VerRequisitoModal';

import '@/app/tablas.css';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

type Requisito = {
  ID_paso: number;
  nombre: string;
  descripcion?: string | null;
  archivo_ejemplo_url?: string | null;
  url_externa?: string | null;
  requiere_legalizacion?: boolean;
  tipo_requisito?: 'DOCUMENTO' | 'ETAPA';
  requiere_nota?: boolean;
  requiere_fecha_descripcion?: boolean;
  requiere_ruta_360?: boolean;
  requiere_otro?: boolean;
  encargados?: any[];
  oficinaId?: number | null;
  oficina?: { ID_oficina: number; nombre: string } | null;
  entrega_final_usuarioId?: number | null;
  entrega_final_usuario?: any;
  legalizacion_flujo?: any[];
};

export type PasoBeca = {
  ID_pasosBeca: number;
  orden: number;
  requisito: Requisito;
};

export default function RequisitosAsignados({
  becaId,
  refreshKey,
}: {
  becaId: number;
  refreshKey: number;
}) {
  const {
    pasos,
    loading,
    error,
    ordenEdits,
    setOrdenEdits,
    reload,
  } = useRequisitosBeca(becaId);

  const [verRequisito, setVerRequisito] = useState<Requisito | null>(null);

useEffect(() => {
  reload();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [refreshKey]);

async function saveOrden(p: PasoBeca) {
  const orden = Number.isFinite(p.orden)
    ? p.orden
    : ordenEdits[p.ID_pasosBeca];

  if (!Number.isFinite(orden)) return;

  await fetchWithAuth(`${BACKEND}/pasos-beca/${p.ID_pasosBeca}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orden }),
  });

  reload();
}

async function saveOrdenMasivo(nuevos: PasoBeca[]) {
  await Promise.all(
    nuevos.map((p) =>
      fetchWithAuth(`${BACKEND}/pasos-beca/${p.ID_pasosBeca}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orden: p.orden }),
      })
    )
  );

  reload();
}

  async function detach(p: PasoBeca) {
    if (!confirm(`Quitar "${p.requisito.nombre}"?`)) return;

    await fetchWithAuth(`${BACKEND}/pasos-beca/${p.ID_pasosBeca}`, {
      method: 'DELETE',
    });

    reload();
  }

  if (loading) return <div>Cargando…</div>;
  if (error) return <p>{error}</p>;

  return (
    <section
    >
      <h2 className="dashboard-title">Requisitos asignados</h2>

      {pasos.length === 0 ? (
        <p>No hay requisitos asignados a esta beca</p>
      ) : (
        <>
          <RequisitosAsignadosTable
            pasos={pasos}
            ordenEdits={ordenEdits}
            setOrdenEdits={setOrdenEdits}
            onSaveOrden={saveOrden}
            onSaveOrdenMasivo={saveOrdenMasivo}
            onVer={setVerRequisito}
            onQuitar={detach}
          />

          <RequisitosAsignadosMobileCards
            pasos={pasos}
            onVer={setVerRequisito}
            onQuitar={detach}
          />
        </>
      )}

      {verRequisito && (
        <VerRequisitoModal
          requisito={verRequisito}
          onClose={() => setVerRequisito(null)}
        />
      )}
    </section>
  );
}