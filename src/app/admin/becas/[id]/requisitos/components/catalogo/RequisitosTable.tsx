'use client';
import { Requisito } from './RequisitosCatalogo';

function bool(v?: boolean) {
  return v ? '✅' : '—';
}

export default function RequisitosTable({
  rows,
  onAttach,
  onEdit,
}: {
  rows: Requisito[];
  onAttach: (r: Requisito) => void;
  onEdit: (r: Requisito) => void;
}) {
  return (
    <div className="table-wrapper hidden md:block">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Nombre</th>
            <th>Configuración</th>
            <th>Encargados</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => {
            const esEtapa = r.tipo_requisito === 'ETAPA';

            return (
              <tr key={r.ID_paso}>
                <td>{r.ID_paso}</td>

                <td>
                  {esEtapa ? '🧩 ETAPA' : '📄 DOCUMENTO'}
                </td>

                <td>
                  <strong>{r.nombre}</strong>
                </td>

                <td>
                  {esEtapa ? (
                    <div className="text-sm">
                      <div>Nota: {bool(r.requiere_nota)}</div>
                      <div>Fecha/Descripción: {bool(r.requiere_fecha_descripcion)}</div>
                      <div>Ruta 360°: {bool(r.requiere_ruta_360)}</div>
                      <div>Otro: {bool(r.requiere_otro)}</div>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <div>Oficina: {r.oficina?.nombre ? '✅' : '—'}</div>
                      <div>PDF: {r.archivo_ejemplo_url ? '✅' : '—'}</div>
                      <div>URL: {r.url_externa ? '✅' : '—'}</div>
                      <div>Legalización presencial:{' '}{r.requiere_legalizacion ? '✅' : '—'}</div>
                    </div>
                  )}
                </td>

                <td>
                  {esEtapa
                    ? r.encargados?.length
                      ? `${r.encargados.length} asignado(s)`
                      : 'Sin encargado'
                    : '—'}
                </td>

                <td>
                  <div className="acciones">
                    <button
                      className="btn-action btn-requisitos"
                      onClick={() => onAttach(r)}
                    >
                      ➕ Añadir
                    </button>
                    <button
                      className="btn-action btn-edit"
                      onClick={() => onEdit(r)}
                    >
                      ✏️ Editar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}