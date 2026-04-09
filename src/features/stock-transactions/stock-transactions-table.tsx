"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useProductsList } from "@/api/generated/products/products";
import {
  useStockTransactionsCreate,
  useStockTransactionsList,
} from "@/api/generated/stock-transactions/stock-transactions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StockTransactionFormValues } from "@/lib/validations/stock-transaction";
import { stockTransactionColumns } from "./stock-transaction-columns";
import { StockTransactionForm } from "./stock-transaction-form";

export function StockTransactionsTable() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);

  const { data: productsData } = useProductsList({ per_page: 100 });
  const products = productsData?.data ?? [];

  const { data, refetch } = useStockTransactionsList(
    selectedProductId ?? 0,
    { page },
    { query: { enabled: !!selectedProductId } },
  );

  const transactions = data?.data ?? [];
  const meta = data?.meta;

  const createMutation = useStockTransactionsCreate({
    mutation: {
      onSuccess: () => {
        toast.success("Transaction recorded");
        setFormOpen(false);
        refetch();
      },
      onError: () => toast.error("Failed to record transaction"),
    },
  });

  function handleSubmit(values: StockTransactionFormValues) {
    createMutation.mutate({
      data: values as Parameters<typeof createMutation.mutate>[0]["data"],
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Select
          value={selectedProductId ? String(selectedProductId) : ""}
          onValueChange={(val) => {
            setSelectedProductId(Number(val));
            setPage(1);
          }}
        >
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Select a product…" />
          </SelectTrigger>
          <SelectContent>
            {products.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Record transaction
        </Button>
      </div>

      {selectedProductId ? (
        <>
          <DataTable
            columns={stockTransactionColumns}
            data={transactions}
            manualPagination
            pageCount={(meta?.last_page as number) ?? 1}
          />

          {meta && (meta.last_page as number) > 1 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {transactions.length} of {meta.total as number} transactions
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
                  disabled={page === (meta.last_page as number)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Select a product to view its stock transactions.
        </p>
      )}

      <StockTransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending}
        defaultProductId={selectedProductId ?? undefined}
      />
    </div>
  );
}
