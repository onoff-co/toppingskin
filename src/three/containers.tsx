import { useMemo } from 'react';
import * as THREE from 'three';
import type { ContainerKind } from '../types';
import { labelTexture } from './textures';

const V = (x: number, y: number) => new THREE.Vector2(x, y);

/** 모서리가 둥근 원기둥 단면 (아래 중심 → 바깥 → 위 중심) */
function roundedProfile(r: number, h: number, b: number, seg = 8) {
  const points = [V(0, 0)];
  for (let i = 0; i <= seg; i++) {
    const a = -Math.PI / 2 + (i / seg) * (Math.PI / 2);
    points.push(V(r - b + Math.cos(a) * b, b + Math.sin(a) * b));
  }
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * (Math.PI / 2);
    points.push(V(r - b + Math.cos(a) * b, h - b + Math.sin(a) * b));
  }
  points.push(V(0, h));
  return points;
}

/** 어깨선이 있는 병 단면 */
function bottleProfile(r: number, wall: number, neck: number, shoulder: number, top: number, b = 0.12) {
  const points = [V(0, 0)];
  for (let i = 0; i <= 8; i++) {
    const a = -Math.PI / 2 + (i / 8) * (Math.PI / 2);
    points.push(V(r - b + Math.cos(a) * b, b + Math.sin(a) * b));
  }
  points.push(V(r, wall));
  for (let i = 1; i <= 12; i++) {
    const t = i / 12;
    const x = (1 - t) ** 2 * r + 2 * (1 - t) * t * r + t * t * neck;
    const y = (1 - t) ** 2 * wall + 2 * (1 - t) * t * shoulder + t * t * shoulder;
    points.push(V(x, y));
  }
  points.push(V(neck, top), V(0, top));
  return points;
}

const geometryCache = new Map<string, THREE.BufferGeometry>();
function cached(key: string, make: () => THREE.BufferGeometry) {
  let g = geometryCache.get(key);
  if (!g) {
    g = make();
    geometryCache.set(key, g);
  }
  return g;
}

const lathe = (key: string, points: () => THREE.Vector2[]) => cached(key, () => new THREE.LatheGeometry(points(), 64));

type ContainerProps = { color: string; accent: string; label: string };

function Glossy({ color, roughness = 0.22 }: { color: string; roughness?: number }) {
  return <meshPhysicalMaterial color={color} roughness={roughness} clearcoat={1} clearcoatRoughness={0.08} />;
}

function LabelBand({ radius, height, y, texture }: { radius: number; height: number; y: number; texture: THREE.Texture }) {
  return (
    <mesh position-y={y}>
      <cylinderGeometry args={[radius, radius, height, 64, 1, true, -Math.PI / 2]} />
      <meshPhysicalMaterial map={texture} roughness={0.45} clearcoat={0.4} />
    </mesh>
  );
}

export function JarLid({ color }: { color: string }) {
  return (
    <mesh geometry={lathe('jar-lid', () => roundedProfile(1.06, 0.4, 0.13))}>
      <meshPhysicalMaterial color={color} roughness={0.18} metalness={0.05} clearcoat={1} clearcoatRoughness={0.05} />
    </mesh>
  );
}

export function Jar({ color, accent, label, open = false, cream = '#fff4f0' }: ContainerProps & { open?: boolean; cream?: string }) {
  const texture = useMemo(() => labelTexture({ title: 'Topping', sub: label, bg: '#fffaf5', ink: accent, layout: 'band' }), [label, accent]);
  return (
    <group>
      <mesh geometry={lathe('jar-body', () => roundedProfile(1, 1, 0.14))}>
        <Glossy color={color} />
      </mesh>
      <LabelBand radius={1.006} height={0.5} y={0.47} texture={texture} />
      {open ? (
        <mesh position-y={1.004} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.87, 48]} />
          <meshPhysicalMaterial color={cream} roughness={0.5} sheen={0.6} />
        </mesh>
      ) : (
        <group position-y={0.98}>
          <JarLid color={accent} />
        </group>
      )}
    </group>
  );
}

export function Bottle({ color, accent, label }: ContainerProps) {
  const texture = useMemo(() => labelTexture({ title: 'Topping', sub: label, bg: '#fffaf5', ink: accent, layout: 'band' }), [label, accent]);
  return (
    <group>
      <mesh geometry={lathe('bottle', () => bottleProfile(0.62, 1.45, 0.24, 1.92, 2.12))}>
        <Glossy color={color} roughness={0.15} />
      </mesh>
      <LabelBand radius={0.626} height={0.6} y={0.78} texture={texture} />
      <mesh position-y={1.98} geometry={lathe('bottle-cap', () => roundedProfile(0.3, 0.52, 0.08))}>
        <Glossy color={accent} />
      </mesh>
    </group>
  );
}

export function Dropper({ color, accent, label }: ContainerProps) {
  const texture = useMemo(() => labelTexture({ title: 'Topping', sub: label, bg: '#fffaf5', ink: accent, layout: 'band' }), [label, accent]);
  return (
    <group>
      <mesh geometry={lathe('dropper', () => bottleProfile(0.5, 0.85, 0.2, 1.18, 1.3, 0.1))}>
        <meshPhysicalMaterial color={color} roughness={0.08} clearcoat={1} clearcoatRoughness={0.03} transmission={0} ior={1.5} />
      </mesh>
      <LabelBand radius={0.506} height={0.42} y={0.46} texture={texture} />
      <mesh position-y={1.1} geometry={lathe('dropper-collar', () => roundedProfile(0.27, 0.34, 0.06))}>
        <meshPhysicalMaterial color="#e9c77b" metalness={0.7} roughness={0.22} clearcoat={1} />
      </mesh>
      <mesh position-y={1.82}>
        <capsuleGeometry args={[0.19, 0.38, 8, 24]} />
        <Glossy color={accent} roughness={0.35} />
      </mesh>
    </group>
  );
}

export function Tube({ color, accent, label }: ContainerProps) {
  const texture = useMemo(() => labelTexture({ title: 'Topping', sub: label, bg: color, ink: accent, layout: 'tube' }), [label, color, accent]);
  const body = cached('tube', () => {
    const g = new THREE.CylinderGeometry(0.55, 0.55, 2.2, 48, 24, true, -Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      // 부동소수 오차로 t가 -0.0000001이 되면 Math.pow가 NaN을 돌려주므로 0~1로 고정
      const t = THREE.MathUtils.clamp((pos.getY(i) + 1.1) / 2.2, 0, 1);
      const k = Math.pow(t, 1.6);
      pos.setX(i, pos.getX(i) * (1 + 0.36 * k));
      pos.setZ(i, pos.getZ(i) * (1 - 0.9 * k));
    }
    g.computeVertexNormals();
    g.translate(0, 1.1 + 0.42, 0);
    return g;
  });
  return (
    <group>
      <mesh geometry={lathe('tube-cap', () => roundedProfile(0.58, 0.46, 0.1))}>
        <Glossy color={accent} />
      </mesh>
      <mesh geometry={body}>
        <meshPhysicalMaterial map={texture} roughness={0.3} clearcoat={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position-y={2.66}>
        <boxGeometry args={[1.52, 0.2, 0.1]} />
        <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={0.8} />
      </mesh>
    </group>
  );
}

export function Container({ kind, ...props }: ContainerProps & { kind: ContainerKind }) {
  if (kind === 'jar') return <Jar {...props} />;
  if (kind === 'bottle') return <Bottle {...props} />;
  if (kind === 'dropper') return <Dropper {...props} />;
  return <Tube {...props} />;
}
