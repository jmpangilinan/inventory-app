"use client";

import { AlertTriangle, Box, Package, Tag } from "lucide-react";
import { useCategoriesList } from "@/api/generated/categories/categories";
import { useProductsList, useProductsLowStock } from "@/api/generated/products/products";
import { StatCard } from "./stat-card";

export function DashboardStats() {
  const { data: productsData } = useProductsList({ per_page: 1 });
  const { data: categoriesData } = useCategoriesList();
  const { data: lowStockData } = useProductsLowStock();
  const { data: allProductsData } = useProductsList({ per_page: 100 });

  const totalProducts = productsData?.meta?.total as number | undefined;
  const totalCategories = categoriesData?.data?.length;
  const lowStockCount = lowStockData?.data?.length;
  const totalStock = allProductsData?.data?.reduce((sum, p) => sum + (p.stock_quantity ?? 0), 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Products" value={totalProducts} icon={Package} />
      <StatCard title="Total Categories" value={totalCategories} icon={Tag} />
      <StatCard
        title="Low Stock Items"
        value={lowStockCount}
        icon={AlertTriangle}
        description={lowStockCount ? "Products below threshold" : "All items sufficiently stocked"}
      />
      <StatCard
        title="Total Stock Units"
        value={totalStock}
        icon={Box}
        description="Sum of all product quantities"
      />
    </div>
  );
}
