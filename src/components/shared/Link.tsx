import type { AnchorHTMLAttributes } from 'react';
import { navigate } from '../../app/router';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** 새로고침 없이 페이지를 바꾸는 링크. 새 탭 열기(⌘/Ctrl 클릭)는 브라우저에 맡긴다 */
export function Link({ href, onClick, ...rest }: Props) {
  return (
    <a
      href={href}
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigate(href);
      }}
    />
  );
}
