import { useContext } from "react";
import Crudbar from "./crudbar/Crudbar";
import BackendTools from "./components/BackendTools";
import DIGraph3d from "./components/DIGraph3d";
import GraphMenu from "./GraphMenu/GraphMenu";
import Sidebar from "./sidebar/Sidebar";
import { GlobalStateContext } from "./context";

const App = () => {
  const { selectedNodeId } = useContext(GlobalStateContext);

  return (
    <div className="flex flex-col w-full h-full justify-between">
      <Crudbar />
      <div className="flex flex-row grow shrink overflow-hidden">
        <div className="">
          <Sidebar></Sidebar>
        </div>
        <div className="w-full h-full">
          <div className="absolute z-10">{selectedNodeId}</div>
          <GraphMenu />
          <DIGraph3d></DIGraph3d>
        </div>
      </div>
      {import.meta.env.MODE == "production" || <BackendTools />}
    </div>
  );
};

export default App;
