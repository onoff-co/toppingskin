import { useLayoutEffect, type ReactNode } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { shadowTexture } from './textures';

let studioEnv: THREE.Texture | null = null;

/** 모든 View가 공유하는 스튜디오 반사광. 한 번만 만든다. */
function getStudioEnv(gl: THREE.WebGLRenderer) {
  if (!studioEnv) {
    const pmrem = new THREE.PMREMGenerator(gl);
    studioEnv = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
  }
  return studioEnv;
}

export function SoftShadow({ y = -1.2, size = 4, x = 0 }: { y?: number; size?: number; x?: number }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[x, y, 0]} renderOrder={-1}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={shadowTexture()} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

type StageProps = {
  children: ReactNode;
  camera?: [number, number, number];
  target?: [number, number, number];
  fov?: number;
  shadowY?: number;
  shadowSize?: number;
  shadow?: boolean;
};

export function Stage({ children, camera = [0, 0.5, 7], target = [0, 0, 0], fov = 30, shadowY = -1.2, shadowSize = 4, shadow = true }: StageProps) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useLayoutEffect(() => {
    scene.environment = getStudioEnv(gl);
    scene.environmentIntensity = 0.85;
  }, [gl, scene]);

  return (
    <>
      <PerspectiveCamera makeDefault position={camera} fov={fov} onUpdate={(cam) => cam.lookAt(...target)} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.7} color="#fff3e4" />
      <pointLight position={[-4, 1.5, -2]} intensity={20} color="#ffb3c6" />
      <pointLight position={[3, -1, 3]} intensity={6} color="#fff0d0" />
      {children}
      {shadow && <SoftShadow y={shadowY} size={shadowSize} />}
    </>
  );
}
