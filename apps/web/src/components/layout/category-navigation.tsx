import { api } from "#lib/api.js";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  CategoriesApiResponse,
  CategoryNavigationProps,
  ExpandedState
} from "./mobile-sidebar.types";

export const CategoryNavigation = ({ onClose }: CategoryNavigationProps) => {
  const router = useRouter();
  
  // Expanded state for accordion navigation
  const [expandedState, setExpandedState] = useState<ExpandedState>({});

  // Fetch categories from API
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await (api as any).categories.get();
      return response.data as CategoriesApiResponse;
    },
  });

  // Navigation functions
  const toggleCategory = (categoryId: string) => {
    setExpandedState(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        isExpanded: !prev[categoryId]?.isExpanded,
      }
    }));
  };

  const toggleChildCategory = (categoryId: string, childId: string) => {
    setExpandedState(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        isExpanded: true,
        expandedChildren: {
          ...prev[categoryId]?.expandedChildren,
          [childId]: !prev[categoryId]?.expandedChildren?.[childId],
        }
      }
    }));
  };

  const navigateToProducts = (slug: string, name: string) => {
    // Navigate to products page with category filter
    router.navigate({ 
      to: '/products',
      search: { category: slug }
    });
    onClose();
  };

  const navigateToProductDetail = (productId: string) => {
    // Navigate to product detail page with correct product ID
    router.navigate({ 
      to: '/products/$productId', 
      params: { productId } 
    });
    onClose();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-gray-500">Kategoriler yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {/* Categories List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          {categoriesData?.data?.map((category) => (
            <div key={category.id}>
              {/* Main Category */}
              <button
                onClick={() => {
                  if (category.children.length > 0) {
                    toggleCategory(category.id);
                  } else {
                    navigateToProducts(category.slug, category.name);
                  }
                }}
                className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  {/* Category icon/image */}
                  <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-base font-medium text-gray-900">
                    {category.name}
                  </span>
                </div>
                {category.children.length > 0 && (
                  expandedState[category.id]?.isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )
                )}
              </button>
              
              {/* Expanded Children */}
              {expandedState[category.id]?.isExpanded && category.children.length > 0 && (
                <div className="bg-gray-50">
                  {category.children.map((child) => (
                    <div key={child.id}>
                      {/* Child Category */}
                      <button
                        onClick={() => {
                          if (child.sub_children.length > 0) {
                            toggleChildCategory(category.id, child.id);
                          } else {
                            navigateToProducts(child.slug, child.name);
                          }
                        }}
                        className="flex items-center justify-between w-full px-12 py-3 text-left hover:bg-gray-100 transition-colors duration-200"
                      >
                        <span className="text-sm font-medium text-gray-800">
                          {child.name}
                        </span>
                        {child.sub_children.length > 0 && (
                          expandedState[category.id]?.expandedChildren?.[child.id] ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )
                        )}
                      </button>
                      
                      {/* Expanded Sub Children */}
                      {expandedState[category.id]?.expandedChildren?.[child.id] && (
                        <div className="bg-gray-100">
                          {child.sub_children.map((subChild) => (
                            <button
                              key={subChild.slug}
                              onClick={() => navigateToProducts(subChild.slug, subChild.name)}
                              className="flex items-center w-full px-16 py-2 text-left hover:bg-gray-200 transition-colors duration-200"
                            >
                              <span className="text-sm text-gray-700">
                                {subChild.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Top Sellers for this category */}
                  {category.top_sellers?.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                      <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                        Çok Satanlar
                      </h3>
                      <div className="space-y-2">
                        {category.top_sellers.map((product) => (
                          <button
                            key={product.slug}
                            onClick={() => navigateToProductDetail(product.slug)}
                            className="flex items-center space-x-3 w-full p-2 rounded-md hover:bg-white transition-colors duration-200"
                          >
                            <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                              {product.picture_src && product.picture_src !== "null" ? (
                                <img 
                                  src={`/images/${product.picture_src}`} 
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <span className="text-xs font-medium text-gray-600">
                                  {product.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {product.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Divider */}
              <div className="border-b border-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 