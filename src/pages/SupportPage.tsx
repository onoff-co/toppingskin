import { InfoLayout } from '../components/shared/InfoLayout';
import { Link } from '../components/shared/Link';

const channels = [
  { label: '전화 상담', value: '1588-0000', note: '평일 10:00 – 17:00 · 점심 12:30 – 13:30', href: 'tel:15880000' },
  { label: '카카오톡 채널', value: '@토핑스킨', note: '평일 10:00 – 17:00 · 순차 답변' },
  { label: '이메일 문의', value: 'help@toppingskin.example', note: '24시간 접수 · 영업일 기준 1일 이내 답변', href: 'mailto:help@toppingskin.example' },
];

const faqs = [
  { q: '주문 취소는 언제까지 가능한가요?', a: '출고 전까지 장바구니 · 주문 내역에서 직접 취소 가능. 오후 2시 이후 주문 건은 다음 영업일 오전 출고 전까지 취소 가능.' },
  { q: '배송은 얼마나 걸리나요?', a: '오후 2시 이전 결제 완료 시 당일 출고, 출고 후 1 – 3 영업일 이내 수령. 제주 · 도서산간 지역은 1 – 2일 추가 소요.' },
  { q: '교환 · 반품은 어떻게 신청하나요?', a: '수령 후 7일 이내 고객센터 또는 이메일로 접수. 자세한 기준은 배송 · 교환 안내 페이지 참고.' },
  { q: '사용 후 피부 트러블이 생겼어요.', a: '사용 중지 후 고객센터로 문의. 피부과 전문의 소견서 제출 시 사용 여부와 관계없이 환불 처리.' },
  { q: '제품 사용기한은 어떻게 되나요?', a: '제조일로부터 24개월, 개봉 후 12개월 권장. 립 마스크 등 일부 제품은 개봉 후 6개월 권장.' },
  { q: '단체 구매 · 입점 제휴 문의는 어디로 하나요?', a: 'partner@toppingskin.example 로 회사명, 담당자, 문의 내용 기재 후 발송.' },
];

/** 좁은 카드에서 이메일이 글자 중간이 아니라 @ 뒤에서 줄바꿈되도록 */
function breakAtSign(value: string) {
  const [user, domain] = value.split('@');
  return domain ? (
    <>
      {user}@<wbr />
      {domain}
    </>
  ) : (
    value
  );
}

export function SupportPage({ path }: { path: string }) {
  return (
    <InfoLayout path={path} eyebrow="Customer Center" title="고객센터" intro="주문 · 배송 · 제품 사용 관련 문의 안내">
      <section className="info__section">
        <h2>상담 채널</h2>
        <ul className="info-channels">
          {channels.map((c) => (
            <li key={c.label}>
              <span>{c.label}</span>
              {c.href ? <a href={c.href}>{breakAtSign(c.value)}</a> : <strong>{c.value}</strong>}
              <small>{c.note}</small>
            </li>
          ))}
        </ul>
        <p className="info__note">주말 · 공휴일 휴무. 휴무일 접수 문의는 다음 영업일 순차 답변.</p>
      </section>

      <section className="info__section">
        <h2>자주 묻는 질문</h2>
        <div className="info-faq">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <p className="info__note">
          교환 · 반품 기준은 <Link href="/shipping">배송 · 교환 안내</Link>에서 확인 가능.
        </p>
      </section>
    </InfoLayout>
  );
}
