import { describe, expect, it } from "vitest";

import type { IProduct } from "@/types/products";

import { matchesProductSearch } from "./matchesProductSearch";

const product: IProduct = {
  id: 42,
  title: "Crème Hydratante",
  description: "Daily face cream for sensitive skin",
  category: "skin-care",
  price: 14.99,
  discountPercentage: 0,
  rating: 4.5,
  stock: 12,
  brand: "Élan",
  tags: ["sensitive", "hydration"],
  thumbnail: "https://example.com/product.jpg",
  images: [],
};

describe("matchesProductSearch", () => {
  it("matches case-insensitively across product fields and query terms", () => {
    expect(matchesProductSearch(product, "ELAN skin creme")).toBe(true);
  });

  it("matches accents and numeric product details", () => {
    expect(matchesProductSearch(product, "hydratant 42 12")).toBe(true);
  });

  it("matches product tags", () => {
    expect(matchesProductSearch(product, "sensitive hydration")).toBe(true);
  });

  it("requires every query term and accepts an empty query", () => {
    expect(matchesProductSearch(product, "cream unavailable")).toBe(false);
    expect(matchesProductSearch(product, "   ")).toBe(true);
  });
});
