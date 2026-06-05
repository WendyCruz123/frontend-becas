'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import KardexSolicitudesTable from './components/KardexSolicitudesTable';
import KardexSolicitudesFilters from './components/KardexSolicitudesFilters';
import { generarReporteKardexPdf } from './utils/generarReporteKardexPdf';
import { useMe } from '@/lib/useMe';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

type EstadoKardexFiltro = 'TODOS' | 'LEGALIZADOS' | 'RECHAZADOS';

export default function KardexPage() {
  const { me } = useMe();

  const [pendientes, setPendientes] = useState<any[]>([]);
  const [revisados, setRevisados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'PENDIENTES' | 'REVISADAS'>('PENDIENTES');
  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [busquedaBeca, setBusquedaBeca] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estadoFiltro, setEstadoFiltro] =
    useState<EstadoKardexFiltro>('TODOS');

  async function load() {
    setLoading(true);
    try {
      const [p, r] = await Promise.all([
        fetchWithAuth(`${BACKEND}/kardex/pendientes`).then((res) => res.json()),
        fetchWithAuth(`${BACKEND}/kardex/revisados`).then((res) => res.json()),
      ]);

      setPendientes(Array.isArray(p) ? p : []);
      setRevisados(Array.isArray(r) ? r : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const pendientesFiltrados = useMemo(() => {
    return filtrarSolicitudesKardex(pendientes, {
      busquedaNombre,
      busquedaBeca,
      fechaInicio,
      fechaFin,
      estadoFiltro: 'TODOS',
    });
  }, [pendientes, busquedaNombre, busquedaBeca, fechaInicio, fechaFin]);

  const revisadosFiltrados = useMemo(() => {
    return filtrarSolicitudesKardex(revisados, {
      busquedaNombre,
      busquedaBeca,
      fechaInicio,
      fechaFin,
      estadoFiltro,
    });
  }, [
    revisados,
    busquedaNombre,
    busquedaBeca,
    fechaInicio,
    fechaFin,
    estadoFiltro,
  ]);

  function limpiarFiltros() {
    setBusquedaNombre('');
    setBusquedaBeca('');
    setFechaInicio('');
    setFechaFin('');
    setEstadoFiltro('TODOS');
  }

  function obtenerNombreUsuario() {
  const nombreCompleto = [
    me?.nombre,
    me?.apellido_paterno,
    me?.apellido_materno,
  ]
    .filter(Boolean)
    .join(' ');

  return nombreCompleto || me?.username || me?.ci || 'Usuario Kardex';
}

function obtenerCiUsuario() {
  return me?.ci || 'No registrado';
}

function generarPdfFiltrado() {
  const rows = tab === 'PENDIENTES' ? pendientesFiltrados : revisadosFiltrados;

  generarReporteKardexPdf({
    rows,
    titulo:
      tab === 'PENDIENTES'
        ? 'REPORTE DE SOLICITUDES PENDIENTES KARDEX'
        : 'REPORTE DE SOLICITUDES NOTIFICADAS KARDEX',
    generadoPor: obtenerNombreUsuario(),
    generadoPorCi: obtenerCiUsuario(),
    filtros: {
      vista: tab === 'PENDIENTES' ? 'PENDIENTES' : 'NOTIFICADOS',
      busquedaNombre,
      busquedaBeca,
      fechaInicio,
      fechaFin,
      estadoFiltro: tab === 'REVISADAS' ? estadoFiltro : 'TODOS',
    },
  });
}

  return (
    <main className="px-5 pb-6 pt-0 -mt-40 md:mt-0 md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="dashboard-title mb-0">NOTIFICACIONES KARDEX</h2>

        <button
          className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-md transition hover:bg-emerald-600 active:scale-[0.98]"
          onClick={generarPdfFiltrado}
        >
          📄 GENERAR REPORTE PDF
        </button>
      </div>

      {loading && <p>Cargando solicitudes...</p>}

      <KardexSolicitudesFilters
        busquedaNombre={busquedaNombre}
        setBusquedaNombre={setBusquedaNombre}
        busquedaBeca={busquedaBeca}
        setBusquedaBeca={setBusquedaBeca}
        fechaInicio={fechaInicio}
        setFechaInicio={setFechaInicio}
        fechaFin={fechaFin}
        setFechaFin={setFechaFin}
        estadoFiltro={estadoFiltro}
        setEstadoFiltro={setEstadoFiltro}
        mostrarEstado={tab === 'REVISADAS'}
        onLimpiar={limpiarFiltros}
      />

      <KardexSolicitudesTable
        pendientes={pendientesFiltrados}
        revisadas={revisadosFiltrados}
        tab={tab}
        setTab={setTab}
        onRefresh={load}
      />
    </main>
  );
}

function filtrarSolicitudesKardex(
  rows: any[],
  filtros: {
    busquedaNombre: string;
    busquedaBeca: string;
    fechaInicio: string;
    fechaFin: string;
    estadoFiltro: EstadoKardexFiltro;
  },
) {
  const textoNombre = filtros.busquedaNombre.trim().toLowerCase();
  const textoBeca = filtros.busquedaBeca.trim().toLowerCase();

  return rows.filter((row) => {
    const persona = row.postulacion?.estudiante?.persona;

    const nombreCompleto = `${persona?.nombre || ''} ${
      persona?.apellido_paterno || ''
    } ${persona?.apellido_materno || ''}`.toLowerCase();

    const ci = String(persona?.ci || '').toLowerCase();

    const beca = String(row.postulacion?.beca?.nombre || '').toLowerCase();

    const estado = String(row.estado_revision || '').toUpperCase();

    const coincideNombre =
      !textoNombre ||
      nombreCompleto.includes(textoNombre) ||
      ci.includes(textoNombre);

    const coincideBeca = !textoBeca || beca.includes(textoBeca);

    const coincideFecha = filtrarPorFechaKardex(
      row.fecha_revision,
      filtros.fechaInicio,
      filtros.fechaFin,
    );

    const coincideEstado =
      filtros.estadoFiltro === 'TODOS' ||
      (filtros.estadoFiltro === 'LEGALIZADOS' &&
        estado.includes('LEGALIZADO')) ||
      (filtros.estadoFiltro === 'RECHAZADOS' &&
        estado.includes('RECHAZADO'));

    return coincideNombre && coincideBeca && coincideFecha && coincideEstado;
  });
}

function filtrarPorFechaKardex(
  fechaRevision: string | null | undefined,
  fechaInicio: string,
  fechaFin: string,
) {
  if (!fechaInicio && !fechaFin) return true;
  if (!fechaRevision) return false;

  const fecha = new Date(fechaRevision);
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