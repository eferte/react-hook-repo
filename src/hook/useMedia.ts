import { useState, useEffect, useMemo, useCallback } from "react";
import { useShallowPreserveDeps } from "./useShallowEffect";

// source : https://github.com/craig1123/react-recipes/blob/master/src/useMedia.js

// sample usage: see https://github.com/craig1123/react-recipes/blob/master/src/useMedia.js

function useMedia<T>(inQueries: string[], inValues: T[], inDefaultValue: T) {
  // protect queries and values from lack of memoization
  const [queries, values, defaultValue] = useShallowPreserveDeps([inQueries, inValues, inDefaultValue]);

  const mediaQueryLists = useMemo(() => (queries as string[]).map((q) => window.matchMedia(q)), [queries]);

  const getValue = useCallback(() => {
    // Get index of first media query that matches
    const index = mediaQueryLists.findIndex((mql) => mql.matches);

    // Return related value or defaultValue if none
    return typeof values[index] !== "undefined" ? values[index] : defaultValue;
  }, [mediaQueryLists, defaultValue, values]);

  const [value, setValue] = useState(getValue);

  useEffect(() => {
    const handler = () => setValue(getValue);

    mediaQueryLists.forEach((mql) => mql.addEventListener("change", handler));

    return () => mediaQueryLists.forEach((mql) => mql.removeEventListener("change", handler));
  }, [mediaQueryLists, getValue]);
  return value;
}

export default useMedia;


