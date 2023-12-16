export function noneUndefined<T>(arr: Array<T | undefined>): arr is Array<T> {
  return !arr.some((x) => x === undefined);
}

export function allOrNothing<T>(arr: Array<T | undefined>): Array<T> | undefined {
  if (noneUndefined(arr)) return arr;
  return undefined;
}
