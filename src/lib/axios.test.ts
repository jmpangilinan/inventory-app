import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/test/msw/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://inventory-api-production-8530.up.railway.app";

describe("axios response interceptor — 401 redirect", () => {
  it("rejects with error on 401 from a non-auth endpoint", async () => {
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.json({}, { status: 401 })));

    const { axiosInstance } = await import("./axios");
    let caught: unknown;
    try {
      await axiosInstance({ method: "GET", url: `${BASE_URL}/products` });
    } catch (e) {
      caught = e;
    }

    expect((caught as { response?: { status: number } })?.response?.status).toBe(401);
  });

  it("rejects with error on 401 from an auth endpoint", async () => {
    server.use(
      http.post(`${BASE_URL}/auth/login`, () =>
        HttpResponse.json({ message: "Invalid credentials" }, { status: 401 }),
      ),
    );

    const { axiosInstance } = await import("./axios");
    let caught: unknown;
    try {
      await axiosInstance({ method: "POST", url: `${BASE_URL}/auth/login` });
    } catch (e) {
      caught = e;
    }

    expect((caught as { response?: { status: number } })?.response?.status).toBe(401);
  });
});
