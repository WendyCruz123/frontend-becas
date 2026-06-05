'use client';

type Props = {
  search: string;
  onSearch: (v: string) => void;
  onSubmit: () => void;
  onCreate: () => void;
};

export function OficinasToolbar({
  search,
  onSearch,
  onSubmit,
  onCreate,
}: Props) {
  return (
    <div
      className="
        becas-controls
        flex flex-col gap-3
        md:flex-row md:items-center md:gap-4
      "
    >
      {/* INPUT */}
      <input
        className="input-busqueda w-full"
        placeholder="Buscar por nombre o descripción"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
      />

      {/* BOTONES */}
      <div className="flex flex-col gap-3 md:flex-row md:gap-3">
        <button className="btn-outline " onClick={onSubmit}>
          Buscar
        </button>

        <button className="btn-primary " onClick={onCreate}>
          + Nueva oficina
        </button>
      </div>
    </div>
  );
}
