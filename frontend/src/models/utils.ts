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

export const checkRequiredFields = (
  className: string,
  obj: { [key: string]: unknown },
  fields: string[],
) => {
  for (const f of fields) {
    if (obj[f] === undefined) {
      console.error(`Invalid ${className}: ${f} is undefined`);
      return false;
    }
  }
  return true;
};

export const checkFieldTypes = (
  className: string,
  obj: { [key: string]: unknown },
  fieldTypes: { [key: string]: string },
) => {
  for (const [key, type] of Object.entries(fieldTypes)) {
    if (typeof obj[key] !== type) {
      console.error(
        `Invalid ${className}.${key}: expected ${type}, got ${typeof obj[key]}`,
      );
      return false;
    }
  }
  return true;
};
