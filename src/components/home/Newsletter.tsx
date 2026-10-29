import { useState, type FormEvent } from "react";

export function Newsletter() {
  const [done, setDone] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDone(true);
  };

  return (
    <section className="newsletter">
      <div className="newsletter__card reveal">
        <div>
          <p className="eyebrow">Topping Club</p>
          <h2>토핑 클럽 뉴스레터</h2>
          <p>
            시즌 신제품 출시 소식 및 회원 전용 샘플 이벤트 안내
          </p>
        </div>
        {done ? (
          <p className="newsletter__done" role="status">
            구독이 완료되었습니다.
          </p>
        ) : (
          <form className="newsletter__form" onSubmit={submit}>
            <label className="sr-only" htmlFor="newsletter-email">
              이메일
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="이메일 주소"
            />
            <button className="btn btn--dark" type="submit">
              구독하기
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
