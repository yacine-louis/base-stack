import { useSyncExternalStore } from "react";

function subscribe() {
  // oxlint-disable-next-line no-empty-function
  return () => {};
}

/**
 * Returns whether the component has hydrated on the client.
 *
 * During SSR, this always returns `false`. On the client, it returns
 * `false` for the initial render and `true` after hydration.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
