import { InfoLayout } from '../components/shared/InfoLayout';

const sections = [
  {
    title: '수집하는 개인정보 항목',
    items: ['회원가입: 이름, 이메일, 비밀번호, 휴대전화 번호', '주문 · 배송: 수령인 이름, 연락처, 배송지 주소', '서비스 이용 과정: 접속 기록, 쿠키, 기기 정보'],
  },
  {
    title: '개인정보의 수집 및 이용 목적',
    items: ['주문 처리, 결제 및 배송', '고객 문의 응대 및 분쟁 처리', '신제품 · 이벤트 안내 (수신 동의 회원에 한함)'],
  },
  {
    title: '개인정보의 보유 및 이용 기간',
    items: ['회원 탈퇴 시 지체 없이 파기', '계약 · 청약철회 기록: 5년 (전자상거래법)', '소비자 불만 · 분쟁 처리 기록: 3년 (전자상거래법)', '접속 기록: 3개월 (통신비밀보호법)'],
  },
  {
    title: '개인정보의 제3자 제공',
    items: ['원칙적으로 이용자 동의 없이 제3자 제공 없음', '법령에 근거하거나 수사기관의 적법한 요청이 있는 경우 예외'],
  },
  {
    title: '개인정보 처리 위탁',
    items: ['CJ대한통운: 상품 배송', '결제대행사: 결제 처리 및 결제 도용 방지', '이메일 발송 대행사: 뉴스레터 · 주문 안내 메일 발송'],
  },
  {
    title: '이용자의 권리와 행사 방법',
    items: ['개인정보 열람, 정정, 삭제, 처리 정지 요구 가능', '마케팅 수신 동의는 언제든 철회 가능', '고객센터 또는 이메일로 요청 시 지체 없이 조치'],
  },
  {
    title: '쿠키 운영',
    items: ['장바구니 유지 및 이용 환경 개선 목적으로 쿠키 · 로컬 저장소 사용', '브라우저 설정에서 저장 거부 가능 · 거부 시 일부 기능 제한'],
  },
  {
    title: '개인정보 보호책임자',
    items: ['책임자: 토핑스킨 개인정보보호팀', '연락처: privacy@toppingskin.example · 1588-0000'],
  },
];

export function PrivacyPage({ path }: { path: string }) {
  return (
    <InfoLayout path={path} eyebrow="Privacy Policy" title="개인정보처리방침" intro="토핑스킨 개인정보 수집 · 이용 · 보관 기준">
      <p className="info__notice">본 방침은 포트폴리오용 가상 브랜드의 예시 문서로, 실제 개인정보를 수집하지 않습니다.</p>
      <ol className="info-policy">
        {sections.map((s) => (
          <li key={s.title}>
            <h2>{s.title}</h2>
            <ul className="info-list">
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="info__note">시행일: 2026년 1월 1일</p>
    </InfoLayout>
  );
}
