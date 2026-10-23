import type { ComponentProps, MouseEvent } from "react";
import { Link, useNavigate } from "react-router";
import { canGoBackInApp } from "~/hooks/useGoBack";

/** For real links: always renders a valid href to the fallback */
export function BackLink({
  fallback,
  children,
  onClick,
  ...props
}: Omit<ComponentProps<typeof Link>, "to"> & { fallback: string }) {
  const navigate = useNavigate();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // leave new-tab / new-window clicks alone
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;

    if (canGoBackInApp()) {
      e.preventDefault();
      navigate(-1);
    }
    // otherwise Link navigates to `fallback` itself (with `replace`, below)
  }

  return (
    <Link {...props} to={fallback} replace onClick={handleClick}>
      {children}
    </Link>
  );
}
