import { cn } from "#lib/utils";
import React from "react";

interface HeroBannerProps extends React.HTMLAttributes<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
}

export const HeroBanner = ({
  className,
  ...props
}: HeroBannerProps) => {
  return (
    <div
      className={cn(
        // Full width banner with no margins/padding
        "w-full m-0 p-0",
        // Responsive heights
        "h-[400px] md:h-[500px] lg:h-[630px]",
        // Background image - cover to fill entire space
        "bg-cover bg-center bg-no-repeat",
        // Background image path
        "bg-[url('/images/banner.png')]",
        // Ensure no overflow
        "overflow-hidden",
        className,
      )}
      style={{
        backgroundImage: "url('/images/banner.png')"
      }}
      {...props}
    >
    </div>
  );
};

HeroBanner.displayName = "HeroBanner"; 