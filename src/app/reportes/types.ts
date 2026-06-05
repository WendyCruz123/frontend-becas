export type EstadoReporteFiltro =
  | 'TODOS'
  | 'EN_PROCESO'
  | 'PENDIENTE'
  | 'HABILITADO'
  | 'REMITIDO_A_DISBECT'
  | 'NO_REMITIDO'
  | 'OBSERVADO'
  | 'APROBADO'
  | 'REPROBADO'
  | 'ABANDONADO';
export type ModoEstadoReporte = 'ACTUAL' | 'HISTORICO';
export type Postulacion = {
  id: string
  gestion: string
  fecha: string
  estado: string
  estado_observacion: string
  observacion: string | null
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  ci: string
  semestre_actual: string
  beca_nombre: string
  beca_tipo: string
  beca_cupos?: number | null;
  beca_fecha_inicio: string
  beca_fecha_fin: string | null
  fecha_estado_final?: string | null
  usuario_estado_final?: string | null
}

export type ReportesFilters = {
  year: number | ''
  searchEstudiante: string
  searchBeca: string
}