export type TipoBecaNotificacion = 'SIN_ETAPAS' | 'CON_ETAPAS';

export type TipoBecaFiltro = TipoBecaNotificacion;

export type EstadoFiltroNotificacion =
  | 'PENDIENTE'
  | 'HABILITADO'
  | 'REMITIDO_A_DISBECT'
  | 'NO_REMITIDO'
  | 'APROBADO'
  | 'REPROBADO'
  | 'ABANDONADO';
export type TipoMensajeEnvio =
  | 'OBSERVADO'
  | 'APROBADO'
  | 'REPROBADO'
  | 'PERSONALIZADO'
  | 'APROBAR_DOCUMENTACION_ETAPAS'
  | 'REMITIDO_A_DISBECT'
  | 'NO_REMITIDO'
  | '';

export type EnviarMensajeRow = {
  id: string;
  gestion: string;
  fecha?: string;
  estado: string;
  estado_observacion: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  ci: string;
  semestre_actual?: string;
  beca_id: number;
  beca_nombre: string;
  beca_tipo: string;
  tiene_etapas?: boolean;
};

export type ResumenEnvioResponse = {
  tipo: string;
  estado?: string;
  seleccionados: number;
  notificados: number;
  fallaron: number;
  mensaje: string;
};

export type OficinaOption = {
  ID_oficina: number;
  nombre: string;
  horario_atencion?: string | null;
};

export type DatosEtapaAdmin = {
  nota?: number;
  fecha?: string;
  descripcion?: string;
  textoExtra?: string;
  oficinaRutaId?: number;
};