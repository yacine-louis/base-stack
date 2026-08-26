import { useEffect } from "react";

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
 * useRefetchOnWindowFocus(() => {
 *   revalidator.revalidate();
 * });
 * ```
 */
export function useRefetchOnWindowFocus(callback: () => void) {
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState !== "hidden") {
        callback();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [callback]);
}
