import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { IProductsResponse } from "@/types/products";

import {
  clearProductDataCaches,
  clearProductsCache,
  getCachedCategories,
  getCachedProducts,
  getProductsCacheKey,
  getProductsCacheVersion,
  getCategoriesCacheVersion,
  setCachedCategories,
  setCachedProducts,
} from "./productDataCache";

const emptyResponse: IProductsResponse = {
  products: [],
  total: 0,
  skip: 0,
  limit: 10,
};

describe("product data cache", () => {
  beforeEach(() => clearProductDataCaches());
  afterEach(() => vi.useRealTimers());

  it("scopes list responses by account", () => {
    const sharedParams = {
      page: 0,
      limit: 10,
      sortBy: "",
      order: "asc" as const,
      category: null,
      search: "",
    };

    expect(getProductsCacheKey({ ...sharedParams, userId: 1 })).not.toBe(
      getProductsCacheKey({ ...sharedParams, userId: 2 }),
    );
  });

  it("rejects an in-flight response after product cache invalidation", () => {
    const version = getProductsCacheVersion();

    clearProductsCache();
    setCachedProducts("page", emptyResponse, version);

    expect(getCachedProducts("page")).toBeUndefined();
  });

  it("expires entries and bounds the cache to the most recent 100 queries", () => {
    vi.useFakeTimers();

    setCachedProducts("expired", emptyResponse);
    vi.advanceTimersByTime(60_000);
    expect(getCachedProducts("expired")).toBeUndefined();

    for (let index = 0; index <= 100; index += 1) {
      setCachedProducts(`page-${index}`, emptyResponse);
    }

    expect(getCachedProducts("page-0")).toBeUndefined();
    expect(getCachedProducts("page-100")).toEqual(emptyResponse);
  });

  it("clears category data along with product data", () => {
    const version = getCategoriesCacheVersion();

    setCachedCategories([], version);
    clearProductDataCaches();

    expect(getCachedCategories()).toBeNull();
  });
});
