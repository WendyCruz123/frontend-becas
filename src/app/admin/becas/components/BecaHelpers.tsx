'use client';

import { Beca } from '../hooks/useBecas';

export function renderEstado(b: Beca) {
  return (
    <span className={`estado ${b.estado ? 'activo' : 'inactivo'}`}>
      {b.estado ? 'Activo' : 'Inactivo'}
    </span>
  );
}

export function renderFechas(b: Beca) {
  return {
    inicio: new Date(b.fecha_inicio).toLocaleDateString(),
    fin: b.fecha_fin
      ? new Date(b.fecha_fin).toLocaleDateString()
      : '—',
  };
}
