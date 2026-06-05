'use client';

import { fetchWithAuth } from './fetchWithAuth';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export async function apiListRutas360() {
  const r = await fetchWithAuth(`${BACKEND}/rutas360`);

  if (!r.ok) {
    throw new Error('No se pudieron cargar las rutas');
  }

  return r.json();
}

export async function apiCreateRuta360(data: {
  nombre: string;
  slug: string;
}) {
  const r = await fetchWithAuth(`${BACKEND}/rutas360`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!r.ok) {
    throw new Error('No se pudo crear la ruta');
  }

  return r.json();
}

export async function apiDeleteRuta360(id: string) {
  const r = await fetchWithAuth(`${BACKEND}/rutas360/${id}`, {
    method: 'DELETE',
  });

  if (!r.ok) {
    throw new Error('No se pudo eliminar la ruta');
  }

  return r.json();
}

export async function apiListPanoramas(rutaId?: string) {
  const qs = rutaId ? `?rutaId=${rutaId}` : '';

  const r = await fetchWithAuth(`${BACKEND}/panoramas${qs}`);

  if (!r.ok) {
    throw new Error('No se pudieron cargar panoramas');
  }

  return r.json();
}

export async function apiCreatePanorama(data: any) {
  const r = await fetchWithAuth(`${BACKEND}/panoramas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!r.ok) {
    throw new Error('No se pudo crear panorama');
  }

  return r.json();
}

export async function apiDeletePanorama(id: string) {
  const r = await fetchWithAuth(`${BACKEND}/panoramas/${id}`, {
    method: 'DELETE',
  });

  if (!r.ok) {
    throw new Error('No se pudo eliminar panorama');
  }

  return r.json();
}
export async function apiUpdatePanoramaImage(id: string, fileUrl: string) {
  const res = await fetch(`${BACKEND}/panoramas/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify({ fileUrl }),
  });

  if (!res.ok) {
    throw new Error('No se pudo actualizar la imagen del panorama');
  }

  return res.json();
}
export async function apiCreateHotspot(data: any) {
  const r = await fetchWithAuth(`${BACKEND}/hotspots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!r.ok) {
    throw new Error('No se pudo crear hotspot');
  }

  return r.json();
}

  export async function apiListHotspots(panoramaId: string) {
    const r = await fetchWithAuth(
      `${BACKEND}/hotspots?panoramaId=${panoramaId}`
    );

    if (!r.ok) {
      throw new Error('No se pudieron cargar hotspots');
    }

    return r.json();
  }
  async function compress360Image(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const maxWidth = 3000;
      const maxHeight = 1500;

      let width = img.width;
      let height = img.height;

      const scale = Math.min(maxWidth / width, maxHeight / height, 1);

      width = Math.round(width * scale);
      height = Math.round(height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);

          if (!blob) {
            resolve(file);
            return;
          }

          const newName = file.name.replace(/\.(png|jpg|jpeg)$/i, '.jpg');

          resolve(
            new File([blob], newName, {
              type: 'image/jpeg',
            })
          );
        },
        'image/jpeg',
        0.82
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}
export async function apiUpload360Image(file: File) {
  const compressedFile = await compress360Image(file);

  const formData = new FormData();
  formData.append('file', compressedFile);

  const r = await fetchWithAuth(`${BACKEND}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!r.ok) {
    throw new Error('No se pudo subir la imagen 360');
  }

  const data = await r.json();

  return data.url as string;
}