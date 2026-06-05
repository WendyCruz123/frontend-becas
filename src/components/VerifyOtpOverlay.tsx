'use client';
import { useState } from 'react';

interface Props {
  email: string;                  // viene del primer paso
  onBack: () => void;             // volver al paso anterior
  onNext: (token: string) => void; // pasar al paso 3 (nueva contraseña)
}

export default function VerifyOtpOverlay({ email, onBack, onNext }: Props) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/security/otp/password/verify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            code,
            purpose: 'password_reset',
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.resetToken) {
        setMessage('✅ Código verificado correctamente');
        setTimeout(() => onNext(data.resetToken), 1200); // avanza al siguiente paso
      } else {
        setMessage(`❌ ${data.message || 'Código inválido o expirado'}`);
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
        {/* Imagen superior (igual que login) */}
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
          Verificar Código
        </h2>

        <p
          style={{
            fontSize: 13,
            color: '#555',
            marginBottom: 10,
          }}
        >
          Ingrese el código que fue enviado a:<br />
          <b>{email}</b>
        </p>

        <form
          onSubmit={handleVerify}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <input
            type="text"
            placeholder="Código de verificación"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            style={{
              width: '85%',
              margin: '0 auto',
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
              textAlign: 'center',
              letterSpacing: '2px',
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
            {loading ? 'Verificando...' : 'Verificar código'}
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
