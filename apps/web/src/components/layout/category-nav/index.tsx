import type { CategoriesApiResponse, Category } from "#components/layout/mobile-sidebar/types";
import { SearchDropdown } from "#components/layout/search-dropdown";
import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { useDebounce } from "#hooks/use-debounce";
import { api } from "#lib/api.js";
import { cn } from "#lib/utils";
import { SearchProps } from "#types/search";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { ChevronDown, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface CategoryNavProps extends React.HTMLAttributes<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
}

interface CategoryDropdownProps {
  category: Category;
  isVisible: boolean;
  onClose: () => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ category, isVisible, onClose }) => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!isVisible) return null;

  const handleProductClick = (productId: string) => {
    router.navigate({ to: `/products/${productId}` });
    onClose();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dropdownRef.current) return;
    
    const rect = dropdownRef.current.getBoundingClientRect();
    const mouseY = e.clientY;
    const dropdownBottom = rect.bottom;
    
    // Kutunun altına 20px yaklaşınca kapat
    if (mouseY > dropdownBottom + 20) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop Overlay - only covers bottom area */}
      <div 
        className="fixed left-0 right-0 bottom-0 bg-transparent z-30"
        style={{ top: '60%' }}
        onMouseEnter={onClose}
      />
      
      {/* Dropdown Content */}
      <div 
        ref={dropdownRef}
        className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-300 rounded-xl shadow-2xl z-50 mt-2 w-[750px] overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Top safe zone for hover */}
        <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent"></div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sol kısım - Top Sellers */}
            {category.top_sellers && category.top_sellers.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-5 text-gray-900 border-b border-gray-200 pb-2">EN ÇOK SATANLAR</h3>
                <div className="space-y-3">
                  {category.top_sellers.map((product, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm border border-transparent hover:border-gray-200"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        {product.picture_src && product.picture_src !== "null" ? (
                          <img 
                            src={`/images/${product.picture_src}`} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors">{product.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{product.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sağ kısım - Alt Kategoriler */}
            {category.children && category.children.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-5 text-gray-900 border-b border-gray-200 pb-2">KATEGORİLER</h3>
                <div className="space-y-4">
                  {category.children.map((child) => (
                    <div key={child.id}>
                      <h4 className="font-semibold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer transition-colors">
                        {child.name}
                      </h4>
                      {child.sub_children && child.sub_children.length > 0 && (
                        <ul className="space-y-1 ml-4">
                          {child.sub_children.map((subChild, index) => (
                            <li key={index}>
                              <a 
                                href="#" 
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors block py-1.5 px-2 rounded cursor-pointer hover:bg-gray-50"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleProductClick(subChild.id);
                                }}
                              >
                                {subChild.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

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
    };

    const apiCategoryName = mappings[categoryName] || categoryName;
    return categoriesData.data.find(cat => cat.name === apiCategoryName) || null;
  };

  // Category hover handlers
  const handleCategoryMouseEnter = (categoryName: string) => {
    const category = getCategoryFromAPI(categoryName);
    if (category) {
      setHoveredCategory(categoryName);
      setActiveCategory(category);
    }
  };

  const handleDropdownContainerMouseLeave = () => {
    setHoveredCategory(null);
    setActiveCategory(null);
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
      
      // Close category dropdown when clicking outside
      if (categoryNavRef.current && !categoryNavRef.current.contains(event.target as Node)) {
        setHoveredCategory(null);
        setActiveCategory(null);
      }
    };

    const handleScroll = () => {
      // Close dropdown when scrolling
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
      };
    }
    
    return () => {};
  }, []);

  return (
    <div 
      ref={categoryNavRef} 
      className="relative"
      onMouseLeave={handleDropdownContainerMouseLeave}
    >
      <nav
        className={cn(
          // Desktop/Tablet: gri arkaplan, Mobile: beyaz arkaplan
          "bg-white md:bg-gray-900 text-white md:border-t md:border-gray-800",
          // Header ile aynı padding değerleri
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
                <li 
                  key={category}
                  onMouseEnter={() => handleCategoryMouseEnter(category)}
                  className="relative z-50"
                >
                  <a
                    href="#"
                    className="text-white hover:text-gray-300 transition-colors duration-200 font-medium text-sm lg:text-base whitespace-nowrap py-2 relative z-50 flex items-center space-x-1"
                  >
                    <span>{category}</span>
                    <ChevronDown 
                      className={`w-3 h-3 transition-transform duration-300 ${
                        hoveredCategory === category ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Search Bar - 768px altı */}
        <div className="md:hidden bg-white px-4">
          <div className="relative" ref={searchContainerRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 rounded-xxl" />
            <Input
              type="text"
              placeholder="ARADIĞINIZ ÜRÜNÜ YAZINIZ..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.length >= 2 && setIsSearchOpen(true)}
              className="w-full pl-10 pr-16 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              size="lg"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 h-6 text-xs"
            >
              ARA
            </Button>
            
            <SearchDropdown
              items={searchResults}
              isLoading={isSearchLoading}
              isOpen={isSearchOpen}
              onItemClick={handleSearchItemClick}
              onClose={handleCloseSearch}
            />
          </div>
        </div>
      </nav>

      {/* Category Dropdown */}
      {activeCategory && hoveredCategory && (
        <CategoryDropdown
          category={activeCategory}
          isVisible={!!hoveredCategory}
          onClose={() => {
            setHoveredCategory(null);
            setActiveCategory(null);
          }}
        />
      )}
    </div>
  );
};

CategoryNav.displayName = "CategoryNav"; 