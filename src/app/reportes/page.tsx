'use client'

import { useRoles } from '@/components/useRoles'
import { ReportesFilters } from './components/ReportesFilters'
import { ReportesHeader } from './components/ReportesHeader'
import { ReportesPagination } from './components/ReportesPagination'
import { ReportesTable } from './components/ReportesTable'
import { ReportesUnauthorized } from './components/ReportesUnauthorized'
import { useReportes } from './hooks/useReportes'
import Link from 'next/link'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import { generarReportePostulacionesPdf } from './utils/generarReportePostulacionesPdf'
import { useMemo, useState } from 'react';
import type { EstadoReporteFiltro, Postulacion } from './types';
import EditPostulacionModal from './components/EditPostulacionModal';
import { useMe } from '@/lib/useMe';
import DetallePostulacionModal from './components/DetallePostulacionModal';
export default function ReportesPage() {
  const { me } = useMe();
  const roles = useRoles()
  const isAdmin = roles.includes('admin')

const {
  rows,
  loading,
  page,
  year,
  searchEstudiante,
  searchBeca,
  totalPages,
   estadoFiltro,
  modoEstado,
  setEstadoFiltro,
  setModoEstado,
  onChangeYear,
  onChangeSearchEstudiante,
  onChangeSearchBeca,
  goPrevPage,
  goNextPage,
  reload,
} = useReportes(isAdmin)
const [editingRow, setEditingRow] = useState<Postulacion | null>(null);
const [editOpen, setEditOpen] = useState(false);
const [fechaInicio, setFechaInicio] = useState('');
const [fechaFin, setFechaFin] = useState('');

const [detailRow, setDetailRow] = useState<Postulacion | null>(null);
const [detailOpen, setDetailOpen] = useState(false);

const generarReportePDF = async () => {
  try {
    const BACKEND =
      process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

    const crearParamsBase = () => {
      const params = new URLSearchParams();

      params.set('offset', '0');
      params.set('limit', '10000');
      params.set('excludeApproved', 'false');

      if (year) {
        params.set('year', String(year));
      }

      if (searchEstudiante.trim()) {
        params.set('searchEstudiante', searchEstudiante.trim());
      }

      if (searchBeca.trim()) {
        params.set('searchBeca', searchBeca.trim());
      }

      return params;
    };

    // Para la tabla: respeta también el estado seleccionado
    const paramsDetalle = crearParamsBase();

    if (estadoFiltro !== 'TODOS') {
      paramsDetalle.set('estado', estadoFiltro);
    }

    paramsDetalle.set('modoEstado', modoEstado);

    // Para las tortas: NO se filtra por estado,
    // así se puede ver el total real por beca
    const paramsEstadisticas = crearParamsBase();
    paramsEstadisticas.set('modoEstado', 'ACTUAL');

    const [resDetalle, resEstadisticas] = await Promise.all([
      fetchWithAuth(`${BACKEND}/postulaciones/admin?${paramsDetalle.toString()}`),
      fetchWithAuth(`${BACKEND}/postulaciones/admin?${paramsEstadisticas.toString()}`),
    ]);

    const dataDetalle = await resDetalle.json();
    const dataEstadisticas = await resEstadisticas.json();

    if (!resDetalle.ok) {
      alert(dataDetalle.message || 'Error al obtener datos del reporte.');
      return;
    }

    if (!resEstadisticas.ok) {
      alert(dataEstadisticas.message || 'Error al obtener estadísticas del reporte.');
      return;
    }

    const filasDetalle: Postulacion[] = Array.isArray(dataDetalle.rows)
      ? dataDetalle.rows
      : [];

    const filasEstadisticas: Postulacion[] = Array.isArray(dataEstadisticas.rows)
      ? dataEstadisticas.rows
      : [];

    const filasFiltradasPdf = filasDetalle.filter((row) => {
      return filtrarPorFechaPostulacion(row.fecha, fechaInicio, fechaFin);
    });

    const filasEstadisticasPdf = filasEstadisticas.filter((row) => {
      return filtrarPorFechaPostulacion(row.fecha, fechaInicio, fechaFin);
    });

    const nombreCompleto = [
      me?.nombre,
      me?.apellido_paterno,
      me?.apellido_materno,
    ]
      .filter(Boolean)
      .join(' ');

await generarReportePostulacionesPdf({
  rows: filasFiltradasPdf,
  rowsEstadisticas: filasEstadisticasPdf,
  generadoPor:
    nombreCompleto || me?.username || me?.ci || 'Usuario administrador',
  generadoPorCi: me?.ci || 'No registrado',
  filtros: {
    year,
    searchEstudiante,
    searchBeca,
    fechaInicio,
    fechaFin,
    estadoFiltro,
  },
});
  } catch (error) {
    console.error(error);
    alert('Error al generar el reporte PDF.');
  }
};
const rowsFiltradas = useMemo(() => {
  return rows.filter((row) => {
    const textoEstudiante = searchEstudiante.trim().toLowerCase();
    const textoBeca = searchBeca.trim().toLowerCase();

    const nombreCompleto =
      `${row.nombre} ${row.apellido_paterno} ${row.apellido_materno}`.toLowerCase();

    const ci = String(row.ci || '').toLowerCase();
    const beca = String(row.beca_nombre || '').toLowerCase();
    const estado = String(row.estado || '').toUpperCase();
    const observacion = String(row.estado_observacion || '').toUpperCase();
    const coincideEstudiante =
      !textoEstudiante ||
      nombreCompleto.includes(textoEstudiante) ||
      ci.includes(textoEstudiante);

    const coincideBeca = !textoBeca || beca.includes(textoBeca);

const coincideEstado =
  estadoFiltro === 'TODOS' ||
  (estadoFiltro === 'OBSERVADO' && observacion === 'OBSERVADO') ||
  estado === estadoFiltro;
    const coincideFecha = filtrarPorFechaPostulacion(
      row.fecha,
      fechaInicio,
      fechaFin,
    );

   return coincideEstudiante && coincideBeca && coincideFecha;
  });
}, [rows, searchEstudiante, searchBeca, fechaInicio, fechaFin, estadoFiltro]);

function limpiarFiltros() {
  onChangeYear('');
  onChangeSearchEstudiante('');
  onChangeSearchBeca('');
  setModoEstado('ACTUAL');
  setFechaInicio('');
  setFechaFin('');
  setEstadoFiltro('TODOS');
}
function filtrarPorFechaPostulacion(
  fechaPostulacion: string | null | undefined,
  fechaInicio: string,
  fechaFin: string,
) {
  if (!fechaInicio && !fechaFin) return true;
  if (!fechaPostulacion) return false;

  const fecha = new Date(fechaPostulacion);
  fecha.setHours(0, 0, 0, 0);

  if (fechaInicio) {
    const inicio = new Date(`${fechaInicio}T00:00:00`);
    if (fecha < inicio) return false;
  }

  if (fechaFin) {
    const fin = new Date(`${fechaFin}T23:59:59`);
    if (fecha > fin) return false;
  }

  return true;
}
  if (!isAdmin) {
    return <ReportesUnauthorized />
  }
  return (
    <div style={{ padding: '25px' }}>
      <ReportesHeader />
      <div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 16,
  }}
