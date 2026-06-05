import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  UnderlineType,
} from 'docx';

type Props = {
  estudiante: any;
  beca: any;
};

function p(text = '') {
  return new Paragraph({ text });
}

function bold(text: string, size = 24) {
  return new TextRun({ text, bold: true, size });
}

function normal(text: string, size = 24) {
  return new TextRun({ text, size });
}

export async function generarCartaDirectorDocx({ estudiante, beca }: Props) {
  const fecha = new Date().toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'long',
  });

  const nombreCompleto = `
    ${estudiante?.nombre ?? ''}
    ${estudiante?.apellido_paterno ?? ''}
    ${estudiante?.apellido_materno ?? ''}
  `.replace(/\s+/g, ' ').trim();

  const becaNombre = beca?.nombre?.toUpperCase() ?? 'BECA';

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1200,
              right: 1200,
              bottom: 1000,
              left: 1200,
            },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [normal(`El Alto, ${fecha}`)],
          }),

          p(''),
          p(''),

          new Paragraph({ children: [normal('Sr.:')] }),

          new Paragraph({
            children: [normal('[nombre de director]')],
          }),

          new Paragraph({ children: [bold('DIRECTOR DE CARRERA')] }),
          new Paragraph({
            children: [bold('CIENCIAS FÍSICAS Y ENERGÍAS ALTERNATIVAS')],
          }),
          new Paragraph({
            children: [bold('UNIVERSIDAD PÚBLICA DE EL ALTO')],
          }),
          new Paragraph({ children: [normal('Presente. –')] }),

          p(''),
          p(''),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `REF: SOLICITUD POSTULACIÓN A ${becaNombre}`,
                bold: true,
                underline: { type: UnderlineType.SINGLE },
                size: 24,
              }),
            ],
          }),

          p(''),
          p(''),

          new Paragraph({
            children: [bold('De mi mayor consideración:')],
          }),

          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 220 },
            children: [
              normal(
                'A través de la presente lo saludo agradeciéndole por el desempeño por el bien común de la carrera.',
              ),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 220 },
            children: [
              normal('El motivo de la presente es para '),
              bold(`SOLICITAR MI POSTULACIÓN A LA ${becaNombre}`),
              normal(
                ', con el cual cumplo en la totalidad de los requisitos señalados en la convocatoria publicada.',
              ),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 220 },
            children: [
              normal(
                'Sin otro en particular, me despido y quedo muy agradecido por la oportunidad presentada.',
              ),
            ],
          }),

          p(''),
          new Paragraph({ children: [normal('Atentamente,')] }),

          p(''),
          p(''),
          p(''),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [normal('________________________')],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [bold(`UNIV.: ${nombreCompleto}`, 24)],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [bold(`C.I.: ${estudiante?.ci ?? '__________'}`, 24)],
          }),

          new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [
    bold(
      `R.U.: ${
        estudiante?.ru ||
        estudiante?.registro_universitario ||
        '__________'
      }`,
      24
    ),
  ],
}),

new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [
    bold(
      `CEL.: ${
        estudiante?.celular ||
        estudiante?.telefono ||
        '__________'
      }`,
      24
    ),
  ],
}),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `Carta_Director_${becaNombre}.docx`;
  a.click();

  window.URL.revokeObjectURL(url);
}