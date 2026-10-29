import { useEffect, useState } from 'react';
import { navigation } from '../../data/content';
import { Link } from '../shared/Link';
import { Logo } from '../shared/Logo';

export function Header({ cartCount, onCartOpen }: { cartCount: number; onCartOpen: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <Link className="site-header__logo" href="/" aria-label="토핑스킨 홈" onClick={() => setOpen(false)}>
        <Logo />
      </Link>
      <nav className="site-header__nav" aria-label="주요 메뉴">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="site-header__actions">
        <button
          className="cart-btn"
          type="button"
          aria-label={`장바구니 열기, ${cartCount}개 담김`}
          aria-haspopup="dialog"
          onClick={() => {
            setOpen(false);
            onCartOpen();
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 8h14l-1.2 10.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
            <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
          </svg>
          {cartCount > 0 && <span key={cartCount} className="cart-btn__count">{cartCount}</span>}
        </button>
        <button className="menu-btn" type="button" aria-expanded={open} aria-label="메뉴 열기" onClick={() => setOpen((v) => !v)}>
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
