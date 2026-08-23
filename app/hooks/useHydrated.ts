import { useSyncExternalStore } from "react";

function subscribe() {
  // oxlint-disable-next-line no-empty-function
  return () => {};
}

export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
