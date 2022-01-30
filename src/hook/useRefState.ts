import { useRef, useMemo, useState } from "react";
import { isFunction } from "../type/utils";

/*
 *
 * Un moyen de fixer le "Stolen closure effect".
 * 
 */
export default function useRefState<S>(
  initialValueOrInitializer: S | (() => S)
): [() => S, (value: S | ((old: S) => S)) => void] {
  const [, refresh] = useState(0);
  const valueRef = useRef<S>(
    isFunction(initialValueOrInitializer)
      ? initialValueOrInitializer()
      : initialValueOrInitializer
  );
  return useMemo(
    () => [
      (): S => valueRef.current,
      (value: S | ((old: S) => S)): void => {
        valueRef.current = isFunction(value) ? value(valueRef.current) : value;
        refresh(n => n + 1);
      },
    ],
    []
  );
}
