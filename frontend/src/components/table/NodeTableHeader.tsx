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
    <Button
      variant="ghost"
      className="break-words whitespace-normal"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown />
    </Button>
  );
};
export { NodeTableHeader };
