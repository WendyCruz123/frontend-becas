'use client';

type Props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export function ReportesPagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: Props) {
  const currentPage = page + 1;
  const pages = Math.max(1, totalPages || 1);

  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= pages;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        width: '100%',
      }}
    >
      <div>
        Página {currentPage} de {pages}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          className="btn-ghost"
          disabled={isPrevDisabled}
          onClick={onPrev}
        >
          « Anterior
        </button>

        <button
          className="btn-ghost"
          disabled={isNextDisabled}
          onClick={onNext}
        >
          Siguiente »
        </button>
      </div>
    </div>
  );
}