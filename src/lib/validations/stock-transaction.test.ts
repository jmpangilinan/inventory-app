import { describe, expect, it } from "vitest";
import { StockTransactionsCreateBodyReason, StockTransactionsCreateBodyType } from "@/api/model";
import { stockTransactionSchema } from "./stock-transaction";

const validTransaction = {
  product_id: 1,
  type: StockTransactionsCreateBodyType.in,
  reason: StockTransactionsCreateBodyReason.purchase,
  quantity: 10,
  notes: null,
};

describe("stockTransactionSchema", () => {
  it("passes with valid data", () => {
    expect(stockTransactionSchema.safeParse(validTransaction).success).toBe(true);
  });

  it("fails when product_id is 0", () => {
    const result = stockTransactionSchema.safeParse({ ...validTransaction, product_id: 0 });
    expect(result.success).toBe(false);
  });

  it("fails when quantity is 0", () => {
    const result = stockTransactionSchema.safeParse({ ...validTransaction, quantity: 0 });
    expect(result.success).toBe(false);
  });

  it("fails when quantity is negative", () => {
    const result = stockTransactionSchema.safeParse({ ...validTransaction, quantity: -1 });
    expect(result.success).toBe(false);
  });

  it("fails with invalid type", () => {
    const result = stockTransactionSchema.safeParse({ ...validTransaction, type: "invalid" });
    expect(result.success).toBe(false);
  });

  it("fails with invalid reason", () => {
    const result = stockTransactionSchema.safeParse({ ...validTransaction, reason: "invalid" });
    expect(result.success).toBe(false);
  });

  it("allows all valid types", () => {
    for (const type of Object.values(StockTransactionsCreateBodyType)) {
      expect(stockTransactionSchema.safeParse({ ...validTransaction, type }).success).toBe(true);
    }
  });

  it("allows notes to be omitted", () => {
    const { notes, ...rest } = validTransaction;
    expect(stockTransactionSchema.safeParse(rest).success).toBe(true);
  });
});
