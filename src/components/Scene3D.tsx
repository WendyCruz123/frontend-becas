'use client';

import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import Hotspot from './Hotspot';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import Link from 'next/link';
// import { routes } from '@/panos/scenes';
// import type { RouteKey } from '@/panos/scenes';
/* ------------ Modelo 3D ------------ */
type OficinaPublica = {
  ID_oficina: number;
  nombre: string;
  descripcion?: string | null;
  horario_atencion?: string | null;
  panorama_route_slug?: string | null;
};
function Modelo3D() {
  const gltf = useGLTF('/FisicaCompleto.glb');
  return <primitive object={gltf.scene} scale={1} />;
}
useGLTF.preload('/FisicaCompleto.glb');

/* ------------ HUD cámara (opcional) ------------ */
function CameraHud({ pos }: { pos: THREE.Vector3 | null }) {
  if (!pos) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: 80,
        right: 15,
        background: 'rgba(0,0,0,0.6)',
        color: '#00ccff',
        padding: '8px 12px',
        borderRadius: 8,
        fontFamily: 'monospace',
        fontSize: 13,
        zIndex: 10,
      }}
    >
      x: {pos.x.toFixed(2)}<br />y: {pos.y.toFixed(2)}<br />z: {pos.z.toFixed(2)}
    </div>
  );
}

/* ------------ Animación de intro al cargar la página ------------ */
function IntroCameraAnimation({ onFinish }: { onFinish: () => void }) {
  const { camera } = useThree();
  const controls = useThree((s: any) => s.controls) as OrbitControlsImpl | null;

  const start = useRef(new THREE.Vector3(-10, 8, 10));
  const end = useRef(new THREE.Vector3(-9.26, 0.76, -5.54));
  const progress = useRef(0);

  useFrame(() => {
    if (progress.current < 1) {
      progress.current += 0.005;
      camera.position.lerpVectors(start.current, end.current, progress.current);
      camera.lookAt(-7, 1.0, -3);
      if (controls) controls.enabled = false;
    } else {
      if (controls) controls.enabled = true;
      onFinish();
    }
  });

  return null;
}

/* ------------ Tracker cámara ------------ */
function TrackCamera({ onUpdate }: { onUpdate: (pos: THREE.Vector3) => void }) {
  const { camera } = useThree();
  useFrame(() => onUpdate(camera.position.clone()));
  return null;
}

/* ------------ Límites de cámara ------------ */
function BoundsLimiter({
  floorY = 0,
  camMinY = 0.5,
  xzBox = [[-38.8, -7.6], [2.8, 1.5]] as [[number, number], [number, number]],
}: {
  floorY?: number;
  camMinY?: number;
  xzBox?: [[number, number], [number, number]];
}) {
  const { camera } = useThree();
  const controls = useThree((s: any) => s.controls) as OrbitControlsImpl | null;

  useFrame(() => {
    if (camera.position.y < camMinY) camera.position.y = camMinY;
    if (controls?.target && controls.target.y < floorY) controls.target.y = floorY;

    const [min, max] = xzBox;
    const clamp = THREE.MathUtils.clamp;

    camera.position.x = clamp(camera.position.x, min[0], max[0]);
    camera.position.z = clamp(camera.position.z, min[1], max[1]);

    if (controls?.target) {
      controls.target.x = clamp(controls.target.x, min[0], max[0]);
      controls.target.z = clamp(controls.target.z, min[1], max[1]);
    }

    controls?.update?.();
  });

  return null;
}

