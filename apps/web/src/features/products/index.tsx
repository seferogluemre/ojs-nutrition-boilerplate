import { Main } from "#components/layout/main";
import { api } from "#lib/api.js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { ProductCard } from "./components/product-card";
import { Product } from "./data/mock-products";

export default function Products() {
  const mainCategory = useMemo(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("main_category");
    }
    return null;
  }, []);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.categories.get();
      return response.data;
    },
    enabled: false, 
  });

  const { data } = useQuery({
    queryKey: ["products", mainCategory],
    queryFn: async () => {
      const queryParams = mainCategory ? { main_category: mainCategory } : {};

      const response = await api.products.get({
        query: queryParams,
      });
      return response.data;
    },
  });

  const getCategoryTitle = (categoryId?: string | null) => {
    if (!categoryId) return "TÜM ÜRÜNLER";

    const category = categoriesData?.data?.find(
      (cat: any) => cat.id === categoryId,
    );
    return category?.name || "KATEGORİ ÜRÜNLERİ";
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mainCategory]);

  return (
    <Main>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Category Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {getCategoryTitle(mainCategory)} 
          </h1>
        </div>

        {/* Products Grid - Desktop 4 columns, responsive */}
        <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {data?.data?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty state */}
        {(!data?.data || data?.data?.length === 0) && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Bu kategoride henüz ürün bulunmamaktadır.
            </p>
          </div>
        )}
      </div>
    </Main>
  );
}
