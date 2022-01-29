import { useCallback, useEffect, useRef } from "react";
import { later } from "../service/FunUtil";

const useFocus = <T extends { focus: () => void }>(autofocus?: boolean): [React.MutableRefObject<T>, () => void] => {
  const htmlElRef = useRef<T>(null);
  const setFocus = useCallback(async () => {
    await later();
    htmlElRef.current && htmlElRef.current.focus();
  }, []);

  useEffect(() => {
    if (autofocus) {
      setFocus();
    }
  }, [autofocus, setFocus]);

  return [htmlElRef, setFocus];
};

export default useFocus;
