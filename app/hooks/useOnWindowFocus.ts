import { useEffect, useRef } from "react";
import { useMatches, useRevalidator, type EntryContext } from "react-router";

/**
 * Re-runs a callback whenever the window/tab regains visibility (e.g. the
 * user switches back to the tab). Useful for refetching data that may have
 * gone stale while the tab was in the background, without setting up a
 * polling interval.
 *
 * The callback is always the latest one passed in (via a ref), so you don't
 * need to memoize it or worry about stale closures.
 *
 * @param callback - Function to invoke when the document becomes visible again.
 *
 * @example
 * ```tsx
 * const revlidator = useRevalidator();
 * useOnWindowFocus(() => {
 *   revalidator.revalidate();
 * });
 * ```
 */
export function useOnWindowFocus(callback: () => void) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        callbackRef.current();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}

declare global {
  interface Window {
    __reactRouterManifest: EntryContext["manifest"] | undefined;
  }
}

export function useRefetchOnWindowFocus() {
  const matches = useMatches();
  const revalidator = useRevalidator();

  useOnWindowFocus(() => {
    const manifestRoutes = window.__reactRouterManifest?.routes;
    if (!manifestRoutes) return;
    const anyMatchHasLoader = matches.some((m) => {
      const routeInfo = manifestRoutes[m.id];
      return Boolean(routeInfo?.hasLoader || routeInfo?.hasClientLoader);
    });

    if (anyMatchHasLoader) {
      revalidator.revalidate();
    }
  });
}
