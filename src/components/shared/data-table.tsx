"use client";

import {
  type ColumnDef,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  type RowData,
  type Table as TanstackTable,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  globalFilterFn?: FilterFn<TData> | keyof typeof import("@tanstack/react-table").filterFns;
  manualPagination?: boolean;
  pageCount?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  totalCount?: number;
  getTable?: (table: TanstackTable<TData>) => void;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  globalFilter,
  onGlobalFilterChange,
  globalFilterFn = "includesString",
  manualPagination = false,
  pageCount,
  page,
  onPageChange,
  totalCount,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: onGlobalFilterChange ? getFilteredRowModel() : undefined,
    state: onGlobalFilterChange ? { globalFilter } : undefined,
    onGlobalFilterChange,
    globalFilterFn: globalFilterFn as FilterFn<TData>,
    manualPagination,
    pageCount,
  });

  const lastPage = pageCount ?? 1;
  const hasPagination = manualPagination && page !== undefined && onPageChange !== undefined;

  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {hasPagination && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {totalCount !== undefined
              ? `Showing ${data.length} of ${totalCount}`
              : `Page ${page} of ${lastPage}`}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === lastPage}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
