'use client';

import { useMemo, useState } from 'react';
import { useEtapasEncargado } from './hooks/useEtapasEncargado';
import { EtapaCard } from './components/EtapaCard';
import { EtapaRevisionModal } from './components/EtapaRevisionModal';
import { EtapasEncargadoFilters } from './components/EtapasEncargadoFilters';
import type { EtapaEncargado } from './types';
import { generarReporteEncargadoPdf } from './utils/generarReporteEncargadoPdf';
import { useMe } from '@/lib/useMe';
type TabVista = 'pendientes' | 'notificados';
type EstadoFiltro = 'TODOS' | 'APROBADOS' | 'REPROBADOS';

export default function EncargadoPage() {
  const { me } = useMe();
  const { pendientes, revisados, oficinas, loading, resolverEtapa } =
    useEtapasEncargado();
  const [vista, setVista] = useState<TabVista>('pendientes');
  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [busquedaBeca, setBusquedaBeca] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>('TODOS');

  const [etapaSeleccionada, setEtapaSeleccionada] =
    useState<EtapaEncargado | null>(null);

  const pendientesFiltrados = useMemo(() => {
    return filtrarEtapas(pendientes, {
      busquedaNombre,
      busquedaBeca,
      fechaInicio,
      fechaFin,
      estadoFiltro: 'TODOS',
    });
  }, [pendientes, busquedaNombre, busquedaBeca, fechaInicio, fechaFin]);

  const revisadosFiltrados = useMemo(() => {
    return filtrarEtapas(revisados, {
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

  return (
    nombreCompleto ||
    me?.username ||
    me?.ci ||
    'Usuario encargado'
  );
}
function obtenerCiUsuario() {
  return me?.ci || 'No registrado';
}

async function generarPdfActual() {
  const rows =
    vista === 'pendientes' ? pendientesFiltrados : revisadosFiltrados;

  await generarReporteEncargadoPdf({
    rows,
    titulo:
      vista === 'pendientes'
        ? 'REPORTE DE ETAPAS PENDIENTES DE REVISIÓN'
        : 'REPORTE DE ETAPAS NOTIFICADAS',
    generadoPor: obtenerNombreUsuario(),
    generadoPorCi: obtenerCiUsuario(),
    filtros: {
      vista: vista === 'pendientes' ? 'PENDIENTES' : 'NOTIFICADOS',
      busquedaNombre,
      busquedaBeca,
      fechaInicio,
      fechaFin,
      estadoFiltro: vista === 'notificados' ? estadoFiltro : 'TODOS',
    },
  });
}
  return (
    <main className="px-5 pb-6 pt-0 -mt-40 md:mt-0 md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="dashboard-title mb-0">PANEL DE ENCARGADO</h2>

        <div className="flex w-full max-w-md rounded-2xl bg-cyan-100/70 p-2 shadow-inner md:w-auto">
          <button
            type="button"
            onClick={() => setVista('pendientes')}
            className={`flex-1 rounded-xl px-5 py-3 text-sm font-black transition ${
              vista === 'pendientes'
                ? 'bg-cyan-700 text-white shadow-lg'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            PENDIENTES
            <span className="ml-2 rounded-full bg-white/25 px-2 py-0.5 text-xs">
              {pendientes.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setVista('notificados')}
            className={`flex-1 rounded-xl px-5 py-3 text-sm font-black transition ${
              vista === 'notificados'
                ? 'bg-cyan-700 text-white shadow-lg'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            NOTIFICADOS
            <span className="ml-2 rounded-full bg-white/25 px-2 py-0.5 text-xs">
              {revisados.length}
            </span>
          </button>
        </div>
                  <button
            type="button"
            onClick={generarPdfActual}
            className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-md transition hover:bg-emerald-600 active:scale-[0.98]"
          >
            📄 GENERAR PDF
          </button>
      </div>

      {loading && <p>Cargando etapas asignadas...</p>}

      <EtapasEncargadoFilters
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
        mostrarEstado={vista === 'notificados'}
        onLimpiar={limpiarFiltros}
      />

      {vista === 'pendientes' && (
        <section className="mb-8">
          <h3 className="text-xl font-black mb-4">
            ETAPAS PENDIENTES DE REVISIÓN
          </h3>

          {pendientesFiltrados.length === 0 ? (
            <div className="table-wrapper p-5 rounded-2xl">
              No existen etapas pendientes con esos filtros.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {pendientesFiltrados.map((p) => (
                <EtapaCard
                  key={p.pasoEstudianteId}
                  etapa={p}
                  onRevisar={() => setEtapaSeleccionada(p)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {vista === 'notificados' && (
        <section>
          <h3 className="text-xl font-black mb-4">ETAPAS NOTIFICADAS</h3>

          {revisadosFiltrados.length === 0 ? (
            <div className="table-wrapper p-5 rounded-2xl">
              No existen etapas notificadas con esos filtros.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {revisadosFiltrados.map((p) => (
                <EtapaCard key={p.pasoEstudianteId} etapa={p} />
              ))}
            </div>
          )}
        </section>
      )}

      <EtapaRevisionModal
        etapa={etapaSeleccionada}
        oficinas={oficinas}
        onClose={() => setEtapaSeleccionada(null)}
        onResolver={async (resultado, payload) => {
          if (!etapaSeleccionada) return;

          await resolverEtapa(
            etapaSeleccionada.pasoEstudianteId,
            resultado,
            payload,
          );
        }}
      />
    </main>
  );
}

function filtrarEtapas(
  etapas: EtapaEncargado[],
  filtros: {
    busquedaNombre: string;
    busquedaBeca: string;
    fechaInicio: string;
    fechaFin: string;
    estadoFiltro: EstadoFiltro;
  },
) {
  const textoNombre = filtros.busquedaNombre.trim().toLowerCase();
  const textoBeca = filtros.busquedaBeca.trim().toLowerCase();

  return etapas.filter((etapa) => {
    const nombreCompleto =
  `${etapa.estudiante.nombre} ${etapa.estudiante.apellido_paterno} ${etapa.estudiante.apellido_materno}`.toLowerCase();

    const ci = String(etapa.estudiante.ci || '').toLowerCase();

    const beca = etapa.beca.nombre.toLowerCase();

    const coincideNombre =
      !textoNombre ||
      nombreCompleto.includes(textoNombre) ||
      ci.includes(textoNombre);
    const coincideBeca = !textoBeca || beca.includes(textoBeca);

    const coincideFecha = filtrarPorFecha(
      etapa.fecha,
      filtros.fechaInicio,
      filtros.fechaFin,
    );

    const estado = etapa.estado_etapa?.toUpperCase() || '';

    const coincideEstado =
      filtros.estadoFiltro === 'TODOS' ||
      (filtros.estadoFiltro === 'APROBADOS' &&
        (estado.includes('APROBADO') || estado.includes('LEGALIZADO'))) ||
      (filtros.estadoFiltro === 'REPROBADOS' &&
        (estado.includes('REPROBADO') || estado.includes('RECHAZADO')));

    return coincideNombre && coincideBeca && coincideFecha && coincideEstado;
  });
}

function filtrarPorFecha(
  fechaEtapa: string | null | undefined,
  fechaInicio: string,
  fechaFin: string,
) {
  if (!fechaInicio && !fechaFin) return true;
  if (!fechaEtapa) return false;

  const fecha = new Date(fechaEtapa);
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