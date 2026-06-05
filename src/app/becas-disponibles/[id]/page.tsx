'use client';

import { useParams, notFound } from 'next/navigation';
import { useMe } from '@/lib/useMe';
import { getGestionForToday } from '@/lib/gestion';
import { useState } from 'react';
import ConfirmModal from '@/components/ConfirmModal';
import { useBecaDetalle } from './hooks/useBecaDetalle';
import { useTramite } from './hooks/useTramite';
import { BecaHeader } from './components/BecaHeader';
import { MiTramitePanel } from './components/MiTramitePanel';
import { RequisitosList } from './components/RequisitosList';
import { generarAvalPdf } from './utils/generarAvalPdf';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import toast from 'react-hot-toast';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export default function BecaDetallePage() {
  const params = useParams<{ id: string }>();
  const becaId = Number(params?.id);
  const becaIdValido = !!becaId && !Number.isNaN(becaId);
const [openConfirmAbandono, setOpenConfirmAbandono] = useState(false);
const [confirmarInicioPendiente, setConfirmarInicioPendiente] = useState(false);
  const { me, isEstudiante } = useMe();
  // const gestion = getGestionForToday();
  // const estudianteId = me?.sub ?? null;

  // const { beca, pasos, oficinas, loading, error } =
  //   useBecaDetalle(becaIdValido ? becaId : 0);
const estudianteId = me?.sub ?? null;

const { beca, pasos, oficinas, loading, error } =
  useBecaDetalle(becaIdValido ? becaId : 0);

const gestion = beca?.fecha_inicio
  ? String(new Date(beca.fecha_inicio).getFullYear())
  : getGestionForToday();
const {
  tramite,
  tramiteActivoGlobal,
  ultimaPostulacionGlobal,
  abandonoRecuperable,
  loading: loadingTramite,
  progreso,
  reload,
  updatePasoLocal,
// } = useTramite(estudianteId, becaIdValido ? becaId : 0);
} = useTramite(estudianteId, becaIdValido ? becaId : 0, gestion);

  if (!becaIdValido) return notFound();

async function ejecutarInicioTramite() {
  const r = await fetchWithAuth(`${BACKEND}/postulaciones/empezar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ becaId, gestion }),
  });

  const text = await r.text();
  const d = text ? JSON.parse(text) : {};

  if (!r.ok) {
    toast.error(d?.message || 'No se pudo iniciar el trámite');
    return;
  }

  toast.success('Trámite iniciado correctamente');
  await reload();
}

async function empezarTramite() {
  if (!isEstudiante) {
    toast.error('Solo estudiantes pueden postular.');
    return;
  }

  const hayAbandonoRecuperableDeOtraBeca =
    abandonoRecuperable &&
    abandonoRecuperable.beca?.ID_beca !== becaId;

  if (hayAbandonoRecuperableDeOtraBeca) {
    setConfirmarInicioPendiente(true);
    return;
  }

  await ejecutarInicioTramite();
}
  async function abandonarTramite() {
    if (!tramite) return;

    await fetchWithAuth(
      `${BACKEND}/postulaciones/${tramite.ID_postulacion}/abandonar`,
      { method: 'PATCH' }
    );

    await reload();
  }

  async function finalizarTramite() {
    if (!tramite || !beca) return;

    const r = await fetchWithAuth(
      `${BACKEND}/postulaciones/${tramite.ID_postulacion}/finalizar`,
      { method: 'PATCH' }
    );

    const text = await r.text();
    const d = text ? JSON.parse(text) : {};

    if (!r.ok) {
      toast.error(d?.message || 'No se pudo finalizar el trámite');
      return;
    }

    generarAvalPdf({
      beca,
      tramite,
      pasos,
      gestion,
      progreso,
      estudiante: me,
    });

    await reload();
  }

  async function togglePaso(pasoBecaId: number, v: boolean) {
    if (!tramite) return;

    updatePasoLocal(pasoBecaId, v);

    const r = await fetchWithAuth(
      `${BACKEND}/postulaciones/${tramite.ID_postulacion}/paso`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pasoBecaId,
          completado: v,
        }),
      }
    );

    if (!r.ok) {
      updatePasoLocal(pasoBecaId, !v);
      toast.error('No se pudo actualizar el requisito');
      return;
    }

    await reload();
  }

  if (loading || loadingTramite) return <div>Cargando…</div>;
  if (error || !beca) return <div>Error</div>;

  const tramiteDeEstaBeca =
    tramite?.beca?.ID_beca === becaId ? tramite : null;
   
  const convocatoriaVencida = (() => {
    if (!beca?.fecha_fin) return false;
    const hoy = new Date();
    const fechaFin = new Date(beca.fecha_fin);
    return hoy > fechaFin;
  })();

const estadosQuePermitenNuevoRegistro = [
  'REPROBADO',
  'ABANDONADO',
  'NO_REMITIDO',
];

const puedeRegistrar =
  !convocatoriaVencida &&
  (
    !tramiteDeEstaBeca ||
    estadosQuePermitenNuevoRegistro.includes(tramiteDeEstaBeca.estado)
  );
  async function continuarTramite() {
  const tramiteAContinuar = abandonoRecuperable ?? tramite;

  if (!tramiteAContinuar) return;

  const r = await fetchWithAuth(
    `${BACKEND}/postulaciones/${tramiteAContinuar.ID_postulacion}/continuar`,
    { method: 'PATCH' }
  );

  const text = await r.text();
  const d = text ? JSON.parse(text) : {};

  if (!r.ok) {
    toast.error(d?.message || 'No se pudo continuar el trámite');
    return;
  }

  toast.success('Trámite recuperado correctamente');
  await reload();
}

  return (
    <>
    <div className="beca-detalle-container">
      <div className="beca-detalle-inner">
        {/* <BecaHeader
          beca={beca}
          tramite={ultimaPostulacionGlobal}
        /> */}
<BecaHeader
  beca={beca}
  tramite={tramiteDeEstaBeca}
/>


        <MiTramitePanel
          tramite={tramiteDeEstaBeca}
          tramiteActivoGlobal={tramiteActivoGlobal}
          ultimaPostulacionGlobal={ultimaPostulacionGlobal}
          abandonoRecuperable={abandonoRecuperable}
          gestion={gestion}
          progreso={progreso}
          beca={beca}
          estudiante={me}
          onEmpezar={empezarTramite}
          onAbandonar={abandonarTramite}
          onFinalizar={finalizarTramite}
          onContinuar={continuarTramite}
        />

        <RequisitosList
          pasos={pasos}
          oficinas={oficinas}
          tramite={tramiteDeEstaBeca}
          beca={beca}
          estudiante={me}
          onToggle={togglePaso}
          estado={tramiteDeEstaBeca?.estado}
        />
      </div>
    </div>
        <ConfirmModal
      open={confirmarInicioPendiente}
      title="Advertencia importante"
      message={
        `Usted tiene un trámite abandonado con avance institucional en la beca "${abandonoRecuperable?.beca?.nombre}".\n\n` +
        `Si inicia un nuevo trámite en "${beca?.nombre}", ya no podrá continuar el trámite anterior y en esta nueva beca debera empezar nuevamente los tramites de legalizacion.\n\n` +
        `Si más adelante desea volver a postular a esa beca, deberá iniciar nuevamente el proceso desde cero, incluyendo los procesos de legalización que correspondan.\n\n` +
        `¿Desea iniciar este nuevo trámite?`
      }
      confirmText="Sí, iniciar nuevo trámite"
      cancelText="Cancelar"
      onCancel={() => setConfirmarInicioPendiente(false)}
      onConfirm={async () => {
        setConfirmarInicioPendiente(false);
        await ejecutarInicioTramite();
      }}
    />
  </>
  );
}