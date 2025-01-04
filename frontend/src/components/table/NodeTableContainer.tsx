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
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// import { NodeTable2 } from "./NodeTable2"
import { NodeTable } from "./NodeTable"
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  scrollTo: string;
}

export function NodeTableContainer<TData, TValue>({
  columns,
  data,
  scrollTo,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    id: true,
    inDegree: true,
    outDegree: true,
    predecessors: false,
    dependencies: false,
    successors: false,
    closenessCentrality: false,
    eigenvectorCentrality: false,
    clusteringCoefficient: false,
    pagerank: false,
    betweennessCentrality: false,
    isSeed: false,
  })

  const table: Table<TData> = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (originalRow) => { return originalRow.id },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="rounded-md border h-full flex flex-col">
      <div className="flex flex-row items-center py-4 gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
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
                )
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
      <NodeTable columns={columns} table={table} scrollTo={scrollTo}></NodeTable>
    </div>
  );
}
