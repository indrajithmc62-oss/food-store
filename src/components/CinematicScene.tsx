import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COLORS = ["#4ade80", "#facc15", "#fb923c", "#f87171", "#a78bfa"];
const DEPTH = 60; // how long the tunnel is
const BG = "#020a05";

// Same input always gives the same "random" number, so the layout is stable.
function seeded(i: number) {
  const x = Math.sin(i * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function Shapes() {
  const items = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        position: [
          (seeded(i) - 0.5) * 14,
          (seeded(i + 50) - 0.5) * 8,
          -i * (DEPTH / 28) - 4,
        ] as [number, number, number],
        scale: 0.5 + seeded(i + 100) * 0.9,
        color: COLORS[i % COLORS.length],
        kind: i % 3,
        speed: 0.2 + seeded(i + 150) * 0.5,
      })),
    []
  );

  const refs = useRef<(THREE.Mesh | null)[]>([]);

  // Runs every frame: slowly spin each shape.
  useFrame((_, delta) => {
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.rotation.x += delta * items[i].speed;
      mesh.rotation.y += delta * items[i].speed * 0.7;
    });
  });

  return (
    <>
      {items.map((it, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={it.position}
          scale={it.scale}
        >
          {it.kind === 0 && <icosahedronGeometry args={[1, 0]} />}
          {it.kind === 1 && <torusGeometry args={[0.8, 0.3, 16, 40]} />}
          {it.kind === 2 && <sphereGeometry args={[0.8, 32, 32]} />}
          <meshStandardMaterial
            color={it.color}
            emissive={it.color}
            emissiveIntensity={0.35}
            roughness={0.35}
            metalness={0.2}
          />
        </mesh>
      ))}
    </>
  );
}

function Particles() {
  const positions = useMemo(() => {
    const count = 600;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (seeded(i + 300) - 0.5) * 30;
      arr[i * 3 + 1] = (seeded(i + 900) - 0.5) * 20;
      arr[i * 3 + 2] = -seeded(i + 1500) * DEPTH - 2;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#bbf7d0" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

// Moves the camera forward based on scroll progress (0 to 1) and tilts it with the mouse.
function CameraRig({ progress }: { progress: MutableRefObject<number> }) {
  useFrame((state, delta) => {
    const p = progress.current;
    const cam = state.camera;
    const targetZ = 6 - p * (DEPTH - 4);
    const targetX = Math.sin(p * Math.PI * 2) * 1.5 + state.pointer.x * 0.8;
    const targetY = state.pointer.y * 0.5;

    // damp() eases toward the target, which gives the smooth cinematic feel.
    cam.position.z = THREE.MathUtils.damp(cam.position.z, targetZ, 3, delta);
    cam.position.x = THREE.MathUtils.damp(cam.position.x, targetX, 3, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, targetY, 3, delta);
    cam.lookAt(0, 0, cam.position.z - 10);
  });
  return null;
}

interface Props {
  progress: MutableRefObject<number>;
}

export default function CinematicScene({ progress }: Props) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 2]}>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 8, 30]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.6} />
      <Shapes />
      <Particles />
      <CameraRig progress={progress} />
    </Canvas>
  );
}