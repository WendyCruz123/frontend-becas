export type PersonaMini = {
  nombre?: string;
  apellido_paterno?: string | null;
  apellido_materno?: string | null;
};

export type UsuarioMini = {
  ID_usuario: number;
  username: string;

  persona?: {
    nombre?: string;
    apellido_paterno?: string | null;
    apellido_materno?: string | null;
  };

  grupo_usuario?: {
    grupo_rol?: {
      nombre?: string;
    };
  }[];
};

export type Oficina = {
  ID_oficina: number;
  nombre: string;
};

export type LegalizacionFlujoItem = {
  id?: number;
  requisitoId?: number;
  usuarioId: number;
  orden: number;
  activo?: boolean;
  usuario?: UsuarioMini;
};

export type RequisitoLegalizacionPayload = {
  usuarioId: number;
  orden: number;
};

export function nombreUsuario(u?: UsuarioMini | null) {
  if (!u) return 'Usuario no disponible';

  const nombre = [
    u.persona?.nombre,
    u.persona?.apellido_paterno,
    u.persona?.apellido_materno,
  ]
    .filter(Boolean)
    .join(' ');

  const rol =
    u.grupo_usuario?.[0]?.grupo_rol?.nombre?.toUpperCase() ?? 'SIN ROL';

  return `${nombre || u.username} - ${rol}`;
}