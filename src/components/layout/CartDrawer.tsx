import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { CartItem } from '../../types';
import { Link } from '../shared/Link';

const FREE_SHIPPING = 30000;
const SHIPPING_FEE = 3000;

const won = (value: number) => `${value.toLocaleString('ko-KR')}원`;

type Props = {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
};

export function CartDrawer({ open, items, onClose, onQty, onRemove, onCheckout }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [ordered, setOrdered] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
  const remain = Math.max(0, FREE_SHIPPING - subtotal);

  useEffect(() => {
    if (!open) {
      setOrdered(false);
      return;
    }
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const checkout = () => {
    setOrdered(true);
    onCheckout();
  };

  return (
    <div className={`cart${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="cart__backdrop" onClick={onClose} />
      <aside className="cart__panel" role="dialog" aria-modal="true" aria-label="장바구니" inert={!open}>
        <header className="cart__head">
          <h2>
            장바구니 <span>{items.reduce((n, item) => n + item.qty, 0)}</span>
          </h2>
          <button ref={closeRef} className="cart__close" type="button" aria-label="장바구니 닫기" onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        {ordered ? (
          <div className="cart__empty">
            <p className="cart__empty-icon" aria-hidden="true">🧁</p>
            <h3>주문 접수 완료</h3>
            <p>주문이 정상적으로 접수되었습니다. (포트폴리오 데모 · 실제 결제 없음)</p>
            <button className="btn btn--ghost" type="button" onClick={onClose}>
              쇼핑 계속하기
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="cart__empty">
            <p className="cart__empty-icon" aria-hidden="true">🍓</p>
            <h3>장바구니가 비어 있습니다</h3>
            <p>컬렉션 또는 토핑 랩에서 제품 선택 가능</p>
            <Link className="btn btn--primary" href="/#collection" onClick={onClose}>
              컬렉션 보기
            </Link>
          </div>
        ) : (
          <>
            <div className="cart__shipping">
              <p>{remain > 0 ? <>{won(remain)} 추가 구매 시 <b>무료배송</b></> : <><b>무료배송</b> 적용</>}</p>
              <span className="meters__bar">
                <span style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING) * 100)}%` }} />
              </span>
            </div>
            <ul className="cart__list">
              {items.map((item) => (
                <li key={item.id} className="cart-item" style={{ '--swatch': item.color } as CSSProperties}>
                  <i className="cart-item__swatch" aria-hidden="true" />
                  <div className="cart-item__info">
                    <strong>{item.name}</strong>
                    <small>{item.sub}</small>
                    <div className="cart-item__qty">
                      <button type="button" aria-label={`${item.name} 수량 줄이기`} disabled={item.qty <= 1} onClick={() => onQty(item.id, -1)}>
                        −
                      </button>
                      <span aria-live="polite">{item.qty}</span>
                      <button type="button" aria-label={`${item.name} 수량 늘리기`} onClick={() => onQty(item.id, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-item__side">
                    <b>{won(item.price * item.qty)}</b>
                    <button type="button" className="cart-item__remove" onClick={() => onRemove(item.id)}>
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="cart__foot">
              <dl>
                <div>
                  <dt>상품 금액</dt>
                  <dd>{won(subtotal)}</dd>
                </div>
                <div>
                  <dt>배송비</dt>
                  <dd>{shipping ? won(shipping) : '무료'}</dd>
                </div>
                <div className="cart__total">
                  <dt>결제 예정 금액</dt>
                  <dd>{won(subtotal + shipping)}</dd>
                </div>
              </dl>
              <button className="btn btn--primary btn--block" type="button" onClick={checkout}>
                주문하기
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
