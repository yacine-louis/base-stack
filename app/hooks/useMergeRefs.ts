import { useCallback, type Ref } from "react";

type PossibleRef<T> = Ref<T> | undefined;

function assignRef<T>(ref: PossibleRef<T>, node: T | null) {
  if (typeof ref === "function") return ref(node);
  if (ref) (ref as React.RefObject<T | null>).current = node;
}

export function useMergedRefs<T>(...refs: PossibleRef<T>[]) {
  return useCallback(
    (node: T | null) => {
      const cleanups = refs.map((ref) => assignRef(ref, node));

      // React 19 calls this on detach instead of calling the ref with `null`
      return () => {
        refs.forEach((ref, i) => {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") cleanup();
          else assignRef(ref, null);
        });
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}
