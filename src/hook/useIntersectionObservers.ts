import { useEffect } from "react";
import useRefState from "./useRefState";
import { useShallowPreserveDeps } from "./useShallowEffect";
// intersection observer polyfill
// require("intersection-observer");

// voir par ici : https://usehooks-ts.com/react-hook/use-intersection-observer

const useIntersectionObservers = (inTargets:Element[], root:Element | Document | null, rootMargin:string, threshold?:number) => {
  const [getVisibleTargets, setVisibleTargets] = useRefState<Element[]>([]);

  // protect queries and values from lack of memoization 
  const [targets] = useShallowPreserveDeps<Element[]>([inTargets]);

  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) =>
          setVisibleTargets((visibleTargets) => {
            const newVisibleTargets:Element[] = [...visibleTargets];
            const pos = newVisibleTargets.indexOf(target);
            if (isIntersecting) {
              if (pos === -1) {
                newVisibleTargets.push(target);
              }
            } else {
              const pos = newVisibleTargets.indexOf(target);
              if (pos > -1) {
                newVisibleTargets.splice(pos, 1);
              }
            }
            newVisibleTargets.sort((a, b) => targets.indexOf(a) - targets.indexOf(b));
            return newVisibleTargets;
          })
        );
      },
      {
        root,
        rootMargin,
        threshold: threshold || 0.75,
      }
    );
    targets.forEach((ref:Element) => ref && observer.observe(ref));

    return () => observer.disconnect();

  }, [targets, root, rootMargin, threshold, setVisibleTargets]);

  return getVisibleTargets as (()=>Element[]);
};

export default useIntersectionObservers;
