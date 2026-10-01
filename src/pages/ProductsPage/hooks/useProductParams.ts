import { useSearchParams } from "react-router-dom";
import type { SelectChangeEvent } from "@mui/material";

const validPageSizes = new Set([5, 10, 20, 30]);

export const parsePageParam = (value: string | null) => {
  const page = Number(value ?? 0);

  return Number.isSafeInteger(page) && page >= 0 ? page : 0;
};

export const parseLimitParam = (value: string | null) => {
  const limit = Number(value ?? 10);

  return validPageSizes.has(limit) ? limit : 10;
};

export const useProductParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parsePageParam(searchParams.get("page"));
  const limit = parseLimitParam(searchParams.get("limit"));

  const sortBy = searchParams.get("sortBy") ?? "";

  const orderParam = searchParams.get("order") as "asc" | "desc";
  const order: "asc" | "desc" = orderParam === "desc" ? "desc" : "asc";

  const category = searchParams.get("category");
  const search = searchParams.get("search") ?? "";

  const updateParams = (changes: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(changes).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  };

  const handleSort = (field: string) => {
    const newOrder = field === sortBy && order === "asc" ? "desc" : "asc";

    updateParams({
      page: "0",
      limit: String(limit),
      sortBy: field,
      order: newOrder,
    });
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    updateParams({
      page: String(newPage),
      limit: String(limit),
    });
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    const newCategory = event.target.value;

    updateParams({
      page: "0",
      limit: String(limit),
      category: newCategory || null,
    });
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateParams({
      page: "0",
      limit: event.target.value,
    });
  };

  return {
    page,
    limit,
    sortBy,
    order,
    category,
    search,
    searchParams,
    setSearchParams,
    handleSort,
    handlePageChange,
    handleCategoryChange,
    handleRowsPerPageChange,
  };
};
