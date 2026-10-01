import type { ICategory, IProductsResponse } from "@/types/products";

const productsCache = new Map<string, IProductsResponse>();
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

export const getCachedProducts = (key: string) => productsCache.get(key);

export const setCachedProducts = (
  key: string,
  response: IProductsResponse,
  version = productsCacheVersion,
) => {
  if (version === productsCacheVersion) {
    productsCache.set(key, response);
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
