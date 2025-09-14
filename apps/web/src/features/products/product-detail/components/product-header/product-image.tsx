import { SafeImage } from "#components/ui/safe-image.js";
import { useMemo } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
}

export function ProductImage({ src, alt }: ProductImageProps) {
  const fallbackImages = [
    "/images/saglik.jpg",
    "/images/collagen.jpg",
    "/images/protein.jpg",
  ];

  const randomImage = useMemo(() => {
    const index = Math.floor(Math.random() * fallbackImages.length);
    return fallbackImages[index];
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md lg:max-w-lg">
        <SafeImage
          src={src}
          alt={alt}
          className="w-full h-auto object-cover rounded-lg shadow-lg"
        />

        {/* Ek rastgele görsel */}
        <div className="mt-4">
          <SafeImage
            src={randomImage}
            alt="Rastgele görsel"
            className="w-full h-auto object-cover rounded-md border border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>
    </div>
  );
} 