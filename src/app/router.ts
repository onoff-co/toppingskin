import { useSyncExternalStore } from 'react';

/** 라이브러리 없이 쓰는 최소한의 History API 라우터 */
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

window.addEventListener('popstate', notify);

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePathname() {
  return useSyncExternalStore(subscribe, () => window.location.pathname.replace(/\/+$/, '') || '/');
}

export function navigate(to: string) {
  const url = new URL(to, window.location.href);
  history.pushState(null, '', url.pathname + url.hash);
  if (url.pathname === window.location.pathname && url.hash) {
    // 같은 페이지 안 앵커는 부드럽게 이동만 한다
    document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  notify();
}

/** 페이지가 바뀐 뒤 해시가 있으면 그 섹션으로, 없으면 맨 위로 */
export function scrollAfterNavigate() {
  const target = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
  if (target) target.scrollIntoView({ behavior: 'instant' });
  else window.scrollTo({ top: 0, behavior: 'instant' });
}

export const productPath = (id: string) => `/products/${id}`;
