import { ProgresoBar } from './ProgresoBar';
import { PostulacionDetalle } from '../types';
import { generarCaratulaBecaDocx } from '../utils/generarCaratulaBecaDocx';

type Props = {
  tramite: PostulacionDetalle | null;
  tramiteActivoGlobal?: PostulacionDetalle | null;
  ultimaPostulacionGlobal?: PostulacionDetalle | null;
  abandonoRecuperable?: PostulacionDetalle | null;
  gestion: string;
  progreso: number;
  beca: any;
  estudiante: any;
  onEmpezar: () => void;
  onAbandonar: () => void;
  onFinalizar: () => void;
  onContinuar?: () => void;
};

const ESTADOS_FINALES = ['APROBADO', 'REPROBADO', 'ABANDONADO', 'NO_REMITIDO'];
const ESTADOS_BLOQUEANTES = [
  'EN_PROCESO',
  'PENDIENTE',
  'HABILITADO',
  'REMITIDO_A_DISBECT',
  'APROBADO',
];

function CodigoSeguimiento({ codigo }: { codigo?: string | null }) {
  if (!codigo) return null;

  return (
    <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <div className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 shadow-sm">
        Código de seguimiento: {codigo}
      </div>

      <button
        type="button"
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        onClick={() => {
          navigator.clipboard.writeText(codigo);
          alert('Código copiado correctamente.');
        }}
      >
        Copiar código
      </button>
    </div>
  );
}

function EstadoFinal({ tramite }: { tramite: PostulacionDetalle }) {
  const estado = tramite.estado;

  const clase =
    estado === 'APROBADO'
      ? 'bg-green-50 border-green-300 text-green-800'
      : estado === 'ABANDONADO'
      ? 'bg-orange-50 border-orange-300 text-orange-800'
      : 'bg-red-50 border-red-300 text-red-800';

  return (
    <div className={`mt-5 rounded-xl border p-5 text-center font-semibold ${clase}`}>
      <p className="text-lg">ESTADO FINAL: {estado}</p>
      <p className="mt-2 text-sm">Beca: {tramite.beca?.nombre}</p>
      <p className="mt-1 text-sm">Gestión: {tramite.gestion}</p>
      <CodigoSeguimiento codigo={tramite.codigo_seguimiento} />
      {tramite.estado_observacion && (
        <p className="mt-2 text-sm">Observación: {tramite.estado_observacion}</p>
      )}
    </div>
  );
}

function PanelRegistrar({
  convocatoriaVencida,
  abandonoRecuperable,
  beca,
  onEmpezar,
  onContinuar,
}: any) {
  return (
    <div className="tramite-info">
      {convocatoriaVencida ? (
        <p className="text-center text-sm font-semibold text-red-700">
          La convocatoria ya finalizó. No se permite registrar un nuevo trámite.
        </p>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="btn-outline" onClick={onEmpezar}>
            REGISTRAR TRÁMITE
          </button>

          {abandonoRecuperable &&
            abandonoRecuperable.beca?.ID_beca !== beca?.ID_beca && (
              <button className="btn-outline" onClick={() => onContinuar?.()}>
               CONTINUAR TRÁMITE EN &quot;{abandonoRecuperable.beca?.nombre}&quot;
              </button>
            )}
        </div>
      )}
    </div>
  );
}

