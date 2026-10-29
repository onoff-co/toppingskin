import * as THREE from 'three';

const cache = new Map<string, THREE.Texture>();

function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  draw(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { texture, redraw: () => { draw(ctx); texture.needsUpdate = true; } };
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

/** 단면이 보이는 시트러스 슬라이스 텍스처 */
export function citrusTexture(flesh: string, rind: string) {
  const key = `citrus:${flesh}:${rind}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const { texture } = canvasTexture(512, 512, (ctx) => {
    const c = 256;
    const rand = seeded(7);
    circle(ctx, c, c, c, rind);
    circle(ctx, c, c, c * 0.93, '#fff6dc');
    const n = 10;
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2 + 0.035;
      const a1 = ((i + 1) / n) * Math.PI * 2 - 0.035;
      const mid = (a0 + a1) / 2;
      ctx.beginPath();
      ctx.moveTo(c + Math.cos(mid) * c * 0.08, c + Math.sin(mid) * c * 0.08);
      ctx.arc(c, c, c * 0.87, a0, a1);
      ctx.closePath();
      ctx.fillStyle = flesh;
      ctx.fill();
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      for (let k = 0; k < 26; k++) {
        const a = a0 + rand() * (a1 - a0);
        const r0 = c * (0.15 + rand() * 0.65);
        const len = c * (0.06 + rand() * 0.08);
        ctx.beginPath();
        ctx.moveTo(c + Math.cos(a) * r0, c + Math.sin(a) * r0);
        ctx.lineTo(c + Math.cos(a) * (r0 + len), c + Math.sin(a) * (r0 + len));
        ctx.stroke();
      }
      ctx.restore();
    }
    circle(ctx, c, c, c * 0.07, '#fff6dc');
  });
  cache.set(key, texture);
  return texture;
}

type LabelOptions = { title: string; sub: string; bg: string; ink: string; layout: 'band' | 'tube' };

/** 용기 둘레를 감싸는 브랜드 라벨. 둘레에 두 번 반복되도록 repeat.x = 2 */
export function labelTexture({ title, sub, bg, ink, layout }: LabelOptions) {
  const key = `label:${layout}:${title}:${sub}:${bg}:${ink}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const [w, h] = layout === 'band' ? [1024, 180] : [512, 640];
  const { texture, redraw } = canvasTexture(w, h, (ctx) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (layout === 'band') {
      ctx.font = `italic 600 ${h * 0.4}px Fraunces, Georgia, serif`;
      ctx.fillText(title, w / 2, h * 0.42);
      ctx.font = `700 ${h * 0.13}px "Noto Sans KR", Arial, sans-serif`;
      ctx.fillText(sub.split('').join(' '), w / 2, h * 0.8);
    } else {
      ctx.font = `italic 600 ${w * 0.2}px Fraunces, Georgia, serif`;
      ctx.fillText(title, w / 2, h * 0.5);
      ctx.font = `700 ${w * 0.06}px "Noto Sans KR", Arial, sans-serif`;
      ctx.fillText(sub.split('').join(' '), w / 2, h * 0.6);
      ctx.fillRect(w * 0.38, h * 0.38, w * 0.24, 3);
    }
  });
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  document.fonts?.load('italic 600 40px Fraunces').then(redraw).catch(() => undefined);
  cache.set(key, texture);
  return texture;
}

/** 오브젝트 아래 깔리는 부드러운 그림자 */
export function shadowTexture() {
  const hit = cache.get('shadow');
  if (hit) return hit;
  const { texture } = canvasTexture(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(150,70,60,0.32)');
    g.addColorStop(0.55, 'rgba(150,70,60,0.12)');
    g.addColorStop(1, 'rgba(150,70,60,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  });
  cache.set('shadow', texture);
  return texture;
}
