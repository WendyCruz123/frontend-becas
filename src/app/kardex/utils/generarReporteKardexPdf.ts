'use client';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

type ReporteKardexParams = {
  rows: any[];
  titulo: string;
  generadoPor: string;
  generadoPorCi?: string;
  filtros: {
    vista: string;
    busquedaNombre: string;
    busquedaBeca: string;
    fechaInicio: string;
    fechaFin: string;
    estadoFiltro: string;
  };
};

export function generarReporteKardexPdf({
  rows,
  titulo,
  generadoPor,
  generadoPorCi,
  filtros,
}: ReporteKardexParams) {
  const fechaGeneracion = new Date().toLocaleString('es-BO');

  const legalizados = rows.filter(
    (r) => r.estado_revision === 'LEGALIZADO',
  ).length;

  const rechazados = rows.filter(
    (r) => r.estado_revision === 'RECHAZADO',
  ).length;

  const body = [
    [
      { text: 'N°', style: 'tableHeader' },
      { text: 'Estudiante', style: 'tableHeader' },
      { text: 'CI', style: 'tableHeader' },
      { text: 'Beca', style: 'tableHeader' },
      { text: 'Requisito', style: 'tableHeader' },
      { text: 'Estado', style: 'tableHeader' },
      { text: 'Observación', style: 'tableHeader' },
      { text: 'Fecha', style: 'tableHeader' },
    ],

    ...rows.map((r, index) => {
      const persona = r.postulacion?.estudiante?.persona;

      return [
        index + 1,
        `${persona?.nombre || ''} ${persona?.apellido_paterno || ''} ${
          persona?.apellido_materno || ''
        }`,
        persona?.ci || '—',
        r.postulacion?.beca?.nombre || '—',
        r.pasoBeca?.requisito?.nombre || '—',
        r.estado_revision || '—',
        r.observacion_revision || '—',
        r.fecha_revision
          ? new Date(r.fecha_revision).toLocaleDateString('es-BO')
          : '—',
      ];
    }),
  ];

  const docDefinition: any = {
    pageSize: 'LETTER',
    pageOrientation: 'landscape',
    pageMargins: [36, 40, 36, 50],

    content: [
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: 'SISTEMA DE BECAS', style: 'institution' },
              {
                text: 'ORIENTACIÓN Y SEGUIMIENTO INSTITUCIONAL',
                style: 'subtitle',
              },
            ],
          },
          {
            width: 'auto',
            text: 'REPORTE KARDEX',
            style: 'reportBadge',
          },
        ],
      },

      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 12,
            x2: 720,
            y2: 12,
            lineWidth: 1,
            lineColor: '#0e889c',
          },
        ],
      },

      { text: titulo, style: 'title', margin: [0, 22, 0, 8] },

      {
        text:
          'El presente reporte contiene el detalle de las solicitudes revisadas por Kardex, registrando los requisitos legalizados o rechazados con observación. Este documento sirve como respaldo institucional del proceso de notificación realizado al estudiante.',
        style: 'paragraph',
      },

      {
        margin: [0, 14, 0, 14],
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            [
              { text: 'Generado por:', style: 'infoLabel' },
              { text: generadoPor || 'Usuario Kardex', style: 'infoValue' },
              { text: 'CI del usuario:', style: 'infoLabel' },
              { text: generadoPorCi || 'No registrado', style: 'infoValue' },
            ],
            [
              { text: 'Fecha de generación:', style: 'infoLabel' },
              { text: fechaGeneracion, style: 'infoValue' },
              { text: 'Vista:', style: 'infoLabel' },
              { text: filtros.vista, style: 'infoValue' },
            ],
            [
              { text: 'Filtro estudiante / CI:', style: 'infoLabel' },
              {
                text: filtros.busquedaNombre || 'Sin filtro',
                style: 'infoValue',
              },
              { text: 'Filtro beca:', style: 'infoLabel' },
              {
                text: filtros.busquedaBeca || 'Sin filtro',
                style: 'infoValue',
              },
            ],
            [
              { text: 'Rango de fechas:', style: 'infoLabel' },
              {
                text:
                  filtros.fechaInicio || filtros.fechaFin
                    ? `${filtros.fechaInicio || 'Inicio no definido'} hasta ${
                        filtros.fechaFin || 'Fin no definido'
                      }`
                    : 'Sin filtro',
                style: 'infoValue',
              },
              { text: 'Filtro estado:', style: 'infoLabel' },
              {
                text: filtros.estadoFiltro || 'TODOS',
                style: 'infoValue',
              },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },

      {
        columns: [
          {
            width: '*',
            text: `Total registros: ${rows.length}`,
            style: 'summaryTotal',
          },
          {
            width: '*',
            text: `Legalizados: ${legalizados}`,
            style: 'summarySuccess',
          },
          {
            width: '*',
            text: `Rechazados: ${rechazados}`,
            style: 'summaryDanger',
          },
        ],
        margin: [0, 0, 0, 18],
      },

      {
        text: 'DETALLE DE SOLICITUDES KARDEX',
        style: 'sectionTitle',
        margin: [0, 8, 0, 8],
      },

      rows.length === 0
        ? {
            text: 'No existen registros para los filtros seleccionados.',
            style: 'emptyText',
          }
        : {
            table: {
              headerRows: 1,
              widths: [22, 105, 50, 115, 115, 70, '*', 60],
              body,
            },
            layout: {
              fillColor: (rowIndex: number) =>
                rowIndex === 0
                  ? '#0e889c'
                  : rowIndex % 2 === 0
                    ? '#f1f5f9'
                    : null,
              hLineColor: () => '#cbd5e1',
              vLineColor: () => '#cbd5e1',
            },
            fontSize: 7.5,
          },

      {
        text:
          'Este documento fue generado automáticamente por el Sistema de Becas como respaldo del proceso de legalización, rechazo y notificación realizado por Kardex.',
        style: 'footerNote',
        margin: [0, 28, 0, 0],
      },
    ],

    styles: {
      institution: {
        fontSize: 16,
        bold: true,
        color: '#1d2c40',
      },
      subtitle: {
        fontSize: 8,
        bold: true,
        color: '#0e889c',
        characterSpacing: 1.2,
      },
      reportBadge: {
        fontSize: 9,
        bold: true,
        color: '#ffffff',
        fillColor: '#0e889c',
        margin: [8, 6, 8, 6],
        alignment: 'center',
      },
      title: {
        fontSize: 15,
        bold: true,
        color: '#1d2c40',
        alignment: 'center',
      },
      paragraph: {
        fontSize: 9,
        color: '#475569',
        alignment: 'justify',
        lineHeight: 1.25,
      },
      sectionTitle: {
        fontSize: 11,
        bold: true,
        color: '#0e889c',
      },
      tableHeader: {
        bold: true,
        color: '#ffffff',
        fontSize: 7.5,
        alignment: 'center',
      },
      infoLabel: {
        bold: true,
        color: '#334155',
        fontSize: 8.5,
      },
      infoValue: {
        color: '#475569',
        fontSize: 8.5,
      },
      summaryTotal: {
        bold: true,
        color: '#1d2c40',
        fontSize: 10,
      },
      summarySuccess: {
        bold: true,
        color: '#047857',
        fontSize: 10,
      },
      summaryDanger: {
        bold: true,
        color: '#b91c1c',
        fontSize: 10,
      },
      emptyText: {
        fontSize: 10,
        italics: true,
        color: '#64748b',
        alignment: 'center',
        margin: [0, 20, 0, 20],
      },
      footerNote: {
        fontSize: 8,
        color: '#64748b',
        italics: true,
        alignment: 'justify',
      },
    },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`reporte-kardex-${new Date().toISOString().slice(0, 10)}.pdf`);
}