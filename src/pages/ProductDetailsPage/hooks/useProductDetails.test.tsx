import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { IProduct } from "@/types/products";
import { useProductChangesStore } from "@/stores/useProductChangesStore";

const { getProductMock } = vi.hoisted(() => ({ getProductMock: vi.fn() }));

vi.mock("@/api/products/getProduct", () => ({ getProduct: getProductMock }));

import { useProductDetails } from "./useProductDetails";

const product: IProduct = {
  id: 8,
  title: "Test product",
  description: "Product description",
  category: "test",
  price: 10,
  discountPercentage: 0,
  rating: 4,
  stock: 2,
  thumbnail: "https://example.com/product.jpg",
  images: [],
};

describe("useProductDetails", () => {
  beforeEach(() => {
    getProductMock.mockReset();
    useProductChangesStore.getState().clearProductChanges();
  });

  it("stays loading until the first product request finishes", async () => {
    let resolveProduct!: (response: { data: IProduct }) => void;
    const request = new Promise<{ data: IProduct }>((resolve) => {
      resolveProduct = resolve;
    });

    getProductMock.mockReturnValue(request);

    const { result } = renderHook(() => useProductDetails(String(product.id)));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(false);

    await act(async () => {
      resolveProduct({ data: product });
      await request;
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.effectiveProduct).toEqual(product);
    });
  });
});
