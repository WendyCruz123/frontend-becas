'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/tablas.css';

import { useBecas, Beca } from './hooks/useBecas';
import BecaFormModal from './components/BecaFormModal';
import BecasControls from './components/BecasControls';
import BecasTable from './components/BecasTable';
import BecasMobileCards from './components/BecasMobileCards';

export default function BecasPage() {
  const router = useRouter();
  const becas = useBecas();

  const [showForm, setShowForm] = useState<null | {
    mode: 'create' | 'edit';
    beca?: Beca;
  }>(null);

  return (
    <div className="p-6">
      <h2 className="dashboard-title">ADMINISTRAR BECAS</h2>

      {/*BecasControls, BecasTable, etc.*/}
      {showForm && (
        <BecaFormModal
          mode={showForm.mode}
          beca={showForm.beca}
          onClose={() => setShowForm(null)}
          onSaved={() => {
            setShowForm(null);
            becas.load();
          }}
        />
      )}

      <BecasControls
  search={becas.search}
  setSearch={becas.setSearch}
  onSearch={() => {
    becas.setOffset(0);
    becas.load();
  }}
  onCreate={() => setShowForm({ mode: 'create' })}
/>

<BecasTable
  rows={becas.rows}
  offset={becas.offset}
  loading={becas.loading}
  onEdit={(b) => setShowForm({ mode: 'edit', beca: b })}
  onToggleEstado={becas.toggleEstado}
  onDelete={becas.remove}
  onRequisitos={(b) =>
    router.push(`/admin/becas/${b.ID_beca}/requisitos`)
  }
/>

<BecasMobileCards
  rows={becas.rows}
  offset={becas.offset}
  loading={becas.loading}
  onEdit={(b) => setShowForm({ mode: 'edit', beca: b })}
  onToggleEstado={becas.toggleEstado}
  onDelete={becas.remove}
  onRequisitos={(b) =>
    router.push(`/admin/becas/${b.ID_beca}/requisitos`)
  }
/>


    </div>
  );
}
