import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { BecaResumen, PostulacionDetalle, PasoPorBeca } from '../types';

(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs;

type UsuarioPdf = {
  nombre?: string | null;
  apellido_paterno?: string | null;
  apellido_materno?: string | null;
  ci?: string | null;
  username?: string | null;
};

type Props = {
  beca: BecaResumen;
  tramite: PostulacionDetalle;
  pasos: PasoPorBeca[];
  gestion: string;
  progreso: number;
  estudiante?: UsuarioPdf | null;
};

export function generarAvalPdf({
  beca,
  tramite,
  pasos,
  gestion,
  progreso,
  estudiante,
}: Props) {
  const fecha = new Date().toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const nombreEstudiante = (
  [
    estudiante?.nombre,
    estudiante?.apellido_paterno,
    estudiante?.apellido_materno,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || estudiante?.username || 'No registrado'
).toUpperCase();

  const ciEstudiante = estudiante?.ci || 'No registrado';

  const requisitos = pasos.map((p, index) => {
    const cumplido =
      tramite.paso_estudiante.find(
        (pe) => pe.pasoBecaId === p.ID_pasosBeca
      )?.completado ?? false;

    return [
      index + 1,
      p.requisito.nombre,
      p.requisito.descripcion || '—',
      cumplido ? 'CUMPLIDO' : 'NO CUMPLIDO',
    ];
  });

  const docDefinition: any = {
    pageSize: 'LETTER',
    pageMargins: [45, 50, 45, 50],

    content: [
      { text: 'UNIVERSIDAD PÚBLICA DE EL ALTO', style: 'institution' },
      {
        text: 'CARRERA DE CIENCIAS FÍSICAS Y ENERGÍAS ALTERNATIVAS',
        style: 'subInstitution',
      },
      {
        text: 'AVAL DE CUMPLIMIENTO DE REQUISITOS',
        style: 'title',
        margin: [0, 25, 0, 10],
      },
      {
        text: `Fecha de emisión: ${fecha}`,
        alignment: 'right',
        fontSize: 10,
        margin: [0, 0, 0, 20],
      },

      {
        text:
          `El presente documento certifica que el estudiante ${nombreEstudiante}, con C.I. ${ciEstudiante}, realizó el registro digital del cumplimiento de requisitos correspondientes al trámite de postulación a la beca indicada.`,
        style: 'paragraph',
      },

      {
        table: {
          widths: ['35%', '65%'],
          body: [
            ['Beca', beca.nombre],
            ['Tipo de beca', beca.tipo || '—'],
            ['Gestión', gestion],
            ['Progreso registrado', `${progreso}%`],
            ['Observación', tramite.estado_observacion || 'SIN OBSERVACION'],
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 15, 0, 20],
      },

      { text: 'Detalle de requisitos cumplidos', style: 'sectionTitle' },

      {
        table: {
          headerRows: 1,
          widths: [25, '*', '*', 80],
          body: [
            [
              { text: 'N°', style: 'tableHeader' },
              { text: 'Requisito', style: 'tableHeader' },
              { text: 'Descripción', style: 'tableHeader' },
              { text: 'Estado', style: 'tableHeader' },
            ],
            ...requisitos,
          ],
        },
        layout: {
          fillColor: (rowIndex: number) => (rowIndex === 0 ? '#0f766e' : null),
          hLineColor: () => '#d1d5db',
          vLineColor: () => '#d1d5db',
        },
        margin: [0, 8, 0, 25],
      },

      {
        text:
          'Este aval tiene carácter informativo y respalda el cumplimiento de requisitos. La validación final corresponde al personal encargado de la revisión documental.',
        style: 'note',
      },

      {
  alignment: 'center',
  margin: [0, 60, 0, 0],
  stack: [
    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 220,
          y2: 0,
          lineWidth: 1,
        },
      ],
    },
    {
      text: 'Firma del estudiante',
      alignment: 'center',
      fontSize: 10,
      margin: [0, 6, 0, 2],
    },
    {
      text: nombreEstudiante,
      alignment: 'center',
      fontSize: 9,
    },
    {
      text: `C.I.: ${ciEstudiante}`,
      alignment: 'center',
      fontSize: 9,
    },
  ],
},
    ],

    styles: {
      institution: {
        fontSize: 15,
        bold: true,
        alignment: 'center',
        color: '#0f172a',
      },
      subInstitution: {
        fontSize: 10,
        bold: true,
        alignment: 'center',
        color: '#334155',
      },
      title: {
        fontSize: 17,
        bold: true,
        alignment: 'center',
        color: '#0f766e',
      },
      sectionTitle: {
        fontSize: 13,
        bold: true,
        color: '#0f172a',
        margin: [0, 10, 0, 6],
      },
      paragraph: {
        fontSize: 11,
        lineHeight: 1.35,
        alignment: 'justify',
        color: '#1f2937',
      },
      tableHeader: {
        bold: true,
        color: '#ffffff',
        fontSize: 10,
      },
      note: {
        fontSize: 10,
        italics: true,
        alignment: 'justify',
        color: '#475569',
      },
    },

    defaultStyle: {
      fontSize: 10,
    },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`aval-requisitos-${beca.nombre}-${gestion}.pdf`);
}