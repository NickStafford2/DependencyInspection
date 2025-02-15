import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { ChevronsUpDown } from "lucide-react";
import React from "react";
import { CellContext } from "@tanstack/react-table";
import { PackageNode, DependencyVersion } from "@/utils/models";

export function CellDependenciesVersion({
  cell,
}: {
  cell: CellContext<PackageNode, DependencyVersion[]>;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  // console.log(cell);
  // console.log(cell.getValue());

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm">
          <h4 className="text-sm font-semibold">
            {cell.getValue().length} packages
          </h4>
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul>
          {cell.getValue().map((value: DependencyVersion, index: number) => (
            <li className="list-disc pl-2 text-nowrap" key={index}>
              {value.packageId}: {value.version}
            </li>
          ))}
        </ul>
        {/* {cell && JSON.parse(JSON.stringify(cell.getValue()))} */}
        {/* {cell && */}
        {/*   cell.map((item) => ( */}
        {/*     <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm whitespace-nowrap"> */}
        {/*       {item["package_id"]}:{item["version"]} */}
        {/*     </div> */}
        {/*   ))} */}
      </CollapsibleContent>
    </Collapsible>
  );
}
