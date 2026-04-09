"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { StockTransaction } from "@/api/model";
import { Badge } from "@/components/ui/badge";

function TypeBadge({ type }: { type?: string }) {
  if (type === "in") return <Badge className="bg-green-600 text-white">In</Badge>;
  if (type === "out") return <Badge variant="destructive">Out</Badge>;
  return <Badge variant="outline">Adjustment</Badge>;
}

function formatReason(reason?: string) {
  if (!reason) return "—";
  return reason.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const productDetailTransactionColumns: ColumnDef<StockTransaction>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <TypeBadge type={row.original.type} />,
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => <span className="text-sm">{formatReason(row.original.reason)}</span>,
  },
  {
    accessorKey: "quantity",
    header: "Qty",
    cell: ({ row }) => <span className="font-medium">{row.original.quantity}</span>,
  },
  {
    id: "stock_change",
    header: "Stock",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.stock_before} → {row.original.stock_after}
      </span>
    ),
  },
  {
    accessorKey: "performed_by",
    header: "By",
    cell: ({ row }) => <span className="text-sm">{row.original.performed_by?.name ?? "—"}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) =>
      row.original.created_at
        ? format(new Date(row.original.created_at), "MMM d, yyyy HH:mm")
        : "—",
  },
];
