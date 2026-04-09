"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { AuditLog } from "@/api/model";
import { Badge } from "@/components/ui/badge";

function ActionBadge({ description }: { description?: string }) {
  const map: Record<string, string> = {
    created: "bg-green-600 text-white",
    updated: "bg-blue-600 text-white",
    deleted: "bg-destructive text-destructive-foreground",
  };
  const label = description ?? "unknown";
  return <Badge className={map[label] ?? "bg-muted text-muted-foreground"}>{label}</Badge>;
}

function formatSubjectType(type?: string | null) {
  if (!type) return "—";
  return type.split("\\").pop() ?? type;
}

export const auditLogColumns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "description",
    header: "Action",
    cell: ({ row }) => <ActionBadge description={row.original.description} />,
  },
  {
    accessorKey: "subject_type",
    header: "Resource",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{formatSubjectType(row.original.subject_type)}</p>
        {row.original.subject_id && (
          <p className="text-xs text-muted-foreground">#{row.original.subject_id}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "causer_id",
    header: "Causer",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.causer_id ? `User #${row.original.causer_id}` : "System"}
      </span>
    ),
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
