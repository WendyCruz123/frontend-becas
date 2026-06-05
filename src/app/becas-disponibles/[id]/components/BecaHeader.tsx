'use client';

import { useState } from 'react';
import { BecaResumen, PostulacionDetalle } from '../types';
import { formatDate } from '../utils';
import BotonVolverDashboard from '@/components/BotonVolverDashboard';
const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

function getMensajeTramite(
  becaActual: BecaResumen,
  tramite: PostulacionDetalle | null
) {
  if (!tramite) return '';

  const esEstaBeca = tramite.beca?.ID_beca === becaActual.ID_beca;
  const nombreBecaTramite = tramite.beca?.nombre || becaActual.nombre;
  const nombre = esEstaBeca ? becaActual.nombre : nombreBecaTramite;

  if (!esEstaBeca) {
    if (tramite.estado === 'APROBADO') {
      return `USTED APROBÓ LA "${nombreBecaTramite.toUpperCase()}". NO PUEDE INICIAR OTRA POSTULACIÓN EN ESTA GESTIÓN.`;
    }

    if (
      ['EN_PROCESO', 'PENDIENTE', 'HABILITADO', 'REMITIDO_A_DISBECT'].includes(
        tramite.estado
      )
    ) {
      return `USTED YA TIENE UNA POSTULACIÓN VIGENTE EN "${nombreBecaTramite.toUpperCase()}".`;
    }

    if (tramite.estado === 'ABANDONADO') {
      return `SU POSTULACIÓN A LA "${nombreBecaTramite.toUpperCase()}" FUE ABANDONADA.`;
    }

    if (tramite.estado === 'REPROBADO') {
      return `SU POSTULACIÓN A LA "${nombreBecaTramite.toUpperCase()}" FUE REPROBADA.`;
    }

    if (tramite.estado === 'NO_REMITIDO') {
      return `SU DOCUMENTACION DE "${nombreBecaTramite.toUpperCase()}" NO FUE REMITIDA A DISBECT.`;
    }
  }

  switch (tramite.estado) {
    case 'EN_PROCESO':
      return `USTED EMPEZÓ SU TRÁMITE EN "${nombre.toUpperCase()}".`;

    case 'PENDIENTE':
      return `USTED FINALIZÓ SU TRÁMITE EN "${nombre.toUpperCase()}".`;

    case 'HABILITADO':
      return `SU POSTULACIÓN A LA "${nombre.toUpperCase()}" FUE HABILITADA PARA ETAPAS.`;

    case 'REMITIDO_A_DISBECT':
      return `SU DOCUMENTACION DE "${nombre.toUpperCase()}" FUE REMITIDA A DISBECT.`;

    case 'NO_REMITIDO':
      return `SU DOCUMENTACION DE "${nombre.toUpperCase()}" NO FUE REMITIDA A DISBECT.`;

    case 'APROBADO':
      return `SU POSTULACIÓN A LA "${nombre.toUpperCase()}" FUE APROBADA.`;

    case 'REPROBADO':
      return `SU POSTULACIÓN A LA "${nombre.toUpperCase()}" FUE REPROBADA.`;

    case 'ABANDONADO':
      return `SU POSTULACIÓN A LA "${nombre.toUpperCase()}" FUE ABANDONADA.`;

    default:
      return '';
  }
}

