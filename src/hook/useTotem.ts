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
 *            le totem, l'autre composant perd le totem et cela provoque
 *            un render de ce composant. Le nouveau composant possède a présent le totem
 *            et cela provoque également un render de ce composant. Tous les autres
 *            composants ne sont pas affectés et leur fonction "render" n'est pas appelée pour eux.
 *
 *
 * useTotemChange : est un hook assez secondaire qui permet d'écouter les changements de totem.
 *                  useTotemChange provoque un render à chaque fois que le totem change de main ou est libéré.
 *
 *
 * Exemple concret d'utilisation:
 *
 *      - Soit deux composants : une arborescence de "dossiers" à gauche, et une liste des fichiers
 *        contenus dans le dossier sélectionné à droite.
 *      - Dans l'arborescence de dossiers à gauche, chaque noeud est représenté par un composant "Folder"
 *      - Chaque composant Folder utilise le hook useTotem pour définir quel noeud est actuellement sélectionné. 
 *        Lorsque l'utilisateur clique sur un dossier, pour montrer que ce dossier est sélectionné, celui-ci prend le totem,
 *        ce qui a pour effet de retirer le totem au précédent dossier qui est alors désectionné. Un seul dossier peut-être
 *        sélectionné à la fois. NOTE : il n'est donc pas possible de sélectionner plusieurs dossiers à la fois.
 *      - A droite, le composant "Liste des fichiers" "écoute" les changements de dossier pour afficher les fichiers
 *        du dossier sélectionné. Pour cela elle utilise le hook useTotemChange.
 *
 * @returns useTotem and useTotemChange hooks
 */
const totemHookFactory = <P>() => {
  const emitter = new EventEmitter<void>();
  const totemChangedEmitter = new EventEmitter();

  const useTotem = (): [(payload?: P) => void, boolean, () => void] => {
    const totem = useRef<RemoveListener | undefined>(undefined);
    const [hasTotem, setHasTotem] = useState(false);

    const takeTotem = useCallback((payload?: P) => {
      if (totem.current) {
        return;
      }
      emitter.trigger();
      const clearListener = emitter.addListener(() => {
        totem.current && totem.current();
        totem.current = undefined;
        setHasTotem(false);
      });
      totem.current = clearListener;
      totemChangedEmitter.trigger(payload);
      setHasTotem(true);
    }, []);

    const releaseTotem = useCallback(() => {
      if (!totem.current) {
        return;
      }
      emitter.trigger();
      totemChangedEmitter.trigger(undefined);
    }, []);

    return [takeTotem, hasTotem, releaseTotem];
  };

  const useTotemChange = () => {
    const [payload, setPayload] = useState<P | undefined>();
    useEffect(() => {
      return totemChangedEmitter.addListener((payload) => {
        setPayload(payload as P | undefined);
      });
    }, []);

    return payload;
  };

  return { useTotem, useTotemChange };
};

export default totemHookFactory;



/*
EXEMPLE D'UTILISATION:

// exemple d'un composant Folder: 


// création des hooks:
// note: cet appel à "totemHookFactory" ne doit être exécuté qu'une seule fois pour tous les composants qui partagent le même totem.

export const { useTotem, useTotemChange } = totemHookFactory<FolderModel>();



// définition du composant:

const Folder = ({ folder, ... }) => {
 
  ....

  const [takeTotem, isSelected] = useTotem();

  ...
  
  
  const handleSelect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    takeTotem(folder);
  };

  return (
    <div className={clsx(Style.Folder, isSelected && Style.FolderSelected)} onClick={handleSelect}>
      <div onClick={handleFolderOpen} style={{ cursor: "pointer" }}>
        <Icon name={isOpen ? "folder-open" : "folder"} marginRight="5px" />
        {folder.label}
      </div>
      
      ...
      { isOpen && folder.children.map ( childFodler => <Folder folder={childFolder} ... /> )  }
      ...

    </div>
  );
};

export default Folder;


*/