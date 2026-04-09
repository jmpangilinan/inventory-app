import { describe, expect, it } from "vitest";
import { productSchema } from "./product";

const validProduct = {
  sku: "SKU-001",
  name: "Test Product",
  description: null,
  price: 99.99,
  stock_quantity: 10,
  low_stock_threshold: 5,
  is_active: true,
  category_id: 1,
};

describe("productSchema", () => {
  it("passes with valid data", () => {
    expect(productSchema.safeParse(validProduct).success).toBe(true);
  });

  it("fails when sku is empty", () => {
    const result = productSchema.safeParse({ ...validProduct, sku: "" });
    expect(result.success).toBe(false);
  });

  it("fails when name is empty", () => {
    const result = productSchema.safeParse({ ...validProduct, name: "" });
    expect(result.success).toBe(false);
  });

  it("fails when price is negative", () => {
    const result = productSchema.safeParse({ ...validProduct, price: -1 });
    expect(result.success).toBe(false);
  });

  it("allows price of zero", () => {
    const result = productSchema.safeParse({ ...validProduct, price: 0 });
    expect(result.success).toBe(true);
  });

  it("fails when category_id is 0", () => {
    const result = productSchema.safeParse({ ...validProduct, category_id: 0 });
    expect(result.success).toBe(false);
  });

  it("allows optional fields to be omitted", () => {
    const { description, stock_quantity, low_stock_threshold, is_active, ...minimal } =
      validProduct;
    const result = productSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });
});
