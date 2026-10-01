import { useEffect, useRef, useState } from "react";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import {
  Box,
  Chip,
  Table,
  Tooltip,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableSortLabel,
} from "@mui/material";

import { useTranslation } from "react-i18next";

import { ProductImage } from "@/components/atoms/ProductImage";
import type { IProduct } from "@/types/products";

import { formatCurrency, getCurrentLanguage } from "@/language";

import { useProductChangesStore } from "@/stores/useProductChangesStore";

import {
  ProductSkeleton,
  ProductEmptyState,
  ProductErrorState,
} from "../elements";

import styles from "./ProductTable.module.scss";

interface ProductTableProps {
  products: IProduct[];
  loading: boolean;
  error: boolean;
  sortBy: string;
  order: "asc" | "desc";
  onSort: (field: string) => void;
  onRetry: () => void;
}

interface TruncatedTextProps {
  children: string;
  className?: string;
}

const TruncatedText = ({ children, className }: TruncatedTextProps) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = textRef.current;

    if (!element) {
      return;
    }

    const updateTruncation = () => {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    };

    updateTruncation();

    const resizeObserver = new ResizeObserver(updateTruncation);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [children]);

  const content = (
    <span ref={textRef} className={className}>
      {children}
    </span>
  );

  if (!isTruncated) {
    return content;
  }

  return (
    <Tooltip title={children} arrow>
      {content}
    </Tooltip>
  );
};

export const ProductTable = ({
  error,
  order,
  sortBy,
  onSort,
  onRetry,
  loading,
  products,
}: ProductTableProps) => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const language = getCurrentLanguage();

  const productChanges = useProductChangesStore(
    (state) => state.productChanges,
  );

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const handleProductKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    productId: number,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleProductClick(productId);
  };

  return (
    <Box className={styles.wrapper}>
      <Table
        className={styles.table}
        size="medium"
        aria-label={t("productTable.label")}
      >
        <colgroup>
          <col className={styles.idColumn} />
          <col className={styles.productColumn} />
          <col className={styles.categoryColumn} />
          <col className={styles.priceColumn} />
          <col className={styles.ratingColumn} />
          <col className={styles.stockColumn} />
        </colgroup>
        <TableHead>
          <TableRow className={styles.headerRow}>
            <TableCell className={styles.idCell}>
              {t("productTable.id")}
            </TableCell>

            <TableCell>{t("productTable.product")}</TableCell>

            <TableCell>{t("productTable.category")}</TableCell>

            <TableCell>
              <TableSortLabel
                active={sortBy === "price"}
                direction={sortBy === "price" ? order : "asc"}
                onClick={() => onSort("price")}
              >
                {t("productTable.price")}
              </TableSortLabel>
            </TableCell>

            <TableCell>
              <TableSortLabel
                active={sortBy === "rating"}
                direction={sortBy === "rating" ? order : "asc"}
                onClick={() => onSort("rating")}
              >
                {t("productTable.rating")}
              </TableSortLabel>
            </TableCell>

            <TableCell>
              <TableSortLabel
                active={sortBy === "stock"}
                direction={sortBy === "stock" ? order : "asc"}
                onClick={() => onSort("stock")}
              >
                {t("productTable.stock")}
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && products.length === 0 ? (
            <ProductSkeleton />
          ) : error ? (
            <ProductErrorState onRetry={onRetry} />
          ) : products.length === 0 ? (
            <ProductEmptyState />
          ) : (
            products.map((product) => {
              const isModified = Boolean(productChanges[product.id]);

              return (
                <TableRow
                  key={product.id}
                  className={styles.row}
                  hover
                  tabIndex={0}
                  onClick={() => handleProductClick(product.id)}
                  onKeyDown={(event) => handleProductKeyDown(event, product.id)}
                  aria-label={product.title}
                >
                  <TableCell className={styles.idCell}>{product.id}</TableCell>

                  <TableCell>
                    <Box className={styles.product}>
                      <ProductImage
                        src={product.thumbnail}
                        alt=""
                        className={styles.thumbnail}
                      />

                      <Box className={styles.productInfo}>
                        <Tooltip
                          title={product.title}
                          arrow
                          disableHoverListener
                        >
                          <Typography
                            component={RouterLink}
                            to={`/products/${product.id}`}
                            variant="body2"
                            className={styles.productTitle}
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                          >
                            <TruncatedText className={styles.truncatedText}>
                              {product.title}
                            </TruncatedText>
                          </Typography>
                        </Tooltip>

                        {product.brand && (
                          <TruncatedText className={styles.brand}>
                            {product.brand}
                          </TruncatedText>
                        )}

                        {isModified && (
                          <Chip
                            label={t("productTable.modifiedLocally")}
                            size="small"
                            color="warning"
                            className={styles.localChip}
                          />
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box className={styles.category}>
                      <TruncatedText className={styles.categoryText}>
                        {product.category}
                      </TruncatedText>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" className={styles.price}>
                      {formatCurrency(product.price, language)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box className={styles.rating}>
                      <Typography variant="body2">★</Typography>

                      <Typography
                        variant="body2"
                        className={styles.ratingValue}
                      >
                        {product.rating}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography
                      component="span"
                      className={`${styles.stockValue} ${
                        product.stock > 0
                          ? styles.stockAvailable
                          : styles.stockUnavailable
                      }`}
                    >
                      {new Intl.NumberFormat(language).format(product.stock)}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Box>
  );
};
