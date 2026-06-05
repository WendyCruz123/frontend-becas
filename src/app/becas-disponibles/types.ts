export type EstadoHistorialPostulacion = 'APROBADO' | 'REPROBADO';

export type HistorialEstadoItem = {
  estado: string;
  fecha: string;
  accion: string;
};

export type BecaRow = {
  ID_beca: number;
  ID_postulacion?: string;

  nombre: string;
  tipo: string;
  cupos?: number | null;
  detalle?: string | null;
  imagen?: string | null;
  fecha_inicio: string;
  fecha_fin: string | null;

  estado_postulacion?: 'APROBADO' | 'REPROBADO';
  gestion?: string;
  codigo_seguimiento?: string | null;
  fecha_postulacion?: string;

  nombre_completo?: string;
  ci?: string;
  observacion?: string | null;
  estado_observacion?: string | null;
};