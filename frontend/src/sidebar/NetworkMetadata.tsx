import { GlobalStateContext } from "@/context";
import { useContext } from "react";

export const NetworkMetadata = () => {
  const { networkMetadata } = useContext(GlobalStateContext);
  return (
    <div>
      <h1 className="text-2xl">
        Network created with {networkMetadata.value.size}
        {networkMetadata.value.size > 1 ? " nodes" : " node"}
      </h1>

      <h1 className="text-lg">Seed Nodes:</h1>
      <ul className="flex flex-row flex-wrap gap-2">
        {networkMetadata.value.seeds.map((seed: string, index: number) => (
          <li
            key={index}
            className="border rounded-lg px-3 py-1  border-green-500"
          >
            {seed}
          </li>
        ))}
      </ul>
    </div>
  );
};
