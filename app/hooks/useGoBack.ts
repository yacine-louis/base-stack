import { useCallback } from "react";
import { useNavigate } from "react-router";

// React Router writes { usr, key, idx } into history.state.
// idx: 0 for the session's first entry, +1 on push, unchanged on replace.
// Only call this from event handlers (browser-only, so no SSR/hydration issues).
export function canGoBackInApp(): boolean {
  if (typeof window === "undefined") return false;
  const idx = window.history.state?.idx;
  return typeof idx === "number" && idx > 0;
}

/** For buttons, close icons, modals: goBack() */
export function useGoBack(fallback: string) {
  const navigate = useNavigate();
  return useCallback(() => {
    if (canGoBackInApp()) navigate(-1);
    else navigate(fallback, { replace: true });
  }, [navigate, fallback]);
}
