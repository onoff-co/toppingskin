import type { LabBase, LabTopping, Stat } from '../types';

export const stats: { id: Stat; label: string }[] = [
  { id: 'moist', label: '수분' },
  { id: 'soothe', label: '진정' },
  { id: 'glow', label: '광채' },
  { id: 'nourish', label: '영양' },
];

export const STAT_MAX = 6;

export const bases: LabBase[] = [
  { id: 'cream', name: '크림', en: 'Cream', container: 'jar', price: 30000, volume: '50ml', texture: '생크림처럼 쫀쫀하게 감싸는 텍스처', boost: { moist: 1, nourish: 2 } },
  { id: 'jelly', name: '젤리', en: 'Jelly', container: 'tube', price: 24000, volume: '100ml', texture: '탱글하게 녹아드는 젤리 텍스처', boost: { soothe: 2, moist: 1 } },
  { id: 'serum', name: '세럼', en: 'Serum', container: 'dropper', price: 34000, volume: '30ml', texture: '시럽처럼 스며드는 세럼 텍스처', boost: { glow: 2, moist: 1 } },
  { id: 'toner', name: '토너', en: 'Toner', container: 'bottle', price: 22000, volume: '200ml', texture: '과즙처럼 맑은 워터 텍스처', boost: { soothe: 1, moist: 1 } },
];

export const toppings: LabTopping[] = [
  { id: 'strawberry', name: '딸기', en: 'Strawberry', color: '#ffc4d0', accent: '#ff6b88', ingredient: '딸기 추출물 · 히알루론산', benefit: '속당김 없이 차오르는 물광', skin: '건성 · 수분 부족 피부', stats: { moist: 4, soothe: 2, glow: 3, nourish: 2 } },
  { id: 'peach', name: '복숭아', en: 'Peach', color: '#ffd3bd', accent: '#f07b5a', ingredient: '복숭아 추출물 · 판테놀', benefit: '보송하고 매끈한 피부결', skin: '결이 거친 피부', stats: { moist: 3, soothe: 2, glow: 3, nourish: 2 } },
  { id: 'lemon', name: '레몬', en: 'Lemon', color: '#fff0a3', accent: '#e0a21c', ingredient: '레몬 유래 비타민C · 나이아신아마이드', benefit: '맑게 밝아지는 톤', skin: '칙칙한 피부', stats: { moist: 2, soothe: 1, glow: 4, nourish: 1 } },
  { id: 'blueberry', name: '블루베리', en: 'Blueberry', color: '#cfd2f7', accent: '#6b6fd0', ingredient: '블루베리 추출물 · 아데노신', benefit: '탄탄하게 차오르는 탄력', skin: '탄력이 고민인 피부', stats: { moist: 2, soothe: 2, glow: 2, nourish: 4 } },
  { id: 'mint', name: '민트', en: 'Mint', color: '#c4ecd0', accent: '#3f9f63', ingredient: '페퍼민트 잎수 · 마데카소사이드', benefit: '열감을 식히는 쿨링 진정', skin: '민감 · 붉은기 피부', stats: { moist: 2, soothe: 4, glow: 1, nourish: 1 } },
  { id: 'rosemary', name: '로즈마리', en: 'Rosemary', color: '#d8e9c9', accent: '#4f7f5a', ingredient: '로즈마리 잎 추출물 · 녹차수', benefit: '산뜻하게 정돈되는 모공', skin: '지성 · 복합성 피부', stats: { moist: 1, soothe: 3, glow: 2, nourish: 1 } },
  { id: 'cake', name: '바닐라 케이크', en: 'Vanilla Cake', color: '#fff0d4', accent: '#e39a6a', ingredient: '시어버터 · 바닐라빈 · 세라마이드', benefit: '포근하게 채우는 장벽 영양', skin: '극건성 · 거친 피부', stats: { moist: 3, soothe: 2, glow: 1, nourish: 4 } },
  { id: 'macaron', name: '마카롱', en: 'Macaron', color: '#ffd6e6', accent: '#f0709c', ingredient: '라즈베리 씨드 오일 · 스쿠알란', benefit: '말랑하게 녹아드는 보습막', skin: '각질 · 들뜸 피부', stats: { moist: 4, soothe: 1, glow: 2, nourish: 3 } },
];
