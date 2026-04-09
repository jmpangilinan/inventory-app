import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "./auth.store";

const mockUser = { id: 1, name: "John Doe", email: "john@example.com", roles: ["admin"] };
const mockToken = "test-token-123";

beforeEach(() => {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
});

describe("useAuthStore", () => {
  it("initialises unauthenticated", () => {
    const { user, token, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
    expect(isAuthenticated).toBe(false);
  });

  it("setAuth stores user and token", () => {
    useAuthStore.getState().setAuth(mockUser, mockToken);
    const { user, token, isAuthenticated } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(token).toBe(mockToken);
    expect(isAuthenticated).toBe(true);
  });

  it("clearAuth removes user and token", () => {
    useAuthStore.getState().setAuth(mockUser, mockToken);
    useAuthStore.getState().clearAuth();
    const { user, token, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
    expect(isAuthenticated).toBe(false);
  });
});
