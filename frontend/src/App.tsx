import { useState } from "react";
import { GraphData, Node } from "./utils/models";
import Crudbar from "./components/Crudbar";
import BackendTools from "./components/BackendTools";
import NpmVisualGraph3d from "./components/NpmVisualGraph3d";
import { NodeTableContainer } from "./components/table/NodeTableContainer";
import { columns } from "./components/table/columns";

const App = () => {
  const [selectedNode, setSelectedNode] = useState<Node>()
  const manageGraphData = (data: GraphData) => {
    return data
  }
  const onResponseChanged = (data: GraphData) => {
    // console.log(JSON.parse(JSON.stringify(data)));
    console.log(data);
    data = manageGraphData(data)
    setGraphData(data);
    setTableData(data.nodes);
  };

  const [graphData, setGraphData] = useState<GraphData>();
  const [tableData, setTableData] = useState<Node[]>([]);
  const [scrollTo, setScrollTo] = useState<string>("");

  const onNodeSelected = (node: Node) => {
    setSelectedNode(node)
    setScrollTo(node.id)
  }

  /* 
  useEffect(() => {
    if (packageName !== "") {
      const url = `/analyzeNetwork/react`;
      axios
        .get(url)
        .then((data) => console.log("analysis results", data))
        .catch((err) => {
          console.log("error fetching data", err);
        });
    }
  }, [packageName]);
  */

  return (
    <div className="flex flex-col w-full h-full justify-between">
      <Crudbar onResponse={onResponseChanged} />
      <div className="flex flex-row grow shrink overflow-hidden">
        <div className="">
          <NodeTableContainer columns={columns} data={tableData} scrollTo={scrollTo}></NodeTableContainer>
        </div>
        <div className="w-full h-full">
          <div className="absolute z-10">{selectedNode?.id}</div>
          <NpmVisualGraph3d graphData={graphData} onNodeSelected={onNodeSelected}></NpmVisualGraph3d>
        </div>
      </div>
      <BackendTools></BackendTools>
    </div>
  );
};

export default App;
