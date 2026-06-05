'use client';

export default function PersonasToolbar({
  search,
  setSearch,
  onCreate,
}: {
  search: string;
  setSearch: (v: string) => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-4">
      <input
        className="input-busqueda w-full"
        placeholder="Buscar por nombre o CI..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button className="btn-primary" onClick={onCreate}>
        ➕ Nueva persona
      </button>
    </div>
  );
}
