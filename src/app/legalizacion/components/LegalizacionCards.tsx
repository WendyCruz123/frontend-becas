'use client';

import { LegalizacionAccion, LegalizacionItem } from '../types';
import LegalizacionCard from './LegalizacionCard';

export default function LegalizacionCards({
  rows,
  onAccion,
  onRechazar,
}: {
  rows: LegalizacionItem[];
  onAccion: (id: number, accion: LegalizacionAccion) => void;
  onRechazar: (item: LegalizacionItem) => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl bg-white/70 p-5 text-sm font-semibold text-slate-600 shadow-sm">
        No hay registros para mostrar.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {rows.map((item) => (
        <LegalizacionCard
          key={item.id}
          item={item}
          onAccion={onAccion}
          onRechazar={onRechazar}
        />
      ))}
    </div>
  );
}