>
  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
    <button
      onClick={generarReportePDF}
        style={{
          background: '#0f766e',
          color: 'white',
          padding: '10px 18px',
          borderRadius: 8,
          border: 'none',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        📄 Generar reporte
      </button>

    </div>

    <Link
      href="/reportes/enviar-mensajes"
      style={{
        background: '#9333ea',
        color: 'white',
        padding: '10px 18px',
        borderRadius: 8,
        textDecoration: 'none',
        fontWeight: 700,
      }}
    >
      📨 Enviar Mensajes
    </Link>
  </div>
      <ReportesFilters
        year={year}
        searchEstudiante={searchEstudiante}
        searchBeca={searchBeca}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        estadoFiltro={estadoFiltro}
        onChangeYear={onChangeYear}
        onChangeSearchEstudiante={onChangeSearchEstudiante}
        onChangeSearchBeca={onChangeSearchBeca}
        setFechaInicio={setFechaInicio}
        setFechaFin={setFechaFin}
        setEstadoFiltro={setEstadoFiltro}
        onLimpiar={limpiarFiltros}
        modoEstado={modoEstado}
setModoEstado={setModoEstado}
      />

<ReportesTable
  rows={rowsFiltradas}
  loading={loading}
  onEdit={(row) => {
    setEditingRow(row);
    setEditOpen(true);
  }}
  onDetail={(row) => {
    setDetailRow(row);
    setDetailOpen(true);
  }}
/>

      <ReportesPagination
        page={page}
        totalPages={totalPages}
        onPrev={goPrevPage}
        onNext={goNextPage}
      />
      <EditPostulacionModal
  open={editOpen}
  row={editingRow}
  onClose={() => {
    setEditOpen(false);
    setEditingRow(null);
  }}
  onSaved={reload}
/>
     
      <DetallePostulacionModal
  open={detailOpen}
  row={detailRow}
  onClose={() => {
    setDetailOpen(false);
    setDetailRow(null);
  }}
/>
    </div>
    
  )
}