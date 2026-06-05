'use client';

import MallaFisica from '@/components/MallaFisica';
import StatsBar from './StatsBar';

export default function DashboardRight({
  theme,
  stats,
}: {
  theme: 'light' | 'dark';
  stats: {
    becasTotal: number;
    becasDisponibles: number;
    postuladosAno: number;
  };
}) {
  return (
    <div className="dashboard-right flex flex-col items-center">

      <div className="w-full max-w-[420px] h-[260px] sm:h-[320px] md:h-[380px] mx-auto relative">
        <MallaFisica theme={theme} />
      </div>

      <StatsBar stats={stats} />
    </div>
  );
}
