import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { ChevronsUpDown } from "lucide-react";
import React from "react";
import { CellContext } from "@tanstack/react-table";
import { PackageNode } from "@/utils/models";

export function CellDependencies({
  cell: cell,
}: {
  cell: CellContext<PackageNode, string[]>;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  // console.log(cell);
  // console.log(cell.getValue());

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <h4 className="text-sm font-semibold">
              <span>{cell.getValue().length} packages</span>
            </h4>
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        {cell && JSON.parse(JSON.stringify(cell.getValue()))}
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
