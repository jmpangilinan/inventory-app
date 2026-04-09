import { describe, expect, it } from "vitest";
import { categorySchema } from "./category";

const validCategory = {
  name: "Electronics",
  description: "Electronic products",
  is_active: true,
};

describe("categorySchema", () => {
  it("passes with valid data", () => {
    expect(categorySchema.safeParse(validCategory).success).toBe(true);
  });

  it("fails when name is empty", () => {
    const result = categorySchema.safeParse({ ...validCategory, name: "" });
    expect(result.success).toBe(false);
  });

  it("allows description to be null", () => {
    const result = categorySchema.safeParse({ ...validCategory, description: null });
    expect(result.success).toBe(true);
  });

  it("allows optional fields to be omitted", () => {
    const result = categorySchema.safeParse({ name: "Electronics" });
    expect(result.success).toBe(true);
  });

  it("allows is_active to be false", () => {
    const result = categorySchema.safeParse({ ...validCategory, is_active: false });
    expect(result.success).toBe(true);
  });
});
