import { z } from "zod";
import { StockTransactionsCreateBodyReason, StockTransactionsCreateBodyType } from "@/api/model";

export const stockTransactionSchema = z.object({
  product_id: z.number().min(1, "Product is required"),
  type: z.enum(Object.values(StockTransactionsCreateBodyType) as [string, ...string[]], {
    error: "Type is required",
  }),
  reason: z.enum(Object.values(StockTransactionsCreateBodyReason) as [string, ...string[]], {
    error: "Reason is required",
  }),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  notes: z.string().nullable().optional(),
});

export type StockTransactionFormValues = z.infer<typeof stockTransactionSchema>;
