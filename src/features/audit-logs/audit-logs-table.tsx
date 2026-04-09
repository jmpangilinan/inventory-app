"use client";

import { useState } from "react";
import { useAuditLogsList } from "@/api/generated/audit-logs/audit-logs";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { auditLogColumns } from "./audit-log-columns";

const SUBJECT_TYPES = ["Product", "Category"];

export function AuditLogsTable() {
  const [page, setPage] = useState(1);
  const [subjectType, setSubjectType] = useState("");

  const { data, isLoading } = useAuditLogsList({
    subject_type: subjectType ? `App\\Models\\${subjectType}` : undefined,
    per_page: 20,
    page,
  });

  const logs = data?.data ?? [];
  const meta = data?.meta;
  const lastPage = (meta?.last_page as number) ?? 1;

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
        pageCount={lastPage}
        page={page}
        onPageChange={setPage}
        totalCount={meta?.total as number | undefined}
        isLoading={isLoading}
      />
    </div>
  );
}