export function MiTramitePanel({
  tramite,
  tramiteActivoGlobal,
  ultimaPostulacionGlobal,
  abandonoRecuperable,
  gestion,
  progreso,
  beca,
  estudiante,
  onEmpezar,
  onAbandonar,
  onFinalizar,
  onContinuar,
}: Props) {
  const convocatoriaVencida = beca?.fecha_fin
    ? new Date() > new Date(beca.fecha_fin)
    : false;

  const esTramiteGlobalDeOtraBeca =
    !!tramiteActivoGlobal &&
    tramiteActivoGlobal.beca?.ID_beca !== beca?.ID_beca;

  const hayBloqueoPorOtraBeca =
    esTramiteGlobalDeOtraBeca &&
    ESTADOS_BLOQUEANTES.includes(tramiteActivoGlobal.estado);

  if (hayBloqueoPorOtraBeca) {
    return null;
  }

  if (!tramite) {
    return (
      <PanelRegistrar
        convocatoriaVencida={convocatoriaVencida}
        abandonoRecuperable={abandonoRecuperable}
        beca={beca}
        onEmpezar={onEmpezar}
        onContinuar={onContinuar}
      />
    );
  }

  const estado = tramite.estado;
  const esEstadoFinal = ESTADOS_FINALES.includes(estado);

  const esUltimaPostulacionReal =
    !!ultimaPostulacionGlobal &&
    ultimaPostulacionGlobal.ID_postulacion === tramite.ID_postulacion;

  const esAbandonadoRecuperable =
    estado === 'ABANDONADO' && tramite.abandono_recuperable === true;

  if (esAbandonadoRecuperable) {
    return (
      <div className="tramite-info">
        <div className="mt-5 rounded-xl border border-orange-300 bg-orange-50 p-5 text-center font-semibold text-orange-800">
          <p className="text-lg">TRÁMITE ABANDONADO</p>
          <p className="mt-2 text-sm">
            Este trámite conserva avance institucional y puede ser continuado mientras la convocatoria siga vigente.
          </p>
          <CodigoSeguimiento codigo={tramite.codigo_seguimiento} />
        </div>

        <div className="mt-5 flex justify-center">
          <button className="btn-outline" onClick={() => onContinuar?.()}>
            CONTINUAR TRÁMITE
          </button>
        </div>
      </div>
    );
  }

  if (esEstadoFinal) {
    if (esUltimaPostulacionReal) {
      return (
        <div className="tramite-info">
          <EstadoFinal tramite={tramite} />

          {['REPROBADO', 'ABANDONADO', 'NO_REMITIDO'].includes(estado) &&
            !convocatoriaVencida && (
              <div className="mt-5 flex justify-center">
                <button className="btn-outline" onClick={onEmpezar}>
                  REGISTRAR NUEVO TRÁMITE
                </button>
              </div>
            )}
        </div>
      );
    }

    return (
      <PanelRegistrar
        convocatoriaVencida={convocatoriaVencida}
        abandonoRecuperable={abandonoRecuperable}
        beca={beca}
        onEmpezar={onEmpezar}
        onContinuar={onContinuar}
      />
    );
  }

  const tienePendienteKardex = tramite.paso_estudiante.some(
    (p) =>
      p.estado_revision === 'PENDIENTE_LEGALIZACION' ||
      p.estado_revision === 'EN_REVISION'
  );

  const tieneRechazadoKardex = tramite.paso_estudiante.some(
    (p) => p.estado_revision === 'RECHAZADO'
  );

  const puedeFinalizar =
    progreso === 100 && !tienePendienteKardex && !tieneRechazadoKardex;

  return (
    <div>
      {estado === 'EN_PROCESO' && <ProgresoBar value={progreso} />}

      <div className="tramite-meta mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:justify-center sm:gap-10 sm:text-base">
        <span>Gestión: {gestion}</span>
        <span>Estado: {estado}</span>
        <span>Observación: {tramite.estado_observacion}</span>
      </div>

      {estado !== 'EN_PROCESO' && (
        <CodigoSeguimiento codigo={tramite.codigo_seguimiento} />
      )}

      <div className="mt-5 flex justify-center">
        <button
          className="btn-outline"
          onClick={() => generarCaratulaBecaDocx({ estudiante, beca })}
        >
          📄 GENERAR CARÁTULA DE BECA
        </button>
      </div>

      {tienePendienteKardex && (
        <p className="mt-4 text-center text-sm font-semibold text-slate-600">
          ⏳ Tiene requisitos enviados a Kardex. Debe esperar la legalización para finalizar.
        </p>
      )}

      {tieneRechazadoKardex && (
        <p className="mt-4 text-center text-sm font-semibold text-orange-700">
          ⚠️ Tiene requisitos rechazados por Kardex. Debe reenviarlos para revisión.
        </p>
      )}

      {estado === 'EN_PROCESO' && (
        <div className="mt-6 flex flex-wrap gap-4 px-11">
          <button className="btn-primary" onClick={onAbandonar}>
            ABANDONAR TRÁMITE
          </button>

          {puedeFinalizar && (
            <button className="btn-outline" onClick={onFinalizar}>
              FINALIZAR TRÁMITE
            </button>
          )}
        </div>
      )}

      {estado === 'PENDIENTE' && (
        <div className="mt-6 px-11">
          <button className="btn-primary" onClick={onAbandonar}>
            ABANDONAR TRÁMITE
          </button>
        </div>
      )}

      {estado === 'REMITIDO_A_DISBECT' && (
        <p className="mt-5 text-center text-sm font-semibold text-cyan-700">
          📌 Su carpeta fue remitida a DISBECT. Desde este estado el trámite queda bajo revisión administrativa y ya no puede ser abandonado.
        </p>
      )}

      {estado === 'HABILITADO' && (
        <p className="mt-5 text-center text-sm font-semibold text-cyan-700">
          📌 Su trámite fue habilitado para evaluación de etapas. Desde este estado ya no puede abandonar el trámite.
        </p>
      )}
    </div>
  );
}