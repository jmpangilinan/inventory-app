import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "@/test/msw/server";
import LoginPage from "./page";

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/stores/auth.store", () => ({
  useAuthStore: vi.fn(() => ({
    setAuth: vi.fn(),
    isAuthenticated: false,
  })),
}));

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://inventory-api-production-8530.up.railway.app";

beforeEach(() => {
  mockPush.mockReset();
  mockReplace.mockReset();
});

describe("LoginPage", () => {
  it("renders all form fields", () => {
    renderWithClient(<LoginPage />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders sign up link", () => {
    renderWithClient(<LoginPage />);
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute("href", "/register");
  });

  it("shows validation errors on empty submit", async () => {
    renderWithClient(<LoginPage />);
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText("Invalid email address")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("redirects to /dashboard on successful login", async () => {
    const { useAuthStore } = await import("@/stores/auth.store");
    const mockSetAuth = vi.fn();
    vi.mocked(useAuthStore).mockReturnValue({
      setAuth: mockSetAuth,
      isAuthenticated: false,
    } as ReturnType<typeof useAuthStore>);

    server.use(
      http.post(`${BASE_URL}/auth/login`, () =>
        HttpResponse.json(
          { data: { id: 1, name: "Juan", email: "juan@example.com" }, token: "tok-123" },
          { status: 200 },
        ),
      ),
    );

    renderWithClient(<LoginPage />);
    await userEvent.type(screen.getByLabelText("Email"), "juan@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/dashboard"));
  });

  it("shows error toast on failed login", async () => {
    server.use(
      http.post(`${BASE_URL}/auth/login`, () =>
        HttpResponse.json({ message: "Invalid credentials" }, { status: 401 }),
      ),
    );

    const { toast } = await import("sonner");
    renderWithClient(<LoginPage />);
    await userEvent.type(screen.getByLabelText("Email"), "juan@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "wrongpassword");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("disables submit button while pending", async () => {
    server.use(
      http.post(`${BASE_URL}/auth/login`, async () => {
        await new Promise((r) => setTimeout(r, 200));
        return HttpResponse.json({}, { status: 200 });
      }),
    );

    renderWithClient(<LoginPage />);
    await userEvent.type(screen.getByLabelText("Email"), "juan@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();
  });

  it("redirects to dashboard if already authenticated", async () => {
    const { useAuthStore } = await import("@/stores/auth.store");
    vi.mocked(useAuthStore).mockReturnValue({
      setAuth: vi.fn(),
      isAuthenticated: true,
    } as ReturnType<typeof useAuthStore>);

    renderWithClient(<LoginPage />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/dashboard"));
  });
});
