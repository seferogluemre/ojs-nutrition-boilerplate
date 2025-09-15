import { SafeImage } from "#components/ui/safe-image.js";
import { useMemo, useState } from "react";
import { ProductPhoto, ProductVariant } from "../../types";

interface ProductImageProps {
  photos: ProductPhoto[];
  primaryPhotoUrl?: string;
  alt: string;
  selectedVariant?: ProductVariant | null;
}

export function ProductImage({ photos, primaryPhotoUrl, alt, selectedVariant }: ProductImageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Determine the main image source
  const mainImageSrc = useMemo(() => {
    // If a variant is selected and has a photo, use it
    if (selectedVariant?.photo_src) {
      return selectedVariant.photo_src;
    }
    
    // If there are photos in the array, use the selected one or primary
    if (photos && photos.length > 0) {
      const primaryPhoto = photos.find(photo => photo.isPrimaryPhoto);
      if (primaryPhoto) {
        return primaryPhoto.url;
      }
      return photos[selectedImageIndex]?.url || photos[0]?.url;
    }
    
    // Fall back to primaryPhotoUrl
    return primaryPhotoUrl || '';
  }, [photos, primaryPhotoUrl, selectedVariant, selectedImageIndex]);

  // Get thumbnail images (exclude the main image if it's from photos array)
  const thumbnailImages = useMemo(() => {
    if (!photos || photos.length <= 1) return [];
    return photos.sort((a, b) => a.order - b.order);
  }, [photos]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Main Image */}
      <div className="flex justify-center">
        <div className="w-full h-100 max-w-md lg:max-w-lg">
          <SafeImage
            src={mainImageSrc}
            alt={alt}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Thumbnail Images */}
      {thumbnailImages.length > 1 && (
        <div className="flex justify-center">
          <div className="flex space-x-2 overflow-x-auto max-w-md lg:max-w-lg">
            {thumbnailImages.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <SafeImage
                  src={photo.url}
                  alt={`${alt} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 