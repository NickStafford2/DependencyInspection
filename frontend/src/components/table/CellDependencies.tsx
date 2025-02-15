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

type CellDependenciesProps<T> = {
  cell: CellContext<PackageNode, T[]>;
  renderItem: (value: T) => React.ReactNode;
};

function CellDependenciesBase<T>({
  cell,
  renderItem,
}: CellDependenciesProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const packages = cell.getValue();

  // Only render the collapsible if there are packages
  if (packages.length === 0) {
    return (
      <span className="flex flex-row flex-nowrap justify-between items-center h-9">
        <h4 className="text-sm font-semibold">0 packages</h4>
      </span>
    );
  } else {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
        <CollapsibleTrigger asChild>
          <span className="flex flex-row flex-nowrap justify-between items-center h-9">
            <h4 className="text-sm font-semibold">
              {packages.length} packages
            </h4>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul>
            {packages.map((value, index) => (
              <li className="text-nowrap" key={index}>
                {renderItem(value)}
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    );
  }
}

export function CellDependencies({
  cell,
}: {
  cell: CellContext<PackageNode, string[]>;
}) {
  // Render each package as a string
  const renderItem = (value: string) => value;

  return <CellDependenciesBase cell={cell} renderItem={renderItem} />;
}

export function CellDependenciesVersion({
  cell,
}: {
  cell: CellContext<PackageNode, DependencyVersion[]>;
}) {
  // Render each package as `packageId: version`
  const renderItem = (value: DependencyVersion) =>
    `${value.packageId}: ${value.version}`;

  return <CellDependenciesBase cell={cell} renderItem={renderItem} />;
}
