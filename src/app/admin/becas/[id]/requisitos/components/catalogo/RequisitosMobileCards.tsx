'use client';
import { Requisito } from './RequisitosCatalogo';

function bool(v?: boolean) {
  return v ? '✅' : '—';
}

export default function RequisitosMobileCards({
  rows,
  onAttach,
  onEdit,
}: {
  rows: Requisito[];
  onAttach: (r: Requisito) => void;
  onEdit: (r: Requisito) => void;
}) {
  return (
    <div className="md:hidden space-y-4">
      {rows.map((r) => {
        const esEtapa = r.tipo_requisito === 'ETAPA';

        return (
          <div key={r.ID_paso} className="table-wrapper p-4 rounded-2xl">
            <div className="flex justify-between mb-2">
              <strong>{r.nombre}</strong>
              <span className="text-xs opacity-70">
                {esEtapa ? '🧩 ETAPA' : '📄 DOCUMENTO'}
              </span>
            </div>

            <div className="text-sm space-y-1 mb-3">
              {esEtapa ? (
                <>
                  <div>Nota: {bool(r.requiere_nota)}</div>
                  <div>Fecha/Descripción: {bool(r.requiere_fecha_descripcion)}</div>
                  <div>Ruta 360°: {bool(r.requiere_ruta_360)}</div>
                  <div>Otro: {bool(r.requiere_otro)}</div>
                  <div>Encargados: {r.encargados?.length ?? 0}</div>
                </>
              ) : (
                <>
                  <div>🏢 Oficina: {r.oficina?.nombre ? '✅' : '—'}</div>
                  <div>📄 PDF: {r.archivo_ejemplo_url ? '✅' : '—'}</div>
                  <div>🔗 URL: {r.url_externa ? '✅' : '—'}</div>
                  <div>🏛 Kardex: {r.requiere_legalizacion ? '✅' : '—'}</div>
                </>
              )}
            </div>

            <div className="acciones">
              <button className="btn-action btn-requisitos" onClick={() => onAttach(r)}>
                ➕ Añadir
              </button>
              <button className="btn-action btn-edit" onClick={() => onEdit(r)}>
                ✏️ Editar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}