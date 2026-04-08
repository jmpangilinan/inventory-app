import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./auth";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "secret" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "secret" });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.email).toBeDefined();
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "" });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.password).toBeDefined();
  });
});

describe("registerSchema", () => {
  const valid = {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    password_confirmation: "password123",
  };

  it("accepts valid registration data", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects short password", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "short",
      password_confirmation: "short",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.password).toBeDefined();
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({ ...valid, password_confirmation: "different" });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.password_confirmation).toBeDefined();
  });

  it("rejects empty name", () => {
    const result = registerSchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.name).toBeDefined();
  });
});
