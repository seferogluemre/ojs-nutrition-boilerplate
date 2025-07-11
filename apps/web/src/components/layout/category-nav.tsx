import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { cn } from "#lib/utils";
import { Search } from "lucide-react";
import React from "react";

interface CategoryNavProps extends React.HTMLAttributes<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
}

const categories = [
  "Proteinler",
  "Spor Gıdaları", 
  "Sağlık",
  "Gıda",
  "Vitamin",
  "Tüm Ürünler"
];

export const CategoryNav = ({
  className,
  ...props
}: CategoryNavProps) => {
  return (
    <nav
      className={cn(
        // Desktop/Tablet: gri arkaplan, Mobile: beyaz arkaplan
        "bg-white md:bg-gray-900 text-white md:border-t md:border-gray-800",
        // Header ile aynı padding değerleri
        "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20",
        "py-0 md:py-3",
        className,
      )}
      {...props}
    >
      {/* Desktop/Tablet Kategori Links - 768px üzeri */}
      <div className="hidden md:flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto">
          <ul className="flex items-center justify-between w-full px-6 lg:px-8 xl:px-12 2xl:px-16">
            {categories.map((category) => (
              <li key={category}>
                <a
                  href="#"
                  className="text-white hover:text-gray-300 transition-colors duration-200 font-medium text-sm lg:text-base whitespace-nowrap"
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Search Bar - 768px altı */}
      <div className="md:hidden bg-white px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 rounded-xl" />
          <Input
            type="text"
            placeholder="ARADIĞINIZ ÜRÜNÜ YAZINIZ..."
            className="w-full pl-10 pr-16 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 h-6 text-xs"
          >
            ARA
          </Button>
        </div>
      </div>
    </nav>
  );
};

CategoryNav.displayName = "CategoryNav"; 