"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { AuditLog } from "@/types/audit-log";

function descriptionBadge(description: string) {
  const map: Record<string, string> = {
    created: "bg-green-600 text-white",
    updated: "bg-blue-600 text-white",
    deleted: "bg-destructive text-destructive-foreground",
  };
  return (
    <Badge className={map[description] ?? "bg-muted text-muted-foreground"}>{description}</Badge>
  );
}

function formatSubjectType(type: string) {
  return type.split("\\").pop() ?? type;
}

export const auditLogColumns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "description",
    header: "Action",
    cell: ({ row }) => descriptionBadge(row.original.description),
  },
  {
    accessorKey: "subject_type",
    header: "Resource",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{formatSubjectType(row.original.subject_type)}</p>
        <p className="text-xs text-muted-foreground">#{row.original.subject_id}</p>
      </div>
    ),
  },
  {
    accessorKey: "causer",
    header: "Performed by",
    cell: ({ row }) => <span className="text-sm">{row.original.causer?.name ?? "System"}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.created_at), "MMM d, yyyy HH:mm"),
  },
];
