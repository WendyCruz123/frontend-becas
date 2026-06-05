'use client';

import '@/app/neumorphismo.css';
import '@/styles/dashboard.css';


import { useRouter } from 'next/navigation';


import { useDashboardData } from './hooks/useDashboardData';
import { useDashboardStats } from './hooks/useDashboardStats';
import { useThemeObserver } from './hooks/useThemeObserver';

import DashboardLeft from './components/DashboardLeft';
import DashboardRight from './components/DashboardRight';

export default function DashboardPage() {
  const router = useRouter();

  const {
    me,
    estudiante,
    roles,
    showForm,
    setShowForm,
    handleFormSuccess,
  } = useDashboardData(router);

  const stats = useDashboardStats();
  const theme = useThemeObserver();

  if (!me) return <p>Cargando...</p>;

  return (
    <div className="dashboard-container flex flex-col lg:flex-row gap-8 px-4 lg:px-12">

      <DashboardLeft
        me={me}
        estudiante={estudiante}
        roles={roles}
        onOpenForm={() => setShowForm(true)}
        router={router}
      />

      <DashboardRight
        theme={theme}
        stats={stats}
      />

    </div>
  );
}
