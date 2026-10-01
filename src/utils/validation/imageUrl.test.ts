import { describe, expect, it } from "vitest";

import { isValidImageUrl } from "./imageUrl";

describe("isValidImageUrl", () => {
  it("accepts absolute HTTP and HTTPS URLs", () => {
    expect(isValidImageUrl("https://example.com/product.webp")).toBe(true);
    expect(isValidImageUrl("http://example.com/image?id=2")).toBe(true);
  });

  it("rejects malformed, relative, and non-web URLs", () => {
    expect(isValidImageUrl("not a url")).toBe(false);
    expect(isValidImageUrl("/images/product.jpg")).toBe(false);
    expect(isValidImageUrl("javascript:alert(1)")).toBe(false);
  });
});
