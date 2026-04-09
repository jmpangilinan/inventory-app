"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Category } from "@/api/model";
import { RowActions } from "@/components/shared/row-actions";
import { Badge } from "@/components/ui/badge";

interface ColumnActions {
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function getCategoryColumns({ onEdit, onDelete }: ColumnActions): ColumnDef<Category>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.original.slug}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.description ?? "—"}</span>
      ),
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
