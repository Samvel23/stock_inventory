import type { IProduct } from "@/types/products";

const normalizeSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

export const matchesProductSearch = (product: IProduct, query: string) => {
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean);

  if (terms.length === 0) {
    return true;
  }

  const searchableText = normalizeSearchText(
    [
      product.title,
      product.description,
      product.category,
      product.brand ?? "",
      ...(product.tags ?? []),
      String(product.id),
      String(product.price),
      String(product.stock),
      String(product.rating),
    ].join(" "),
  );

  return terms.every((term) => searchableText.includes(term));
};
