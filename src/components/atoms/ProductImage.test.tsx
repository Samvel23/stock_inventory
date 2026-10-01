import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductImage } from "./ProductImage";

describe("ProductImage", () => {
  it("shows the local fallback when the image fails to load", () => {
    render(
      <ProductImage src="https://example.com/missing.jpg" alt="Product" />,
    );

    const image = screen.getByRole("img", { name: "Product" });

    fireEvent.error(image);

    expect(image.getAttribute("src")).toContain("product-placeholder.svg");
  });
});
