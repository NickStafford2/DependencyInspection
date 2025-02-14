import { useRef } from "react";
import {
  ColumnDef,
  flexRender,
  Table as ReactTable,
} from "@tanstack/react-table";
// import { /*elementScroll, */ useVirtualizer } from "@tanstack/react-virtual";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table-scrollable";
import { PackageNode } from "@/utils/models";

interface DataTableProps {
  columns: ColumnDef<PackageNode>[];
  table: ReactTable<PackageNode>;
  scrollTo: string;
}

export function NodeTable({ columns, table /*, scrollTo */ }: DataTableProps) {
  /** Getting a react shadcn table to scroll in the body of the table is a difficult
   * task. I had to dynamically change the height with javascript so that it fills its
   * container. They I had to do some css tricks you can see below to get the scrolling
   * behaviour to work. I can not find a way to do both all in css. That is why this
   * component seems excessively complex.**/
  const wrapperRef = useRef<HTMLDivElement>(null);

  const tableScrollerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      id="node-table-container"
      ref={wrapperRef}
      className="relative w-full h-full"
    >
      <div className="absolute top-0 left-0 bottom-0 right-0">
        <Table ref={tableScrollerRef} wrapperClassName="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="break-words whitespace-normal"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, index) => {
                    return index === -1 ? (
                      <TableHeader key={cell.id} className="align-top">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableHeader>
                    ) : (
                      <TableCell key={cell.id} className="align-top">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
