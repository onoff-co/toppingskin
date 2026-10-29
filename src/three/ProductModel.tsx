import { useEffect, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import type { ContainerKind, ToppingId } from '../types';
import { Container } from './containers';
import { Topping, WhipCream } from './toppings';
import { prefersReducedMotion } from './pointer';

/** 용기마다 화면 안에 들어오도록 맞춘 크기와 높이. top은 용기 윗면 높이 */
const FIT: Record<ContainerKind, { scale: number; y: number; top: number }> = {
  jar: { scale: 0.9, y: -1.12, top: 1.38 },
  bottle: { scale: 0.92, y: -1.2, top: 2.5 },
  dropper: { scale: 1.12, y: -1.2, top: 2.2 },
  tube: { scale: 0.86, y: -1.25, top: 2.76 },
};

type Props = {
  container: ContainerKind;
  color: string;
  accent: string;
  label: string;
  topping: ToppingId;
  toppingColor?: string;
  /** 마우스를 올리면 빨리 돈다 */
  active?: boolean;
  /** 값이 바뀌면 토핑이 위에서 떨어지는 연출 */
  dropKey?: string;
  /** 드래그로 쌓인 회전량. 매 프레임 소비하고 0으로 되돌린다 */
  turn?: RefObject<number>;
  /** 실물 사진과 비교할 때처럼 정면을 보고 멈춰 있는다 */
  still?: boolean;
};

export function ProductModel({ container, color, accent, label, topping, toppingColor, active = false, dropKey, turn, still = false }: Props) {
  const spin = useRef<THREE.Group>(null);
  const drop = useRef<THREE.Group>(null);
  const speed = useRef(still ? 0 : 0.35);
  const fall = useRef({ y: 0, v: 0 });
  const fit = FIT[container];

  useEffect(() => {
    if (dropKey !== undefined) fall.current = { y: 2.6, v: 0 };
  }, [dropKey]);

  useFrame((state, dt) => {
    const step = Math.min(dt, 1 / 30);
    speed.current = THREE.MathUtils.damp(speed.current, active ? 2.2 : still || prefersReducedMotion ? 0 : 0.35, 4, step);
    if (spin.current) {
      spin.current.rotation.y += step * speed.current;
      if (turn?.current) {
        spin.current.rotation.y += turn.current;
        turn.current = 0;
      }
      spin.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
    }
    // 스프링으로 톡 떨어졌다 튀어오르기
    const f = fall.current;
    f.v += -f.y * 140 * step;
    f.v *= Math.pow(0.002, step);
    f.y += f.v * step;
    if (drop.current) drop.current.position.y = f.y;
  });

  const onJar = container === 'jar';

  return (
    <group position-y={fit.y} scale={fit.scale}>
      <group ref={spin}>
        <Container kind={container} color={color} accent={accent} label={label} />
        <group ref={drop}>
          {onJar ? (
            <group position-y={fit.top - 0.02}>
              <group scale={0.62}>
                <WhipCream />
              </group>
              <group position-y={topping === 'cake' ? 0.8 : 0.95} rotation={[0.25, 0, topping === 'strawberry' ? 0.5 : 0.15]} scale={topping === 'cake' ? 0.68 : 0.95}>
                <Topping id={topping} color={toppingColor} />
              </group>
            </group>
          ) : (
            <Float speed={prefersReducedMotion ? 0 : 2} rotationIntensity={0.6} floatIntensity={0.6}>
              <group position={[0.95, fit.top * 0.62, 0.45]} scale={0.95}>
                <Topping id={topping} color={toppingColor} />
              </group>
            </Float>
          )}
        </group>
      </group>
    </group>
  );
}
