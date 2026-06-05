export type EtapaEncargado = {
  pasoEstudianteId: number;
  estado_etapa: 'EN_REVISION' | 'APROBADO' | 'REPROBADO' | 'ABANDONADO';
  completado: boolean;
  fecha_completado?: string | null;
  nota?: number | null;
  fecha?: string | null;
  descripcion?: string | null;
  texto_extra?: string | null;

  oficina?: {
    ID_oficina: number;
    nombre: string;
    horario_atencion?: string | null;
  } | null;

  beca: {
    ID_beca: number;
    nombre: string;
    tipo: string;
    gestion: string;
  };

  estudiante: {
    ci: string;
    nombre: string;
    apellido_paterno?: string | null;
    apellido_materno?: string | null;
  };

  requisito: {
    nombre: string;
    requiere_nota?: boolean;
    requiere_fecha_descripcion?: boolean;
    requiere_ruta_360?: boolean;
    requiere_otro?: boolean;
  };
};

export type OficinaOption = {
  ID_oficina: number;
  nombre: string;
  horario_atencion?: string | null;
};