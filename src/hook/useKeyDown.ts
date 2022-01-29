import { useEffect } from "react";

import { later } from "../service/FunUtil";

const useKeyDown = (
  predicat: (e: KeyboardEvent) => boolean,
  action: ((e: KeyboardEvent) => void) | undefined,
  stopPropagation = true
): void => {
  useEffect(() => {
    const listener = (message: KeyboardEvent) => {
      if (predicat(message)) {
        if (stopPropagation) {
          message.preventDefault();
          message.stopPropagation();
        }
        later().then(() => action && action(message));
      }
    };

    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [predicat, action, stopPropagation]);
};

export default useKeyDown;
