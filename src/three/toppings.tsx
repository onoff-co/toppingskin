import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { ToppingId } from '../types';
import { citrusTexture } from './textures';

const TAU = Math.PI * 2;

/* ---------- 딸기 ---------- */

const strawberryProfile = (t: number) => 0.95 * Math.pow(t, 0.65) * Math.sqrt(Math.max(0, 1 - Math.pow(t, 5)));

export function Strawberry({ color = '#ff3b5c' }: { color?: string }) {
  const { body, seeds } = useMemo(() => {
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      points.push(new THREE.Vector2(strawberryProfile(t), -1 + 1.8 * t));
    }
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];
    for (let i = 0; i < 64; i++) {
      const t = 0.12 + 0.72 * (i / 64);
      const theta = i * 2.39996;
      const r = strawberryProfile(t) * 0.99;
      const y = -1 + 1.8 * t;
      dummy.position.set(r * Math.sin(theta), y, r * Math.cos(theta));
      dummy.lookAt(dummy.position.x * 2, y + 0.25, dummy.position.z * 2);
      dummy.scale.set(0.035, 0.05, 0.018);
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
    }
    return { body: new THREE.LatheGeometry(points, 48), seeds: matrices };
  }, []);
  const seedRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = seedRef.current;
    if (!mesh) return;
    seeds.forEach((matrix, i) => mesh.setMatrixAt(i, matrix));
    mesh.instanceMatrix.needsUpdate = true;
  }, [seeds]);

  return (
    <group scale={0.55}>
      <mesh geometry={body}>
        <meshPhysicalMaterial color={color} roughness={0.28} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      <instancedMesh ref={seedRef} args={[undefined, undefined, seeds.length]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#ffe08a" roughness={0.4} />
      </instancedMesh>
      <group position-y={0.78}>
        {Array.from({ length: 7 }, (_, i) => (
          <group key={i} rotation-y={(i / 7) * TAU}>
            <mesh position={[0, 0, 0.26]} rotation-x={0.35} scale={[0.13, 0.03, 0.34]}>
              <sphereGeometry args={[1, 16, 10]} />
              <meshStandardMaterial color="#4a9d4f" roughness={0.6} />
            </mesh>
          </group>
        ))}
        <mesh position={[0.02, 0.2, 0]} rotation-z={-0.15}>
          <cylinderGeometry args={[0.035, 0.045, 0.4, 8]} />
          <meshStandardMaterial color="#3f8a45" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- 레몬 · 오렌지 슬라이스 ---------- */

const CITRUS = {
  lemon: { flesh: '#ffe36b', rind: '#f5cb24' },
  orange: { flesh: '#ffa23a', rind: '#ff8418' },
};

export function CitrusSlice({ kind = 'lemon' }: { kind?: keyof typeof CITRUS }) {
  const materials = useMemo(() => {
    const { flesh, rind } = CITRUS[kind];
    const face = new THREE.MeshPhysicalMaterial({ map: citrusTexture(flesh, rind), roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.05 });
    const side = new THREE.MeshPhysicalMaterial({ color: rind, roughness: 0.45, clearcoat: 0.6 });
    return [side, face, face];
  }, [kind]);

  return (
    <mesh rotation-x={Math.PI / 2} scale={0.62} material={materials}>
      <cylinderGeometry args={[1, 1, 0.2, 48]} />
    </mesh>
  );
}

/* ---------- 블루베리 ---------- */

function Blueberry({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.26, 32, 24]} />
        <meshPhysicalMaterial color="#45509f" roughness={0.45} sheen={1} sheenColor="#b9c3ef" sheenRoughness={0.8} clearcoat={0.3} />
      </mesh>
      <mesh position-y={0.245} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.07, 0.026, 8, 16]} />
        <meshStandardMaterial color="#2b2e5c" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function Blueberries() {
  return (
    <group>
      <Blueberry position={[0, 0.05, 0]} />
      <Blueberry position={[0.42, -0.02, 0.14]} />
      <Blueberry position={[-0.18, -0.05, 0.4]} />
    </group>
  );
}

/* ---------- 허브 잎 ---------- */

function useLeafGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.36, 0.22, 0.32, 0.8, 0, 1.1);
    shape.bezierCurveTo(-0.32, 0.8, -0.36, 0.22, 0, 0);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.012,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
      curveSegments: 24,
    });
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // 잎을 오목하게 말고 끝을 살짝 늘어뜨린다
      pos.setZ(i, pos.getZ(i) + x * x * 0.9 - y * y * 0.12);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);
}

