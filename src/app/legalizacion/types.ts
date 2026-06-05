export type LegalizacionVista =
  | 'TODOS'
  | 'PENDIENTES'
  | 'EN_REVISION'
  | 'ENTREGA'
  | 'LEGALIZADOS'
  | 'ENTREGADOS'
  | 'RECHAZADOS';
export type OrdenFecha = 'DESC' | 'ASC';

export type LegalizacionAccion =
  | 'pasar-revision'
  | 'legalizar'
  | 'rechazar'
  | 'entregar';

export type LegalizacionItem = {
  id: number;
  estado: string;
  orden: number;
  activo_revision: boolean;
  es_entrega_final: boolean;
  fecha_inicio?: string | null;
  fecha_revision?: string | null;
  observacion?: string | null;

  requisito: {
    id: number;
    nombre: string;
    descripcion?: string | null;
  };

  beca: {
    id: number;
    nombre: string;
    tipo: string;
    gestion: string;
  };

  estudiante: {
    id: number;
    ci: string;
    nombre: string;
    apellido_paterno?: string | null;
    apellido_materno?: string | null;
  };
};

export type LegalizacionData = {
  pendientesRecepcion: LegalizacionItem[];
  enRevision: LegalizacionItem[];
  entregaFinal: LegalizacionItem[];
  revisados: LegalizacionItem[];
};