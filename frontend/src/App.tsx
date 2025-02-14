import { useContext } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Crudbar from "./crudbar/Crudbar";
import BackendTools from "./components/BackendTools";
import DIGraph3d from "./components/DIGraph3d";
import Sidebar from "./sidebar/Sidebar";
import { GlobalStateContext } from "./context";
import GraphMenu from "./GraphMenu/GraphMenu";

const App = () => {
  const { selectedNodeId } = useContext(GlobalStateContext);

  return (
    <div className="flex flex-col w-full h-full justify-between">
      <Crudbar />

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <span className="absolute z-10 text-2xl p-4">{selectedNodeId}</span>
          <GraphMenu />
          <DIGraph3d />
        </ResizablePanel>
      </ResizablePanelGroup>
      {import.meta.env.MODE == "production" || <BackendTools />}
    </div>
  );
};

export default App;
