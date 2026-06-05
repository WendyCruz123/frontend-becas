'use client';

import { useState } from 'react';
import Scene3D from '@/components/Scene3D';
import Header from '@/components/Header';
import OfficesPanel from '@/components/OfficesPanel';

import ConsultarSeguimientoModal from '@/components/ConsultarSeguimientoModal';

export default function Home() {
  type OficinaPublica = {
  ID_oficina: number;
  nombre: string;
  descripcion?: string | null;
  horario_atencion?: string | null;
  panorama_route_slug?: string | null;
};

const [selectedOffice, setSelectedOffice] = useState<OficinaPublica | null>(null);
const [openSeguimiento, setOpenSeguimiento] = useState(false);
  return (
    <main style={{ height: '100vh', width: '100vw', position: 'relative', background: '#000' }}>
      <Header />
      <button
        type="button"
        onClick={() => setOpenSeguimiento(true)}
        style={{
          position: 'fixed',
          right: 28,
          bottom: 28,
          zIndex: 80,
          border: '1px solid rgba(34,211,238,.35)',
          background: 'rgba(15,23,42,.88)',
          color: '#fff',
          padding: '14px 20px',
          borderRadius: 18,
          fontWeight: 800,
          boxShadow: '0 18px 45px rgba(0,0,0,.35)',
        }}
      >
        Consultar trámite
      </button>

      <ConsultarSeguimientoModal
        open={openSeguimiento}
        onClose={() => setOpenSeguimiento(false)}
      />
<OfficesPanel onSelect={setSelectedOffice} selectedOffice={selectedOffice} />
<Scene3D selectedOffice={selectedOffice} />
    </main>
  );
}