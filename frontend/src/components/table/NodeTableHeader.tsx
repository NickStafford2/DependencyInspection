import { Button } from "@/components/ui/button";
import { PackageNode } from "@/models/GraphData";
import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { LuArrowUp, LuArrowDown } from "react-icons/lu";
import { useState, useEffect, ReactNode } from "react";

interface NodeTableHeaderProps {
  column: Column<PackageNode>;
  title: string;
}

const NodeTableHeader = ({ column, title }: NodeTableHeaderProps) => {
  const [sortIcon, setSortIcon] = useState<ReactNode>(<ArrowUpDown />); // Initialize the sort icon in state
  // let sortIcon: ReactNode = <ArrowUpDown />;
  const toggleSort = () => {
    column.toggleSorting(column.getIsSorted() === "asc");
  };

  const isSorted = column.getIsSorted();

  useEffect(() => {
    // Update the sort icon based on the column's sort state
    if (isSorted === "asc") {
      setSortIcon(<LuArrowUp className="text-green-200" />);
    } else if (isSorted === "desc") {
      setSortIcon(<LuArrowDown className="text-red-200" />);
    } else {
      setSortIcon(<ArrowUpDown />);
    }
  }, [column, isSorted]); // Use the extracted isSorted value here
  return (
    <div className="flex justify-between flex-row items-center font-semibold underline break-words whitespace-normal">
      {title}
      <Button variant="ghost" className="px-2" onClick={toggleSort}>
        {sortIcon}
      </Button>
    </div>
  );
};
export { NodeTableHeader };
