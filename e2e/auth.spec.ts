import { expect, test } from "@playwright/test";

test("redirects unauthenticated user to login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);
});

test("login page renders correctly", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Inventory App" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});

test("shows validation errors on empty submit", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Invalid email address")).toBeVisible();
});
