export type PasoPorBeca = {
  ID_pasosBeca: number;
  orden: number;
  requisito: {
    ID_paso: number;
    nombre: string;
    descripcion?: string | null;
    archivo_ejemplo_url?: string | null;
    url_externa?: string | null;
    oficinaId?: number | null;
    requiere_legalizacion?: boolean;
    dias_estimados_legalizacion?: number | null;
    tipo_requisito?: 'DOCUMENTO' | 'ETAPA';
    requiere_nota?: boolean;
    requiere_fecha_descripcion?: boolean;
    requiere_ruta_360?: boolean;
    requiere_otro?: boolean;
  };
};

export type Oficina = {
  ID_oficina: number;
  nombre: string;
  descripcion?: string | null;
  horario_atencion: string;
  estado_oficina: boolean;
  panorama_route_slug?: string | null;
};

export type BecaResumen = {
  ID_beca: number;
  nombre: string;
  detalle?: string | null;
  imagen?: string | null;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  periodo_bloqueo?: 'ANUAL' | 'SEMESTRAL';
};

export type PasoEstudiante = {
  pasoBecaId: number;
  completado: boolean;
  estado_revision?:
    | 'NO_REQUIERE'
    | 'PENDIENTE_LEGALIZACION'
    | 'EN_REVISION'
    | 'LEGALIZADO'
    | 'RECHAZADO';

estado_etapa?:
  | 'BLOQUEADO'
  | 'EN_REVISION'
  | 'APROBADO'
  | 'REPROBADO'
  | 'ABANDONADO'
  | null;
  observacion_revision?: string | null;
  fecha_revision?: string | null;
  oficinaRuta?: {
    ID_oficina: number;
    nombre: string;
    horario_atencion?: string | null;
    panorama_route_slug?: string | null;
  } | null;
  pasoBeca?: {
    requisito?: {
      tipo_requisito?: 'DOCUMENTO' | 'ETAPA';
    };
  };
};

export type EstadoPostulacion =
  | 'EN_PROCESO'
  | 'PENDIENTE'
  | 'HABILITADO'
  | 'REMITIDO_A_DISBECT'
  | 'NO_REMITIDO'
  | 'APROBADO'
  | 'REPROBADO'
  | 'ABANDONADO';

export type PostulacionDetalle = {
  ID_postulacion: string;
  codigo_seguimiento?: string | null;
  estado: EstadoPostulacion;
  estado_observacion: string;
  observacion?: string | null;
  gestion: string;
  periodo_postulacion?: string | null;

  abandono_recuperable?: boolean;
  motivo_abandono?: string | null;
  fecha_abandono?: string | null;

  beca: {
    ID_beca: number;
    nombre: string;
    fecha_fin?: string | null;
    periodo_bloqueo?: 'ANUAL' | 'SEMESTRAL';
  };

  paso_estudiante: PasoEstudiante[];
};