'use client';
import Image from 'next/image';
import { useState } from 'react';

interface IconButtonProps {
  src: string;              // imagen por defecto
  hoverSrc: string;         // imagen al pasar el mouse
  alt: string;              // texto alternativo
  className?: string;       // clases extra (ej: "salir", "inicio")
  onClick?: () => void;     // acción al hacer clic
}

export default function IconButton({
  src,
  hoverSrc,
  alt,
  className = '',
  onClick,
}: IconButtonProps) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`icon-btn ${className} ${hover ? 'hover-active' : ''}`}
    >
      <Image
      key={hover ? hoverSrc : src} // ← fuerza rerender
        src={hover ? hoverSrc : src}
        alt={alt}
        width={60}
        height={60}
        unoptimized // ← evita la caché de next/image
        className="icon-img"
      />
    </button>
  );
}
