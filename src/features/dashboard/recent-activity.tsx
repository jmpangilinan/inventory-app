"use client";

import { format } from "date-fns";
import { Activity } from "lucide-react";
import { useAuditLogsList } from "@/api/generated/audit-logs/audit-logs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const actionColors: Record<string, string> = {
  created: "bg-green-600 text-white",
  updated: "bg-blue-600 text-white",
  deleted: "bg-destructive text-destructive-foreground",
};

function formatSubjectType(type?: string | null) {
  if (!type) return "—";
  return type.split("\\").pop() ?? type;
}

export function RecentActivity() {
  const { data, isLoading } = useAuditLogsList({ per_page: 8 });
  const logs = data?.data ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <Activity className="size-4 text-muted-foreground" />
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : logs.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <div className="divide-y">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      actionColors[log.description ?? ""] ?? "bg-muted text-muted-foreground"
                    }
                  >
                    {log.description ?? "unknown"}
                  </Badge>
                  <span className="text-sm">{formatSubjectType(log.subject_type)}</span>
                  {log.subject_id && (
                    <span className="text-xs text-muted-foreground">#{log.subject_id}</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {log.created_at ? format(new Date(log.created_at), "MMM d, HH:mm") : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
