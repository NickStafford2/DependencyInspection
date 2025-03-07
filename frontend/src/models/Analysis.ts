import { _isObject, checkFieldTypes, checkRequiredFields } from "./utils";

export class Analysis {
  seeds: string[];
  size: number;

  constructor(seeds: string[], size: number) {
    this.seeds = seeds;
    this.size = size;
  }
}

export const isAnalysis = (data: unknown): data is Analysis => {
  if (!_isObject(data)) {
    console.error("Data is not an object");
    return false;
  }

  const obj = data as { [key: string]: unknown };

  const requiredFields = ["seeds", "size"];
  if (checkRequiredFields("Analysis", obj, requiredFields) === false)
    return false;

  const fieldTypes = {
    seeds: "string[]",
    size: "number",
  };
  if (checkFieldTypes("Analysis", obj, fieldTypes) === false) return false;

  return true;
};
