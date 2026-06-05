export type Oficina = {
  ID_oficina: number;
  nombre: string;
  descripcion?: string | null;
  horario_atencion: string;
  estado_oficina: boolean;
  panorama_route_slug?: string | null;
  _count?: { panoramas: number; requisito: number };
};

export type PageResp = {
  count: number;
  rows: Oficina[];
};
