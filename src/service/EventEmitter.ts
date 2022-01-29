import Listener from "../type/Listener";

export type RemoveListener = () => void;

/**
 * Basic event emitter implementation
 *
 * Warning : !!! removeListener function must be called to avoid memory leak !!!
 * Warning : !!! removeListener function must be called to avoid memory leak !!!
 * Warning : !!! removeListener function must be called to avoid memory leak !!!
 *
 * Advice : use a Custom Hook with a useEffect inside to add and remove listener
 *          then use this hook in the components to listen on events without the need to add and remove listener inside the component
 *
 */
export default class EventEmitter<T> {
  private listeners: Listener<T>[] = [];

  addListener = (listener: Listener<T>): RemoveListener => {
    this.listeners.push(listener);
    return () => this.removeListener(listener);
  };

  removeListener = (listener: Listener<T>): void => {
    const idx = this.listeners.indexOf(listener);
    if (idx > -1) {
      this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
  };

  trigger = (message: T): void => {
    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i](message);
    }
  };
}
