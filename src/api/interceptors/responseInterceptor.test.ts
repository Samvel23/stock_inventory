import type { AxiosError } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  apiClient: vi.fn(),
  refreshAuth: vi.fn(),
  redirectToLogin: vi.fn(),
  state: {
    credentials: null as {
      accessToken: string;
      refreshToken: string;
    } | null,
    removeCredentials: vi.fn(),
    setCredentials: vi.fn(),
  },
}));

vi.mock("@/api/client/apiClient", () => ({ apiClient: mocks.apiClient }));
vi.mock("@/api/auth/refreshAuth", () => ({ refreshAuth: mocks.refreshAuth }));
vi.mock("@/stores/useUserStore", () => ({
  useUserStore: { getState: () => mocks.state },
}));
vi.mock("@/utils/auth/redirectToLogin", () => ({
  redirectToLogin: mocks.redirectToLogin,
}));

import { responseErrorInterceptor } from "./responseInterceptor";

const createUnauthorizedError = (url: string) =>
  ({
    config: { url },
    response: { status: 401 },
  }) as AxiosError;

describe("responseErrorInterceptor", () => {
  beforeEach(() => {
    mocks.apiClient.mockReset();
    mocks.refreshAuth.mockReset();
    mocks.redirectToLogin.mockReset();
    mocks.state.credentials = null;
    mocks.state.removeCredentials.mockReset();
    mocks.state.setCredentials.mockReset();
  });

  it("does not refresh or redirect for invalid login credentials", async () => {
    const error = createUnauthorizedError("/auth/login");

    await expect(responseErrorInterceptor(error)).rejects.toBe(error);

    expect(mocks.refreshAuth).not.toHaveBeenCalled();
    expect(mocks.state.removeCredentials).not.toHaveBeenCalled();
    expect(mocks.redirectToLogin).not.toHaveBeenCalled();
  });

  it("preserves credentials when refresh fails because of a network error", async () => {
    const refreshError = Object.assign(new Error("Network unavailable"), {
      isAxiosError: true,
    });
    const error = createUnauthorizedError("/products/1");

    mocks.state.credentials = {
      accessToken: "access",
      refreshToken: "refresh",
    };
    mocks.refreshAuth.mockRejectedValue(refreshError);

    await expect(responseErrorInterceptor(error)).rejects.toBe(refreshError);

    expect(mocks.state.removeCredentials).not.toHaveBeenCalled();
    expect(mocks.redirectToLogin).not.toHaveBeenCalled();
  });
});
