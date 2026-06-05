'use client';

export default function FondoInteractivo() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -2,
        background: '#d7d7d7',
        pointerEvents: 'none',
      }}
    />
  );
}
