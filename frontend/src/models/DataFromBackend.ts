import { Analysis } from "./Analysis";
import { GraphData } from "./GraphData";
import { _isObject, checkFieldTypes, checkRequiredFields } from "./utils";

export class DataFromBackend {
  graphData: GraphData;
  analysis: Analysis;

  constructor(graphData: GraphData, analysis: Analysis) {
    this.graphData = graphData;
    this.analysis = analysis;
  }
}

export const isDataFromBackend = (data: unknown): data is DataFromBackend => {
  if (!_isObject(data)) {
    console.error("Data is not an object");
    return false;
  }

  const obj = data as { [key: string]: unknown };

  const requiredFields = ["graphData", "analysis"];
  if (checkRequiredFields("DataFromBackend", obj, requiredFields) === false)
    return false;

  const fieldTypes = {
    graphData: "[object Object]",
    analysis: "[object Object]",
  };
  if (checkFieldTypes("DataFromBackend", obj, fieldTypes) === false)
    return false;

  return true;
};
