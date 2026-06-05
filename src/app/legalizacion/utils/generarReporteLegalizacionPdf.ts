'use client';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { LegalizacionItem, LegalizacionVista, OrdenFecha } from '../types';
import { estadoLabel, fechaLlegada, nombreEstudiante } from '../utils';
import {
  PAGE_OFICIO_VERTICAL,
  crearBackgroundMembretado,
  crearHeaderInstitucionalVertical,
  crearFooterInstitucional,
} from '@/lib/pdf/plantillaInstitucional';

import { imageToBase64 } from '@/lib/pdf/imageToBase64';
(pdfMake as any).vfs = (pdfFonts as any).vfs;

type Params = {
  rows: LegalizacionItem[];
  titulo: string;
  generadoPor: string;
  generadoPorCi?: string;
  generadoPorRol?: string;
  filtros: {
    vista: LegalizacionVista;
    busquedaEstudiante: string;
    busquedaCi: string;
    busquedaGestion: string;
    busquedaBeca: string;
    ordenFecha: OrdenFecha;
  };
};

export async function generarReporteLegalizacionPdf({
  rows,
  titulo,
  generadoPor,
  generadoPorCi,
  generadoPorRol,
  filtros,
}: Params) {
  const fechaGeneracion = new Date().toLocaleString('es-BO', {
    timeZone: 'America/La_Paz',
  });
  const logoBase64 = await imageToBase64('/logo.png');
const membreteBase64 = await imageToBase64('/membretada.png');
  const pendientes = rows.filter((r) => r.estado === 'PENDIENTE_LEGALIZACION').length;
  const enRevision = rows.filter((r) => r.estado === 'EN_REVISION').length;
  const legalizados = rows.filter((r) => r.estado === 'LEGALIZADO').length;
  const entregados = rows.filter((r) => r.estado === 'ENTREGADO').length;
  const rechazados = rows.filter((r) => r.estado === 'RECHAZADO').length;

  const body = [
    [
      { text: 'N°', style: 'tableHeader' },
      { text: 'Estudiante', style: 'tableHeader' },
      { text: 'CI', style: 'tableHeader' },
      { text: 'Beca', style: 'tableHeader' },
      { text: 'Gestión', style: 'tableHeader' },
      { text: 'Requisito', style: 'tableHeader' },
      { text: 'Estado', style: 'tableHeader' },
      { text: 'Observación', style: 'tableHeader' },
      { text: 'Fecha', style: 'tableHeader' },
    ],
    ...rows.map((r, index) => [
      index + 1,
      nombreEstudiante(r.estudiante) || '—',
      r.estudiante?.ci || '—',
      r.beca?.nombre || '—',
      r.beca?.gestion || '—',
      r.requisito?.nombre || '—',
      estadoLabel(r.estado),
      r.observacion || '—',
      fechaLlegada(r)
        ? new Date(fechaLlegada(r)).toLocaleString('es-BO', {
  timeZone: 'America/La_Paz',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})
        : '—',
    ]),
  ];

  const docDefinition: any = {
    pageSize: PAGE_OFICIO_VERTICAL,
pageOrientation: 'portrait',
pageMargins: [42, 82, 42, 62],

background: crearBackgroundMembretado(membreteBase64),

header: crearHeaderInstitucionalVertical(
  logoBase64,
  'REPORTE LEGALIZACIÓN',
),

footer: crearFooterInstitucional(),

    content: [

      { text: titulo, style: 'title', margin: [0, 22, 0, 8] },

      {
        text:
          'El presente reporte contiene el detalle de los requisitos sujetos a legalización presencial, incluyendo recepción física, revisión, legalización, rechazo y entrega final según el flujo institucional configurado.',
        style: 'paragraph',
      },

      {
        margin: [0, 14, 0, 14],
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            [
            { text: 'Generado por:', style: 'infoLabel' },
            { text: generadoPor || 'Usuario del sistema', style: 'infoValue' },
            { text: 'Área / rol:', style: 'infoLabel' },
            { text: generadoPorRol || 'No registrado', style: 'infoValue' },
            ],
            [
            { text: 'CI del usuario:', style: 'infoLabel' },
            { text: generadoPorCi || 'No registrado', style: 'infoValue' },
            { text: 'Fecha de generación:', style: 'infoLabel' },
            { text: fechaGeneracion, style: 'infoValue' },
            ],
            [
              { text: 'Fecha de generación:', style: 'infoLabel' },
              { text: fechaGeneracion, style: 'infoValue' },
              { text: 'Vista:', style: 'infoLabel' },
              { text: filtros.vista, style: 'infoValue' },
            ],
            [
              { text: 'Filtro estudiante:', style: 'infoLabel' },
              { text: filtros.busquedaEstudiante || 'Sin filtro', style: 'infoValue' },
              { text: 'Filtro CI:', style: 'infoLabel' },
              { text: filtros.busquedaCi || 'Sin filtro', style: 'infoValue' },
            ],
            [
              { text: 'Filtro gestión:', style: 'infoLabel' },
              { text: filtros.busquedaGestion || 'Sin filtro', style: 'infoValue' },
              { text: 'Filtro beca:', style: 'infoLabel' },
              { text: filtros.busquedaBeca || 'Sin filtro', style: 'infoValue' },
            ],
            [
              { text: 'Orden:', style: 'infoLabel' },
              {
                text:
                  filtros.ordenFecha === 'DESC'
                    ? 'Más recientes primero'
                    : 'Más antiguos primero',
                style: 'infoValue',
              },
              { text: 'Total filtrado:', style: 'infoLabel' },
              { text: String(rows.length), style: 'infoValue' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },

      {
        columns: [
          { width: '*', text: `Total: ${rows.length}`, style: 'summaryTotal' },
          { width: '*', text: `Pendientes: ${pendientes}`, style: 'summaryInfo' },
          { width: '*', text: `En revisión: ${enRevision}`, style: 'summaryInfo' },
          { width: '*', text: `Legalizados: ${legalizados}`, style: 'summarySuccess' },
          { width: '*', text: `Entregados: ${entregados}`, style: 'summarySuccess' },
          { width: '*', text: `Rechazados: ${rechazados}`, style: 'summaryDanger' },
        ],
        margin: [0, 0, 0, 18],
      },

      {
        text: 'DETALLE DE LEGALIZACIONES PRESENCIALES',
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
              widths: [18, 74, 34, 68, 32, 76, 54, 48, 50],
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
            fontSize: 5.2,
          },

      {
        text:
          'Este documento fue generado automáticamente por el Sistema de Becas como respaldo institucional del proceso de legalización presencial.',
        style: 'footerNote',
        margin: [0, 28, 0, 0],
      },
    ],

    styles: {
      institution: { fontSize: 16, bold: true, color: '#1d2c40' },
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
      sectionTitle: { fontSize: 11, bold: true, color: '#0e889c' },
      tableHeader: {
        bold: true,
        color: '#ffffff',
        fontSize: 7,
        alignment: 'center',
      },
      infoLabel: { bold: true, color: '#334155', fontSize: 8.5 },
      infoValue: { color: '#475569', fontSize: 8.5 },
      summaryTotal: { bold: true, color: '#1d2c40', fontSize: 9 },
      summaryInfo: { bold: true, color: '#0369a1', fontSize: 9 },
      summarySuccess: { bold: true, color: '#047857', fontSize: 9 },
      summaryDanger: { bold: true, color: '#b91c1c', fontSize: 9 },
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
    .download(`reporte-legalizacion-${new Date().toISOString().slice(0, 10)}.pdf`);
}