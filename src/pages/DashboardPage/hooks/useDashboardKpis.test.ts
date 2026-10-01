import { describe, expect, it } from "vitest";

import type { IProduct } from "@/types/products";

import { getDashboardKpis } from "./useDashboardKpis";

const makeProduct = (id: number, rating: number): IProduct => ({
  id,
  title: `Product ${id}`,
  description: "Product description",
  category: "test",
  price: 10,
  discountPercentage: 0,
  rating,
  stock: 5,
  thumbnail: "",
  images: [],
});

describe("getDashboardKpis", () => {
  it("does not count unrated products in the average rating", () => {
    const result = getDashboardKpis([makeProduct(1, 4), makeProduct(2, 0)]);

    expect(result.averageRating).toBe(4);
  });
});
