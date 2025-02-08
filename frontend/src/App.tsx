import { useState } from "react";
// import { signal } from "@preact/signals-react";
import { GraphData, Node } from "./utils/models";
import Crudbar from "./crudbar/Crudbar";
import BackendTools from "./components/BackendTools";
import DIGraph3d from "./components/DIGraph3d";
import { NodeTableContainer } from "./components/table/NodeTableContainer";
import { columns } from "./components/table/columns";
import GraphMenu from "./GraphMenu/GraphMenu";

const App = () => {
  const [selectedNode, setSelectedNode] = useState<Node>();
  // const onResponseChanged = (data: GraphData) => {
  //   setGraphData(data);
  //   setTableData(data.nodes);
  // };

  // const [graphData, setGraphData] = useState<GraphData>();
  // const [tableData, setTableData] = useState<Node[]>([]);
  const [scrollTo, setScrollTo] = useState<string>("");

  const onNodeSelected = (node: Node) => {
    setSelectedNode(node);
    setScrollTo(node.id);
  };

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
      <Crudbar />
      <div className="flex flex-row grow shrink overflow-hidden">
        <div className="">
          <NodeTableContainer
            columns={columns}
            scrollTo={scrollTo}
          ></NodeTableContainer>
        </div>
        <div className="w-full h-full">
          <div className="absolute z-10">{selectedNode?.id}</div>
          <GraphMenu />

          <DIGraph3d onNodeSelected={onNodeSelected}></DIGraph3d>
        </div>
      </div>
      {import.meta.env.MODE == "production" || <BackendTools />}
    </div>
  );
};

export default App;
