'use client';

import { useEffect, useState } from 'react';
import ConsultarSeguimientoModal from '@/components/ConsultarSeguimientoModal';
import MiniCarousel from './MiniCarousel';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

function getToken() {
  if (typeof window === 'undefined') return null;

  return (
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('accessToken') ||
    sessionStorage.getItem('token')
  );
}

function getMensajeTramiteDashboard(tramite: any) {
  if (!tramite) return '';

  const nombre = (
    tramite?.beca?.nombre ||
    tramite?.beca_nombre_historico ||
    'BECA'
  ).toUpperCase();

  switch (tramite.estado) {
    case 'EN_PROCESO':
      return `USTED EMPEZÓ SU TRÁMITE EN "${nombre}".`;

    case 'PENDIENTE':
      return `USTED FINALIZÓ SU TRÁMITE EN "${nombre}".`;

    case 'HABILITADO':
      return `SU POSTULACIÓN A LA "${nombre}" FUE HABILITADA PARA ETAPAS.`;

    case 'REMITIDO_A_DISBECT':
      return `SU DOCUMENTACIÓN DE "${nombre}" FUE REMITIDA A DISBECT.`;

    case 'NO_REMITIDO':
      return `SU DOCUMENTACIÓN DE "${nombre}" NO FUE REMITIDA A DISBECT.`;

    case 'APROBADO':
      return `SU POSTULACIÓN A LA "${nombre}" FUE APROBADA.`;
case 'APROBADO':
  return `USTED APROBÓ LA "${nombre}". NO PUEDE INICIAR OTRA POSTULACIÓN EN ESTA GESTIÓN.`;

    case 'ABANDONADO':
      return `SU POSTULACIÓN A LA "${nombre}" FUE ABANDONADA.`;

    default:
      return '';
  }
}

export default function DashboardLeft({
  me,
  estudiante,
  roles,
  onOpenForm,
  router,
}: {
  me: any;
  estudiante: any;
  roles: string[];
  onOpenForm: () => void;
  router: any;
}) {
  const isAdmin = roles.includes('admin');
  const isEstudiante = roles.includes('estudiante');

  const [openSeguimiento, setOpenSeguimiento] = useState(false);
  const [tramite, setTramite] = useState<any>(null);

useEffect(() => {
  if (!isEstudiante) return;

  const cargarUltimoTramite = async () => {
    try {
      const gestion = String(new Date().getFullYear());

      const estudianteId =
        estudiante?.ID_estudiante ||
        estudiante?.id ||
        estudiante?.estudianteId;

      const usuarioId =
        me?.ID_usuario ||
        me?.id ||
        me?.sub ||
        me?.usuarioId;

      let url = '';

      if (estudianteId) {
        url = `${BACKEND}/postulaciones/activo?gestion=${gestion}&estudianteId=${estudianteId}`;
      } else if (usuarioId) {
        url = `${BACKEND}/postulaciones/activo?gestion=${gestion}&usuarioId=${usuarioId}`;
      } else {
        console.log('NO HAY estudianteId NI usuarioId', { me, estudiante });
        return;
      }

      console.log('CONSULTANDO TRÁMITE:', url);

      const res = await fetch(url);

      if (!res.ok) {
        console.log('ERROR AL CONSULTAR TRÁMITE:', res.status);
        return;
      }

      const data = await res.json();

      console.log('TRÁMITE RECIBIDO:', data);

      setTramite(data ?? null);
    } catch (error) {
      console.log('ERROR DASHBOARD TRÁMITE:', error);
      setTramite(null);
    }
  };

  cargarUltimoTramite();
}, [isEstudiante, me, estudiante]);

  const mensajeTramite = getMensajeTramiteDashboard(tramite);

  return (
    <div className="dashboard-left w-full lg:w-1/2 flex flex-col items-center">
      <div className="neumorphic-card card-with-triangle w-full max-w-full sm:max-w-[600px] lg:max-w-[750px] mx-auto relative overflow-hidden">
        <h1 className="nm-title text-xl sm:text-2xl md:text-3xl text-center">
          ¡BIENVENIDO! {me.nombre?.toUpperCase()}
        </h1>

        {isEstudiante && mensajeTramite && (
          <div className="beca-status-message mt-3 text-center">
            {mensajeTramite}
          </div>
        )}

        <MiniCarousel />

        <div className="boton-derecha flex flex-col gap-3 items-center mt-4">
          {isAdmin && (
            <button
              className="nm-button-primary"
              onClick={() => router.push('/admin/editor360')}
            >
              EDITOR 360
            </button>
          )}
        </div>
      </div>

      <div className="nm-button-group mt-6">
        <button
          className="nm-button"
          onClick={() => router.push('/becas-disponibles')}
        >
          BECAS
        </button>

        <button
          className="nm-button"
          onClick={() => router.push('/restricciones')}
        >
          RESTRICCIONES
        </button>

        <button
          className="nm-button"
          onClick={() => router.push('/modelado-3d')}
        >
          FÍSICA 3D
        </button>

        <button className="nm-button" onClick={() => setOpenSeguimiento(true)}>
          CONSULTAR TRÁMITE
        </button>
      </div>

      {!estudiante && (
        <p style={{ marginTop: 12, color: '#00387E' }}>
          Aún no registraste tus datos académicos.
        </p>
      )}

      <ConsultarSeguimientoModal
        open={openSeguimiento}
        onClose={() => setOpenSeguimiento(false)}
      />
    </div>
  );
}