'use client';
import { useState } from 'react';

interface Props {
  resetToken: string;   // viene del VerifyOtpOverlay
  onBack: () => void;   // volver al paso anterior
  onFinish: () => void; // volver al login al completar el cambio
}
console.log('BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL);

export default function ResetPasswordOverlay({ resetToken, onBack, onFinish }: Props) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('⚠️ Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-reset-token': resetToken, // Header con el token temporal
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Contraseña cambiada correctamente.');
        setTimeout(onFinish, 1200); // Regresa al login
      } else {
        setMessage(`❌ ${data.message || 'Error al cambiar la contraseña.'}`);
      }
    } catch {
      setMessage('⚠️ No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}
    >
      <div
        style={{
          width: 'min(420px, 92vw)',
          borderRadius: 25,
          overflow: 'hidden',
          background: '#fff',
          boxShadow: `
            12px 12px 24px rgba(0,0,0,0.25),
            -12px -12px 24px rgba(255,255,255,0.4)
          `,
          textAlign: 'center',
          padding: '3rem 2.5rem 2.5rem',
          color: '#333',
        }}
      >
        {/* Imagen superior */}
        <div
          style={{
            position: 'relative',
            height: '160px',
            backgroundImage: 'url("/fisica.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)',
            marginBottom: '2.5rem',
          }}
        />

        <h2
          style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '.4px',
            textTransform: 'uppercase',
            color: '#1c274c',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          Restablecer Contraseña
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {/* Nueva contraseña */}
          <div style={{ position: 'relative', width: '85%' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                borderRadius: 12,
                border: 'none',
                background: '#e0e5ec',
                boxShadow: `
                  inset 4px 4px 8px #b8bcc3,
                  inset -4px -4px 8px #ffffff
                `,
                color: '#333',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                userSelect: 'none',
                fontSize: 18,
                color: '#666',
              }}
              title={showPassword ? 'Ocultar' : 'Ver'}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          {/* Confirmar contraseña */}
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: '85%',
              padding: '0.9rem 1rem',
              borderRadius: 12,
              border: 'none',
              background: '#e0e5ec',
              boxShadow: `
                inset 4px 4px 8px #b8bcc3,
                inset -4px -4px 8px #ffffff
              `,
              color: '#333',
              fontSize: 14,
              outline: 'none',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 10,
              width: '85%',
              padding: '0.9rem',
              borderRadius: 15,
              border: 'none',
              background: '#e0e5ec',
              boxShadow: `
                6px 6px 12px #b8bcc3,
                -6px -6px 12px #ffffff
              `,
              fontWeight: 700,
              fontSize: 15,
              color: '#0048ff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                'inset 4px 4px 8px #b8bcc3, inset -4px -4px 8px #ffffff')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                '6px 6px 12px #b8bcc3, -6px -6px 12px #ffffff')
            }
          >
            {loading ? 'Guardando...' : 'Cambiar contraseña'}
          </button>

          <p
            onClick={onBack}
            style={{
              marginTop: 10,
              fontSize: 13,
              color: '#0077cc',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            ⬅ Volver
          </p>

          {message && (
            <p
              style={{
                marginTop: 10,
                color: '#333',
                fontSize: 13,
                background: '#e0e5ec',
                boxShadow: `
                  inset 2px 2px 5px #b8bcc3,
                  inset -2px -2px 5px #ffffff
                `,
                padding: '8px 10px',
                borderRadius: 10,
              }}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