function buildImageUrl(url?: string | null) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BACKEND}${url.startsWith('/') ? url : `/${url}`}`;
}

export function BecaHeader({
  beca,
  tramite,
}: {
  beca: BecaResumen;
  tramite: PostulacionDetalle | null;
}) {
  const [openDetalle, setOpenDetalle] = useState(false);
  const mensaje = getMensajeTramite(beca, tramite);
  const imagenUrl = buildImageUrl(beca.imagen);

  return (
    <>
      <section className="mx-0 mb-6 mt-4 border-b border-slate-900/10 px-4 pb-5 pt-0 sm:mb-8 sm:mt-5 sm:px-8 sm:pb-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
               <BotonVolverDashboard />
            <h1
              className="
                max-w-4xl
                text-[1.2rem]
                sm:text-[1.6rem]
                lg:text-[2rem]
                xl:text-[2.3rem]
                font-bold
                leading-tight
                tracking-normal
                text-slate-800
                uppercase
                font-sans
              "
              style={{
                fontFamily:
                  '"Inter", "Segoe UI", "Helvetica Neue", sans-serif',
              }}
            >
              {beca.nombre}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm sm:text-base text-slate-700">
              <div className="flex items-center gap-2 rounded-full border border-cyan-100 bg-white/70 px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>
                <strong>Tipo:</strong> {beca.tipo || '—'}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-cyan-100 bg-white/70 px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>
                <strong>Inicio:</strong> {formatDate(beca.fecha_inicio)}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-cyan-100 bg-white/70 px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>
                <strong>Fin:</strong> {formatDate(beca.fecha_fin)}
              </span>
            </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpenDetalle(true)}
            className="
              w-full rounded-2xl bg-gradient-to-r from-cyan-700 to-sky-600
              px-5 py-3 text-sm font-black uppercase tracking-wide text-white
              shadow-lg shadow-cyan-900/20 transition
              hover:from-cyan-800 hover:to-sky-700 active:scale-[0.98]
              lg:w-auto lg:shrink-0
            "
          >
            VER CONVOCATORIA
          </button>
        </div>

        {mensaje && (
          <div className="beca-status-message">
            {mensaje}
          </div>
        )}
      </section>

{openDetalle && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
    <div
      className="
        relative w-full max-w-[980px] overflow-hidden rounded-[32px]
        border border-white/70 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.35)]
      "
    >
      <button
        type="button"
        onClick={() => setOpenDetalle(false)}
        className="
          absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center
          rounded-full bg-white text-2xl font-bold text-slate-600
          shadow-md transition hover:bg-red-50 hover:text-red-600
        "
      >
        ×
      </button>

      <div className="grid max-h-[90vh] overflow-y-auto md:grid-cols-[360px_1fr]">
        <div className="relative bg-gradient-to-br from-cyan-800 via-sky-700 to-slate-900 p-5">
          {imagenUrl ? (
            <button
              type="button"
              onClick={() => window.open(imagenUrl, '_blank')}
              className="group block h-full w-full"
            >
              <img
                src={imagenUrl}
                alt={beca.nombre}
                className="
                  h-[330px] w-full rounded-[26px] object-contain
                  bg-white/95 p-2 shadow-2xl transition group-hover:scale-[1.02]
                  md:h-full md:min-h-[520px]
                "
              />

              <span className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/75 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white backdrop-blur">
                Click para ver imagen
              </span>
            </button>
          ) : (
            <div className="flex h-[330px] items-center justify-center rounded-[26px] border border-white/20 bg-white/10 text-center text-white md:h-full md:min-h-[520px]">
              <div>
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
                  🎓
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-100">
                  Sin imagen registrada
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-800">
            {beca.tipo || 'Beca'}
          </span>

          <h2 className="mt-4 text-2xl font-black uppercase leading-tight text-slate-800 sm:text-3xl">
            {beca.nombre}
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Inicio
              </p>
              <p className="mt-1 text-base font-bold text-slate-800">
                {formatDate(beca.fecha_inicio)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Cierre
              </p>
              <p className="mt-1 text-base font-bold text-slate-800">
                {formatDate(beca.fecha_fin)}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-cyan-100 bg-cyan-50/60 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700">
              Detalle
            </p>

            <div className="mt-3 max-h-[280px] overflow-y-auto whitespace-pre-line pr-2 text-sm leading-7 text-slate-700">
              {beca.detalle?.trim()
                ? beca.detalle
                : 'No se registró un detalle para esta beca.'}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setOpenDetalle(false)}
              className="
                rounded-2xl bg-slate-900 px-6 py-3
                text-sm font-black uppercase tracking-wide text-white
                shadow-lg transition hover:bg-cyan-800 active:scale-[0.98]
              "
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
}