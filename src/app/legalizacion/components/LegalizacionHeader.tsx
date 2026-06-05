'use client';

export default function LegalizacionHeader({
  loading,
  onRefresh,
  msg,
}: {
  loading: boolean;
  onRefresh: () => void;
  msg?: string;
}) {
  return (
    <section className="modal-academicos rounded-[28px] p-6">
      <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-700">
        Legalización presencial
      </span>

      <h1 className="dashboard-title mt-2">
        Dashboard de legalización de requisitos
      </h1>

      <p className="text-sm text-slate-600">
        Gestiona recepción física, revisión, legalización, rechazo y entrega
        final de documentos.
      </p>

      <button className="btn-outline mt-4" onClick={onRefresh} disabled={loading}>
        {loading ? 'Cargando…' : 'Actualizar'}
      </button>

      {msg && <p className="error-msg mt-3">{msg}</p>}
    </section>
  );
}