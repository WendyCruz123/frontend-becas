export type Ruta360 = {
  id: string;
  nombre: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  panoramas?: Panorama360[];
};

export type Panorama360 = {
  id: string;
  rutaId?: string | null;
  oficina_id?: number | null;
  name: string;
  fileUrl: string;
  projection?: string | null;
  publicado: boolean;
  orden: number;
  es_portada: boolean;
  createdAt: string;
  updatedAt: string;
  hotspots?: Hotspot360[];
};

export type HotspotType = 'INFORMACION' | 'LINK';

export type IconType = 'INFO' | 'FLECHA';

export type Hotspot360 = {
  id: string;
  panoramaId: string;
  type: HotspotType;
  x: number;
  y: number;
  z: number;
  icon: IconType;
  titulo?: string | null;
  contenido?: string | null;
  orden?: number | null;
  activo: boolean;
  link?: {
    id: string;
    hotspotId: string;
    targetPanoramaId: string;
    transition?: string | null;
  } | null;
};

export type CapturedPoint = {
  yaw: number;
  pitch: number;
};