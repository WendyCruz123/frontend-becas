'use client';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { Postulacion } from '../types';
import {
  PAGE_OFICIO_VERTICAL,
  crearBackgroundMembretado,
  crearHeaderInstitucionalVertical,
  crearFooterInstitucional,
} from '@/lib/pdf/plantillaInstitucional';

import { imageToBase64 } from '@/lib/pdf/imageToBase64';
(pdfMake as any).vfs = (pdfFonts as any).vfs;

type ReportePostulacionesParams = {
  rows: Postulacion[];
  rowsEstadisticas?: Postulacion[];
  generadoPor: string;
  generadoPorCi?: string;
  filtros: {
    year: number | '';
    searchEstudiante: string;
    searchBeca: string;
    fechaInicio: string;
    fechaFin: string;
    estadoFiltro: string;
  };
};
export async function generarReportePostulacionesPdf({
  rows,
  rowsEstadisticas = rows,
  generadoPor,
  generadoPorCi,
  filtros,
}: ReportePostulacionesParams) {
  const fechaGeneracion = new Date().toLocaleString('es-BO');
  const logoBase64 = await imageToBase64('/logo.png');
  const membreteBase64 = await imageToBase64('/membretada.png');
const ESTADOS_REPORTE: string[] = [
  'EN_PROCESO',
  'PENDIENTE',
  'HABILITADO',
  'REMITIDO_A_DISBECT',
  'NO_REMITIDO',
  'OBSERVADO',
  'APROBADO',
  'REPROBADO',
  'ABANDONADO',
];

const COLORES_ESTADO: Record<string, string> = {
  EN_PROCESO: '#38bdf8',
  PENDIENTE: '#f59e0b',
  HABILITADO: '#6366f1',
  REMITIDO_A_DISBECT: '#8b5cf6',
  NO_REMITIDO: '#64748b',
  OBSERVADO: '#f97316',
  APROBADO: '#22c55e',
  REPROBADO: '#ef4444',
  ABANDONADO: '#334155',
};

const agruparPorBeca = rowsEstadisticas.reduce((acc, row) => {
  const beca = row.beca_nombre || 'Sin beca registrada';
  const estado =
    row.estado_observacion === 'OBSERVADO'
      ? 'OBSERVADO'
      : row.estado || 'SIN_ESTADO';

  if (!acc[beca]) {
    acc[beca] = {
      total: 0,
      tipo: row.beca_tipo || '—',
      cupos: row.beca_cupos ?? null,
      estados: {},
    };
  }

  acc[beca].total += 1;
  acc[beca].estados[estado] = (acc[beca].estados[estado] || 0) + 1;

  return acc;
}, {} as Record<
  string,
  {
    total: number;
    tipo: string;
    cupos: number | null;
    estados: Record<string, number>;
  }
>);
function crearTortaSvg(
  estados: Record<string, number>,
  total: number,
  estadoResaltado: string,
) {
  if (total === 0) {
    return `<svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="42" fill="#e2e8f0"/>
    </svg>`;
  }

  let acumulado = 0;
  const cx = 60;
  const cy = 60;
const r = 42;

  const segmentos = ESTADOS_REPORTE
    .filter((estado) => estados[estado])
    .map((estado) => {
      const valor = estados[estado];
      const inicio = (acumulado / total) * Math.PI * 2;
      acumulado += valor;
      const fin = (acumulado / total) * Math.PI * 2;

      const x1 = cx + r * Math.cos(inicio);
      const y1 = cy + r * Math.sin(inicio);
      const x2 = cx + r * Math.cos(fin);
      const y2 = cy + r * Math.sin(fin);

      const largeArc = fin - inicio > Math.PI ? 1 : 0;
      const color = COLORES_ESTADO[estado] || '#94a3b8';

      const opacidad =
        estadoResaltado !== 'TODOS' && estado !== estadoResaltado ? 0.35 : 1;

      return `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${color}" opacity="${opacidad}"/>`;
    })
    .join('');

  return `<svg width="120" height="120" viewBox="0 0 120 120">
    ${segmentos}
    <circle cx="60" cy="60" r="19" fill="#ffffff"/>
    <text x="60" y="58" font-size="10" font-weight="bold" text-anchor="middle" fill="#1e293b">${total}</text>
  </svg>`;
}
const datosEstadisticos = (
  Object.entries(agruparPorBeca) as [
    string,
    {
      total: number;
      tipo: string;
      cupos: number | null;
      estados: Record<string, number>;
    },
  ][]
);
const esReporteGeneral = !filtros.searchBeca.trim();

const estadosGenerales = rowsEstadisticas.reduce((acc, row) => {
  const estado =
    row.estado_observacion === 'OBSERVADO'
      ? 'OBSERVADO'
      : row.estado || 'SIN_ESTADO';

  acc[estado] = (acc[estado] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const totalGeneralPostulaciones = rowsEstadisticas.length;

const totalGeneralCupos = Object.values(agruparPorBeca).reduce(
  (sum, beca) => sum + (beca.cupos ?? 0),
  0,
);

const totalGeneralAprobados = estadosGenerales['APROBADO'] || 0;

const acefaliaGeneral = Math.max(
  totalGeneralCupos - totalGeneralAprobados,
  0,
);

function recortarTexto(texto: string, max = 18) {
  return texto.length > max ? `${texto.slice(0, max)}...` : texto;
}

function crearMiniTorta(
  beca: string,
  data: {
    total: number;
    tipo: string;
    cupos: number | null;
    estados: Record<string, number>;
  },
) {
  const leyenda = ESTADOS_REPORTE
    .filter((estado) => data.estados[estado])
    .slice(0, 3)
    .map((estado) => {
      const cantidad = data.estados[estado];
      return {
        columns: [
          {
            width: 5,
            canvas: [
              {
                type: 'ellipse',
                x: 2.5,
                y: 3,
                r1: 2,
                r2: 2,
                color: COLORES_ESTADO[estado] || '#94a3b8',
              },
            ],
          },
          {
            width: '*',
            text: `${filtrosTexto(estado)} (${cantidad})`,
            fontSize: 4.3,
            color: '#334155',
          },
        ],
        columnGap: 2,
        margin: [0, 0.5, 0, 0.5],
      };
    });
const totalCupos = data.cupos ?? null;
const aprobados = data.estados['APROBADO'] || 0;

const acefalia =
  totalCupos !== null ? Math.max(totalCupos - aprobados, 0) : null;
  return {
    width: '*',
    stack: [
      {
        text: recortarTexto(beca, 22),
        bold: true,
        fontSize: 4.8,
        color: '#16324f',
        alignment: 'center',
        margin: [0, 0, 0, 1.5],
      },
      {
  text: totalCupos !== null ? `Total cupos: ${totalCupos}` : 'Total cupos: —',
  fontSize: 4.4,
  bold: true,
  color: '#16a34a',
  alignment: 'center',
  margin: [0, 0, 0, 0.5],
},
{
  text:
    acefalia !== null
      ? `Acefalía: ${acefalia}`
      : 'Acefalía: —',
  fontSize: 4.4,
  bold: true,
  color: '#dc2626',
  alignment: 'center',
  margin: [0, 0, 0, 1],
},
      {
        svg: crearTortaSvg(data.estados, data.total, filtros.estadoFiltro),
        width: 44,
        alignment: 'center',
        margin: [0, 0, 0, 1],
      },
      {
        text: `${data.total} Total`,
        fontSize: 4.5,
        bold: true,
        color: '#475569',
        alignment: 'center',
        margin: [0, 0, 0, 1.5],
      },
      ...leyenda,
    ],
    margin: [1.5, 0, 1.5, 4],
  };
}

const bloquesEstadisticos = [];

for (let i = 0; i < datosEstadisticos.length; i += 8) {
  const grupo = datosEstadisticos.slice(i, i + 8);

  bloquesEstadisticos.push({
    columns: [
      ...grupo.map(([beca, data]) => crearMiniTorta(beca, data)),
      ...Array.from({ length: 8 - grupo.length }).map(() => ({
        width: '*',
        text: '',
      })),
    ],
    columnGap: 2,
    margin: [0, 0, 0, 5],
  });
}

function filtrosTexto(value: string) {
  return value.replaceAll('_', ' ');
}
  const body = [
    [
      { text: 'N°', style: 'tableHeader' },
      { text: 'Estudiante', style: 'tableHeader' },
      { text: 'CI', style: 'tableHeader' },
      { text: 'Beca', style: 'tableHeader' },
      { text: 'Tipo', style: 'tableHeader' }, 
      { text: 'Fecha postulación', style: 'tableHeader' },
      { text: 'Estado', style: 'tableHeader' },
      { text: 'Fecha estado', style: 'tableHeader' },
      { text: 'Actualizado por', style: 'tableHeader' },
    ],
    ...rows.map((row, index) => [
      index + 1,
      `${row.nombre} ${row.apellido_paterno} ${row.apellido_materno}`,
      row.ci || '—',
      row.beca_nombre || '—',
      row.beca_tipo || '—',
      row.fecha ? new Date(row.fecha).toLocaleDateString('es-BO') : '—',
      row.estado || '—',
      row.fecha_estado_final
  ? new Date(row.fecha_estado_final).toLocaleString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  : '—',
row.usuario_estado_final || '—',
    ]),
  ];

const docDefinition: any = {
pageSize: PAGE_OFICIO_VERTICAL,
pageOrientation: 'portrait',
pageMargins: [42, 82, 42, 62],

background: crearBackgroundMembretado(membreteBase64),

header: crearHeaderInstitucionalVertical(
  logoBase64,
  'REPORTE ADMINISTRATIVO',
),

footer: crearFooterInstitucional(),
    content: [
      {
        text: 'REPORTE DE POSTULACIONES A BECAS',
        style: 'title',
        margin: [0, 5, 0, 8],
      },

      {
        text:
          'El presente reporte contiene el detalle de los estudiantes que realizaron su postulación a las becas registradas en el sistema. Este documento es generado por administración como respaldo institucional del seguimiento y control de postulaciones.',
        style: 'paragraph',
      },

      {
        margin: [0, 14, 0, 14],
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            [
              { text: 'Generado por:', style: 'infoLabel' },
              { text: generadoPor || 'Usuario administrador', style: 'infoValue' },
              { text: 'CI del usuario:', style: 'infoLabel' },
              { text: generadoPorCi || 'No registrado', style: 'infoValue' },
            ],
            [
              { text: 'Fecha de generación:', style: 'infoLabel' },
              { text: fechaGeneracion, style: 'infoValue' },
              { text: 'Gestión / año:', style: 'infoLabel' },
              { text: filtros.year || 'Sin filtro', style: 'infoValue' },
            ],
            [
              { text: 'Filtro estudiante / CI:', style: 'infoLabel' },
              {
                text: filtros.searchEstudiante || 'Sin filtro',
                style: 'infoValue',
              },
              { text: 'Filtro beca:', style: 'infoLabel' },
              { text: filtros.searchBeca || 'Sin filtro', style: 'infoValue' },
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
              { text: 'Estado:', style: 'infoLabel' },
              { text: filtros.estadoFiltro || 'TODOS', style: 'infoValue' },
            ],
            [
              { text: 'Total de registros:', style: 'infoLabel' },
              { text: String(rows.length), style: 'infoValue' },
              { text: '', style: 'infoLabel' },
              { text: '', style: 'infoValue' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },
      {
        text: 'RESUMEN ESTADÍSTICO POR BECA',
        style: 'sectionTitle',
        margin: [0, 8, 0, 8],
      },

rowsEstadisticas.length === 0
  ? {
      text: 'No existen datos estadísticos para los filtros seleccionados.',
      style: 'emptyText',
    }
  : esReporteGeneral
    ? {
    columns: [
      { width: '*', text: '' },
      {
        width: 270,
        stack: [
          {
            text: 'RESUMEN GENERAL',
            bold: true,
            fontSize: 10,
            color: '#16324f',
            alignment: 'center',
            margin: [0, 0, 0, 4],
          },
          {
            columns: [
              {
                width: 90,
                stack: [
                  {
                    svg: crearTortaSvg(
                      estadosGenerales,
                      totalGeneralPostulaciones,
                      filtros.estadoFiltro,
                    ),
                    width: 75,
                    alignment: 'center',
                    margin: [0, 0, 0, 2],
                  },
                  {
                    text: `${totalGeneralPostulaciones} postulaciones`,
                    fontSize: 7,
                    bold: true,
                    color: '#475569',
                    alignment: 'center',
                    margin: [0, 0, 0, 0],
                  },
                ],
              },
              {
                width: 190,
                stack: [
                  {
                    text: `Total cupos: ${totalGeneralCupos}`,
                    fontSize: 8,
                    bold: true,
                    color: '#16a34a',
                    margin: [0, 6, 0, 2],
                  },
                  {
                    text: `Acefalía: ${acefaliaGeneral}`,
                    fontSize: 8,
                    bold: true,
                    color: '#dc2626',
                    margin: [0, 0, 0, 4],
                  },
                  ...ESTADOS_REPORTE
                    .filter((estado) => estadosGenerales[estado])
                    .map((estado) => ({
                      columns: [
                        {
                          width: 8,
                          canvas: [
                            {
                              type: 'ellipse',
                              x: 4,
                              y: 4,
                              r1: 3,
                              r2: 3,
                              color: COLORES_ESTADO[estado] || '#94a3b8',
                            },
                          ],
                        },
                        {
                          width: '*',
                          text: `${filtrosTexto(estado)}: ${estadosGenerales[estado]}`,
                          fontSize: 6.8,
                          bold: true,
                          color: COLORES_ESTADO[estado] || '#334155',
                        },
                      ],
                      columnGap: 3,
                      margin: [0, 0.8, 0, 0.8],
                    })),
                ],
              },
            ],
            columnGap: 8,
          },
        ],
      },
      { width: '*', text: '' },
    ],
    margin: [0, 0, 0, 8],
  }
    : {
        stack: bloquesEstadisticos,
      },
      {
        text: 'DETALLE DE POSTULACIONES',
        style: 'sectionTitle',
        margin: [0, 8, 0, 8],
      },

      rows.length === 0
        ? {
            text: 'No existen registros para los filtros seleccionados.',
            style: 'emptyText',
          }
        : {
    columns: [
      { width: '*', text: '' },
      {
        width: 600,
        table: {
          headerRows: 1,
          widths: [10, 82, 35, 66, 43, 48, 44, 55, 60],
          body,
        },
        alignment: 'center',
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
        fontSize: 5.6,
      },
      { width: '*', text: '' },
    ],
  },
      {
        text:
          'Este documento fue generado automáticamente por el Sistema de Becas como aval administrativo de los registros de postulación visualizados según los filtros aplicados.',
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
    .download(`reporte-postulaciones-${new Date().toISOString().slice(0, 10)}.pdf`);
}