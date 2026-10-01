import { Box, Chip, Divider, Rating, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { formatCurrency, getCurrentLanguage } from "@/language";
import type { IProduct } from "@/types/products";

import styles from "./ProductInfo.module.scss";

interface ProductInfoProps {
  product: IProduct;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const language = getCurrentLanguage();

  return (
    <Stack className={styles.info}>
      <Box>
        <Typography variant="h4" className={styles.title}>
          {product.title}
        </Typography>

        {product.brand && (
          <Typography
            variant="body2"
            color="text.secondary"
            className={styles.brand}
          >
            {product.brand}
          </Typography>
        )}
      </Box>

      <Stack className={styles.chips}>
        <Chip
          label={product.category}
          size="small"
          onClick={() => {
            const params = new URLSearchParams({ category: product.category });

            navigate(`/products?${params.toString()}`);
          }}
        />

        <Chip
          label={
            product.stock > 0
              ? t("productInfo.inStock", {
                  count: product.stock,
                })
              : t("productInfo.outOfStock")
          }
          size="small"
          color={product.stock > 0 ? "success" : "error"}
          variant="outlined"
        />

        <Chip
          label={t("productInfo.rating", {
            rating: product.rating,
          })}
          size="small"
          variant="outlined"
        />
      </Stack>

      <Box className={styles.rating}>
        <Rating value={product.rating} precision={0.1} readOnly />

        <Typography variant="body2" color="text.secondary">
          {product.rating} / 5
        </Typography>
      </Box>

      <Divider />

      <Typography
        variant="body1"
        color="text.secondary"
        className={styles.description}
      >
        {product.description}
      </Typography>

      <Box>
        <Typography variant="h5" className={styles.price}>
          {formatCurrency(product.price, language)}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {t("productInfo.currentPrice")}
        </Typography>
      </Box>
    </Stack>
  );
};
