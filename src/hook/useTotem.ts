import { useCallback, useEffect, useRef, useState } from "react";
import EventEmitter, { RemoveListener } from "../service/EventEmitter";

/**
 * 
 * @name totemHookFactory
 * 
 * Cette fonction permet de construire deux hooks "useTotem" et "useTotemChange".
 * 
 * useTotem : est un hook qui permet à plusieurs composants de partager un jeton (totem) mais
 *            un seul composant à la fois peut disposer du jeton. Donc dès qu'un composant prend
 *            le jeton (totem), l'autre composant perd le totem et cela provoque
 *            un render de ce composant. Le nouveau composant possède a présent
 *            le totem et cela provoque également un render de ce composant. Tous les autres
 *            composants ne sont pas affectés et leur fonction "render" n'est pas appelée pour eux.
 * 
 * 
 * useTotemChange : est un hook assez secondaire qui permet d'écouter les changements de totem.
 *                  useTotemChange provoque un render à chaque fois que le totem change de main.
 * 
 * 
 * Exemple concret d'utilisation:
 * 
 *      - Soit deux composants : une arborescence de "dossiers" à gauche, et une liste des fichiers
 *        du dossier sélectionné à droite. 
 *      - Dans l'arborescence de dossiers à gauche, chaque noeud est représenté par un composant "Folder"
 *      - Chaque composant Folder utilise le hook useTotem pour définir quel noeud est actuellement sélectionné
 *      - A droite, le composant "Liste des fichiers" "écoute" les changements de dossier pour afficher les fichiers
 *        du dossier sélectionné. Pour cela elle utilise le hook useTotemChange.
 * 
 * @returns useTotem and useTotemChange hooks
 */
const totemHookFactory = <P> () => {

  const emitter = new EventEmitter<void>();
  const totemChangedEmitter = new EventEmitter();

  const useTotem = (): [(payload?: P) => void, boolean] => {
    const totem = useRef<RemoveListener | undefined>(undefined);
    const [selected, setSelected] = useState(false);

    const takeTotem = useCallback((payload?: P) => {
      if (totem.current) {
        return
      }
      emitter.trigger();
      const clearListener = emitter.addListener(() => {
        totem.current && totem.current();
        totem.current = undefined;
        setSelected(false);
      });
      totem.current = clearListener;
      totemChangedEmitter.trigger(payload);
      setSelected(true);
    }, []);
    return [takeTotem, selected];
  };

  const useTotemChange = () => {
    const [payload, setPayload] = useState<P | undefined>();
    useEffect(() => {
      return totemChangedEmitter.addListener((payload) => {
        setPayload(payload as P | undefined);
        console.log("cHanged", payload)
      });
    }, []);

    return payload;
  };

  return { useTotem, useTotemChange };
};

export default totemHookFactory;
