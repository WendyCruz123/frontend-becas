import { fetchWithAuth } from '@/lib/fetchWithAuth';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export async function apiListOficinas() {
  const r = await fetchWithAuth(`${BACKEND}/oficinas?limit=1000&offset=0`);
  const data = await r.json().catch(() => ({}));
  return Array.isArray(data?.rows) ? data.rows : [];
}

export async function apiListEncargados() {
  const r = await fetchWithAuth(`${BACKEND}/requisitos/encargados`);
  const data = await r.json().catch(() => []);
  return Array.isArray(data) ? data : [];
}

export async function apiListUsuariosLegalizacion() {
  const r = await fetchWithAuth(`${BACKEND}/requisitos/usuarios-legalizacion`);
  const data = await r.json().catch(() => []);
  return Array.isArray(data) ? data : [];
}

export async function apiUploadRequisitoFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BACKEND}/files/requisitos`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Error al subir el documento');
  }

  const data = await res.json();
  return data.url as string;
}

export async function apiSaveRequisito(params: {
  mode: 'create' | 'edit';
  requisitoId?: number;
  payload: any;
}) {
  const url =
    params.mode === 'create'
      ? `${BACKEND}/requisitos`
      : `${BACKEND}/requisitos/${params.requisitoId}`;

  const method = params.mode === 'create' ? 'POST' : 'PATCH';

  const r = await fetchWithAuth(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params.payload),
  });

  if (!r.ok) {
    const d = await r.json().catch(() => ({}));
    const errorMsg = Array.isArray(d?.message)
      ? d.message.join(' | ')
      : d?.message || 'Error al guardar';

    throw new Error(errorMsg);
  }

  return r.json();
}