/* ------------ Fondo HDR rotatable (con valores FIJOS) ------------ */
function BackgroundHDR({
  baseRotationY = 0,
  autoRotate = true,
  speed = THREE.MathUtils.degToRad(8.6),
}: {
  baseRotationY?: number;
  autoRotate?: boolean;
  speed?: number;
}) {
  const tex = useLoader(RGBELoader, '/cielo.hdr');
  const groupRef = useRef<THREE.Group | null>(null);

  useMemo(() => {
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.LinearSRGBColorSpace;
    tex.needsUpdate = true;
  }, [tex]);

  useFrame(({ camera }, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.copy(camera.position);
    if (!autoRotate) groupRef.current.rotation.y = baseRotationY;
    else groupRef.current.rotation.y += speed * delta;
  });

  return (
    <group ref={groupRef} rotation={[0, baseRotationY, 0]}>
      <mesh frustumCulled={false} renderOrder={-1} scale={1000}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          map={tex}
          side={THREE.BackSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ------------ Fly-to genérico (anima cámara a pos/target) ------------ */
type FlyRequest = {
  position: THREE.Vector3;
  target: THREE.Vector3;
  duration?: number; // segundos
};

function CameraFly({
  request,
  onDone,
}: {
  request: FlyRequest | null;
  onDone?: () => void;
}) {
  const { camera } = useThree();
  const controls = useThree((s: any) => s.controls) as OrbitControlsImpl | null;

  const startPos = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const t = useRef(0);
  const active = useRef(false);

  useEffect(() => {
    if (!request) return;
    // snapshot de inicio
    startPos.current.copy(camera.position);
    startTarget.current.copy(controls?.target ?? new THREE.Vector3());
    t.current = 0;
    active.current = true;
    if (controls) controls.enabled = false;
  }, [request, camera, controls]);

  useFrame((_, delta) => {
    if (!request || !active.current) return;
    const dur = request.duration ?? 1.6;
    t.current = Math.min(1, t.current + delta / dur);

    camera.position.lerpVectors(startPos.current, request.position, t.current);
    if (controls) {
      controls.target.lerpVectors(startTarget.current, request.target, t.current);
      controls.update();
    } else {
      camera.lookAt(request.target);
    }

    if (t.current >= 1) {
      active.current = false;
      if (controls) controls.enabled = true;
      onDone?.();
    }
  });

  return null;
}

export default function Scene3D({
  selectedOffice,
}: {
  selectedOffice: OficinaPublica | null;
}) {
    const [camPos, setCamPos] = useState<THREE.Vector3 | null>(null);
  const [introDone, setIntroDone] = useState(false);

  const [flyReq, setFlyReq] = useState<FlyRequest | null>(null);

  // Coordenadas que YA TE FUNCIONAN con el pin de bienvenida
  const FINAL_POS = new THREE.Vector3(-9.26, 0, -5.54);
  const FINAL_TARGET = new THREE.Vector3(-4, 0.3, -3);

const getOfficeView = (officeName: string) => {
  const name = officeName.toUpperCase();

  if (name.includes('DISBEDC') || name.includes('DISBECT') || name.includes('FUL') || name.includes('FEDERACIÓN')) {
    return {
      position: new THREE.Vector3(-28.25, 1.29, -3.91),
      target: new THREE.Vector3(-26.5, 1, -3),
      title: name.includes('FUL')
        ? 'FEDERACIÓN UNIVERSITARIA LOCAL (FUL)'
        : 'DISBEDC',
    };
  }

  if (name.includes('CENTRO')) {
    return {
      position: FINAL_POS,
      target: FINAL_TARGET,
      title: 'CENTRO DE ESTUDIANTES',
    };
  }

  if (name.includes('KARDEX')) {
    return {
      position: FINAL_POS,
      target: FINAL_TARGET,
      title: 'KARDEX DE CARRERA',
    };
  }

  return {
    position: FINAL_POS,
    target: FINAL_TARGET,
    title: 'DIRECCIÓN DE CARRERA',
  };
};

  useEffect(() => {
    document.body.style.overscrollBehavior = 'none';
  }, []);

  const goToFinalView = () => {
    setFlyReq({
      position: FINAL_POS,
      target: FINAL_TARGET,
      duration: 1.8,
    });
  };

useEffect(() => {
  if (!selectedOffice || !introDone) return;

  const view = getOfficeView(selectedOffice.nombre);

  setFlyReq({
    position: view.position,
    target: view.target,
    duration: 1.8,
  });
}, [selectedOffice, introDone]);
  return (
    <>
      <CameraHud pos={camPos} />
{selectedOffice?.panorama_route_slug && introDone && (
  <>
    {/* 📱 MOBILE */}
    <div
      className="
        fixed left-3 top-[82%] z-40
        w-[200px]
        md:hidden
      "
    >
      <Link
        href={`/visor/${selectedOffice.panorama_route_slug}`}
        className="
          flex items-center justify-center
          rounded-lg
          bg-gradient-to-r from-blue-600 to-cyan-400
          px-3 py-1.5
          text-[11px] font-bold text-white
          shadow-[0_8px_20px_rgba(34,211,238,.25)]
        "
      >
        {getOfficeView(selectedOffice.nombre).title}
      </Link>
    </div>

{/* 🖥️ DESKTOP */}
<div
  className="
    hidden md:block
    fixed left-[500px] top-[600px] z-40
    -translate-x-1/2

    w-[320px]
    rounded-2xl
    border border-cyan-300/20
    bg-slate-950/80
    p-5 text-white
    shadow-[0_25px_70px_rgba(0,0,0,.5)]
    backdrop-blur-xl
  "
>
  <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
    Ubicación seleccionada
  </p>

  <h3 className="mt-3 text-lg font-black">
    {getOfficeView(selectedOffice.nombre).title}
  </h3>

  <Link
    href={`/visor/${selectedOffice.panorama_route_slug}`}
    className="
      mt-4 flex items-center justify-center
      rounded-xl
      bg-gradient-to-r from-blue-600 to-cyan-400
      px-5 py-3 text-sm font-bold text-white
      shadow-[0_15px_40px_rgba(34,211,238,.3)]
      transition hover:scale-[1.03]
    "
  >
    Ver recorrido 360°
  </Link>
    </div>
  </>
)}

      <Canvas camera={{ position: [0, 0, 1], fov: 70 }}>
        {/* IBL y fondo */}
        <Environment files="/cielo.hdr" />
        <BackgroundHDR />

        {/* Luces */}
        <directionalLight position={[10, 10, 5]} intensity={0.6} castShadow />
        <ambientLight intensity={0.1} />

        {/* Intro inicial */}
        {!introDone && <IntroCameraAnimation onFinish={() => setIntroDone(true)} />}

        <Modelo3D />

        <OrbitControls
          makeDefault
          target={[0, 0, -1.5]}
          enablePan
          screenSpacePanning={false}
          enableZoom
          minDistance={1}
          maxDistance={50}
          minPolarAngle={0}
          maxPolarAngle={THREE.MathUtils.degToRad(85)}
          enabled={introDone} // bloquea mientras corre intro/fly
        />

        <BoundsLimiter />

        {/* Hotspot: al hacer click vuela a la vista final */}
        <Hotspot
          position={[-7.5, 1.2, -5.3]}
          label="BIENVENIDOS A LA CARRERA DE FÍSICA"
          onClick={goToFinalView}
        />

        {/* Componente que ejecuta el vuelo */}
        <CameraFly request={flyReq} onDone={() => setFlyReq(null)} />

        <TrackCamera onUpdate={setCamPos} />
      </Canvas>
    </>
  );
}
