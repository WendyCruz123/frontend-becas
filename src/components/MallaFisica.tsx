"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Html,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import React, { useRef, useEffect } from "react";

interface MallaFisicaProps {
  cameraPosition?: [number, number, number];
  background?: string;
  autoRotate?: boolean;
}

type Props = {
  modelUrl?: string;
};

/* ============================================================
    1) MEJORA DE MATERIALES (brillo, sombras, reflejos)
============================================================ */
function enhanceMaterial(scene: THREE.Object3D) {
  scene.traverse((o: any) => {
    if (o.isMesh && o.material) {
      o.castShadow = true;
      o.receiveShadow = true;
      o.material.roughness = 0.35;
      o.material.metalness = 0.5;
      o.material.envMapIntensity = 1.3;
    }
  });
}

/* ============================================================
    2) MODELO PRINCIPAL DEL EDIFICIO
============================================================ */
function ModeloEdificio({ modelUrl = "Cienciasfisica.glb" }: Props) {
  const group = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(modelUrl);

  enhanceMaterial(scene);

  const initialRotation = Math.PI / 9;

  useEffect(() => {
    group.current.rotation.y = initialRotation;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Levitación suave
    group.current.position.y = -0.5 + Math.sin(t * 1.4) * 0.05;

    // Rotación animada
    group.current.rotation.y =
      initialRotation + Math.sin(t * 0.8) * (Math.PI / 5);
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={1.22} />
    </group>
  );
}

/* ============================================================
    3) ESCÁNER HOLOGRÁFICO
============================================================ */
function ScanSystem() {
  const scan = useRef<THREE.Mesh>(null!);
  const pulse = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const duration = 3;
    const t = (state.clock.getElapsedTime() % duration) / duration;

    scan.current.position.y = 0.03 + t * 2.5;

    const mat = scan.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 1.4 * (1 - t);

    pulse.current.scale.setScalar(1 + Math.sin(t * Math.PI * 2) * 0.05);
  });
  

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} ref={pulse}>
        <ringGeometry args={[1.2, 1.6, 80]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.4} />
      </mesh>

      <mesh ref={scan}>
        <cylinderGeometry args={[1.9, 1.9, 0.2, 80, 1, true]} />
        <meshBasicMaterial
          color="#00ff00"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

/* ============================================================
    4) PUNTOS TÉCNICOS TIPO BLUEPRINT
============================================================ */
function TechPoint({
  position,
  label,
}: {
  position: [number, number, number];
  label: string;
}) {
  const ref = useRef<any>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 3) * 0.02;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#00a7d6" />
      </mesh>

      <Html
        position={[0.05, 0, 0]}
        style={{
          fontSize: "9px",
          fontFamily: "Segoe UI, sans-serif",
          fontWeight: 600,
          color: "#00a7d6",
          whiteSpace: "nowrap",
          textShadow: "0 0 4px #a8f7ff",
        }}
      >
        {label}
      </Html>
    </group>
  );
}

/* ============================================================
    5) ESCENA COMPLETA
============================================================ */

function Scene3D({
  modelUrl,
  theme = "light",
}: Props & { theme?: "light" | "dark" }) {

  // 🔥 Color dinámico del fondo
  const bgColor = theme === "dark" ? "#4a4f55" : "#e3e4e5";

  return (
    <Canvas
      shadows
      camera={{ position: [-4.2, 1.4, 3], fov: 38 }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* 🔥 Fondo dinámico aplicado correctamente */}
      <color attach="background" args={[bgColor]} />

      <Environment preset="warehouse" />

      <ambientLight intensity={0.8} />
      <directionalLight intensity={1.4} position={[6, 7, 4]} castShadow />
      <pointLight intensity={1.2} position={[0, 2.5, 1]} color="#00eaff" />

      <group position={[0, -0.6, 0]}>
        <ScanSystem />
      </group>

      <ModeloEdificio modelUrl={modelUrl} />

      <OrbitControls enablePan={false} enableDamping dampingFactor={0.09} />
    </Canvas>
  );
}



/* ============================================================
    6) EXPORTACIÓN FINAL SIN CONTENEDOR EXTRA
============================================================ */
export default function MallaFisica({ theme = "light" }: { theme?: "light" | "dark" }) {
  return <Scene3D modelUrl="/Cienciasfisica.glb" theme={theme} />;
}


useGLTF.preload('/Cienciasfisica.glb');
