import { useEffect, useMemo, useState } from "react";

import { getProduct } from "@/api/products/getProduct";

import { useProductChangesStore } from "@/stores/useProductChangesStore";

import { mergeProductChanges } from "@/utils/products/mergeProductChanges";

import type { IProduct } from "@/types/products";

interface IFetchedProductState {
  productId: number | null;
  product: IProduct | null;
  error: boolean;
}

export const useProductDetails = (id?: string) => {
  const productChanges = useProductChangesStore(
    (state) => state.productChanges,
  );

  const createdProducts = useProductChangesStore(
    (state) => state.createdProducts,
  );

  const deletedProducts = useProductChangesStore(
    (state) => state.deletedProducts,
  );

  const deletedProductIds = useMemo(
    () => deletedProducts.map((product) => product.id),
    [deletedProducts],
  );

  const productId = Number(id);

  const isValidProductId = Number.isInteger(productId) && productId > 0;

  const isDeleted = isValidProductId
    ? deletedProductIds.includes(productId)
    : false;

  const localProduct =
    isValidProductId && !isDeleted
      ? (createdProducts.find((item) => item.id === productId) ?? null)
      : null;

  const shouldFetch = isValidProductId && !isDeleted && !localProduct;

  const [fetchedState, setFetchedState] = useState<IFetchedProductState>(
    () => ({
      productId: null,
      product: null,
      error: false,
    }),
  );

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }

    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        const response = await getProduct({
          id: productId,
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        setFetchedState({
          productId,
          product: response.data,
          error: false,
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Error getting product", error);

        setFetchedState({
          productId,
          product: null,
          error: true,
        });
      }
    };

    void fetchProduct();

    return () => {
      controller.abort();
    };
  }, [productId, shouldFetch]);

  const hasCurrentFetchedProduct =
    fetchedState.productId === productId && fetchedState.product !== null;

  const hasCurrentFetchError =
    fetchedState.productId === productId && fetchedState.error;

  const fetchedProduct = hasCurrentFetchedProduct ? fetchedState.product : null;

  const product = localProduct ?? fetchedProduct;

  const effectiveProduct = product
    ? mergeProductChanges(product, productChanges[product.id] ?? {})
    : null;

  const loading =
    shouldFetch &&
    fetchedState.productId !== productId &&
    !hasCurrentFetchError;

  const error =
    !isValidProductId ||
    isDeleted ||
    (!localProduct && !fetchedProduct && hasCurrentFetchError);

  return {
    product,
    effectiveProduct,
    loading,
    error,
  };
};
