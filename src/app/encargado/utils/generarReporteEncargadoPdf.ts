import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { EtapaEncargado } from '../types';
import {
  PAGE_OFICIO_VERTICAL,
  crearBackgroundMembretado,
  crearHeaderInstitucionalVertical,
  crearFooterInstitucional,
} from '@/lib/pdf/plantillaInstitucional';

import { imageToBase64 } from '@/lib/pdf/imageToBase64';
(pdfMake as any).vfs = (pdfFonts as any).vfs;

type ReporteParams = {
  rows: EtapaEncargado[];
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

export async function generarReporteEncargadoPdf({
  rows,
  titulo,
  generadoPor,
  generadoPorCi,
  filtros,
}: ReporteParams) {
  const fechaGeneracion = new Date().toLocaleString('es-BO');
const logoBase64 = await imageToBase64('/logo.png');
const membreteBase64 = await imageToBase64('/membretada.png');
  const body = [
    [
      { text: 'N°', style: 'tableHeader' },
      { text: 'Estudiante', style: 'tableHeader' },
      { text: 'CI', style: 'tableHeader' },
      { text: 'Beca', style: 'tableHeader' },
      { text: 'Etapa', style: 'tableHeader' },
      { text: 'Estado', style: 'tableHeader' },
      { text: 'Fecha', style: 'tableHeader' },
      { text: 'Nota', style: 'tableHeader' },
    ],
    ...rows.map((etapa, index) => [
      index + 1,
      `${etapa.estudiante.nombre} ${etapa.estudiante.apellido_paterno} ${etapa.estudiante.apellido_materno}`,
      etapa.estudiante.ci || '—',
      etapa.beca.nombre || '—',
      etapa.requisito.nombre || '—',
      etapa.estado_etapa || '—',
      etapa.fecha ? new Date(etapa.fecha).toLocaleDateString('es-BO') : '—',
      etapa.nota !== null && etapa.nota !== undefined ? String(etapa.nota) : '—',
    ]),
  ];

  const docDefinition: any = {
    pageSize: PAGE_OFICIO_VERTICAL,
pageOrientation: 'portrait',
pageMargins: [42, 82, 42, 62],

background: crearBackgroundMembretado(membreteBase64),

header: crearHeaderInstitucionalVertical(
  logoBase64,
  'REPORTE ENCARGADO',
),

footer: crearFooterInstitucional(),

    content: [
  

      { text: titulo, style: 'title', margin: [0, 5, 0, 8] },

      {
        text:
          'El presente reporte contiene el detalle de las etapas gestionadas por el encargado, incluyendo estudiantes notificados o pendientes según los filtros aplicados en el sistema.',
        style: 'paragraph',
      },

      {
        margin: [0, 14, 0, 14],
        table: {
          widths: ['*', '*'],
          body: [
            [
              { text: 'Generado por:', style: 'infoLabel' },
              { text: generadoPor || 'Usuario encargado', style: 'infoValue' },
            ],
            [
            { text: 'CI del encargado:', style: 'infoLabel' },
            { text: generadoPorCi || 'No registrado', style: 'infoValue' },
            ],
            [
              { text: 'Fecha de generación:', style: 'infoLabel' },
              { text: fechaGeneracion, style: 'infoValue' },
            ],
            [
              { text: 'Vista:', style: 'infoLabel' },
              { text: filtros.vista, style: 'infoValue' },
            ],
            [
              { text: 'Filtro estudiante / CI:', style: 'infoLabel' },
              { text: filtros.busquedaNombre || 'Sin filtro', style: 'infoValue' },
            ],
            [
              { text: 'Filtro beca:', style: 'infoLabel' },
              { text: filtros.busquedaBeca || 'Sin filtro', style: 'infoValue' },
            ],
            [
              { text: 'Rango de fechas:', style: 'infoLabel' },
              {
                text:
                  filtros.fechaInicio || filtros.fechaFin
                    ? `${filtros.fechaInicio || 'Inicio no definido'} hasta ${filtros.fechaFin || 'Fin no definido'}`
                    : 'Sin filtro',
                style: 'infoValue',
              },
            ],
            [
              { text: 'Filtro estado:', style: 'infoLabel' },
              { text: filtros.estadoFiltro || 'TODOS', style: 'infoValue' },
            ],
            [
              { text: 'Total de registros:', style: 'infoLabel' },
              { text: String(rows.length), style: 'infoValue' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },

      {
        text: 'DETALLE DE ETAPAS',
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
              widths: [18, 92, 38, 82, 82, 56, 52, 32],
              body,
            },
            layout: {
              fillColor: (rowIndex: number) =>
                rowIndex === 0 ? '#0e889c' : rowIndex % 2 === 0 ? '#f1f5f9' : null,
              hLineColor: () => '#cbd5e1',
              vLineColor: () => '#cbd5e1',
            },
            fontSize: 5.2,
          },

      {
        text:
          'Este documento fue generado automáticamente por el Sistema de Becas como respaldo del proceso de notificación y revisión realizado por el encargado correspondiente.',
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
        fontSize: 8,
        alignment: 'center',
      },
      infoLabel: {
        bold: true,
        color: '#334155',
        fontSize: 9,
      },
      infoValue: {
        color: '#475569',
        fontSize: 9,
      },
      emptyText: {
        fontSize: 10,
        italics: true,
        color: '#64748b',
        alignment: 'center',
        margin: [0, 20, 0, 20],
      },
      footerNote: {
        fontSize: 6.5,
        color: '#64748b',
        italics: true,
        alignment: 'justify',
      },
    },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`reporte-encargado-${new Date().toISOString().slice(0, 10)}.pdf`);
}