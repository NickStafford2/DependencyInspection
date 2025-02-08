import {
  ColumnDef,
  getFilteredRowModel,
  getCoreRowModel,
  VisibilityState,
  ColumnFiltersState,
  useReactTable,
  SortingState,
  getSortedRowModel,
  Table,
} from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import { NodeTable2 } from "./NodeTable2"
import { NodeTable } from "./NodeTable";
import React, { useContext } from "react";
import { GlobalStateContext } from "@/context";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  scrollTo: string;
}

/** @useSignals **/
export function NodeTableContainer<TData, TValue>({
  columns,
  scrollTo,
}: DataTableProps<TData, TValue>) {
  const { tableData } = useContext(GlobalStateContext);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: true,
      inDegree: false,
      outDegree: false,
      dependencies: false,
      dependency_of: false,
      all_dependencies: false,
      all_dependency_of: false,
      closenessCentrality: false,
      eigenvectorCentrality: false,
      clusteringCoefficient: true,
      pagerank: true,
      betweennessCentrality: true,
      isSeed: false,
    });

  const table: Table<TData> = useReactTable({
    // @ts-ignore
    data: tableData.value,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (originalRow) => {
      // @ts-ignore
      return originalRow.id;
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="rounded-md border h-full flex flex-col">
      <div className="flex flex-row items-center py-4 gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-row flex-nowrap">
            {/* <Button variant="outline" className="ml-auto"> */}
            Columns <ChevronDown />
            {/* </Button> */}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder="Filter packages..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <NodeTable
        columns={columns}
        table={table}
        scrollTo={scrollTo}
      ></NodeTable>
    </div>
  );
}
