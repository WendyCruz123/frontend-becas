'use client';

export default function StatsBar({
  stats,
}: {
  stats: {
    becasTotal: number;
    becasDisponibles: number;
    postuladosAno: number;
  };
}) {
  return (
    <div className="stats-bar w-full mt-8 flex flex-col sm:flex-row justify-center items-center gap-6">

      <div className="stats-item">
        <div className="stats-icon">🎓</div>
        <div className="stats-label">Becas Totales</div>
        <div className="stats-value">{stats.becasTotal}</div>
      </div>

      <div className="stats-divider"></div>

      <div className="stats-item">
        <div className="stats-icon">📅</div>
        <div className="stats-label">Becas Disponibles</div>
        <div className="stats-value">{stats.becasDisponibles}</div>
      </div>

      <div className="stats-divider"></div>

      <div className="stats-item">
        <div className="stats-icon">👥</div>
        <div className="stats-label">Postulados del Año</div>
        <div className="stats-value">{stats.postuladosAno}</div>
      </div>

    </div>
  );
}
