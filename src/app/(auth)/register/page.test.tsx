import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "@/test/msw/server";
import RegisterPage from "./page";

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

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://inventory-api-production-8530.up.railway.app";

const validData = {
  name: "Juan dela Cruz",
  email: "juan@example.com",
  password: "password123",
  password_confirmation: "password123",
};

beforeEach(() => {
  mockPush.mockReset();
  mockReplace.mockReset();
});

describe("RegisterPage", () => {
  it("renders all form fields", () => {
    renderWithClient(<RegisterPage />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("renders sign in link", () => {
    renderWithClient(<RegisterPage />);
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/login");
  });

  it("shows validation errors on empty submit", async () => {
    renderWithClient(<RegisterPage />);
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));
    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    renderWithClient(<RegisterPage />);
    await userEvent.type(screen.getByLabelText("Name"), validData.name);
    await userEvent.type(screen.getByLabelText("Email"), validData.email);
    await userEvent.type(screen.getByLabelText("Password"), validData.password);
    await userEvent.type(screen.getByLabelText("Confirm Password"), "different");
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));
    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
  });

  it("redirects to /login on successful registration", async () => {
    server.use(
      http.post(`${BASE_URL}/auth/register`, () =>
        HttpResponse.json(
          { data: { id: 1, name: validData.name, email: validData.email } },
          { status: 201 },
        ),
      ),
    );

    renderWithClient(<RegisterPage />);
    await userEvent.type(screen.getByLabelText("Name"), validData.name);
    await userEvent.type(screen.getByLabelText("Email"), validData.email);
    await userEvent.type(screen.getByLabelText("Password"), validData.password);
    await userEvent.type(
      screen.getByLabelText("Confirm Password"),
      validData.password_confirmation,
    );
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/login"));
  });

  it("shows error toast on failed registration", async () => {
    server.use(
      http.post(`${BASE_URL}/auth/register`, () =>
        HttpResponse.json({ message: "Email already taken" }, { status: 422 }),
      ),
    );

    const { toast } = await import("sonner");
    renderWithClient(<RegisterPage />);
    await userEvent.type(screen.getByLabelText("Name"), validData.name);
    await userEvent.type(screen.getByLabelText("Email"), validData.email);
    await userEvent.type(screen.getByLabelText("Password"), validData.password);
    await userEvent.type(
      screen.getByLabelText("Confirm Password"),
      validData.password_confirmation,
    );
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("disables submit button while pending", async () => {
    server.use(
      http.post(`${BASE_URL}/auth/register`, async () => {
        await new Promise((r) => setTimeout(r, 200));
        return HttpResponse.json({}, { status: 201 });
      }),
    );

    renderWithClient(<RegisterPage />);
    await userEvent.type(screen.getByLabelText("Name"), validData.name);
    await userEvent.type(screen.getByLabelText("Email"), validData.email);
    await userEvent.type(screen.getByLabelText("Password"), validData.password);
    await userEvent.type(
      screen.getByLabelText("Confirm Password"),
      validData.password_confirmation,
    );
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByRole("button", { name: /creating account/i })).toBeDisabled();
  });
});
