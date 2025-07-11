import { cn } from "#lib/utils";
import { Shield, Smile, Truck } from "lucide-react";
import React from "react";

interface InfoBannerProps extends React.HTMLAttributes<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
}

const infoItems = [
  {
    icon: Truck,
    title: "AYNI GÜN KARGO",
    description: "16:00'DAN ÖNCEKİ SİPARİŞLERDE"
  },
  {
    icon: Smile,
    title: "ÜCRETSİZ KARGO",
    description: "100 TL ÜZERİ ALIŞVERİŞLERDE"
  },
  {
    icon: Shield,
    title: "GÜVENLİ ALIŞVERİŞ",
    description: "1.000.000+ MUTLU MÜŞTERİ"
  }
];

export const InfoBanner = ({
  className,
  ...props
}: InfoBannerProps) => {
  return (
    <div
      className={cn(
        // 768px altında gizli, üstünde görünür
        "hidden md:block",
        // Background ve border
        "bg-gray-50 border-b border-gray-200",
        // Header ile aynı padding değerleri
        "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20",
        "py-3",
        className,
      )}
      {...props}
    >
      {/* Container for centering */}
      <div className="w-full max-w-7xl mx-auto">
        {/* Info Items */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 sm:gap-6 lg:gap-8">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 text-center sm:text-left">
              {/* Icon */}
              <item.icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
              
              {/* Text Content */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1">
                <span className="text-xs font-semibold text-gray-800 whitespace-nowrap">
                  {item.title}
                </span>
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  {item.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

InfoBanner.displayName = "InfoBanner"; 