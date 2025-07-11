import { cn } from "#lib/utils";
import React from "react";

interface SecondaryBannerProps extends React.HTMLAttributes<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
}

export const SecondaryBanner = ({
  className,
  ...props
}: SecondaryBannerProps) => {
  return (
    <div
      className={cn(
        // Full width banner with no margins/padding
        "w-full m-0 p-0",
        // Responsive heights - 480px on desktop, scaled down for smaller screens
        "h-[300px] md:h-[400px] lg:h-[480px]",
        // Background image - cover to fill entire space
        "bg-cover bg-center bg-no-repeat",
        // Ensure no overflow
        "overflow-hidden",
        className,
      )}
      style={{
        backgroundImage: "url('/images/banner2.png')"
      }}
      {...props}
    >
      {/* Banner content - currently empty as requested */}
    </div>
  );
};

SecondaryBanner.displayName = "SecondaryBanner"; 