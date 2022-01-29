
export type Dictionary<T = any> = { [key: string]: T };

export type SetStateAction<S> = S | ((prevState: S) => S);

export function isFunction(value: any): value is Function {
  return typeof value === "function";
}
export function isString(value: any): value is string {
  return typeof value === "string";
}
export function isNumber(value: any): value is number {
  return typeof value === "number";
}
export function isBoolean(value: any): value is boolean {
  return (
    typeof value === "boolean" || value instanceof Boolean || value === Boolean
  );
}
export function isPrimitive(value: any): value is number | string | boolean {
  return isString(value) || isNumber(value) || isBoolean(value);
}
function isObject(value: any): value is object {
  return value !== null && typeof value === "object";
}
export function isDictionary<T = any>(value: any): value is Dictionary<T> {
  return value !== null && typeof value === "object";
}
const objectToString = (o: any): string => Object.prototype.toString.call(o);

export function isDate(value: any): value is Date {
  return isObject(value) && objectToString(value) === "[object Date]";
}
export function isArray<T>(value: any): value is Array<T> {
  return Array.isArray(value);
}
export function isError(value: any): value is Error {
  return (
    isObject(value) &&
    (objectToString(value) === "[object Error]" || value instanceof Error)
  );
}

export function omit<T = any>(
  value: T,
  a: T[],
  predicat?: (a: T, b: T) => boolean
): T[] {
  if (predicat) {
    return a.filter((v) => {
      return !predicat(v, value);
    });
  } else {
    return a.filter((v) => {
      return v !== value;
    });
  }
}
