import { LegalizacionData, LegalizacionItem, LegalizacionVista, OrdenFecha } from './types';

export function nombreEstudiante(e: LegalizacionItem['estudiante']) {
  return [e.nombre, e.apellido_paterno, e.apellido_materno]
    .filter(Boolean)
    .join(' ');
}

export function estadoLabel(estado: string) {
  const map: Record<string, string> = {
    PENDIENTE_LEGALIZACION: 'Pendiente de entrega física',
    EN_REVISION: 'Documento en revisión',
    LEGALIZADO: 'Documento legalizado',
    RECHAZADO: 'Documento rechazado',
    ENTREGADO: 'Documento entregado',
  };

  return map[estado] ?? estado;
}

export function fechaLlegada(item: LegalizacionItem) {
  return item.fecha_inicio || item.fecha_revision || '';
}

export function unirLegalizaciones(data: LegalizacionData) {
  const rows = [
    ...data.pendientesRecepcion,
    ...data.enRevision,
    ...data.entregaFinal,
    ...data.revisados,
  ];

  const map = new Map<number, LegalizacionItem>();

  for (const row of rows) {
    map.set(row.id, row);
  }

  return Array.from(map.values());
}

export function filtrarLegalizaciones(
  rows: LegalizacionItem[],
  filtros: {
    busquedaEstudiante: string;
    busquedaCi: string;
    busquedaGestion: string;
    busquedaBeca: string;
    vista: LegalizacionVista;
    ordenFecha: OrdenFecha;
  },
) {
  const estudianteText = filtros.busquedaEstudiante.trim().toLowerCase();
  const ciText = filtros.busquedaCi.trim().toLowerCase();
  const gestionText = filtros.busquedaGestion.trim().toLowerCase();
  const becaText = filtros.busquedaBeca.trim().toLowerCase();

  return rows
    .filter((item) => {
      const nombre = nombreEstudiante(item.estudiante).toLowerCase();
      const ci = String(item.estudiante.ci || '').toLowerCase();
      const gestion = String(item.beca.gestion || '').toLowerCase();
      const beca = String(item.beca.nombre || '').toLowerCase();

      const okNombre = !estudianteText || nombre.includes(estudianteText);
      const okCi = !ciText || ci.includes(ciText);
      const okGestion = !gestionText || gestion.includes(gestionText);
      const okBeca = !becaText || beca.includes(becaText);

      const okVista =
        filtros.vista === 'TODOS' ||
        (filtros.vista === 'PENDIENTES' && item.estado === 'PENDIENTE_LEGALIZACION') ||
        (filtros.vista === 'EN_REVISION' && item.estado === 'EN_REVISION') ||
        (filtros.vista === 'ENTREGA' && item.es_entrega_final && item.estado === 'LEGALIZADO') ||
        (filtros.vista === 'LEGALIZADOS' && item.estado === 'LEGALIZADO' && !item.es_entrega_final) ||
        (filtros.vista === 'ENTREGADOS' && item.estado === 'ENTREGADO') ||
        (filtros.vista === 'RECHAZADOS' && item.estado === 'RECHAZADO');

      return okNombre && okCi && okGestion && okBeca && okVista;
    })
    .sort((a, b) => {
      const fa = new Date(fechaLlegada(a) || 0).getTime();
      const fb = new Date(fechaLlegada(b) || 0).getTime();

      return filtros.ordenFecha === 'DESC' ? fb - fa : fa - fb;
    });
}