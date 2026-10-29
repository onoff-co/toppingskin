import { InfoLayout } from '../components/shared/InfoLayout';

const shipping = [
  { label: '배송 업체', value: 'CJ대한통운' },
  { label: '배송비', value: '3,000원 · 30,000원 이상 구매 시 무료' },
  { label: '출고 기준', value: '평일 오후 2시 이전 결제 완료 시 당일 출고' },
  { label: '배송 기간', value: '출고 후 1 – 3 영업일' },
  { label: '추가 배송비', value: '제주 3,000원 · 도서산간 5,000원' },
];

const returns = [
  { label: '신청 기간', value: '제품 수령 후 7일 이내' },
  { label: '단순 변심', value: '왕복 배송비 6,000원 고객 부담 · 미개봉 제품에 한함' },
  { label: '제품 하자 · 오배송', value: '배송비 전액 토핑스킨 부담' },
  { label: '환불 시점', value: '반품 제품 도착 및 검수 완료 후 3 영업일 이내' },
];

const notAllowed = [
  '제품 개봉 또는 사용으로 상품 가치가 훼손된 경우',
  '시간 경과로 재판매가 어려울 만큼 상품 가치가 떨어진 경우',
  '구성품 · 사은품 누락 또는 패키지 훼손이 있는 경우',
  '수령 후 7일이 지난 경우',
];

const steps = ['고객센터 · 이메일로 교환 · 반품 접수', '접수 확인 후 회수 기사 방문 안내', '제품 회수 및 검수', '교환 제품 재발송 또는 환불 처리'];

function InfoTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="info-table">
      {rows.map((r) => (
        <div key={r.label}>
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ShippingPage({ path }: { path: string }) {
  return (
    <InfoLayout path={path} eyebrow="Shipping & Returns" title="배송 · 교환 안내" intro="배송 기준 및 교환 · 반품 절차 안내">
      <section className="info__section">
        <h2>배송 안내</h2>
        <InfoTable rows={shipping} />
      </section>

      <section className="info__section">
        <h2>교환 · 반품 안내</h2>
        <InfoTable rows={returns} />
      </section>

      <section className="info__section">
        <h2>교환 · 반품 절차</h2>
        <ol className="info-steps">
          {steps.map((s, i) => (
            <li key={s}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {s}
            </li>
          ))}
        </ol>
      </section>

      <section className="info__section">
        <h2>교환 · 반품 불가 사유</h2>
        <ul className="info-list">
          {notAllowed.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="info__note">피부 트러블로 인한 반품은 전문의 소견서 제출 시 개봉 여부와 관계없이 접수 가능.</p>
      </section>
    </InfoLayout>
  );
}
