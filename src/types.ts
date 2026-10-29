export type ContainerKind = 'jar' | 'bottle' | 'dropper' | 'tube';
export type ToppingId = 'strawberry' | 'peach' | 'lemon' | 'orange' | 'blueberry' | 'mint' | 'rosemary' | 'cake' | 'macaron';
export type ProductLine = 'fruit' | 'herb' | 'dessert';

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  line: ProductLine;
  price: number;
  volume: string;
  container: ContainerKind;
  /** 용기 본체 색 */
  color: string;
  /** 뚜껑·라벨 글씨 색 */
  accent: string;
  /** 카드 배경 */
  tint: string;
  topping: ToppingId;
  toppingColor?: string;
  /** 실물 비교용 제품 사진 (public 기준 경로) */
  photo: string;
  label: string;
  description: string;
  tags: string[];
  badge?: string;
}

export interface ProductDetail {
  headline: string;
  story: string;
  ingredients: { name: string; role: string }[];
  skin: string[];
  howTo: string[];
  /** 1 가벼움 ~ 5 리치 */
  texture: number;
  scent: string;
  fullIngredients: string;
  reviews: { rating: number; body: string; author: string; skin: string }[];
}

export type AddToCart = (item: Omit<CartItem, 'qty'>, qty?: number) => void;

export interface CartItem {
  id: string;
  name: string;
  /** 용량 또는 레시피 설명 */
  sub: string;
  price: number;
  color: string;
  qty: number;
}

export type Stat = 'moist' | 'soothe' | 'glow' | 'nourish';

export interface LabBase {
  id: string;
  name: string;
  en: string;
  container: ContainerKind;
  price: number;
  volume: string;
  texture: string;
  boost: Partial<Record<Stat, number>>;
}

export interface LabTopping {
  id: ToppingId;
  name: string;
  en: string;
  color: string;
  accent: string;
  ingredient: string;
  benefit: string;
  skin: string;
  stats: Record<Stat, number>;
}
