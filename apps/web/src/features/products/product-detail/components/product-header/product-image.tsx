interface ProductImageProps {
  src: string;
  alt: string;
}

export function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md lg:max-w-lg">
        <img
          src={src === "null" ? "/images/collagen.jpg" : src}
          alt={alt}
          className="w-full h-auto object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
} 