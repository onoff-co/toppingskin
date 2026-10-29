import { useEffect, type ReactNode } from 'react';
import { Link } from './Link';

export const infoPages = [
  { href: '/support', label: '고객센터' },
  { href: '/shipping', label: '배송 · 교환 안내' },
  { href: '/privacy', label: '개인정보처리방침' },
];

type Props = { path: string; eyebrow: string; title: string; intro: string; children: ReactNode };

/** 고객센터 · 배송 안내 · 개인정보처리방침이 함께 쓰는 안내 페이지 틀 */
export function InfoLayout({ path, eyebrow, title, intro, children }: Props) {
  useEffect(() => {
    document.title = `${title} | 토핑스킨`;
    return () => {
      document.title = '토핑스킨 | 오늘 피부에 토핑 한 스쿱';
    };
  }, [title]);

  return (
    <main className="info">
      <header className="info__head">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>
      <nav className="info__tabs" aria-label="고객 안내">
        {infoPages.map((page) => (
          <Link key={page.href} href={page.href} aria-current={page.href === path ? 'page' : undefined}>
            {page.label}
          </Link>
        ))}
      </nav>
      <div className="info__body">{children}</div>
    </main>
  );
}
