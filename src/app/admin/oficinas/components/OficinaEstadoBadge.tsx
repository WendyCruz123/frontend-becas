'use client';

export function OficinaEstadoBadge({ active }: { active: boolean }) {
  return (
    <span className={`badge ${active ? 'badge-active' : 'badge-inactive'}`}>
      {active ? 'Activa' : 'Inactiva'}
    </span>
  );
}
