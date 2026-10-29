import { useState, type CSSProperties } from 'react';
import { View } from '@react-three/drei';
import { bases, STAT_MAX, stats, toppings } from '../../data/lab';
import { Stage } from '../../three/Stage';
import { ProductModel } from '../../three/ProductModel';
import type { AddToCart } from '../../types';

export function ToppingLab({ onAdd }: { onAdd: AddToCart }) {
  const [baseId, setBaseId] = useState(bases[0].id);
  const [toppingId, setToppingId] = useState(toppings[0].id);
  const base = bases.find((b) => b.id === baseId)!;
  const topping = toppings.find((t) => t.id === toppingId)!;
  const recipe = `${topping.name} ${base.name}`;

  return (
    <section className="lab" id="lab" style={{ '--tint': topping.color, '--accent': topping.accent } as CSSProperties}>
      <header className="section-head reveal">
        <p className="eyebrow">Topping Lab</p>
        <h2>나만의 토핑을 골라보세요</h2>
        <p>베이스 텍스처와 토핑 선택에 따른 피부 고민별 맞춤 레시피</p>
      </header>

      <div className="lab__grid">
        <div className="lab__controls">
          <fieldset>
            <legend>
              <span>1</span> 베이스 텍스처
            </legend>
            <div className="lab__bases">
              {bases.map((b) => (
                <button key={b.id} type="button" aria-pressed={b.id === baseId} onClick={() => setBaseId(b.id)}>
                  <strong>{b.name}</strong>
                  <small>{b.en}</small>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <span>2</span> 토핑
            </legend>
            <div className="lab__toppings">
              {toppings.map((t) => (
                <button key={t.id} type="button" aria-pressed={t.id === toppingId} onClick={() => setToppingId(t.id)} style={{ '--swatch': t.color, '--swatch-ink': t.accent } as CSSProperties}>
                  <i />
                  {t.name}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="lab__stage">
          <View className="lab__view">
            <Stage shadowY={-1.15}>
              <ProductModel
                container={base.container}
                color={topping.color}
                accent={topping.accent}
                label={topping.en.toUpperCase()}
                topping={topping.id}
                dropKey={`${base.id}-${topping.id}`}
              />
            </Stage>
          </View>
          <p className="lab__hint">토핑 선택 시 실시간 반영</p>
        </div>

        <div className="lab__result" aria-live="polite">
          <p className="lab__result-en">
            {topping.en} {base.en}
          </p>
          <h3>{recipe}</h3>
          <p className="lab__result-texture">{base.texture}</p>
          <dl>
            <div>
              <dt>핵심 성분</dt>
              <dd>{topping.ingredient}</dd>
            </div>
            <div>
              <dt>기대 효과</dt>
              <dd>{topping.benefit}</dd>
            </div>
            <div>
              <dt>추천 피부</dt>
              <dd>{topping.skin}</dd>
            </div>
          </dl>
          <ul className="meters">
            {stats.map((s) => {
              const value = Math.min(STAT_MAX, topping.stats[s.id] + (base.boost[s.id] ?? 0));
              return (
                <li key={s.id}>
                  <span>{s.label}</span>
                  <span className="meters__bar">
                    <span style={{ width: `${(value / STAT_MAX) * 100}%` }} />
                  </span>
                  <b>{value}</b>
                </li>
              );
            })}
          </ul>
          <button className="btn btn--primary btn--block" type="button" onClick={() => onAdd({ id: `lab-${base.id}-${topping.id}`, name: recipe, sub: `커스텀 레시피 · ${base.volume}`, price: base.price, color: topping.color })}>
            레시피 담기 · {base.price.toLocaleString('ko-KR')}원
          </button>
        </div>
      </div>
    </section>
  );
}
