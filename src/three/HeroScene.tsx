import { useRef, type ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { SoftShadow, Stage } from './Stage';
import { Jar, JarLid } from './containers';
import { Blueberries, CakeSlice, CitrusSlice, Macaron, MintSprig, Peach, RosemarySprig, Strawberry, WhipCream } from './toppings';
import { pointer, prefersReducedMotion } from './pointer';

const CAMERA_Z = 9;
const CAMERA_FOV = 32;

type Floater = { pos: [number, number, number]; rot?: [number, number, number]; scale: number; speed: number; node: ReactNode };

const FLOATERS: Floater[] = [
  { pos: [-2.15, 1.45, 0.2], rot: [0.3, 0.7, 0.2], scale: 0.85, speed: 1.6, node: <CitrusSlice kind="orange" /> },
  { pos: [2.2, -0.35, 0.7], rot: [0.2, -0.6, -0.3], scale: 0.72, speed: 1.9, node: <CitrusSlice kind="lemon" /> },
  { pos: [-1.95, -0.95, 1.1], rot: [0, 0.4, 0.9], scale: 0.95, speed: 1.4, node: <Strawberry /> },
  { pos: [1.55, -1.55, 1.4], scale: 0.95, speed: 2.1, node: <Blueberries /> },
  { pos: [-2.5, 0.25, -1], rot: [0.2, 0.3, 0.4], scale: 1.05, speed: 1.2, node: <MintSprig /> },
  { pos: [1.3, 2.05, -0.5], rot: [0.55, 0, -0.45], scale: 0.62, speed: 1.3, node: <JarLid color="#ff6b88" /> },
  { pos: [2.55, 1.15, -1.4], rot: [0.5, 0.2, 0.3], scale: 0.95, speed: 1.7, node: <Macaron color="#cfd2f7" /> },
  { pos: [-1.05, 2.3, -1.5], rot: [0, -0.5, 0.2], scale: 0.85, speed: 1.5, node: <Peach /> },
  { pos: [-2.7, -2.0, -1.6], rot: [0.35, 0.9, 0], scale: 0.9, speed: 1.1, node: <CakeSlice /> },
  { pos: [2.95, -1.7, -2.4], rot: [0.3, 0, -0.2], scale: 0.85, speed: 1.3, node: <RosemarySprig /> },
];

export function HeroScene() {
  const group = useRef<THREE.Group>(null);
  // state.viewport는 기본 카메라 기준이라 View 크기(size)와 히어로 카메라 값으로 직접 계산한다
  const size = useThree((s) => s.size);
  const height = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2));
  const width = (height * size.width) / Math.max(1, size.height);
  // 넓은 화면에서는 View가 히어로 전체를 덮으므로 카피 반대편(오른쪽)으로 비켜 세운다
  const wide = width / height > 1.1;
  const fit = wide ? Math.min(1, height / 5.4, (width * 0.6) / 6.2) : Math.min(1, width / 6.4, height / 5.6);
  const offsetX = wide ? width / 2 - 3 * fit - 0.2 : 0;

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.x * 0.35, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.y * 0.15, 3, dt);
  });

  const speed = prefersReducedMotion ? 0 : 1;

  return (
    <Stage camera={[0, 0.5, CAMERA_Z]} fov={CAMERA_FOV} shadow={false}>
      <SoftShadow y={-2.05 * fit} size={5 * fit} x={offsetX} />
      <group ref={group} position-x={offsetX} scale={fit}>
        <Float speed={speed * 1.2} rotationIntensity={0.25} floatIntensity={0.35}>
          <group position-y={-2} scale={1.2}>
            <Jar color="#ffc4d0" accent="#ff6b88" label="STRAWBERRY CREAM" open cream="#ffe9ee" />
            <group position-y={1} scale={0.95}>
              <WhipCream color="#ffeef2" />
            </group>
            <group position={[0.05, 2.0, 0]} rotation-z={0.35} scale={0.9}>
              <Strawberry />
            </group>
          </group>
        </Float>
        {FLOATERS.map((f, i) => (
          <Float key={i} speed={f.speed * speed} rotationIntensity={1.1} floatIntensity={1.4}>
            <group position={f.pos} rotation={f.rot} scale={f.scale}>
              {f.node}
            </group>
          </Float>
        ))}
      </group>
    </Stage>
  );
}
