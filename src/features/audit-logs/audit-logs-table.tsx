"use client";

import { useState } from "react";
import { useAuditLogsList } from "@/api/generated/audit-logs/audit-logs";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import type { AuditLogsResponse } from "@/types/audit-log";
import { auditLogColumns } from "./audit-log-columns";

const SUBJECT_TYPES = ["Product", "Category"];

export function AuditLogsTable() {
  const [page, setPage] = useState(1);
  const [subjectType, setSubjectType] = useState("");

  const { data: rawData } = useAuditLogsList({
    subject_type: subjectType ? `App\\Models\\${subjectType}` : undefined,
    per_page: 20,
  });

  const data = rawData as unknown as AuditLogsResponse | undefined;
  const logs = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter by resource:</span>
        {["", ...SUBJECT_TYPES].map((type) => (
          <Button
            key={type || "all"}
            variant={subjectType === type ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSubjectType(type);
              setPage(1);
            }}
          >
            {type || "All"}
          </Button>
        ))}
      </div>

      <DataTable
        columns={auditLogColumns}
        data={logs}
        manualPagination
        pageCount={meta?.last_page ?? 1}
      />

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {logs.length} of {meta.total} entries
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
              disabled={page === meta.last_page}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