export function MintSprig() {
  const leaf = useLeafGeometry();
  const leaves: { rot: [number, number, number]; s: number }[] = [
    { rot: [0.2, 0, 0.7], s: 0.8 },
    { rot: [0.2, Math.PI, 0.7], s: 0.8 },
    { rot: [-0.1, 0.6, 0.25], s: 1 },
    { rot: [-0.1, -2.5, 0.25], s: 1 },
    { rot: [0, 0.1, 0], s: 0.7 },
  ];
  return (
    <group position-y={-0.45}>
      {leaves.map(({ rot, s }, i) => (
        <mesh key={i} geometry={leaf} rotation={rot} scale={s} position-y={i > 3 ? 0.25 : i > 1 ? 0.1 : 0}>
          <meshPhysicalMaterial color="#56b36a" roughness={0.45} clearcoat={0.5} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh position-y={-0.1}>
        <cylinderGeometry args={[0.03, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#3f8a4f" />
      </mesh>
    </group>
  );
}

export function RosemarySprig() {
  const needles = useMemo(
    () => Array.from({ length: 34 }, (_, i) => ({ y: -0.85 + i * 0.05, turn: i * 2.4, tilt: 0.9 + (i % 3) * 0.1, len: 0.3 - i * 0.004 })),
    [],
  );
  return (
    <group rotation-z={-0.7}>
      <mesh>
        <cylinderGeometry args={[0.022, 0.03, 1.9, 8]} />
        <meshStandardMaterial color="#6f5a3e" roughness={0.8} />
      </mesh>
      {needles.map((n, i) => (
        <group key={i} position-y={n.y} rotation-y={n.turn}>
          <mesh position={[0, 0.06, 0.13]} rotation-x={n.tilt}>
            <capsuleGeometry args={[0.026, n.len, 4, 8]} />
            <meshPhysicalMaterial color={i % 2 ? '#4f7f5a' : '#5e9468'} roughness={0.5} clearcoat={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- 복숭아 ---------- */

export function Peach() {
  const leaf = useLeafGeometry();
  const geometry = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 64, 48);
    const pos = g.attributes.position;
    const v = new THREE.Vector3();
    const warm = new THREE.Color('#ffd27a');
    const blush = new THREE.Color('#ff6f7d');
    const tmp = new THREE.Color();
    const colors: number[] = [];
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const phi = Math.atan2(v.x, v.z);
      const crease = Math.exp(-(phi * phi) / 0.015) * 0.09 * (1 - Math.pow(Math.abs(v.y), 3));
      const dimple = v.y > 0 ? Math.exp(-((1 - v.y) ** 2) / 0.004) * 0.12 : 0;
      v.multiplyScalar(1 - crease - dimple);
      v.y *= 0.95;
      pos.setXYZ(i, v.x, v.y, v.z);
      const mix = THREE.MathUtils.clamp(0.45 + v.z * 0.35 + v.y * 0.25 - v.x * 0.25, 0, 1);
      tmp.copy(warm).lerp(blush, mix);
      colors.push(tmp.r, tmp.g, tmp.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group scale={0.55}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial vertexColors roughness={0.6} sheen={1} sheenColor="#ffe6d6" sheenRoughness={0.5} />
      </mesh>
      <mesh geometry={leaf} position={[0.05, 0.86, 0]} rotation={[0.3, 0.4, -1.1]} scale={0.6}>
        <meshPhysicalMaterial color="#5aa35f" roughness={0.45} clearcoat={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position-y={0.92}>
        <cylinderGeometry args={[0.03, 0.045, 0.18, 8]} />
        <meshStandardMaterial color="#6f5a3e" />
      </mesh>
    </group>
  );
}

/* ---------- 휘핑 크림 ---------- */

export function WhipCream({ color = '#fff7f0', turns = 2.6, radius = 0.75, height = 0.9, tube = 0.24 }: { color?: string; turns?: number; radius?: number; height?: number; tube?: number }) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 160; i++) {
      const t = i / 160;
      const angle = t * turns * TAU;
      const r = radius * (1 - t) * 0.9 + 0.04;
      points.push(new THREE.Vector3(Math.cos(angle) * r, t * height + tube * 0.6, Math.sin(angle) * r));
    }
    const tubular = 260;
    const radial = 16;
    const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), tubular, tube, radial, false);
    const pos = g.attributes.position;
    const nor = g.attributes.normal;
    const p = new THREE.Vector3();
    const n = new THREE.Vector3();
    for (let i = 0; i <= tubular; i++) {
      const t = i / tubular;
      const taper = t > 0.82 ? Math.max(0.12, (1 - t) / 0.18) : 1;
      for (let j = 0; j <= radial; j++) {
        const idx = i * (radial + 1) + j;
        p.fromBufferAttribute(pos, idx);
        n.fromBufferAttribute(nor, idx);
        // 별 모양 깍지 자국
        const ridge = 1 + 0.14 * Math.cos((j / radial) * TAU * 8);
        p.addScaledVector(n, tube * (taper * ridge - 1));
        pos.setXYZ(idx, p.x, p.y, p.z);
      }
    }
    g.computeVertexNormals();
    return g;
  }, [turns, radius, height, tube]);

  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial color={color} roughness={0.55} clearcoat={0.4} clearcoatRoughness={0.3} sheen={0.6} sheenColor="#ffffff" />
    </mesh>
  );
}

/* ---------- 마카롱 ---------- */

export function Macaron({ color = '#ffb3cc', filling = '#fff4ea' }: { color?: string; filling?: string }) {
  return (
    <group scale={0.55}>
      <mesh position-y={0.22} scale={[1, 0.5, 1]}>
        <sphereGeometry args={[1, 48, 24, 0, TAU, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color={color} roughness={0.5} clearcoat={0.25} />
      </mesh>
      <mesh position-y={0.2} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.95, 0.09, 12, 48]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.9, 0.9, 0.28, 48]} />
        <meshPhysicalMaterial color={filling} roughness={0.5} sheen={0.5} />
      </mesh>
      <mesh position-y={-0.2} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.95, 0.09, 12, 48]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position-y={-0.22} rotation-x={Math.PI} scale={[1, 0.5, 1]}>
        <sphereGeometry args={[1, 48, 24, 0, TAU, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color={color} roughness={0.5} clearcoat={0.25} />
      </mesh>
    </group>
  );
}

/* ---------- 케이크 조각 ---------- */

const CAKE_LAYERS = [
  { h: 0.3, color: '#f4d29c', rough: 0.85 },
  { h: 0.08, color: '#fff6ec', rough: 0.5 },
  { h: 0.06, color: '#ff4d6d', rough: 0.2 },
  { h: 0.3, color: '#f4d29c', rough: 0.85 },
  { h: 0.14, color: '#fffaf3', rough: 0.5 },
];

export function CakeSlice() {
  const layers = useMemo(() => {
    const angle = 0.9;
    const shape = new THREE.Shape();
    // absarc가 현재 점에서 호 시작점까지 이어 주고 Shape는 자동으로 닫힌다.
    // 같은 점을 두 번 넣으면 Extrude 법선 계산이 NaN이 된다
    shape.moveTo(0, 0);
    shape.absarc(0, 0, 1.1, -angle / 2, angle / 2, false);
    let y = 0;
    return CAKE_LAYERS.map((layer) => {
      const g = new THREE.ExtrudeGeometry(shape, { depth: layer.h, bevelEnabled: false, curveSegments: 24 });
      g.rotateX(-Math.PI / 2);
      const item = { ...layer, geometry: g, y };
      y += layer.h;
      return item;
    });
  }, []);

  return (
    <group scale={0.9} position={[-0.6, -0.42, 0]}>
      {layers.map((l, i) => (
        <mesh key={i} geometry={l.geometry} position-y={l.y}>
          <meshPhysicalMaterial color={l.color} roughness={l.rough} clearcoat={l.rough < 0.3 ? 1 : 0.2} />
        </mesh>
      ))}
      <group position={[0.82, 0.88, 0]} scale={0.32}>
        <WhipCream />
      </group>
      <group position={[0.8, 1.35, 0]} rotation-z={0.4} scale={0.45}>
        <Strawberry />
      </group>
    </group>
  );
}

/* ---------- 레지스트리 ---------- */

export function Topping({ id, color }: { id: ToppingId; color?: string }) {
  switch (id) {
    case 'strawberry':
      return <Strawberry />;
    case 'peach':
      return <Peach />;
    case 'lemon':
      return <CitrusSlice kind="lemon" />;
    case 'orange':
      return <CitrusSlice kind="orange" />;
    case 'blueberry':
      return <Blueberries />;
    case 'mint':
      return <MintSprig />;
    case 'rosemary':
      return <group scale={0.75}><RosemarySprig /></group>;
    case 'cake':
      return <CakeSlice />;
    case 'macaron':
      return <Macaron color={color} />;
  }
}
