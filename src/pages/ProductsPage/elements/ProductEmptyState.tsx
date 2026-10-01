import { TableCell, TableRow, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import styles from "./ProductEmptyState.module.scss";

export const ProductEmptyState = () => {
  const { t } = useTranslation();

  return (
    <TableRow>
      <TableCell colSpan={6} className={styles.cell}>
        <Typography variant="body1" className={styles.title}>
          {t("productsPage.noProducts")}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {t("productsPage.noProductsDescription")}
        </Typography>
      </TableCell>
    </TableRow>
  );
};
