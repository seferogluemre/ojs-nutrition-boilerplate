import React, { useMemo, useState } from "react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt: string;
  fallbackSrcs?: string[];
  fallbackSrc?: string;
  randomizeFallback?: boolean;
}

export function SafeImage({
  src,
  alt,
  className,
  fallbackSrcs,
  fallbackSrc,
  randomizeFallback = true,
  ...imgProps
}: SafeImageProps) {
  const defaultFallbacks = useMemo(
    () => fallbackSrcs || ["/images/saglik.jpg", "/images/collagen.jpg", "/images/protein.jpg"],
    [fallbackSrcs],
  );

  const pickFallback = () => {
    if (fallbackSrc) return fallbackSrc;
    if (!randomizeFallback) return defaultFallbacks[0];
    const index = Math.floor(Math.random() * defaultFallbacks.length);
    return defaultFallbacks[index];
  };

  const isValidSrc = (value?: string | null) => {
    if (!value) return false;
    const trimmed = value.toString().trim();
    return trimmed !== "" && trimmed.toLowerCase() !== "null";
  };

  const [currentSrc, setCurrentSrc] = useState<string>(
    () => (isValidSrc(src) ? (src as string) : pickFallback()),
  );

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setCurrentSrc(pickFallback())}
      {...imgProps}
    />
  );
}


