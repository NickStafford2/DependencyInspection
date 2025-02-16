import { _isObject, checkFieldTypes, checkRequiredFields } from "./utils";

export class NetworkMetadata {
  seeds: string[];
  size: number;

  constructor(seeds: string[], size: number) {
    this.seeds = seeds;
    this.size = size;
  }
}

export const isNetworkMetadata = (data: unknown): data is NetworkMetadata => {
  if (!_isObject(data)) {
    console.error("Data is not an object");
    return false;
  }

  const obj = data as { [key: string]: unknown };

  const requiredFields = ["seeds", "size"];
  if (checkRequiredFields("NetworkMetadata", obj, requiredFields) === false)
    return false;

  const fieldTypes = {
    seeds: "string[]",
    size: "number",
  };
  if (checkFieldTypes("NetworkMetadata", obj, fieldTypes) === false)
    return false;

  return true;
};
