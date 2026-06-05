'use client';

type Props = {
  count: number;
  limit: number;
  offset: number;
  onLimitChange: (v: number) => void;
  onOffsetChange: (v: number) => void;
};

export function OficinasPagination({
  count,
  limit,
  offset,
  onLimitChange,
  onOffsetChange,
}: Props) {
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.max(1, Math.ceil(count / limit));

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12 }}>
      <div>
        Mostrar{' '}
        <select
          className="select"
          value={limit}
          onChange={(e) => {
            onLimitChange(Number(e.target.value));
            onOffsetChange(0);
          }}
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>{' '}
        de {count}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="btn-ghost"
          disabled={page <= 1}
          onClick={() => onOffsetChange(offset - limit)}
        >
          « Anterior
        </button>

        <span>
          Página {page} de {pages}
        </span>

        <button
          className="btn-ghost"
          disabled={page >= pages}
          onClick={() => onOffsetChange(offset + limit)}
        >
          Siguiente »
        </button>
      </div>
    </div>
  );
}
