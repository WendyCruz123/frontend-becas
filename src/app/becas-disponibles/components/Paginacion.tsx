export function Paginacion({
  page,
  pages,
  onPrev,
  onNext,
}: {
  page: number;
  pages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <button
        className="
          rounded-xl border border-slate-200 bg-white px-4 py-2
          text-sm font-bold text-slate-700 shadow-sm transition
          hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40
        "
        disabled={page <= 1}
        onClick={onPrev}
      >
        « Anterior
      </button>

      <span className="rounded-xl bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-800">
        Página {page} de {pages}
      </span>

      <button
        className="
          rounded-xl border border-slate-200 bg-white px-4 py-2
          text-sm font-bold text-slate-700 shadow-sm transition
          hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40
        "
        disabled={page >= pages}
        onClick={onNext}
      >
        Siguiente »
      </button>
    </div>
  );
}