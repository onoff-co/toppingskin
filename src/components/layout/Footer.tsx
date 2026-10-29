import { navigation } from '../../data/content';
import { Link } from '../shared/Link';
import { Logo } from '../shared/Logo';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <Logo />
          <p>과일 · 허브 · 디저트 레시피 기반 스킨케어 브랜드</p>
        </div>
        <nav className="site-footer__links" aria-label="푸터 메뉴">
          <p>Shop</p>
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="site-footer__links">
          <p>Customer</p>
          <Link href="/support">고객센터 1588-0000</Link>
          <Link href="/shipping">배송 · 교환 안내</Link>
          <Link href="/privacy">개인정보처리방침</Link>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© 2026 Topping Skin. 포트폴리오용 가상 브랜드입니다.</span>
        <span>Instagram · YouTube · Kakao</span>
      </div>
    </footer>
  );
}
