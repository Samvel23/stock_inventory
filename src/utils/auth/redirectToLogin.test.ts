import { describe, expect, it } from "vitest";

import { getLoginHash } from "./redirectToLogin";

describe("getLoginHash", () => {
  it("preserves the current hash route in the login redirect", () => {
    expect(getLoginHash("/products/12?tab=reviews")).toBe(
      "/login?redirect=%2Fproducts%2F12%3Ftab%3Dreviews",
    );
  });
});
