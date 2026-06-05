'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import RequisitosAsignados from './components/asignados/RequisitosAsignados';
import RequisitosCatalogo from './components/catalogo/RequisitosCatalogo';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export default function AdminRequisitosPage() {
  const params = useParams<{ id: string }>();
  const becaId = Number(params.id);

  const [becaNombre, setBecaNombre] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function loadBeca() {
      try {
        const r = await fetchWithAuth(`${BACKEND}/becas/${becaId}`);
        const data = await r.json();
        setBecaNombre(data.nombre);
      } catch {
        setBecaNombre('');
      }
    }

    if (becaId) loadBeca();
  }, [becaId]);

  function refreshAsignados() {
    setRefreshKey((k) => k + 1);
  }
  return (
    <div
      className="
        grid
        grid-cols-1              /* 📱 Mobile */
        lg:grid-cols-[1.1fr_1fr] /* 💻 Desktop */
        gap-6
        pt-10                   /* espacio desde el header */
      "
    >
      <RequisitosAsignados
        becaId={becaId}
        refreshKey={refreshKey}
      />

      <RequisitosCatalogo
        becaId={becaId}
        becaNombre={becaNombre}
        onAttached={refreshAsignados}
      />
    </div>
  );
}
