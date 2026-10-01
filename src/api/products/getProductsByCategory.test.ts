import { expect, it, vi } from "vitest";

const { get } = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("../client", () => ({ apiClient: { get } }));

import { getProductsByCategory } from "./getProductsByCategory";

it("encodes category path segments", () => {
  getProductsByCategory({ category: "skin care/face" });

  expect(get).toHaveBeenCalledWith("/products/category/skin%20care%2Fface", {
    params: {
      limit: 10,
      skip: 0,
    },
    signal: undefined,
  });
});
