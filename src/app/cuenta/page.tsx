'use client';

import { useCuenta } from './hooks/useCuenta';
import CuentaDatos from './componentes/CuentaDatos';
import CuentaAcademica from './componentes/CuentaAcademica';
import EstadoPostulacion from './componentes/EstadoPostulacion';
import MiniCardDato from './componentes/MiniCardDato';

export default function CuentaPage() {
  const { loading, persona, estudiante, error } = useCuenta();

  if (loading) return <div style={{ padding: 20 }}>Cargando...</div>;
  if (error) return <div style={{ padding: 20 }}>{error}</div>;
  if (!persona) return <div style={{ padding: 20 }}>No se encontraron datos.</div>;

  return (
    <div style={{ padding: 20 }}>

<div className="grid grid-cols-1 xl:grid-cols-[minmax(480px,600px)_1fr] gap-10 w-full">

  {/* COLUMNA IZQUIERDA */}
  <CuentaDatos persona={persona} />

  {/* COLUMNA DERECHA */}
  <div className="flex flex-col gap-8">

    {/* ESTADO PRINCIPAL */}
    <EstadoPostulacion
      puedePostular={!!estudiante?.evaluacion?.puedePostular}
    />

    {/* MINI CARDS */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <MiniCardDato
        titulo="Promedio"
        valor={estudiante.promedio}
        icono="📊"
      />
      <MiniCardDato
        titulo="Año de ingreso"
        valor={estudiante.año_ingreso}
        icono="📅"
      />
      <MiniCardDato
        titulo="Reprobadas"
        valor={estudiante.numero_Materias_Reprobadas}
        icono="📕"
      />
    </div>

    {/* DETALLE ACADÉMICO */}
    <CuentaAcademica estudiante={estudiante} />

  </div>
</div>

    </div>
  );
}
