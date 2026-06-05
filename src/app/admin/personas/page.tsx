'use client';

import { useEffect, useState } from 'react';
import { usePersonas } from './hooks/usePersonas';
import { PersonaListItem } from './types';

import PersonasToolbar from './components/PersonasToolbar';
import PersonasTable from './components/PersonasTable';
import PersonasMobileCards from './components/PersonasMobileCards';
import PersonaFormModal from './components/PersonaFormModal';
import RolAsignarModal from './components/RolAsignarModal';

export default function PersonasPage() {
  // 🔹 Hook de personas (API)
  const {
    data,
    loading,
    error,
    setSearch: setSearchApi,
    reload,
  } = usePersonas();

  // 🔹 Estado local para el input (IMPORTANTE)
  const [search, setSearch] = useState('');

  // 🔹 Estados UI
  const [selected, setSelected] = useState<PersonaListItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showRoles, setShowRoles] = useState<PersonaListItem | null>(null);

  // 🔹 Sincroniza búsqueda local → hook
  useEffect(() => {
    setSearchApi(search);
  }, [search, setSearchApi]);

  return (
    <div className="p-6">
      <h2 className="dashboard-title">Gestión de personas</h2>

      {/* TOOLBAR */}
      <PersonasToolbar
        search={search}
        setSearch={setSearch}
        onCreate={() => {
          setSelected(null);
          setShowForm(true);
        }}
      />

      {/* LISTADO */}
      {!loading && (
        <>
          <PersonasTable
            rows={data}
            onEdit={(p) => {
              setSelected(p);
              setShowForm(true);
            }}
            onRoles={(p) => setShowRoles(p)}
            onDelete={() => {}}
          />

          <PersonasMobileCards
            rows={data}
            onEdit={(p) => {
              setSelected(p);
              setShowForm(true);
            }}
            onRoles={(p) => setShowRoles(p)}
            onDelete={() => {}}
          />
        </>
      )}

      {/* MODAL FORM */}
      {showForm && (
        <PersonaFormModal
          persona={selected}
          onClose={() => setShowForm(false)}
          onSaved={reload}
        />
      )}

      {/* MODAL ROLES */}
      {showRoles && showRoles.usuario && (
        <RolAsignarModal
          usuarioId={showRoles.usuario.ID_usuario}
          nombrePersona={showRoles.nombre}
          onClose={() => setShowRoles(null)}
        />
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-600 mt-4">
          {error}
        </p>
      )}
    </div>
  );
}
