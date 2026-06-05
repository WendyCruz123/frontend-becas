'use client';

import { Html } from '@react-three/drei';
import Image from 'next/image';

type Props = {
  position: [number, number, number];
  label?: string;
  onClick?: () => void;
};

export default function Hotspot({ position, label, onClick }: Props) {
  return (
    <Html position={position} center>
      {/* 👇 clase "hotspot" para poder atenuarlo con CSS cuando el login esté abierto */}
      <div
        className="hotspot"
        onClick={onClick}
        style={{ cursor: 'pointer', textAlign: 'center', userSelect: 'none' }}
      >
        <Image src="/pin.png" alt="Pin" width={30} height={30} />
        {label && (
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              borderRadius: 6,
              marginTop: 4,
              padding: '2px 6px',
              fontSize: 12,
            }}
          >
            {label}
          </div>
        )}
      </div>
    </Html>
  );
}
