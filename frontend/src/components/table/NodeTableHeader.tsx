import { Button } from "@/components/ui/button";
import { PackageNode } from "@/utils/models";
import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

interface NodeTableHeaderProps {
  column: Column<PackageNode>;
  title: string;
}

const NodeTableHeader = ({ column, title }: NodeTableHeaderProps) => {
  return (
    <div className="flex flex-row items-center font-semibold underline break-words whitespace-normal">
      {title}
      <Button
        variant="ghost"
        className=""
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <ArrowUpDown />
      </Button>
    </div>
  );
};
export { NodeTableHeader };
