"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/api/model";
import { RowActions } from "@/components/shared/row-actions";
import { Badge } from "@/components/ui/badge";

interface ColumnActions {
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function getProductColumns({ onEdit, onDelete }: ColumnActions): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.sku}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          {row.original.category && (
            <p className="text-xs text-muted-foreground">{row.original.category.name}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span>
          {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(
            row.original.price ?? 0,
          )}
        </span>
      ),
    },
    {
      accessorKey: "stock_quantity",
      header: "Stock",
      cell: ({ row }) => {
        const qty = row.original.stock_quantity ?? 0;
        const isLow = row.original.is_low_stock;
        return (
          <div className="flex items-center gap-2">
            <span>{qty}</span>
            {isLow && (
              <Badge variant="destructive" className="text-xs">
                Low
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) =>
        row.original.is_active ? (
          <Badge variant="outline" className="border-green-600 text-green-600">
            Active
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Inactive
          </Badge>
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <RowActions onEdit={() => onEdit(row.original)} onDelete={() => onDelete(row.original)} />
      ),
    },
  ];
}
