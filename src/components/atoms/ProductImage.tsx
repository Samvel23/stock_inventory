import { useState, type ImgHTMLAttributes } from "react";

interface ProductImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "onError"
> {
  src?: string | null;
}

const fallbackSource = `${import.meta.env.BASE_URL}product-placeholder.svg`;

export const ProductImage = ({ src, ...props }: ProductImageProps) => {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const imageSource = src?.trim() ?? "";
  const useFallback = !imageSource || imageSource === failedSource;

  return (
    <img
      {...props}
      src={useFallback ? fallbackSource : imageSource}
      onError={() => {
        if (!useFallback) {
          setFailedSource(imageSource);
        }
      }}
    />
  );
};
