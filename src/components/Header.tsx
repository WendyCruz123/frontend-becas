'use client';

import Image from 'next/image';
import { useState } from 'react';
import LoginOverlay from './LoginOverlay'; // 👈 importamos directamente tu login
// (No importa que esté en app/login, funciona perfectamente como componente)

export default function Header() {
  const [logoHover, setLogoHover] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const LOGO_SIZE = 'clamp(62px, 7.2vw, 92px)';

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 15,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: 'min(1200px, 92vw)',
          padding: '14px 18px',
          borderRadius: 30,
          background:
            'linear-gradient(135deg, rgba(15,16,32,0.72), rgba(30,30,54,0.72))',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 10px 28px rgba(0,0,0,.35)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          overflow: 'visible',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            gap: 18,
            alignItems: 'center',
          }}
        >
          {/* LOGO */}
          <div
            onMouseEnter={() => setLogoHover(true)}
            onMouseLeave={() => setLogoHover(false)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: `calc(${LOGO_SIZE})`,
              height: `calc(${LOGO_SIZE})`,
              transform: `translateY(-14%) scale(${logoHover ? 1.45 : 1.25})`,
              transition: 'transform .18s ease',
              willChange: 'transform',
              cursor: 'default',
            }}
            aria-hidden
          >
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              sizes="(max-width: 768px) 70px, 92px"
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 6px 16px rgba(0,0,0,.35))',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              priority
            />
          </div>

          {/* TÍTULO 3D */}
          <div
            className="titulo-3d"
            style={{
              textAlign: 'center',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              padding: '0 6px',
            }}
            title="CARRERA DE CIENCIAS FÍSICAS Y ENERGÍAS ALTERNATIVAS"
          >
            CARRERA DE CIENCIAS FÍSICAS Y ENERGÍAS ALTERNATIVAS
          </div>

          {/* BOTÓN LOGIN grande (abre modal) */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowLogin(true)}
              style={{
                background: 'linear-gradient(90deg,#2F6BFF,#00C2FF)',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                padding: '12px 22px',
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: '.3px',
                cursor: 'pointer',
                boxShadow: '0 12px 26px rgba(0,150,255,.35)',
                transition: 'transform .15s ease, box-shadow .15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 16px 32px rgba(0,150,255,.45)';
                (e.currentTarget as HTMLButtonElement).style.transform =
                  'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 12px 26px rgba(0,150,255,.35)';
                (e.currentTarget as HTMLButtonElement).style.transform =
                  'translateY(0)';
              }}
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 Mostramos el Login encima como modal */}
      {showLogin && (
        <
        >
          <LoginOverlay />
          <button
            onClick={() => setShowLogin(false)}
            style={{
              position: 'fixed',
              top: 25,
              right: 35,
              zIndex: 2100,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 32,
              cursor: 'pointer',
              textShadow: '0 2px 6px rgba(0,0,0,.6)',
            }}
          >
            ×
          </button>
        </>
      )}
    </>
  );
}
