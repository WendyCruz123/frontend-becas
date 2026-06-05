'use client';
import { useRouter } from 'next/navigation';
import { useRoles, Role } from './useRoles';
import IconButton from './IconButton';
import { useNotificacionesSistema } from '@/hooks/useNotificacionesSistema';


type Item = {
  label: string;
  href?: string;
  src: string;
  hoverSrc: string;
  onClick?: () => void;
};

function buildItems(roles: Role[], logout: () => void): Item[] {
  const baseInicio = { label: 'INICIO', href: '/dashboard', src: '/Inicio.png', hoverSrc: '/InicioColor.jpg' };

  const baseCuenta = { label: 'CUENTA', href: '/cuenta', src: '/Perfil.png', hoverSrc: '/perfilColor.jpg' };
 const legalizacionItem = { label: 'LEGALIZACIÓN',href: '/legalizacion',src: '/legalizacion.png',hoverSrc: '/legalizaColor.png',};
  const salir = { label: 'SALIR', onClick: logout, src: '/salir.png', hoverSrc: '/salirColor.jpg' };

  const estudianteSet = [baseInicio, baseCuenta,salir,];

  const adminSet = [
    baseInicio,
    // baseBecas,
    { label: 'CREAR BECAS', href: '/admin/becas', src: '/crearBeca.png', hoverSrc: '/crearBecaColor.jpg' },
    baseCuenta,
    { label: 'ADMINISTRAR OFICINAS', href: '/admin/oficinas', src: '/administrarOficina.png', hoverSrc: '/administrarOficinaColor.jpg' },
    { label: 'ADMINISTRAR PERSONAS', href: '/admin/personas', src: '/administrarUsuario.png', hoverSrc: '/administrarUsuarioColor.jpg' },
    { label: 'REPORTES', href: '/reportes', src: '/notificaciones.png', hoverSrc: '/notificacionesColor.jpg' },
    legalizacionItem,{ label: 'ENCARGADO', href: '/encargado', src: '/encargado.png', hoverSrc: '/encargadocolor.png' },
    salir,
  ];
    const legalizacionSet = [
    baseInicio,
    legalizacionItem,
    baseCuenta,
    salir,
  ];
const encargadoSet = [
  baseInicio,
  {
    label: 'ENCARGADO', href: '/encargado', src: '/encargado.png', hoverSrc: '/encargadocolor.png',
  },
  baseCuenta,
  salir,
];

if (roles.includes('admin')) return adminSet;
if (roles.includes('kardex')) return legalizacionSet;
if (roles.includes('director')) return legalizacionSet;
if (roles.includes('encargado')) return encargadoSet;
if (roles.includes('estudiante')) return estudianteSet;
  // si no hay roles
  return [baseInicio, salir];
}

export default function UserMenu() {
  const router = useRouter();
  const roles = useRoles();
  const { noLeidas } = useNotificacionesSistema();

  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    router.replace('/');
  };

  const items = buildItems(roles, logout);

return (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      overflow: 'hidden',
    }}
  >
    {/* MENU DESLIZABLE */}
    <div
      className="menu-bar"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        overflowX: 'auto',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
        WebkitOverflowScrolling: 'touch',
        scrollSnapType: 'x mandatory',
        padding: '6px 4px',
        maxWidth: '100%',
        scrollbarWidth: 'none',
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            flex: '0 0 auto',
            scrollSnapAlign: 'center',
          }}
        >
          <IconButton
            src={item.src}
            hoverSrc={item.hoverSrc}
            alt={item.label}
            onClick={item.onClick ?? (() => router.push(item.href!))}
          />
        </div>
      ))}
    </div>

    {/* 🔔 NOTIFICACIONES FIJO */}
    <button
      style={{
        width: 62,
        height: 62,
        minWidth: 62,
        borderRadius: '50%',
        border: '2px solid #00e5ff',
        background: '#f5f5f5',
        boxShadow: '0 4px 15px rgba(0,0,0,.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: '0.25s',
        position: 'relative',
        flexShrink: 0,
      }}
      onClick={() => router.push('/notificaciones')}
    >
      <img
        src="/notificacion.png"
        alt="Notificaciones"
        style={{
          width: 34,
          height: 34,
          objectFit: 'contain',
        }}
      />

      {noLeidas > 0 && (
        <span
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            minWidth: 22,
            height: 22,
            borderRadius: '50%',
            background: '#ff2d55',
            color: '#fff',
            fontSize: 12,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 5px',
            boxShadow: '0 2px 8px rgba(0,0,0,.25)',
          }}
        >
          {noLeidas > 99 ? '99+' : noLeidas}
        </span>
      )}
    </button>
  </div>
);
}
