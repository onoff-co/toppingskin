import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { View } from '@react-three/drei';
import { lines, products } from '../data/products';
import { productDetails } from '../data/productDetails';
import { reviews as homeReviews } from '../data/content';
import { Stage } from '../three/Stage';
import { ProductModel } from '../three/ProductModel';
import { ProductCard } from '../components/home/Collection';
import { Link } from '../components/shared/Link';
import { PhotoCompare } from '../components/shared/PhotoCompare';
import { NotFoundPage } from './NotFoundPage';
import type { AddToCart } from '../types';

const TEXTURE_LABELS = ['워터리', '가벼움', '촉촉', '쫀쫀', '리치'];

type Props = { id: string; onAdd: AddToCart; onBuyNow: () => void };

export function ProductPage({ id, onAdd, onBuyNow }: Props) {
  const product = products.find((p) => p.id === id);
  const detail = productDetails[id];
  const [qty, setQty] = useState(1);
  const turn = useRef(0);
  const drag = useRef<number | null>(null);

  useEffect(() => {
    setQty(1);
    if (product) document.title = `${product.name} | 토핑스킨`;
    return () => {
      document.title = '토핑스킨 | 오늘 피부에 토핑 한 스쿱';
    };
  }, [product]);

  if (!product || !detail) return <NotFoundPage />;

  const lineLabel = lines.find((l) => l.id === product.line)?.label;
  const reviews = [...homeReviews.filter((r) => r.product === product.name), ...detail.reviews];
  const rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const related = [...products.filter((p) => p.id !== id && p.line === product.line), ...products.filter((p) => p.line !== product.line)].slice(0, 3);
  const cartItem = { id: product.id, name: product.name, sub: product.volume, price: product.price, color: product.color };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current === null) return;
    turn.current += (event.clientX - drag.current) * 0.012;
    drag.current = event.clientX;
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <main className="pdp" style={{ '--tint': product.tint, '--accent': product.accent } as CSSProperties}>
      <nav className="pdp__crumbs" aria-label="현재 위치">
        <Link href="/">홈</Link>
        <span aria-hidden="true">/</span>
        <Link href="/#collection">{lineLabel}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <section className="pdp__top">
        <div className="pdp__stage" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
          {product.badge && <span className="product-card__badge">{product.badge}</span>}
          <View className="pdp__view">
            <Stage shadowY={-1.15}>
              <ProductModel
                container={product.container}
                color={product.color}
                accent={product.accent}
                label={product.label}
                topping={product.topping}
                toppingColor={product.toppingColor}
                turn={turn}
              />
            </Stage>
          </View>
          <p className="pdp__hint">← 드래그하여 회전 →</p>
        </div>

        <div className="pdp__info">
          <p className="pdp__line">{lineLabel}</p>
          <p className="pdp__en">{product.nameEn}</p>
          <h1>{product.name}</h1>
          <p className="pdp__rating">
            <span aria-hidden="true">{'★★★★★'.slice(0, Math.round(rating))}</span> {rating.toFixed(1)} <small>· 리뷰 {reviews.length}개</small>
          </p>
          <p className="pdp__headline">{detail.headline}</p>
          <p className="pdp__story">{detail.story}</p>
          <ul className="product-card__tags">
            {product.tags.map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>

          <dl className="pdp__meta">
            <div>
              <dt>용량</dt>
              <dd>{product.volume}</dd>
            </div>
            <div>
              <dt>향</dt>
              <dd>{detail.scent}</dd>
            </div>
            <div>
              <dt>텍스처</dt>
              <dd>
                <span className="pdp__texture" aria-label={`${TEXTURE_LABELS[detail.texture - 1]} (5단계 중 ${detail.texture})`}>
                  {TEXTURE_LABELS.map((label, i) => (
                    <i key={label} className={i < detail.texture ? 'is-on' : ''} />
                  ))}
                </span>
                {TEXTURE_LABELS[detail.texture - 1]}
              </dd>
            </div>
          </dl>

          <div className="pdp__buy">
            <div className="cart-item__qty pdp__qty">
              <button type="button" aria-label="수량 줄이기" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)}>
                −
              </button>
              <span aria-live="polite">{qty}</span>
              <button type="button" aria-label="수량 늘리기" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>
            <p className="pdp__price">{(product.price * qty).toLocaleString('ko-KR')}원</p>
          </div>
          <div className="pdp__actions">
            <button className="btn btn--ghost" type="button" onClick={() => onAdd(cartItem, qty)}>
              장바구니 담기
            </button>
            <button
              className="btn btn--primary"
              type="button"
              onClick={() => {
                onAdd(cartItem, qty);
                onBuyNow();
              }}
            >
              바로 구매하기
            </button>
          </div>
          <p className="pdp__notice">30,000원 이상 무료배송 · 오후 2시 이전 주문 시 당일 출고</p>
        </div>
      </section>

      <section className="pdp__section">
        <header className="pdp__section-head">
          <p className="eyebrow">3D vs Real</p>
          <h2>실제 제품 비교</h2>
          <p className="pdp__section-sub">3D 모델과 실제 촬영 이미지 비교 · 좌우 드래그</p>
        </header>
        <PhotoCompare product={product} />
      </section>

      <section className="pdp__section">
        <header className="pdp__section-head">
          <p className="eyebrow">Topping Recipe</p>
          <h2>주요 성분</h2>
        </header>
        <ol className="pdp__ingredients">
          {detail.ingredients.map((item, i) => (
            <li key={item.name}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>{item.name}</h3>
              <p>{item.role}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="pdp__section pdp__guide">
        <div>
          <p className="eyebrow">For You</p>
          <h2>추천 피부 타입</h2>
          <ul className="pdp__checks">
            {detail.skin.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">How to Use</p>
          <h2>사용 방법</h2>
          <ol className="pdp__steps">
            {detail.howTo.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      </section>

      <details className="pdp__full">
        <summary>전성분 보기</summary>
        <p>{detail.fullIngredients}</p>
      </details>

      <section className="pdp__section">
        <header className="pdp__section-head">
          <p className="eyebrow">Reviews</p>
          <h2>고객 리뷰</h2>
        </header>
        <div className="pdp__reviews">
          {reviews.map((r) => (
            <article key={r.author} className="pdp__review">
              <p className="review-card__stars" aria-label={`별점 ${r.rating}점`}>
                {'★★★★★'.slice(0, r.rating)}
                <span>{'★★★★★'.slice(r.rating)}</span>
              </p>
              <p>“{r.body}”</p>
              <footer>
                <strong>{r.author}</strong> · {r.skin}
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="pdp__section">
        <header className="pdp__section-head">
          <p className="eyebrow">Pair it with</p>
          <h2>함께 쓰면 좋은 제품</h2>
        </header>
        <div className="product-grid">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} />
          ))}
        </div>
      </section>
    </main>
  );
}
