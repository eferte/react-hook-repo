import { EffectCallback, useEffect, useRef } from "react";
import { isArray } from "../type/utils"
import { areArraysShallowEqual } from "../service/FunUtil";

/**
 * 
 * @param {array} deps Array of hook dependencies 
 * @returns Si une shallow comparaison des tableaux dans le tableau de dépendances ne donne pas
 *          de différence et si une comparaison par référence pour les autres dépendances ne donne
 *          pas de différences, alors on retourne le tableau de dépendances du précédent render.
 * 
 *          But : éviter l'oubli de mémoisation des dépendances (de type tableau).
 * 
 */
export function useShallowPreserveDeps<O = any>(deps:unknown[]):O[] {
  const previous = useRef<unknown[]>();

  if (previous.current && isArray(deps)) {
    let foundDiff = false;
    for (let i = 0; i < deps.length; i++) {
      if (isArray(deps[i])) {
        if (!areArraysShallowEqual(previous.current[i] as unknown[], deps[i] as unknown[])) {
          foundDiff = true;
          break;
        }
      } else if (deps[i] !== previous.current[i]) {
        foundDiff = true;
        break;
      }
    }
    if (!foundDiff) {
      // Les dépendances n'ont pas changées, du coup, on retourne l'ancien tableau de dépendances
      return previous.current as O[];
    }
  }
  previous.current = deps;
  return deps as O[];
};

export function useShallowEffect (f:EffectCallback, inputDeps:unknown[]) {
  const deps = useShallowPreserveDeps(inputDeps);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(f, deps);
};