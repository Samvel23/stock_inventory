import { useState } from "react";

import { Box, Stack } from "@mui/material";

import { ProductImage } from "@/components/atoms/ProductImage";
import type { IProduct } from "@/types/products";

import styles from "./ProductGallery.module.scss";

interface ProductGalleryProps {
  product: IProduct;
}

const ProductGalleryContent = ({ product }: ProductGalleryProps) => {
  const productImages = Array.isArray(product.images)
    ? product.images.filter(
        (image): image is string =>
          typeof image === "string" && Boolean(image.trim()),
      )
    : [];
  const thumbnail =
    typeof product.thumbnail === "string" ? product.thumbnail : "";
  const images = productImages.length > 0 ? productImages : [thumbnail];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const activeImage = images.includes(selectedImage)
    ? selectedImage
    : images[0];

  return (
    <Box className={styles.gallery}>
      <Box className={styles.mainImageWrapper}>
        <ProductImage
          src={activeImage}
          alt={product.title}
          className={styles.mainImage}
        />
      </Box>

      <Stack className={styles.thumbnails}>
        {images.map((image, index) => {
          const isSelected = activeImage === image;

          return (
            <Box
              key={`${image}-${index}`}
              component="button"
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`${styles.thumbnail} ${
                isSelected ? styles.thumbnailSelected : ""
              }`}
            >
              <ProductImage
                src={image}
                alt={`${product.title} ${index + 1}`}
                className={styles.thumbnailImage}
              />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export const ProductGallery = ({ product }: ProductGalleryProps) => (
  <ProductGalleryContent key={product.id} product={product} />
);
