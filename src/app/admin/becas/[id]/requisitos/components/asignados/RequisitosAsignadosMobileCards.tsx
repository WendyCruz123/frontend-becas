'use client';

function BadgeBool({ active, label }: { active?: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-black ${
        active
          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
          : 'bg-slate-100 text-slate-400 border border-slate-200'
      }`}
    >
      {active ? '✓' : '—'} {label}
    </span>
  );
}

export default function RequisitosAsignadosMobileCards({
  pasos,
  onVer,
  onQuitar,
}: {
  pasos: any[];
  onVer: (r: any) => void;
  onQuitar: (p: any) => void;
}) {
  return (
    <div className="md:hidden space-y-4">
      {pasos.map((p) => {
        const r = p.requisito;
        const esEtapa = r.tipo_requisito === 'ETAPA';

        return (
          <article
            key={p.ID_pasosBeca}
            className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur-xl"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <span className="mb-2 inline-flex rounded-full bg-cyan-100 px-3 py-1 text-[11px] font-black text-cyan-800">
                  Orden {p.orden ?? '—'}
                </span>

                <h3 className="text-[15px] font-black uppercase leading-tight text-slate-800">
                  {r.nombre}
                </h3>
              </div>

              <span
                className={`shrink-0 rounded-2xl px-3 py-2 text-[11px] font-black ${
                  esEtapa
                    ? 'bg-violet-100 text-violet-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {esEtapa ? '🧩 ETAPA' : '📄 DOC'}
              </span>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {esEtapa ? (
                <>
                  <BadgeBool active={r.requiere_nota} label="Nota" />
                  <BadgeBool active={r.requiere_fecha_descripcion} label="Fecha/Descripción" />
                  <BadgeBool active={r.requiere_ruta_360} label="Ruta 360°" />
                  <BadgeBool active={r.requiere_otro} label="Otro" />
                  <span className="rounded-full border border-cyan-300 bg-cyan-50 px-3 py-1 text-[11px] font-black text-cyan-800">
                    Encargados: {r.encargados?.length ?? 0}
                  </span>
                </>
              ) : (
                <>
                  <BadgeBool active={r.requiere_legalizacion} label="Legalización" />
                  <BadgeBool active={!!r.archivo_ejemplo_url} label="PDF" />
                  <BadgeBool active={!!r.url_externa} label="URL" />
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onVer(r)}
                className="rounded-2xl bg-cyan-600 px-4 py-2 text-sm font-black text-white shadow-lg shadow-cyan-600/25 transition hover:bg-cyan-700"
              >
                👁 Ver
              </button>

              <button
                onClick={() => onQuitar(p)}
                className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-black text-white shadow-lg shadow-rose-500/25 transition hover:bg-rose-600"
              >
                🗑 Quitar
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}