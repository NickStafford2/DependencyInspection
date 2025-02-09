import { useEffect, useState, useRef } from "react";
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
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table: ReactTable<TData>;
  scrollTo: string;
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const updateSize = () => {
    if (wrapperRef.current) {
      const newWidth = wrapperRef.current.clientWidth;
      const newHeight = wrapperRef.current.clientHeight;
      setDimensions({ width: newWidth, height: newHeight });
    }
  };

  useEffect(() => {
    // Set the initial size when the component mounts
    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    // Cleanup observer when the component is unmounted
    return () => {
      resizeObserver.disconnect();
    };
  }, []); // Empty dependency array: this runs once on mount

  const tableScrollerRef = useRef<HTMLDivElement>(null);
  // React.useEffect(() => {
  //   // console.log(scrollTo)
  //   if (scrollTo) {
  //     const row = table.getRow(scrollTo);
  //     // console.log(row);
  //     // console.log(tableScrollerRef.current?.scrollTo);
  //     tableScrollerRef.current?.scrollTo({ top: row.index });
  //     // tableBodyRef.current?.scrollIntoView();
  //   }
  // }, [scrollTo, table]);
  return (
    <div ref={wrapperRef} className="relative w-full h-full">
      <div className="absolute top-0 left-0 bottom-0 right-0">
        <Table
          ref={tableScrollerRef}
          width={dimensions.width}
          height={dimensions.height}
          wrapperClassName=""
        >
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
                    <TableCell key={cell.id} className="align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
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
