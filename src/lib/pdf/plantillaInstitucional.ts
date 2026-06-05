export const PAGE_OFICIO_VERTICAL = {
  width: 612,
  height: 936,
};

export const PAGE_OFICIO_HORIZONTAL = {
  width: 936,
  height: 612,
};

export const COLORES_INSTITUCIONALES = {
  principal: '#0f766e',
  secundario: '#14b8a6',
  titulo: '#16324f',
  texto: '#475569',
  borde: '#cbd5e1',
  fondoSuave: '#f8fafc',
};

export function crearBackgroundMembretado(membreteBase64: string) {
  return () => ({
    image: membreteBase64,
    width: 612,
    height: 936,
    absolutePosition: {
      x: 0,
      y: 0,
    },
  });
}

export function crearHeaderInstitucionalVertical(
  logoBase64: string,
  tituloReporte: string,
) {
  return () => ({
    margin: [42, 22, 42, 0],
    columns: [
      {
        width: 62,
        image: logoBase64,
        fit: [52, 52],
      },
      {
        width: '*',
        stack: [
          {
            text: 'UNIVERSIDAD PÚBLICA DE EL ALTO',
            fontSize: 12,
            bold: true,
            color: COLORES_INSTITUCIONALES.titulo,
            margin: [0, 4, 0, 1],
          },
          {
            text: 'CARRERA DE CIENCIAS FÍSICAS Y ENERGÍAS ALTERNATIVAS',
            fontSize: 8.5,
            bold: true,
            color: COLORES_INSTITUCIONALES.principal,
          },
          {
            text: 'Sistema Web de Orientación y Seguimiento para la Postulación a Becas',
            fontSize: 7,
            color: COLORES_INSTITUCIONALES.texto,
          },
        ],
      },
      {
        width: 120,
        text: tituloReporte,
        alignment: 'right',
        bold: true,
        fontSize: 8.5,
        color: COLORES_INSTITUCIONALES.titulo,
        margin: [0, 12, 0, 0],
      },
    ],
  });
}

export function crearFooterInstitucional() {
  return (currentPage: number, pageCount: number) => ({
    margin: [42, 0, 42, 18],
    columns: [
      {
        text: 'Documento generado automáticamente por el Sistema de Becas.',
        fontSize: 6.5,
        color: '#64748b',
      },
      {
        text: `Página ${currentPage} de ${pageCount}`,
        alignment: 'right',
        fontSize: 6.5,
        color: '#64748b',
      },
    ],
  });
}