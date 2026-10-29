import { View } from '@react-three/drei';
import { HeroScene } from '../../three/HeroScene';

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__copy reveal">
        <p className="eyebrow">Fruit · Herb · Dessert Skincare</p>
        <h1>
          오늘 피부에
          <br />
          <span className="hero__accent">토핑</span> 한 스쿱
        </h1>
        <p className="hero__lead">
          과일, 허브, 디저트 레시피에서 출발한 스킨케어. 향과 텍스처를 레이어링하는 데일리 루틴.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#collection">
            컬렉션 보기
          </a>
          <a className="btn btn--ghost" href="#lab">
            토핑 조합하기
          </a>
        </div>
        <ul className="hero__facts">
          <li>
            <strong>12</strong>
            <span>과일 · 허브 추출물</span>
          </li>
          <li>
            <strong>0%</strong>
            <span>인공 색소</span>
          </li>
          <li>
            <strong>4.9</strong>
            <span>평균 리뷰 평점</span>
          </li>
        </ul>
      </div>
      <View className="hero__view">
        <HeroScene />
      </View>
      <a className="hero__scroll" href="#collection" aria-label="아래로 스크롤">
        <span />
      </a>
    </section>
  );
}
