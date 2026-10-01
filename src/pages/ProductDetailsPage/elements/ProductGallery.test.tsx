import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { IProduct } from "@/types/products";

import { ProductGallery } from "./ProductGallery";

const product: IProduct = {
  id: 8,
  title: "Test product",
  description: "Product description",
  category: "test",
  price: 10,
  discountPercentage: 0,
  rating: 4,
  stock: 2,
  thumbnail: "https://example.com/one.jpg",
  images: ["https://example.com/one.jpg", "https://example.com/two.jpg"],
};

describe("ProductGallery", () => {
  it("selects a current image when the product image URLs change", () => {
    const { rerender } = render(<ProductGallery product={product} />);

    fireEvent.click(screen.getByRole("button", { name: "Test product 2" }));

    const updatedProduct = {
      ...product,
      thumbnail: "https://example.com/updated.jpg",
      images: ["https://example.com/updated.jpg"],
    };

    rerender(<ProductGallery product={updatedProduct} />);

    expect(
      screen.getByRole("img", { name: "Test product" }).getAttribute("src"),
    ).toBe("https://example.com/updated.jpg");
  });
});
