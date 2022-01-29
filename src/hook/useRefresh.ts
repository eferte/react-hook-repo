import { useState, useCallback } from "react";

/**
 *
 *  Pour forcer un re-render du composant...
 * 
 */
const useRefresh = (): [() => void, number] => {
  const [count, setCount] = useState(0);
  const refresh = useCallback(() => {
    setCount((prevCount) => {
      return prevCount + 1;
    });
  }, []);

  return [refresh, count];
};

export default useRefresh;
