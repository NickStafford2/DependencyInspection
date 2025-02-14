import ForceGraph3D from "react-force-graph-3d";
import { useEffect, useState, useRef, useContext } from "react";
import { GlobalStateContext } from "@/context";
// import SpriteText from "https://esm.sh/three-spritetext";
// import SpriteText from "three-spritetext";

/** @useSignals */
const DIGraph3d = () => {
  const { graphData, selectedNodeId } = useContext(GlobalStateContext);
  const graphRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const updateSize = () => {
    if (graphRef.current) {
      const newWidth = graphRef.current.clientWidth;
      const newHeight = graphRef.current.clientHeight;
      setDimensions({ width: newWidth, height: newHeight });
    }
  };

  useEffect(() => {
    // Set the initial size when the component mounts
    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    if (graphRef.current) {
      resizeObserver.observe(graphRef.current);
    }

    // Cleanup observer when the component is unmounted
    return () => {
      resizeObserver.disconnect();
    };
  }, []); // Empty dependency array: this runs once on mount

  return (
    <div ref={graphRef} className="relative w-full h-full">
      <div className="absolute top-0 left-0">
        {/* {JSON.stringify(graphData.value)} */}
        {graphData.value && (
          <ForceGraph3D
            width={dimensions.width}
            height={dimensions.height}
            // nodeVal={j}
            onNodeClick={(node) => {
              selectedNodeId.value = node.id;
            }}
            nodeAutoColorBy="group"
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.05}
            nodeLabel={"test"}
            // nodeThreeObject={(node) => {
            // 	const sprite = new SpriteText(node.id);
            // 	sprite.color = node.color;
            // 	// console.log(node);
            // 	sprite.textHeight = (18 + node.val) / 12;
            // 	return sprite;
            // }}
            graphData={graphData.value}
          />
        )}
      </div>
    </div>
  );
};

export default DIGraph3d;
