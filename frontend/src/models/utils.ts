export const _isObject = (value: unknown): value is object =>
  typeof value === "object" && value !== null;
export const _isString = (value: unknown): value is string =>
  typeof value === "string";
export const _isArray = <T>(
  value: unknown,
  checkItem: (item: unknown) => item is T,
): value is T[] => {
  return Array.isArray(value) && value.every(checkItem);
};
