import type { CSSProperties, PointerEvent } from 'react';
import { reviews } from '../../data/content';

function tilt(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  el.style.setProperty('--ry', `${x * 14}deg`);
  el.style.setProperty('--rx', `${-y * 14}deg`);
}

function reset(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty('--ry', '0deg');
  event.currentTarget.style.setProperty('--rx', '0deg');
}

export function Reviews() {
  return (
    <section className="reviews" id="reviews">
      <header className="section-head reveal">
        <p className="eyebrow">Sweet Reviews</p>
        <h2>한 입 먹어본 듯한 후기</h2>
        <p>토핑스킨 실사용 고객 후기</p>
      </header>
      <div className="review-grid">
        {reviews.map((r) => (
          <article key={r.author} className="review-card" style={{ '--tint': r.color } as CSSProperties} onPointerMove={tilt} onPointerLeave={reset}>
            <div className="review-card__inner">
              <p className="review-card__stars" aria-label={`별점 ${r.rating}점`}>
                {'★★★★★'.slice(0, r.rating)}
                <span>{'★★★★★'.slice(r.rating)}</span>
              </p>
              <p className="review-card__body">“{r.body}”</p>
              <footer>
                <strong>
                  {r.author} <small>· {r.skin}</small>
                </strong>
                <span>{r.product}</span>
              </footer>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
