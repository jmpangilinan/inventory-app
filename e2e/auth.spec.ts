import { expect, type Page, test } from "@playwright/test";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function mockLoginSuccess(page: Page) {
  await page.route("**/auth/login", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: { id: 1, name: "Test User", email: "test@example.com", roles: ["admin"] },
        token: "test-token-123",
      }),
    }),
  );
}

async function mockLoginFailure(page: Page) {
  await page.route("**/auth/login", (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ message: "Invalid credentials" }),
    }),
  );
}

async function mockDashboardApis(page: Page) {
  const emptyPaginated = JSON.stringify({
    data: [],
    meta: { current_page: 1, last_page: 1, per_page: 15, total: 0 },
    links: {},
  });

  await page.route("**/products/low-stock", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: [] }),
    }),
  );
  await page.route("**/products**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: emptyPaginated }),
  );
  await page.route("**/categories**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: emptyPaginated }),
  );
  await page.route("**/audit-logs**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: emptyPaginated }),
  );
}

/** Set auth cookie so middleware treats the browser as authenticated. */
async function setAuthCookie(page: Page) {
  await page.context().addCookies([
    {
      name: "auth_token",
      value: "test-token-123",
      domain: "localhost",
      path: "/",
      maxAge: 60 * 60 * 24,
    },
  ]);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe("Unauthenticated redirects", () => {
  test("redirects / to /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirects /dashboard to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renders correctly", async ({ page }) => {
    await expect(page.getByText("Inventory App")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Invalid email address")).toBeVisible();
  });

  test("shows error toast on wrong credentials", async ({ page }) => {
    await mockLoginFailure(page);
    await page.getByLabel("Email").fill("wrong@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Invalid email or password.")).toBeVisible();
  });

  test("navigates to register page via Sign up link", async ({ page }) => {
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL(/\/register/);
  });

  test("successful login redirects to dashboard", async ({ page }) => {
    await mockLoginSuccess(page);
    await mockDashboardApis(page);
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe("Register page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("renders correctly", async ({ page }) => {
    await expect(page.getByText("Create your account")).toBeVisible();
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByLabel("Confirm Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Invalid email address")).toBeVisible();
  });

  test("shows error when passwords do not match", async ({ page }) => {
    await page.getByLabel("Name").fill("Juan dela Cruz");
    await page.getByLabel("Email").fill("juan@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByLabel("Confirm Password").fill("different");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("navigates to login page via Sign in link", async ({ page }) => {
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Authenticated flow", () => {
  test.beforeEach(async ({ page }) => {
    await setAuthCookie(page);
    await mockDashboardApis(page);
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("dashboard renders after login", async ({ page }) => {
    await expect(page.getByText("Dashboard")).toBeVisible();
  });

  test("sidebar navigation links are visible", async ({ page }) => {
    await expect(page.getByRole("link", { name: /products/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /categories/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /stock transactions/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /audit logs/i })).toBeVisible();
  });

  test("already-authenticated user visiting /login is redirected to dashboard", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
