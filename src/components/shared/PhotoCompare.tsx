import { useState, type CSSProperties } from 'react';
import { View } from '@react-three/drei';
import { Stage } from '../../three/Stage';
import { ProductModel } from '../../three/ProductModel';
import type { Product } from '../../types';

/**
 * 3D 모델 위에 실물 사진을 겹쳐 놓고 손잡이로 경계를 옮기는 비교 슬라이더.
 * 3D는 고정 캔버스(z-index 5) 위에 그려지므로 사진·손잡이는 그보다 높은 z-index로 덮는다.
 */
export function PhotoCompare({ product }: { product: Product }) {
  const [pos, setPos] = useState(50);

  return (
    <div className="compare" style={{ '--pos': `${pos}%` } as CSSProperties}>
      <View className="compare__view">
        <Stage shadowY={-1.15}>
          <ProductModel
            container={product.container}
            color={product.color}
            accent={product.accent}
            label={product.label}
            topping={product.topping}
            toppingColor={product.toppingColor}
            still
          />
        </Stage>
      </View>
      <img className="compare__photo" src={product.photo} alt={`${product.name} 실제 제품 사진`} loading="lazy" draggable={false} />
      <span className="compare__tag compare__tag--left">3D 모델</span>
      <span className="compare__tag compare__tag--right">실제 제품</span>
      <span className="compare__handle" aria-hidden="true">
        <i />
      </span>
      <input
        className="compare__range"
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(event) => setPos(Number(event.target.value))}
        aria-label="3D 모델과 실제 사진 비교 위치"
      />
    </div>
  );
}
