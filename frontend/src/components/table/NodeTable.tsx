import {
  ColumnDef,
  flexRender,
  Table as ReactTable,

} from "@tanstack/react-table"
import { elementScroll, useVirtualizer } from '@tanstack/react-virtual'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table-scrollable";
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table: ReactTable<TData>,
  scrollTo: string
}

export function NodeTable<TData, TValue>({
  columns,
  table,
  scrollTo,
}: DataTableProps<TData, TValue>) {
  /** Getting a react shadcn table to scroll in the body of the table is a difficult 
   * task. I had to dynamically change the height with javascript so that it fills its 
   * container. They I had to do some css tricks you can see below to get the scrolling 
   * behaviour to work. I can not find a way to do both all in css. That is why this 
   * component seems excessively complex.**/
  const tableScrollerRef = React.useRef<HTMLDivElement>(null)
  const wrapperRef = React.useRef<HTMLTableSectionElement>(null)

  const setHeight = () => {
    if (wrapperRef?.current && tableScrollerRef?.current) {
      tableScrollerRef.current.style.height = wrapperRef.current.clientHeight + 'px'
    }
  }
  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => tableScrollerRef.current
  })
  React.useEffect(() => {
    console.log(scrollTo)
    if (scrollTo) {
      const row = table.getRow(scrollTo)
      console.log(row)
      tableScrollerRef.current?.scrollTo
      // tableBodyRef.current?.scrollIntoView()
    }
  }, [scrollTo])


  React.useEffect(() => {
    setHeight()
    const resizeObserver = new ResizeObserver(() => {
      setHeight()
    })
    console.log(tableScrollerRef)
    if (wrapperRef?.current && tableScrollerRef?.current) {
      resizeObserver.observe(wrapperRef.current)
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="rounded-md border grow">
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
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}
                    className="align-top"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
