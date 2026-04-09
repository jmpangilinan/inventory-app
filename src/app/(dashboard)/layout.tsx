import { MobileSidebar, Sidebar } from "@/components/shared/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex h-14 items-center gap-2 border-b px-4 lg:hidden">
          <MobileSidebar />
          <span className="font-semibold text-sm">Inventory App</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
