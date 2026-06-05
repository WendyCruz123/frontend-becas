'use client';

import { useEffect, useState } from 'react';
import { useOficinas } from './hooks/useOficinas';
import { Oficina } from './types';
import { OficinasTable } from './components/OficinasTable';
import { OficinasToolbar } from './components/OficinasToolbar';
import { OficinasPagination } from './components/OficinasPagination';
import { OficinaFormModal } from './components/OficinaFormModal';
import OficinasMobileCards from './components/OficinasMobileCards';

export default function OficinasPage() {
  const { rows, count, loading, error, load } = useOficinas();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [modal, setModal] =
    useState<null | { mode: 'create' | 'edit'; row?: Oficina }>(null);

  // Debounce de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(0);
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Carga de datos
  useEffect(() => {
    load({ limit, offset, search: debouncedSearch });
  }, [limit, offset, debouncedSearch]);

  const handleSubmitSearch = () => {
    setOffset(0);
    setDebouncedSearch(search.trim());
    load({ limit, offset: 0, search: search.trim() });
  };

  const handleRefresh = () => {
    load({ limit, offset, search: debouncedSearch });
  };

  return (
    <div className="p-6">
      <h2 className="dashboard-title">ADMINISTRAR OFICINAS/AULAS</h2>

      <OficinasToolbar
        search={search}
        onSearch={setSearch}
        onSubmit={handleSubmitSearch}
        onCreate={() => setModal({ mode: 'create' })}
      />

      <div className="hidden md:block">
        <OficinasTable
          rows={rows}
          loading={loading}
          onEdit={(row) => setModal({ mode: 'edit', row })}
          onRefresh={handleRefresh}
        />
      </div>

      <div className="md:hidden">
        <OficinasMobileCards
          rows={rows}
          loading={loading}
          onEdit={(row) => setModal({ mode: 'edit', row })}
          onRefresh={handleRefresh}
        />
      </div>

      <OficinasPagination
        count={count}
        limit={limit}
        offset={offset}
        onLimitChange={(value) => {
          setLimit(value);
          setOffset(0);
        }}
        onOffsetChange={setOffset}
      />

      {error && <p style={{ color: '#b00020' }}>{error}</p>}

      {modal && (
        <OficinaFormModal
          {...modal}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            handleRefresh();
          }}
        />
      )}
    </div>
  );
}