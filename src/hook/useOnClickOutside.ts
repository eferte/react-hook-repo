import { useEffect } from "react";
import { isFunction } from "../type/utils";

export type ClickOutsidePredicat = (target: any, event: MouseEvent) => boolean;

function useOnClickOutside<S extends HTMLElement>(
  refOrPredicat: ClickOutsidePredicat | React.MutableRefObject<S>,
  handler: (event: MouseEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (isFunction(refOrPredicat)) {
        if (refOrPredicat(event.target, event)) {
          handler(event);
        }
        return;
      } else if (refOrPredicat.current && refOrPredicat.current.contains(event.target as any)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("click", listener);
    return () => {
      document.removeEventListener("click", listener);
    };
  }, [refOrPredicat, handler]);
}

export { useOnClickOutside };
