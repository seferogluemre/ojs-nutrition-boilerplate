import { api } from "#lib/api.js";
import { cn } from "#lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import {
  CategoriesApiResponse,
  Category,
  CategoryNavigationProps,
  ChildCategory,
  PanelData,
  SubChildCategory
} from "./mobile-sidebar.types";

export const CategoryNavigation = ({ onClose }: CategoryNavigationProps) => {
  const router = useRouter();
  
  // Panel stack state - starts with main categories panel
  const [panelStack, setPanelStack] = useState<PanelData[]>([
    {
      level: 'main',
      title: 'Kategoriler',
      items: [],
    }
  ]);

  // Fetch categories from API
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await (api as any).categories.get();
      return response.data as CategoriesApiResponse;
    },
  });

  // Initialize main categories when data loads
  React.useEffect(() => {
    if (categoriesData?.data && panelStack.length === 1 && panelStack[0].items.length === 0) {
      setPanelStack([{
        level: 'main',
        title: 'Kategoriler',
        items: categoriesData.data,
      }]);
    }
  }, [categoriesData]);

  // Navigation functions
  const pushPanel = (newPanel: PanelData) => {
    setPanelStack(prev => [...prev, newPanel]);
  };

  const popPanel = () => {
    if (panelStack.length > 1) {
      setPanelStack(prev => prev.slice(0, -1));
    }
  };

  const navigateToCategory = (category: Category) => {
    const newPanel: PanelData = {
      level: 'category',
      title: category.name,
      items: category.children,
      parentId: category.id,
      parentData: category,
    };
    pushPanel(newPanel);
  };

  const navigateToSubcategory = (childCategory: ChildCategory) => {
    const newPanel: PanelData = {
      level: 'subcategory',
      title: childCategory.name,
      items: childCategory.sub_children,
      parentId: childCategory.id,
      parentData: childCategory,
    };
    pushPanel(newPanel);
  };



  const navigateToProductDetail = (productId: string) => {
    router.navigate({ 
      to: '/products/$productId', 
      params: { productId } 
    });
    onClose();
  };

  // Current panel is always the top of the stack
  const currentPanel = panelStack[panelStack.length - 1];

  // Main categories that should be displayed
  const allowedMainCategories = [
    "PROTEİN",
    "WHEY PROTEİN", 
    "SPOR GIDALAR",
    "SPOR GIDALARI",
    "SAĞLIK",
    "GIDA",
    "VİTAMİN",
    "VITAMIN"
  ];

  // Render functions for different panel levels
  const renderMainCategories = () => {
    // Filter categories to show only allowed main categories
    const filteredCategories = (currentPanel.items as Category[]).filter(category => 
      allowedMainCategories.some(allowed => 
        category.name.toUpperCase().includes(allowed.toUpperCase()) ||
        allowed.toUpperCase().includes(category.name.toUpperCase())
      )
    );

    return (
      <div className="space-y-1">
        {filteredCategories.map((category) => (
        <div key={category.id}>
          <button
            onClick={() => {
              if (category.children.length > 0 || category.top_sellers?.length > 0) {
                navigateToCategory(category);
              }
              // No action for categories without children and top_sellers
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
            {(category.children.length > 0 || category.top_sellers?.length > 0) && (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <div className="border-b border-gray-100" />
        </div>
      ))}
    </div>
    );
  };

  const navigateToProducts = (categoryId: string, categoryName: string) => {
    router.navigate({ 
      to: '/products', 
      search: { categoryId, categoryName }
    });
    onClose();
  };

  const renderSubCategories = () => {
    const currentItems = currentPanel.items as ChildCategory[];
    
    return (
      <div className="space-y-1">
        {/* If no children but has top_sellers, show a message */}
        {currentItems.length === 0 && (currentPanel.parentData as Category)?.top_sellers?.length > 0 && (
          <div className="px-6 py-4 text-center text-gray-600 bg-gray-50 mx-4 rounded-lg">
            <p className="text-sm">Bu kategoride alt kategoriler bulunmuyor.</p>
            <p className="text-xs mt-1">Aşağıda bu kategorinin çok satan ürünlerini görebilirsiniz.</p>
          </div>
        )}
        
        {/* Render SubCategories and their products */}
        {currentItems.map((childCategory) => (
          <div key={childCategory.id}>
            <button
              onClick={() => {
                if (childCategory.sub_children.length > 0) {
                  navigateToSubcategory(childCategory);
                } else {
                  // If no sub-children, navigate to products for this category
                  navigateToProducts(childCategory.id, childCategory.name);
                }
              }}
              className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="text-base font-medium text-gray-900">
                {childCategory.name}
              </span>
              {childCategory.sub_children.length > 0 ? (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              ) : (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Ürünleri Gör
                </span>
              )}
            </button>
            
            {/* Show products for this specific ChildCategory */}
            {childCategory.products && childCategory.products.length > 0 && (
              <div className="bg-blue-50 px-4 py-3 ml-6 mr-6 mb-2 rounded-lg">
                <h4 className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
                  {childCategory.name} Ürünleri
                </h4>
                <div className="space-y-2">
                  {childCategory.products.slice(0, 3).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => navigateToProductDetail(product.id)}
                      className="flex items-center space-x-3 w-full p-2 rounded-md hover:bg-white transition-colors duration-200"
                    >
                      <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        {product.picture_src && product.picture_src !== "null" ? (
                          <img 
                            src={`/images/${product.picture_src}`} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded"
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
                        <p className="text-xs text-blue-600 font-semibold">
                          ₺{product.price}
                        </p>
                      </div>
                    </button>
                  ))}
                  {childCategory.products.length > 3 && (
                    <button
                      onClick={() => navigateToProducts(childCategory.id, childCategory.name)}
                      className="text-xs text-blue-600 hover:text-blue-800 underline pl-2"
                    >
                      +{childCategory.products.length - 3} ürün daha...
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <div className="border-b border-gray-100" />
          </div>
        ))}
        
        {renderTopSellers()}
      </div>
    );
  };

  const renderSubSubCategories = () => (
    <div className="space-y-1">
      {(currentPanel.items as SubChildCategory[]).map((subChild) => (
        <div key={subChild.slug}>
          <button
            onClick={() => {
              navigateToProductDetail(subChild.id);
            }}
            className="flex items-center w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="text-base font-medium text-gray-900">
              {subChild.name}
            </span>
          </button>
          <div className="border-b border-gray-100" />
        </div>
      ))}
    </div>
  );

  const renderTopSellers = () => {
    const parentData = currentPanel.parentData as Category;
    if (!parentData?.top_sellers?.length) return null;

    return (
      <div className=" px-6 py-8 mt-12">
        <h3 className="text-xs text-center font-semibold text-gray-600 mb-3 uppercase tracking-wider">
          Çok Satanlar
        </h3>
        <div className="space-y-2">
          {parentData.top_sellers.map((product) => (
            <button
              key={product.id}
              onClick={() => navigateToProductDetail(product.id)}
              className="flex items-center space-x-3 w-full p-3 rounded-md shadow-sm hover:shadow-md hover:bg-white transition-shadow duration-200"
            >
              <div className="w-8 h-8  bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
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
    );
  };

  const renderCurrentPanel = () => {
    switch (currentPanel.level) {
      case 'main':
        return renderMainCategories();
      case 'category':
        return renderSubCategories();
      case 'subcategory':
        return renderSubSubCategories();
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-gray-500">Kategoriler yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden">
      {/* Sliding panels container */}
      <div className="relative h-full">
        {panelStack.map((panel, index) => (
          <div
            key={`${panel.level}-${panel.parentId || 'main'}-${index}`}
            className={cn(
              "absolute inset-0 bg-white transition-transform duration-300 ease-in-out",
              index === panelStack.length - 1 
                ? "translate-x-0" 
                : "-translate-x-full"
            )}
          >
            {/* Panel header */}
            <div className="flex items-center px-4 pt-1">
              {index > 0 && (
                <button
                  onClick={popPanel}
                  className="p-1 mr-3 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
             
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto">
              {index === panelStack.length - 1 && renderCurrentPanel()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 