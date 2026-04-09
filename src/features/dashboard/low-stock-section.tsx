"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useProductsLowStock } from "@/api/generated/products/products";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LowStockSection() {
  const { data, isLoading } = useProductsLowStock();
  const products = data?.data ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <AlertTriangle className="size-4 text-destructive" />
        <CardTitle className="text-base">Low Stock Alerts</CardTitle>
        {!isLoading && products.length > 0 && (
          <Badge variant="destructive" className="ml-auto">
            {products.length}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : products.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            All products are sufficiently stocked.
          </p>
        ) : (
          <div className="divide-y">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-2.5">
                <div>
                  <Link
                    href={`/products/${product.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-destructive">
                    {product.stock_quantity ?? 0} units
                  </p>
                  <p className="text-xs text-muted-foreground">
                    threshold: {product.low_stock_threshold ?? 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
