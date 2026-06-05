import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { LegalizacionAccion, LegalizacionData } from './types';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

// export async function apiMisPendientesLegalizacion(): Promise<LegalizacionData> {
//   const r = await fetchWithAuth(`${BACKEND}/legalizacion/mis-pendientes`);

//   if (!r.ok) {
//     const d = await r.json().catch(() => ({}));
//     throw new Error(d?.message || 'No se pudo cargar legalizaciones.');
//   }

//   return r.json();
// }
export async function apiMisPendientesLegalizacion(
  gestion?: string,
): Promise<LegalizacionData> {
  const qs = new URLSearchParams();

  if (gestion) {
    qs.set('gestion', gestion);
  }

  const r = await fetchWithAuth(
    `${BACKEND}/legalizacion/mis-pendientes?${qs.toString()}`
  );

  if (!r.ok) {
    const d = await r.json().catch(() => ({}));
    throw new Error(d?.message || 'No se pudo cargar legalizaciones.');
  }

  return r.json();
}
export async function apiAccionLegalizacion(params: {
  id: number;
  accion: LegalizacionAccion;
  observacion?: string;
}) {
  const r = await fetchWithAuth(
    `${BACKEND}/legalizacion/${params.id}/${params.accion}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ observacion: params.observacion ?? '' }),
    },
  );

  if (!r.ok) {
    const d = await r.json().catch(() => ({}));
    throw new Error(d?.message || 'No se pudo procesar la acción.');
  }

  return r.json();
}