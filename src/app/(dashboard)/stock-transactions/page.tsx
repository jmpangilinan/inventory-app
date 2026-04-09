import { StockTransactionsTable } from "@/features/stock-transactions/stock-transactions-table";

export const metadata = { title: "Stock Transactions — Inventory App" };

export default function StockTransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Stock Transactions</h1>
        <p className="text-sm text-muted-foreground">Record and review all stock movements.</p>
      </div>
      <StockTransactionsTable />
    </div>
  );
}
