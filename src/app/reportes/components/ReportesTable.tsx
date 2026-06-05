
import type { Postulacion } from '../types';
import ReportesMobileCards from './ReportesMobileCards';

type Props = {
  rows: Postulacion[];
  loading: boolean;
  onEdit?: (row: Postulacion) => void;
  onDetail?: (row: Postulacion) => void;
};

const HEADERS = [
  'Nombre completo',
  'CI',
  'Beca',
  'Tipo',
  'Inicio beca',
  'Fin beca',
  'Fecha postulación',
  'Estado',
  'Observación',
  'Acciones',
];

export function ReportesTable({ rows, loading, onEdit, onDetail }: Props) {
  return (
    <>
      {/* MÓVIL */}
      <ReportesMobileCards rows={rows} loading={loading} />

      {/* DESKTOP */}
      <div className="table-wrapper hidden md:block">
        <table>
          <thead>
            <tr>
              {HEADERS.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10}>Cargando...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={10}>No se encontraron resultados.</td>
              </tr>
            ) : (
              rows.map((row) => (
              <tr key={row.id}>
                <td>
                  {`${row.nombre} ${row.apellido_paterno} ${row.apellido_materno}`}
                </td>
                <td>{row.ci}</td>
                <td>{row.beca_nombre}</td>
                <td>{row.beca_tipo}</td>
                <td>{new Date(row.beca_fecha_inicio).toLocaleDateString('es-BO')}</td>
                <td>
                  {row.beca_fecha_fin
                    ? new Date(row.beca_fecha_fin).toLocaleDateString('es-BO')
                    : 'Sin fecha'}
                </td>
                <td>{new Date(row.fecha).toLocaleDateString('es-BO')}</td>
                <td>{row.estado}</td>
                <td>{row.estado_observacion}</td>
                <td>
                  <div className="acciones">
                  <button className="btn-action btn-edit" onClick={() => onEdit?.(row)}>
                    ✏️ Editar
                  </button>
                  <button
                    className="btn-action btn-view"
                    onClick={() => onDetail?.(row)}
                  >
                    👁 Ver detalle
                  </button>
                  </div>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}