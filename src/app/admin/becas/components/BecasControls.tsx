'use client';

export default function BecasControls({
  search,
  setSearch,
  onSearch,
  onCreate,
}: {
  search: string;
  setSearch: (v: string) => void;
  onSearch: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="becas-controls flex flex-col sm:flex-row gap-3 sm:items-center">
      <input
        className="input-busqueda w-full"
        placeholder="Buscar por nombre o tipo"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />
      <div className="flex flex-col gap-3 md:flex-row md:gap-3">
        <button className="btn-outline" onClick={onSearch}>
          Buscar
        </button>

        <button className="btn-primary" onClick={onCreate}>
          + Nueva beca
        </button>
      </div>
    </div>
  );
}
