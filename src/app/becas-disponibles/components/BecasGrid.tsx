import { BecaRow } from '../types';
import { BecaCard } from './BecaCard';
import { HistorialPostulacionesCards } from './HistorialPostulacionesCards';

export function BecasGrid({
  rows,
  modo = 'vigentes',
}: {
  rows: BecaRow[];
  modo?: 'vigentes' | 'historial';
}) {
  if (modo === 'historial') {
    return <HistorialPostulacionesCards rows={rows} />;
  }

  return (
    <div
      className="
        grid w-full grid-cols-1 gap-5
        sm:grid-cols-2
        xl:grid-cols-3
      "
    >
      {rows.map((b) => (
        <BecaCard key={b.ID_postulacion ?? b.ID_beca} beca={b} />
      ))}
    </div>
  );
}