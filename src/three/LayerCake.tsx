import { useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Blueberries, MintSprig, Strawberry, WhipCream } from './toppings';
import { prefersReducedMotion } from './pointer';

function Sponge({ y, h }: { y: number; h: number }) {
  return (
    <mesh position-y={y + h / 2}>
      <cylinderGeometry args={[1.3, 1.3, h, 64]} />
      <meshPhysicalMaterial color="#f3cf94" roughness={0.9} sheen={0.6} sheenColor="#fff1d6" />
    </mesh>
  );
}

function Frosting() {
  const geometry = useMemo(() => {
    const r = 1.38;
    const h = 1.38;
    const b = 0.14;
    const pts = [new THREE.Vector2(0, 0)];
    pts.push(new THREE.Vector2(r, 0));
    for (let i = 0; i <= 10; i++) {
      const a = (i / 10) * (Math.PI / 2);
      pts.push(new THREE.Vector2(r - b + Math.cos(a) * b, h - b + Math.sin(a) * b));
    }
    pts.push(new THREE.Vector2(0, h));
    return new THREE.LatheGeometry(pts, 72);
  }, []);
  const drips = useMemo(() => Array.from({ length: 14 }, (_, i) => ({ a: (i / 14) * Math.PI * 2, len: 0.18 + ((i * 37) % 7) * 0.05 })), []);
  return (
    <group>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial color="#fff3ea" roughness={0.35} clearcoat={0.6} sheen={0.5} />
      </mesh>
      {drips.map((d, i) => (
        <mesh key={i} position={[Math.sin(d.a) * 1.37, 1.28 - d.len / 2, Math.cos(d.a) * 1.37]}>
          <capsuleGeometry args={[0.07, d.len, 6, 12]} />
          <meshPhysicalMaterial color="#ff5f80" roughness={0.15} clearcoat={1} />
        </mesh>
      ))}
      <mesh position-y={1.382} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[1.26, 64]} />
        <meshPhysicalMaterial color="#ff5f80" roughness={0.12} clearcoat={1} />
      </mesh>
    </group>
  );
}

function ToppingCrown() {
  const swirls = useMemo(() => Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2), []);
  return (
    <group position-y={1.38}>
      {swirls.map((a, i) => (
        <group key={i} position={[Math.sin(a) * 1.02, 0, Math.cos(a) * 1.02]} scale={0.26}>
          <WhipCream />
        </group>
      ))}
      <group position={[0, 0.48, 0]} rotation-z={0.2} scale={0.75}>
        <Strawberry />
      </group>
      <group position={[0.45, 0.32, 0.3]} rotation={[0.3, 0.8, 1.3]} scale={0.6}>
        <Strawberry />
      </group>
      <group position={[-0.35, 0.2, 0.45]} scale={0.6}>
        <Blueberries />
      </group>
      <group position={[-0.25, 0.55, -0.3]} rotation-x={-0.4} scale={0.55}>
        <MintSprig />
      </group>
    </group>
  );
}

const LAYERS: ReactNode[] = [
  <Sponge y={0} h={0.55} />,
  <>
    <mesh position-y={0.62}>
      <cylinderGeometry args={[1.31, 1.31, 0.14, 64]} />
      <meshPhysicalMaterial color="#ff6f8e" roughness={0.12} clearcoat={1} />
    </mesh>
    <Sponge y={0.69} h={0.55} />
  </>,
  <Frosting />,
  <ToppingCrown />,
];

/** 루틴 단계(step)만큼 케이크 층이 위에서 내려앉는다 */
export function LayerCake({ step }: { step: number }) {
  const root = useRef<THREE.Group>(null);
  const layers = useRef<(THREE.Group | null)[]>([]);

  useFrame((_, dt) => {
    const d = Math.min(dt, 1 / 30);
    if (root.current && !prefersReducedMotion) root.current.rotation.y += d * 0.3;
    LAYERS.forEach((_, i) => {
      const g = layers.current[i];
      if (!g) return;
      const on = i <= step;
      g.position.y = THREE.MathUtils.damp(g.position.y, on ? 0 : 3, 5, d);
      const s = THREE.MathUtils.damp(g.scale.x, on ? 1 : 0.0001, 7, d);
      g.scale.setScalar(s);
    });
  });

  return (
    <group ref={root} position-y={-1.0} scale={0.72}>
      <mesh position-y={-0.06}>
        <cylinderGeometry args={[1.85, 1.75, 0.12, 64]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.15} clearcoat={1} />
      </mesh>
      {LAYERS.map((node, i) => (
        <group key={i} ref={(el) => { layers.current[i] = el; }} position-y={3} scale={0.0001}>
          {node}
        </group>
      ))}
    </group>
  );
}
