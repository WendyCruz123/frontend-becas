'use client';
import { useEffect, useState } from 'react';
import UserMenu from '@/components/UserMenu';
import FondoInteractivo from './FondoInteractivo';
import { FiCalendar } from 'react-icons/fi';
import { useMe } from '@/lib/useMe';
function getNombreUsuario(me: any) {
  const nombreCompleto = [
    me?.nombre,
    me?.apellido_paterno,
    me?.apellido_materno,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return nombreCompleto || me?.username || 'USUARIO';
}

export default function TopBarShell({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
    const { me } = useMe();
const [theme, setTheme] = useState<'light' | 'dark'>(() => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  }
  return 'dark';
});

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const fechaFormateada = new Date()
  .toLocaleDateString('es-BO', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  })
  .replace('.', '')
  .replace(' de ', ' ')
  .replace(/^./, (c) => c.toUpperCase())
  .replace(/\b\w/g, (c) => c.toUpperCase());

useEffect(() => {
  document.documentElement.setAttribute(
    'data-theme',
    theme === 'dark' ? 'dark' : 'light'
  );
  localStorage.setItem('theme', theme);
}, [theme]);
  const nombreUsuario = getNombreUsuario(me);  
  return (
    <div
      className={`app-bg ${className}`}
      style={{ minHeight: '100vh', position: 'relative' }}
    >
      <FondoInteractivo />
      {/* === BARRA SUPERIOR COMPLETA (texto + menú) === */}
      <div className="top-header-bar">
        <div className="title-fisica">
          <span>Sistema de Becas</span>
          <small>Orientación y</small>
          <small>Seguimiento institucional</small>
          
        </div>
        <div className="right-header-row">

          {/* UserMenu */}
          <UserMenu />

        {/* === FECHA + SWITCH (grupo) === */}
        <div className="fecha-switch-group">
          <div className="fecha-hoy">
            <FiCalendar className="icono-fecha" />

            {mounted && fechaFormateada}
          </div>
                      {mounted && me && (
              <div className="top-user-name" title={nombreUsuario}>
                {nombreUsuario.toUpperCase()}
              </div>
            )}
          {mounted && (
            <div
              className={`modo-switch ${theme === "dark" ? "dark" : ""}`}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <div className="modo-toggle">
                <div className="toggle-btn">
                  {theme === "light" ? "☀️" : "🌙"}
                </div>
              </div>
            </div>
          )}
          
        </div>

        </div>
      </div>
      <div className="menu-shadow-mask" />

      {/* Contenido del dashboard */}
      <main
        style={{
          width: '100%',
          margin: 0,
          paddingTop: '100px',
          paddingLeft: 0,
          paddingRight: 0,
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>
    </div>
  );
}
