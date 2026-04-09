"use client";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useProductsCreate,
  useProductsDelete,
  useProductsList,
  useProductsUpdate,
} from "@/api/generated/products/products";
import type { Product } from "@/api/model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import type { ProductFormValues } from "@/lib/validations/product";
import { getProductColumns } from "./product-columns";
import { ProductDeleteDialog } from "./product-delete-dialog";
import { ProductForm } from "./product-form";

export function ProductsTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data, refetch } = useProductsList({
    search: debouncedSearch || undefined,
    page,
    per_page: 15,
  });

  const products = data?.data ?? [];
  const meta = data?.meta;

  const createMutation = useProductsCreate({
    mutation: {
      onSuccess: () => {
        toast.success("Product created");
        setFormOpen(false);
        refetch();
      },
      onError: () => toast.error("Failed to create product"),
    },
  });

  const updateMutation = useProductsUpdate({
    mutation: {
      onSuccess: () => {
        toast.success("Product updated");
        setFormOpen(false);
        refetch();
      },
      onError: () => toast.error("Failed to update product"),
    },
  });

  const deleteMutation = useProductsDelete({
    mutation: {
      onSuccess: () => {
        toast.success("Product deleted");
        setDeleteOpen(false);
        refetch();
      },
      onError: () => toast.error("Failed to delete product"),
    },
  });

  function handleEdit(product: Product) {
    setSelectedProduct(product);
    setFormOpen(true);
  }

  function handleDelete(product: Product) {
    setSelectedProduct(product);
    setDeleteOpen(true);
  }

  function handleFormSubmit(values: ProductFormValues) {
    if (selectedProduct?.id) {
      updateMutation.mutate({ id: selectedProduct.id, data: values });
    } else {
      createMutation.mutate({ data: values });
    }
  }

  function handleConfirmDelete() {
    if (selectedProduct?.id) {
      deleteMutation.mutate({ id: selectedProduct.id });
    }
  }

  const columns = getProductColumns({ onEdit: handleEdit, onDelete: handleDelete });

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: (meta?.last_page as number) ?? 1,
  });

  const isPendingForm = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search by name or SKU…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />
        <Button
          onClick={() => {
            setSelectedProduct(null);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-2 size-4" />
          Add product
        </Button>
      </div>

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
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {meta && (meta.last_page as number) > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {products.length} of {meta.total as number} products
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === (meta.last_page as number)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ProductForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSubmit={handleFormSubmit}
        isPending={isPendingForm}
      />

      <ProductDeleteDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedProduct(null);
        }}
        product={selectedProduct}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
