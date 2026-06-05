'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { tokenStore } from '@/lib/tokenStore';
import { useRoles } from '@/components/useRoles';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export function useDashboardData(router: any) {
  const [me, setMe] = useState<any>(null);
  const [estudiante, setEstudiante] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const roles = useRoles();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const r1 = await fetch('/api/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (r1.ok) {
          const d = await r1.json();
          if (d?.accessToken) tokenStore.set(d.accessToken);
        }

        const r2 = await fetchWithAuth(`${BACKEND}/usuario/me`);
        if (!r2.ok) {
          router.replace('/login');
          return;
        }

        const data = await r2.json();
        if (!alive) return;
        setMe(data.user);

        const r3 = await fetchWithAuth(
          `${BACKEND}/estudiante/me/${data.user.personaId}`
        );

        if (r3.ok) {
          const j = await r3.json();
          setEstudiante(j.data);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      alive = false;
    };
  }, [router]);

  const handleFormSuccess = async () => {
    if (!me) return;
    const r = await fetchWithAuth(
      `${BACKEND}/estudiante/me/${me.personaId}`
    );
    if (r.ok) {
      const j = await r.json();
      setEstudiante(j.data);
    }
    setShowForm(false);
  };

  return {
    me,
    estudiante,
    roles,
    showForm,
    setShowForm,
    handleFormSuccess,
  };
}
