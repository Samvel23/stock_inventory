import { describe, expect, it } from "vitest";

import { parseLimitParam, parsePageParam } from "./useProductParams";

describe("product pagination query params", () => {
  it("falls back for invalid and negative page numbers", () => {
    expect(parsePageParam("abc")).toBe(0);
    expect(parsePageParam("-1")).toBe(0);
    expect(parsePageParam("3")).toBe(3);
  });

  it("accepts supported page sizes and rejects zero or unsupported sizes", () => {
    expect(parseLimitParam("0")).toBe(10);
    expect(parseLimitParam("7")).toBe(10);
    expect(parseLimitParam("20")).toBe(20);
  });
});
