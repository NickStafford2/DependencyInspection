import { useState } from "react";
import { Node } from "./utils/models";
import Crudbar from "./crudbar/Crudbar";
import BackendTools from "./components/BackendTools";
import DIGraph3d from "./components/DIGraph3d";
import { NodeTableContainer } from "./components/table/NodeTableContainer";
import { columns } from "./components/table/columns";
import GraphMenu from "./GraphMenu/GraphMenu";

const App = () => {
  const [selectedNode, setSelectedNode] = useState<Node>();
  const [scrollTo, setScrollTo] = useState<string>("");

  const onNodeSelected = (node: Node) => {
    setSelectedNode(node);
    setScrollTo(node.id);
  };

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
