import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';

type Props = {
  estudiante: any;
  beca: any;
};

const border = {
  style: BorderStyle.SINGLE,
  size: 12,
  color: '000000',
};

const noBorder = {
  style: BorderStyle.NONE,
  size: 0,
  color: 'FFFFFF',
};

function run(text: string, size = 34, bold = true, font = 'Arial') {
  return new TextRun({ text, size, bold, font });
}

function pCenter(children: TextRun[], spacingAfter = 80) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: spacingAfter },
    children,
  });
}

function pLeft(children: TextRun[], spacingAfter = 190) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: spacingAfter },
    children,
  });
}

async function getLogoBuffer() {
  const res = await fetch('/logoupea.png');
  return await res.arrayBuffer();
}

export async function generarCaratulaBecaDocx({ estudiante, beca }: Props) {
  const becaNombre = beca?.nombre?.toUpperCase() ?? 'BECA';
  const logoBuffer = await getLogoBuffer();

  const paterno = `${estudiante?.apellido_paterno ?? ''}`.toUpperCase();
  const materno = `${estudiante?.apellido_materno ?? ''}`.toUpperCase();
  const nombre = `${estudiante?.nombre ?? ''}`.toUpperCase();

  const inicial = paterno?.[0] ?? '';

  const inicialBox = new Table({
    alignment: AlignmentType.RIGHT,
    width: { size: 1700, type: WidthType.DXA },
    borders: {
      top: border,
      bottom: border,
      left: border,
      right: border,
      insideHorizontal: border,
      insideVertical: border,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            margins: {
              top: 90,
              bottom: 90,
              left: 90,
              right: 90,
            },
            children: [
              pCenter([run('INICIAL PATERNO', 11, true)], 50),
              pCenter([run(inicial, 70, true, 'Times New Roman')], 0),
            ],
          }),
        ],
      }),
    ],
  });

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: noBorder,
      bottom: noBorder,
      left: noBorder,
      right: noBorder,
      insideHorizontal: noBorder,
      insideVertical: noBorder,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            borders: {
              top: noBorder,
              bottom: noBorder,
              left: noBorder,
              right: noBorder,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new ImageRun({
                    data: logoBuffer,
                    type: 'png',
                    transformation: {
                      width: 65,
                      height: 65,
                    },
                  }),
                ],
              }),
            ],
          }),

          new TableCell({
            width: { size: 85, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: {
              top: noBorder,
              bottom: noBorder,
              left: noBorder,
              right: noBorder,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Universidad Pública de El Alto',
                    bold: true,
                    size: 38,
                    font: 'Monotype Corsiva',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const mainTable = new Table({
    alignment: AlignmentType.CENTER,
    width: {
      size: 8500,
      type: WidthType.DXA,
    },
    borders: {
      top: border,
      bottom: border,
      left: border,
      right: border,
      insideHorizontal: noBorder,
      insideVertical: noBorder,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            margins: {
              top: 250,
              bottom: 650,
              left: 250,
              right: 250,
            },
            children: [
              headerTable,

              pCenter([run('PROGRAMA:', 34)], 60),
              pCenter([run(`“${becaNombre}”`, 36)], 40),

              inicialBox,

              pCenter(
                [
                  run('Carrera: ', 34),
                  run(
                    `${estudiante?.carrera ?? 'CIENCIAS FÍSICAS Y ENERGÍAS ALTERNATIVAS'}`.toUpperCase(),
                    34,
                  ),
                ],
                200,
              ),

              
              pLeft([run('SEDE: '), run('......')], 260),

              pLeft([run('APELLIDO PATERNO: '), run(paterno)]),
              pLeft([run('APELLIDO MATERNO: '), run(materno)]),
              pLeft([run('NOMBRE (S): '), run(nombre)]),

              pLeft([
                run('C.I.: '),
                run(`${estudiante?.ci ?? '__________'}`),
              ]),

              pLeft([
                run('R.U.: '),
                run(`${estudiante?.ru ?? '__________'}`),
              ]),

              pLeft([
                run('CEL.: '),
                run(`${estudiante?.celular ?? '__________'}`),
              ]),

              pLeft([run('Nº de Hnos. que estudian en la UPEA:.........')]),

              pLeft([run('Nº DE FOJAS: '), run('......')], 260),

              pCenter([run('EL ALTO - BOLIVIA', 32)], 420),
            ],
          }),
        ],
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 700,
              right: 700,
              bottom: 700,
              left: 700,
            },
          },
        },
        children: [mainTable],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `Caratula_${becaNombre}.docx`;
  a.click();

  window.URL.revokeObjectURL(url);
}