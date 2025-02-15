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
  cell,
}: {
  cell: CellContext<PackageNode, string[]>;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const packages = cell.getValue();

  // Only render the collapsible if there are packages
  if (packages.length === 0) {
    return <h4 className="text-sm font-semibold text-gray-700">None</h4>;
  } else {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <h4 className="text-sm font-semibold">
              {packages.length} packages
            </h4>
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul>
            {packages.map((value: string, index: number) => (
              <li className="list-disc pl-2 text-nowrap" key={index}>
                {value}
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    );
  }
}
