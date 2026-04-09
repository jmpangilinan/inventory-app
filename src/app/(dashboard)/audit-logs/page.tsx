import { AuditLogsTable } from "@/features/audit-logs/audit-logs-table";

export const metadata = { title: "Audit Logs — Inventory App" };

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">Read-only trail of all resource changes.</p>
      </div>
      <AuditLogsTable />
    </div>
  );
}
