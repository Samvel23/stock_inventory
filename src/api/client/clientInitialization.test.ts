import { describe, expect, it } from "vitest";

import { apiClient } from "./index";

describe("API client initialization", () => {
  it("loads the configured client and interceptors without an import cycle", () => {
    expect(apiClient).toBeDefined();
  });
});
