import { Link } from '../components/shared/Link';

export function NotFoundPage() {
  return (
    <main className="not-found">
      <p className="eyebrow">404 · Not Found</p>
      <h1>페이지를 찾을 수 없습니다</h1>
      <p>주소가 변경되었거나 존재하지 않는 페이지입니다.</p>
      <Link className="btn btn--primary" href="/#collection">
        컬렉션 보기
      </Link>
    </main>
  );
}
