'use client';
import { tokenStore } from '@/lib/tokenStore';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// Importa los 3 modales
import ForgotPasswordOverlay from './ForgotPasswordOverlay';
import VerifyOtpOverlay from './VerifyOtpOverlay';
import ResetPasswordOverlay from './ResetPasswordOverlay';

export default function LoginOverlay() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
   const [step, setStep] = useState<'login' | 'forgot' | 'verify' | 'reset'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
 
 
  const router = useRouter();

  const inputStyle: React.CSSProperties = {
        width: '85%',
        margin: '0 auto',
        padding: '0.9rem 1rem',
        borderRadius: 8,
        border: 'none',
        background: '#e0e5ec',
        boxShadow: `
          inset 4px 4px 8px #b8bcc3,
          inset -4px -4px 8px #ffffff
        `,
        color: '#333',
        fontSize: 14,
        outline: 'none',
  };
  useEffect(() => {
    document.body.classList.add('login-open');
    return () => document.body.classList.remove('login-open');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data?.accessToken) tokenStore.set(data.accessToken);
        router.push('/dashboard');
      } else {
        setMessage(`❌ Error: ${data.message || 'Credenciales incorrectas'}`);
      }
    } catch {
      setMessage('⚠ No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  // 🟨 PASO 1: Recuperar contraseña
  if (step === 'forgot') {
    return (
      <ForgotPasswordOverlay
        onBack={() => setStep('login')}
        onNext={(email) => {
          setResetEmail(email);
          setStep('verify');
        }}
      />
    );
  }

  // 🟧 PASO 2: Verificar código OTP
  if (step === 'verify') {
    return (
      <VerifyOtpOverlay
        email={resetEmail}
        onBack={() => setStep('forgot')}
        onNext={(token) => {
          setResetToken(token);
          setStep('reset');
        }}
      />
    );
  }

  // 🟩 PASO 3: Nueva contraseña
  if (step === 'reset') {
    return (
      <ResetPasswordOverlay
        resetToken={resetToken}
        onBack={() => setStep('verify')}
        onFinish={() => setStep('login')}
      />
    );
  }


  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(255, 255, 255, 0.4)', // <- semi transparente
        backdropFilter: 'blur(9px)', // <- efecto desenfoque
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        overflow: 'hidden',
      }}
    >
  <div
  style={{
    width: 'min(480px, 95vw)',   // controla el ancho máximo
minHeight: '450px',          // asegura que el cuadro sea más largo
    borderRadius: 10,
    overflow: 'hidden',
    background: '#fff', // el fondo de la parte inferior
    boxShadow: `
      12px 12px 24px rgba(0,0,0,0.25),
      -12px -12px 24px rgba(255,255,255,0.4)
    `,
  }}
>
  {/* Parte superior con la imagen */}
  <div

    style={{
      position: 'relative',
      height: '260px',
      backgroundImage: 'url("/fisica.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)', // <- crea la división diagonal
    }}
  >
    

  </div>
      
  {/* Parte inferior con el formulario */}
<div style={{ padding: '4rem 3rem 3 rem'}}>
       <h2
          style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '.4px',
            textTransform: 'uppercase',
            color: '#1c274c',
            marginBottom: 25,
            textAlign: 'center'
          }}
        >
          INGRESE AL SISTEMA DE BECAS<br />
          CIENCIAS FÍSICAS Y ENERGÍAS ALTERNATIVAS
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          {/* Campo contraseña con ojito */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 14,
              cursor: 'pointer',
              userSelect: 'none',
              fontSize: 18,
              color: '#666',
            }}
            title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 10,
              width: '93%',
              margin: '0 auto',
              padding: '0.9rem',
              borderRadius: 8,
              border: 'none',
              background: '#b0c4de',
              boxShadow: `
                6px 6px 12px #b8bcc3,
                -6px -6px 12px #ffffff
              `,
              fontWeight: 700,
              fontSize: 16,
              color: '#0048ff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                'inset 4px 4px 8px #809bbf, inset -4px -4px 8px #b0c4de')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                '6px 6px 12px #657c9a, -6px -6px 12px #ffffff')
            }
          >
            {loading ? 'Ingresando...' : 'INGRESAR'}
          </button>
        {/* Enlace "¿Has olvidado tu contraseña?" */}
        <p
          onClick={() => setStep('forgot')}
          style={{
            marginTop: 10,
            textAlign: 'center',
            fontSize: 15,
            color: '#0077cc',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          ¿Has olvidado tu contraseña?
        </p>

          {message && (
            <p
              style={{
                marginTop: 10,
                color: '#c0392b',
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
 
</div>
         );
}