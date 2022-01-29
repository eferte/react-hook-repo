type Listener<T, R = void> = (message: T) => R;

export default Listener;
