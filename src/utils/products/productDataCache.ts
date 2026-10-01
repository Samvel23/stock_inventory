import type { ICategory, IProductsResponse } from "@/types/products";

interface IProductsCacheEntry {
  response: IProductsResponse;
  expiresAt: number;
}

const MAX_PRODUCT_CACHE_ENTRIES = 100;
const PRODUCT_CACHE_TTL_MS = 60_000;
const productsCache = new Map<string, IProductsCacheEntry>();
let productsCacheVersion = 0;

let categoriesCache: ICategory[] | null = null;
let categoriesPromise: Promise<ICategory[]> | null = null;
let categoriesCacheVersion = 0;

export const getProductsCacheKey = ({
  page,
  limit,
  sortBy,
  order,
  category,
  search,
  userId,
}: {
  page: number;
  limit: number;
  sortBy: string;
  order: "asc" | "desc";
  category: string | null;
  search: string;
  userId?: number | null;
}) =>
  JSON.stringify({
    page,
    limit,
    sortBy,
    order,
    category,
    search,
    userId,
  });

export const getCachedProducts = (key: string) => {
  const entry = productsCache.get(key);

  if (!entry) {
    return undefined;
  }

  if (entry.expiresAt <= Date.now()) {
    productsCache.delete(key);
    return undefined;
  }

  productsCache.delete(key);
  productsCache.set(key, entry);

  return entry.response;
};

export const setCachedProducts = (
  key: string,
  response: IProductsResponse,
  version = productsCacheVersion,
) => {
  if (version === productsCacheVersion) {
    productsCache.delete(key);
    productsCache.set(key, {
      response,
      expiresAt: Date.now() + PRODUCT_CACHE_TTL_MS,
    });

    while (productsCache.size > MAX_PRODUCT_CACHE_ENTRIES) {
      const oldestKey = productsCache.keys().next().value;

      if (oldestKey === undefined) {
        break;
      }

      productsCache.delete(oldestKey);
    }
  }
};

export const getProductsCacheVersion = () => productsCacheVersion;

export const clearProductsCache = () => {
  productsCache.clear();
  productsCacheVersion += 1;
};

export const getCachedCategories = () => categoriesCache;

export const setCachedCategories = (
  categories: ICategory[],
  version = categoriesCacheVersion,
) => {
  if (version === categoriesCacheVersion) {
    categoriesCache = categories;
  }
};

export const getCategoriesPromise = () => categoriesPromise;

export const setCategoriesPromise = (
  promise: Promise<ICategory[]> | null,
  version = categoriesCacheVersion,
) => {
  if (version === categoriesCacheVersion) {
    categoriesPromise = promise;
  }
};

export const getCategoriesCacheVersion = () => categoriesCacheVersion;

export const clearCategoriesCache = () => {
  categoriesCache = null;
  categoriesPromise = null;
  categoriesCacheVersion += 1;
};

export const clearProductDataCaches = () => {
  clearProductsCache();
  clearCategoriesCache();
};
