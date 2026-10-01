import { useEffect, useState } from "react";

import { getCategories } from "@/api/products";

import type { ICategory } from "@/types/products";

import {
  getCachedCategories,
  getCategoriesCacheVersion,
  getCategoriesPromise,
  setCachedCategories,
  setCategoriesPromise,
} from "@/utils/products/productDataCache";

export const useCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>(
    () => getCachedCategories() ?? [],
  );

  const [loading, setLoading] = useState(() => getCachedCategories() === null);

  const [error, setError] = useState(false);

  useEffect(() => {
    const cachedCategories = getCachedCategories();
    let active = true;
    const cacheVersion = getCategoriesCacheVersion();
    let request =
      cachedCategories === null
        ? getCategoriesPromise()
        : Promise.resolve(cachedCategories);

    if (!request) {
      request = getCategories()
        .then((response) => {
          setCachedCategories(response.data, cacheVersion);

          return response.data;
        })
        .finally(() => {
          setCategoriesPromise(null, cacheVersion);
        });

      setCategoriesPromise(request, cacheVersion);
    }

    request
      .then((data) => {
        if (!active) {
          return;
        }

        setCategories(data);
        setError(false);
        setLoading(false);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setError(true);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return {
    categories,
    loading,
    error,
  };
};
