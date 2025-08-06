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
  Product,
  SubChildCategory,
} from "./types";

export const CategoryNavigation = ({ onClose }: CategoryNavigationProps) => {
  const router = useRouter();

  // Panel stack state - starts with main categories panel
  const [panelStack, setPanelStack] = useState<PanelData[]>([
    {
      level: "main",
      title: "Kategoriler",
      items: [],
    },
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
    if (
      categoriesData?.data &&
      panelStack.length === 1 &&
      panelStack[0].items.length === 0
    ) {
      setPanelStack([
        {
          level: "main",
          title: "Kategoriler",
          items: categoriesData.data,
        },
      ]);
    }
  }, [categoriesData]);

  // Navigation functions
  const pushPanel = (newPanel: PanelData) => {
    setPanelStack((prev) => [...prev, newPanel]);
  };

  const popPanel = () => {
    if (panelStack.length > 1) {
      setPanelStack((prev) => prev.slice(0, -1));
    }
  };

  const navigateToCategory = (category: Category) => {
    const newPanel: PanelData = {
      level: "category",
      title: category.name,
      items: category.children,
      parentId: category.id,
      parentData: category,
    };
    pushPanel(newPanel);
  };

  const navigateToSubcategory = (childCategory: ChildCategory) => {
    const newPanel: PanelData = {
      level: "subcategory",
      title: childCategory.name,
      items: childCategory.sub_children,
      parentId: childCategory.id,
      parentData: childCategory,
    };
    pushPanel(newPanel);
  };

  const navigateToProductsPanel = (category: ChildCategory) => {
    const newPanel: PanelData = {
      level: "products",
      title: `${category.name} Ürünleri`,
      items: category.products || [],
      parentId: category.id,
      parentData: category,
    };
    pushPanel(newPanel);
  };

  const navigateToProductDetail = (productId: string) => {
    router.navigate({
      to: "/products/$productId",
      params: { productId },
    });
    onClose();
  };

  // Current panel is always the top of the stack
  const currentPanel = panelStack[panelStack.length - 1];

  const allowedMainCategories = [
    "PROTEİN",
    "WHEY PROTEİN",
    "SPOR GIDALAR",
    "SPOR GIDALARI",
    "SAĞLIK",
    "GIDA",
    "VİTAMİN",
    "VITAMIN",
  ];

  // Render functions for different panel levels
  const renderMainCategories = () => {
    // Filter categories to show only allowed main categories and non-empty ones
    const filteredCategories = (currentPanel.items as Category[]).filter(
      (category) => {
        // Check if category is in allowed list
        const isAllowed = allowedMainCategories.some(
          (allowed) =>
            category.name.toUpperCase().includes(allowed.toUpperCase()) ||
            allowed.toUpperCase().includes(category.name.toUpperCase()),
        );

        // Check if category has content (children or top_sellers)
        const hasContent =
          (category.children && category.children.length > 0) ||
          (category.top_sellers && category.top_sellers.length > 0);

        return isAllowed && hasContent;
      },
    );

    return (
      <div className="space-y-1">
        {filteredCategories.map((category) => (
          <div key={category.id}>
            <button
              onClick={() => {
                if (
                  category.children.length > 0 ||
                  category.top_sellers?.length > 0
                ) {
                  navigateToCategory(category);
                }
                // No action for categories without children and top_sellers
              }}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                {/* Category icon/image */}
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200">
                  <span className="text-xs font-medium text-gray-600">
                    {category.name.charAt(0)}
                  </span>
                </div>
                <span className="text-base font-medium text-gray-900">
                  {category.name}
                </span>
              </div>
              {(category.children.length > 0 ||
                category.top_sellers?.length > 0) && (
                <ChevronRight className="h-5 w-5 text-gray-400" />
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
      to: "/products",
      search: { categoryId, categoryName },
    });
    onClose();
  };

  const renderSubCategories = () => {
    const currentItems = currentPanel.items as ChildCategory[];

    // Filter out empty subcategories (no sub_children and no products)
    const filteredItems = currentItems.filter((childCategory) => {
      const hasSubChildren =
        childCategory.sub_children && childCategory.sub_children.length > 0;
      const hasProducts =
        childCategory.products && childCategory.products.length > 0;
      return hasSubChildren || hasProducts;
    });

    return (
      <div className="space-y-1">
        {/* If no children but has top_sellers, show a message */}
        {filteredItems.length === 0 &&
          (currentPanel.parentData as Category)?.top_sellers?.length > 0 && (
            <div className="mx-4 rounded-lg bg-gray-50 px-6 py-4 text-center text-gray-600">
              <p className="text-sm">
                Bu kategoride alt kategoriler bulunmuyor.
              </p>
              <p className="mt-1 text-xs">
                Aşağıda bu kategorinin çok satan ürünlerini görebilirsiniz.
              </p>
            </div>
          )}

        {/* Render SubCategories and their products */}
        {filteredItems.map((childCategory) => (
          <div key={childCategory.id}>
            <button
              onClick={() => {
                if (childCategory.sub_children.length > 0) {
                  // Has sub-children, navigate to subcategory panel
                  navigateToSubcategory(childCategory);
                } else if (
                  childCategory.products &&
                  childCategory.products.length > 0
                ) {
                  // No sub-children but has products, show products in sidebar
                  navigateToProductsPanel(childCategory);
                } else {
                  // No sub-children and no products, navigate to external products page
                  navigateToProducts(childCategory.id, childCategory.name);
                }
              }}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-gray-50"
            >
              <span className="text-base font-medium text-gray-900">
                {childCategory.name}
              </span>
              {(childCategory.sub_children.length > 0 ||
                (childCategory.products &&
                  childCategory.products.length > 0)) && (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>
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
            className="flex w-full items-center px-6 py-4 text-left transition-colors duration-200 hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <img
                src={subChild.picture_src}
                alt={subChild.name}
                className="h-8 w-8 rounded-md"
              />
              <span className="text-base font-medium text-gray-900">
                {subChild.name}
              </span>
            </div>
          </button>
          <div className="border-b border-gray-100" />
        </div>
      ))}
    </div>
  );

  const renderProducts = () => {
    const products = currentPanel.items as Product[];

    if (!products || products.length === 0) {
      return (
        <div className="px-6 py-8 text-center text-gray-500">
          <p className="text-sm">Bu kategoride ürün bulunamadı.</p>
        </div>
      );
    }

    return (
      <div className="space-y-1 px-4">
        {products.map((product) => (
          <div key={product.id}>
            <button
              onClick={() => navigateToProductDetail(product.id)}
              className="flex w-full items-center space-x-3 rounded-lg p-4 text-left transition-colors duration-200 hover:bg-gray-50"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200">
                {product.picture_src && product.picture_src !== "null" ? (
                  <img
                    src={product.picture_src}
                    alt={product.name}
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-xs font-medium text-gray-600">
                    {product.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium text-gray-900">
                  {product.name}
                </p>
              </div>
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderTopSellers = () => {
    const parentData = currentPanel.parentData as Category;
    if (!parentData?.top_sellers?.length) return null;

    return (
      <div className="mx-4 mt-6 rounded-lg bg-gray-50 px-6 py-4">
        <h3 className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
          Çok Satanlar
        </h3>
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {parentData.top_sellers.map((product) => (
            <button
              key={product.id}
              onClick={() => navigateToProductDetail(product.id)}
              className="flex w-full items-center space-x-3 rounded-md border border-gray-100 bg-white p-3 transition-colors duration-200 hover:bg-gray-100"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-gray-200">
                {product.picture_src && product.picture_src !== "null" ? (
                  <img
                    src={`/images/${product.picture_src}`}
                    alt={product.name}
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : (
                  <span className="text-xs font-medium text-gray-600">
                    {product.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-xs font-medium text-gray-900">
                  {product.name}
                </p>
                <p className="truncate text-xs text-gray-500">
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
      case "main":
        return renderMainCategories();
      case "category":
        return renderSubCategories();
      case "subcategory":
        return renderSubSubCategories();
      case "products":
        return renderProducts();
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
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
            key={`${panel.level}-${panel.parentId || "main"}-${index}`}
            className={cn(
              "absolute inset-0 bg-white transition-transform duration-300 ease-in-out",
              index === panelStack.length - 1
                ? "translate-x-0"
                : "-translate-x-full",
            )}
          >
            {/* Panel header */}
            <div className="flex items-center px-4 pt-1">
              {index > 0 && (
                <button
                  onClick={popPanel}
                  className="mr-3 rounded-md p-1 transition-colors hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
              )}
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto pb-4">
              {index === panelStack.length - 1 && renderCurrentPanel()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
