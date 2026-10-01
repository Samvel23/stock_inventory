import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getCategoriesMock } = vi.hoisted(() => ({
  getCategoriesMock: vi.fn(),
}));

vi.mock("@/api/products", () => ({ getCategories: getCategoriesMock }));

import { clearCategoriesCache } from "@/utils/products/productDataCache";

import { useCategories } from "./useCategories";

describe("useCategories", () => {
  beforeEach(() => {
    clearCategoriesCache();
    getCategoriesMock.mockReset();
  });

  it("allows a failed category request to be retried", async () => {
    getCategoriesMock
      .mockRejectedValueOnce(new Error("Network unavailable"))
      .mockResolvedValueOnce({
        data: [
          {
            slug: "skin-care",
            name: "Skin care",
            url: "https://example.com/categories/skin-care",
          },
        ],
      });

    const { result } = renderHook(() => useCategories());

    await waitFor(() => expect(result.current.error).toBe(true));

    act(() => result.current.retry());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(false);
      expect(result.current.categories).toHaveLength(1);
    });
  });
});
