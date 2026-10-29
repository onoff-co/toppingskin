export function Logo() {
  return (
    <span className="logo">
      <svg className="logo__mark" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M8 22h24l-3 12a3 3 0 0 1-3 2.3H14a3 3 0 0 1-3-2.3L8 22Z" fill="#ffc4d0" />
        <path d="M8 22c0-4 3-6 6-6 1-4 4-6 6-6s5 2 6 6c3 0 6 2 6 6Z" fill="#fff4ee" stroke="#ff6b88" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="21" cy="8" r="4.2" fill="#ff3b5c" />
        <path d="M21 4c1-2 3-2.6 4.4-2.2" stroke="#3f8a45" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
      <span className="logo__text">
        <strong>Topping Skin</strong>
        <small>토핑스킨</small>
      </span>
    </span>
  );
}
