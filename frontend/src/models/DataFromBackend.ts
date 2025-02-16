import { Analysis, GraphData } from "./models";
import { _isObject } from "./utils";

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

  if (!obj.graphData) {
    console.error("Invalid DataFromBackend: graphData missing");
    return false;
  }
  if (!obj.analysis) {
    console.error("Invalid DataFromBackend: analysis missing");
    return false;
  }

  if (typeof obj.graphData !== "object") {
    console.error("Invalid type for graphData: expected object");
    return false;
  }
  if (typeof obj.analysis !== "object") {
    console.error("Invalid type for analysis: expected object");
    return false;
  }
};
