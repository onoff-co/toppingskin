import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import * as THREE from 'three';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { SupportPage } from '../pages/SupportPage';
import { ShippingPage } from '../pages/ShippingPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { scrollAfterNavigate, usePathname } from './router';
import { CartDrawer } from '../components/layout/CartDrawer';
import { useReveal } from '../hooks/useReveal';
import type { AddToCart, CartItem } from '../types';

const CART_KEY = 'toppingskin-cart';

function loadCart(): CartItem[] {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<number>(undefined);
  const cartCount = cart.reduce((n, item) => n + item.qty, 0);
  const path = usePathname();
  useReveal(path);

  useEffect(() => {
    requestAnimationFrame(scrollAfterNavigate);
  }, [path]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // 저장소를 못 쓰는 환경에서는 새로고침 시 장바구니가 비워질 뿐이다
    }
  }, [cart]);

  const addToCart = useCallback<AddToCart>((item, qty = 1) => {
    setCart((items) =>
      items.some((i) => i.id === item.id) ? items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i)) : [...items, { ...item, qty }],
    );
    setToast(`${item.name} · 장바구니에 추가되었습니다`);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2200);
  }, []);

  const changeQty = useCallback((id: string, delta: number) => {
    setCart((items) => items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)));
  }, []);

  const removeItem = useCallback((id: string) => setCart((items) => items.filter((i) => i.id !== id)), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const checkout = useCallback(() => setCart([]), []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  return (
    <>
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} items={cart} onClose={closeCart} onQty={changeQty} onRemove={removeItem} onCheckout={checkout} />
      {path === '/' ? (
        <HomePage onAdd={addToCart} />
      ) : path.startsWith('/products/') ? (
        <ProductPage key={path} id={path.slice('/products/'.length)} onAdd={addToCart} onBuyNow={() => setCartOpen(true)} />
      ) : path === '/support' ? (
        <SupportPage path={path} />
      ) : path === '/shipping' ? (
        <ShippingPage path={path} />
      ) : path === '/privacy' ? (
        <PrivacyPage path={path} />
      ) : (
        <NotFoundPage />
      )}
      <Footer />
      <p className={`toast${toast ? ' is-visible' : ''}`} role="status">
        {toast}
      </p>
      {/* 페이지 전체를 덮는 단일 WebGL 캔버스. 각 섹션의 <View>가 자기 영역에만 그려진다 */}
      <Canvas
        className="gl-layer"
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 5 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NeutralToneMapping;
        }}
      >
        <View.Port />
      </Canvas>
    </>
  );
}
