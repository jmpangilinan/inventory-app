import { CategoriesTable } from "@/features/categories/categories-table";

export const metadata = { title: "Categories — Inventory App" };

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-sm text-muted-foreground">Manage your product categories.</p>
      </div>
      <CategoriesTable />
    </div>
  );
}
