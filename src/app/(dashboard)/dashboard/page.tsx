import { DashboardStats } from "@/features/dashboard/dashboard-stats";
import { LowStockSection } from "@/features/dashboard/low-stock-section";
import { RecentActivity } from "@/features/dashboard/recent-activity";

export const metadata = { title: "Dashboard — Inventory App" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your inventory.</p>
      </div>
      <DashboardStats />
      <div className="grid gap-4 lg:grid-cols-2">
        <LowStockSection />
        <RecentActivity />
      </div>
    </div>
  );
}
