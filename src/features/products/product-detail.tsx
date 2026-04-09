"use client";

import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useProductsShow, useProductsUpdate } from "@/api/generated/products/products";
import { useStockTransactionsList } from "@/api/generated/stock-transactions/stock-transactions";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ProductFormValues } from "@/lib/validations/product";
import { productDetailTransactionColumns } from "./product-detail-columns";
import { ProductForm } from "./product-form";

function ProductInfoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-48" />
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => i).map((i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-32" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface ProductDetailProps {
  id: number;
}

export function ProductDetail({ id }: ProductDetailProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [txPage, setTxPage] = useState(1);

  const { data: productData, isLoading: productLoading, refetch } = useProductsShow(id);
  const product = productData?.data;

  const { data: txData } = useStockTransactionsList(id, { page: txPage });
  const transactions = txData?.data ?? [];
  const txMeta = txData?.meta;
  const txLastPage = (txMeta?.last_page as number) ?? 1;

  const updateMutation = useProductsUpdate({
    mutation: {
      onSuccess: () => {
        toast.success("Product updated");
        setFormOpen(false);
        refetch();
      },
      onError: () => toast.error("Failed to update product"),
    },
  });

  function handleFormSubmit(values: ProductFormValues) {
    updateMutation.mutate({ id, data: values });
  }

  const phpFormat = (val: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className={cn(
              "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
            )}
          >
            <ArrowLeft className="mr-1.5 size-4" />
            Products
          </Link>
          {productLoading ? (
            <Skeleton className="h-7 w-48" />
          ) : (
            <h1 className="text-2xl font-semibold">{product?.name ?? "Product"}</h1>
          )}
        </div>
        <Button onClick={() => setFormOpen(true)} disabled={productLoading}>
          <Pencil className="mr-2 size-4" />
          Edit
        </Button>
      </div>

      {productLoading ? (
        <ProductInfoSkeleton />
      ) : product ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Product Info</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">SKU</p>
              <p className="font-mono text-sm">{product.sku}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="text-sm">{product.category?.name ?? "—"}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Status</p>
              <StatusBadge active={product.is_active} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-sm font-medium">{phpFormat(product.price ?? 0)}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Stock Quantity</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{product.stock_quantity ?? 0}</p>
                {product.is_low_stock && (
                  <Badge variant="destructive" className="text-xs">
                    Low
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Low Stock Threshold</p>
              <p className="text-sm">{product.low_stock_threshold ?? 0}</p>
            </div>
            {product.description && (
              <div className="space-y-0.5 sm:col-span-2 lg:col-span-3">
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm">{product.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Stock Transactions</h2>
        <DataTable
          columns={productDetailTransactionColumns}
          data={transactions}
          manualPagination
          pageCount={txLastPage}
        />
        {txLastPage > 1 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {transactions.length}
              {txMeta?.total ? ` of ${txMeta.total as number}` : ""} transactions
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={txPage === 1}
                onClick={() => setTxPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={txPage === txLastPage}
                onClick={() => setTxPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        product={product}
        onSubmit={handleFormSubmit}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
