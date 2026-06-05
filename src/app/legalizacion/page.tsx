'use client';

import { useEffect, useMemo, useState } from 'react';
import '@/app/tablas.css';
import { apiAccionLegalizacion, apiMisPendientesLegalizacion } from './api';
import { LegalizacionAccion, LegalizacionData, LegalizacionItem, LegalizacionVista, OrdenFecha } from './types';
import { filtrarLegalizaciones, unirLegalizaciones } from './utils';
import LegalizacionFilters from './components/LegalizacionFilters';
import LegalizacionCards from './components/LegalizacionCards';
import RechazarLegalizacionModal from './components/RechazarLegalizacionModal';
import { generarReporteLegalizacionPdf } from './utils/generarReporteLegalizacionPdf';
import { useMe } from '@/lib/useMe';

import { getGestionForToday } from '@/lib/gestion';

const emptyData: LegalizacionData = {
  pendientesRecepcion: [],
  enRevision: [],
  entregaFinal: [],
  revisados: [],
};

export default function LegalizacionPage() {
  const [data, setData] = useState<LegalizacionData>(emptyData);
  const [loading, setLoading] = useState(false);

  const [busquedaEstudiante, setBusquedaEstudiante] = useState('');
  const [busquedaCi, setBusquedaCi] = useState('');
  const [busquedaGestion, setBusquedaGestion] = useState('');
  const [busquedaBeca, setBusquedaBeca] = useState('');
  const [vista, setVista] = useState<LegalizacionVista>('TODOS');
  const [ordenFecha, setOrdenFecha] = useState<OrdenFecha>('DESC');

  const [rechazar, setRechazar] = useState<LegalizacionItem | null>(null);

  const gestion = '2027';
// const gestion = getGestionForToday();

  async function load() {
    setLoading(true);
    try {
      // const json = await apiMisPendientesLegalizacion();
      const json = await apiMisPendientesLegalizacion(gestion);
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const rowsFiltrados = useMemo(() => {
    return filtrarLegalizaciones(unirLegalizaciones(data), {
      busquedaEstudiante,
      busquedaCi,
      busquedaGestion,
      busquedaBeca,
      vista,
      ordenFecha,
    });
  }, [
    data,
    busquedaEstudiante,
    busquedaCi,
    busquedaGestion,
    busquedaBeca,
    vista,
    ordenFecha,
  ]);

  function limpiarFiltros() {
    setBusquedaEstudiante('');
    setBusquedaCi('');
    setBusquedaGestion('');
    setBusquedaBeca('');
    setVista('TODOS');
    setOrdenFecha('DESC');
  }

  async function handleAccion(
    id: number,
    accion: LegalizacionAccion,
    observacion = '',
  ) {
    await apiAccionLegalizacion({ id, accion, observacion });
    await load();
  }
  const { me } = useMe();

function obtenerNombreUsuario() {
  return [
    me?.nombre,
    me?.apellido_paterno,
    me?.apellido_materno,
  ]
    .filter(Boolean)
    .join(' ') || me?.username || me?.ci || 'Usuario del sistema';
}
function obtenerRolInstitucional() {
  const roles = me?.roles?.map((r) => String(r).toLowerCase()) ?? [];

  if (roles.includes('admin')) return 'CENTRO DE ESTUDIANTES';
  if (roles.includes('director')) return 'DIRECCIÓN';
  if (roles.includes('kardex')) return 'KARDEX';

  return 'USUARIO DEL SISTEMA';
}
async function generarPdfFiltrado() {
  await generarReporteLegalizacionPdf({
    rows: rowsFiltrados,
    titulo: 'REPORTE DE LEGALIZACIÓN PRESENCIAL DE REQUISITOS',
    generadoPor: obtenerNombreUsuario(),
    generadoPorCi: me?.ci || 'No registrado',
    generadoPorRol: obtenerRolInstitucional(),
    filtros: {
      vista,
      busquedaEstudiante,
      busquedaCi,
      busquedaGestion,
      busquedaBeca,
      ordenFecha,
    },
  });
}
  return (
    <main className="px-5 pb-6 pt-0 -mt-40 md:mt-0 md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="dashboard-title mb-0">
            LEGALIZACIÓN PRESENCIAL
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Recepción, revisión, legalización y entrega final de requisitos.
          </p>
        </div>

        <button
          className="rounded-xl bg-cyan-700 px-5 py-3 text-sm font-black text-white shadow-md transition hover:bg-cyan-800 active:scale-[0.98]"
          onClick={load}
          disabled={loading}
        >
          {loading ? 'CARGANDO...' : 'ACTUALIZAR'}
        </button>
        <button
            className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-md transition hover:bg-emerald-600 active:scale-[0.98]"
            onClick={generarPdfFiltrado}
            >
            📄 GENERAR REPORTE PDF
        </button>
      </div>

      <LegalizacionFilters
        busquedaEstudiante={busquedaEstudiante}
        setBusquedaEstudiante={setBusquedaEstudiante}
        busquedaCi={busquedaCi}
        setBusquedaCi={setBusquedaCi}
        busquedaGestion={busquedaGestion}
        setBusquedaGestion={setBusquedaGestion}
        busquedaBeca={busquedaBeca}
        setBusquedaBeca={setBusquedaBeca}
        vista={vista}
        setVista={setVista}
        ordenFecha={ordenFecha}
        setOrdenFecha={setOrdenFecha}
        onLimpiar={limpiarFiltros}
      />

      <div className="mb-4 text-sm font-black text-slate-600">
        Registros encontrados: {rowsFiltrados.length}
      </div>

      <LegalizacionCards
        rows={rowsFiltrados}
        onAccion={handleAccion}
        onRechazar={setRechazar}
      />

      {rechazar && (
        <RechazarLegalizacionModal
          item={rechazar}
          onClose={() => setRechazar(null)}
          onSubmit={async (observacion) => {
            await handleAccion(rechazar.id, 'rechazar', observacion);
            setRechazar(null);
          }}
        />
      )}
    </main>
  );
}