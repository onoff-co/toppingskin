import { useState, type CSSProperties } from 'react';
import { View } from '@react-three/drei';
import { lines, products } from '../../data/products';
import { Stage } from '../../three/Stage';
import { ProductModel } from '../../three/ProductModel';
import type { AddToCart, Product, ProductLine } from '../../types';
import { productPath } from '../../app/router';
import { Link } from '../shared/Link';

export function ProductCard({ product, onAdd }: { product: Product; onAdd: AddToCart }) {
  const [hover, setHover] = useState(false);
  return (
    <article
      className="product-card"
      style={{ '--tint': product.tint, '--accent': product.accent } as CSSProperties}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Link className="product-card__stage" href={productPath(product.id)} tabIndex={-1} aria-hidden="true">
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
        <View className="product-card__view">
          <Stage shadowY={-1.15}>
            <ProductModel
              container={product.container}
              color={product.color}
              accent={product.accent}
              label={product.label}
              topping={product.topping}
              toppingColor={product.toppingColor}
              active={hover}
            />
          </Stage>
        </View>
      </Link>
      <div className="product-card__body">
        <p className="product-card__en">{product.nameEn}</p>
        <h3>
          <Link href={productPath(product.id)}>{product.name}</Link>
        </h3>
        <p className="product-card__desc">{product.description}</p>
        <ul className="product-card__tags">
          {product.tags.map((tag) => (
            <li key={tag}>#{tag}</li>
          ))}
        </ul>
        <div className="product-card__foot">
          <p className="product-card__price">
            {product.price.toLocaleString('ko-KR')}원 <small>{product.volume}</small>
          </p>
          <button className="add-btn" type="button" aria-label={`${product.name} 장바구니 담기`} onClick={() => onAdd({ id: product.id, name: product.name, sub: product.volume, price: product.price, color: product.color })}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

export function Collection({ onAdd }: { onAdd: AddToCart }) {
  const [line, setLine] = useState<ProductLine | 'all'>('all');
  const visible = line === 'all' ? products : products.filter((p) => p.line === line);

  return (
    <section className="collection" id="collection">
      <header className="section-head reveal">
        <p className="eyebrow">The Collection</p>
        <h2>컬렉션</h2>
        <p>과일 비타민 · 허브 진정 · 디저트 영양 케어 라인</p>
      </header>
      <div className="filter-pills" role="tablist" aria-label="라인 필터">
        {lines.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={line === item.id} className={line === item.id ? 'is-active' : ''} onClick={() => setLine(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="product-grid">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
