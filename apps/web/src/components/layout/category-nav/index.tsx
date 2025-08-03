import type { CategoriesApiResponse, Category } from "#components/layout/mobile-sidebar/types";
import { useDebounce } from "#hooks/use-debounce";
import { api } from "#lib/api.js";
import { cn } from "#lib/utils";
import { SearchProps } from "#types/search";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { CategoryDropdown } from "./category-dropdown";
import { CategoryItem } from "./category-item";
import { MobileSearchBar } from "./mobile-search-bar";

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
  // Search states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchProps[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Category dropdown states
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch categories from API
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await (api as any).categories.get();
      return response.data as CategoriesApiResponse;
    },
  });

  const { data: searchData } = useQuery({
    queryKey: ["search-products-category", debouncedSearchQuery],
    queryFn: async () => {
      if (debouncedSearchQuery.length < 2) return { data: [] };

      const response = await (api as any).products.get({
        query: { search: debouncedSearchQuery }
      });
      return response.data;
    },
    enabled: debouncedSearchQuery.length >= 2,
  });

  useEffect(() => {
    if (searchData) {
      setSearchResults(searchData?.data || []);
      setIsSearchLoading(false);
    }
  }, [searchData]);

  // Category mapping helper
  const getCategoryFromAPI = (categoryName: string): Category | null => {
    if (!categoriesData?.data) return null;
    
    const mappings: Record<string, string> = {
      "Proteinler": "PROTEİN",
      "Spor Gıdaları": "SPOR GIDALARI", 
      "Sağlık": "SAĞLIK",
      "Gıda": "GIDA",
      "Vitamin": "VİTAMİN",
      "Tüm Ürünler": "PROTEİN",
    };

    const apiCategoryName = mappings[categoryName] || categoryName;
    let foundCategory = categoriesData.data.find(cat => cat.name === apiCategoryName);
    
    if (!foundCategory) {
      foundCategory = categoriesData.data.find(cat => 
        cat.name.toLowerCase() === apiCategoryName.toLowerCase() ||
        cat.name.toLowerCase() === categoryName.toLowerCase()
      );
    }
    
    if (!foundCategory) {
      foundCategory = categoriesData.data.find(cat => 
        cat.name.toLowerCase().includes(categoryName.toLowerCase()) ||
        categoryName.toLowerCase().includes(cat.name.toLowerCase())
      );
    }
    
    return foundCategory || null;
  };

  // Category hover handlers
  const handleCategoryMouseEnter = (categoryName: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }

    const category = getCategoryFromAPI(categoryName);
    if (category) {
      setHoveredCategory(categoryName);
      setActiveCategory(category);
    }
  };

  const handleCategoryMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
      setActiveCategory(null);
    }, 200);
    setCloseTimeout(timeout);
  };

  const handleDropdownMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const handleDropdownContainerMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
      setActiveCategory(null);
    }, 100);
    setCloseTimeout(timeout);
  };

  // Search handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchQuery(value);

    if (value.length >= 2) {
      setIsSearchLoading(true);
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
      setSearchResults([]);
    }
  };

  const handleSearchItemClick = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  // Click outside effect for search and scroll handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      
      if (categoryNavRef.current && !categoryNavRef.current.contains(event.target as Node)) {
        setHoveredCategory(null);
        setActiveCategory(null);
      }
    };

    const handleScroll = () => {
      setHoveredCategory(null);
      setActiveCategory(null);
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('scroll', handleScroll);
        if (closeTimeout) {
          clearTimeout(closeTimeout);
        }
      };
    }
    
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  return (
    <div 
      ref={categoryNavRef} 
      className="relative"
    >
      <nav
        className={cn(
          "bg-white md:bg-gray-900 text-white md:border-t md:border-gray-800",
          "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20",
          "py-0 md:py-3",
          "relative z-40",
          className,
        )}
        {...props}
      >
        <div className="hidden md:flex items-center justify-center relative z-50">
          <div className="w-full max-w-7xl mx-auto">
            <ul className="flex items-center justify-between w-full px-6 lg:px-8 xl:px-12 2xl:px-16">
              {categories.map((category) => (
                <CategoryItem
                  key={category}
                  category={category}
                  isHovered={hoveredCategory === category}
                  onMouseEnter={() => handleCategoryMouseEnter(category)}
                  onMouseLeave={handleCategoryMouseLeave}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <MobileSearchBar
          searchQuery={searchQuery}
          searchResults={searchResults}
          isSearchOpen={isSearchOpen}
          isSearchLoading={isSearchLoading}
          searchContainerRef={searchContainerRef}
          onSearchChange={handleSearchChange}
          onSearchFocus={() => searchQuery.length >= 2 && setIsSearchOpen(true)}
          onSearchItemClick={handleSearchItemClick}
          onCloseSearch={handleCloseSearch}
        />
      </nav>

      {/* Category Dropdown */}
      {activeCategory && hoveredCategory && (
        <div
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownContainerMouseLeave}
        >
          <CategoryDropdown
            category={activeCategory}
            isVisible={!!hoveredCategory}
            onClose={() => {
              setHoveredCategory(null);
              setActiveCategory(null);
              if (closeTimeout) {
                clearTimeout(closeTimeout);
                setCloseTimeout(null);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

CategoryNav.displayName = "CategoryNav"; 