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
  return typeof value === "boolean" || value instanceof Boolean || value === Boolean;
}
export function isPrimitive(value: any): value is number | string | boolean {
  return isString(value) || isNumber(value) || isBoolean(value);
}
export function isDictionary<T = any>(value: any): value is Dictionary<T> {
  return value !== null && typeof value === "object";
}
export function isArray<T>(value: any): value is Array<T> {
  return Array.isArray(value);
}
