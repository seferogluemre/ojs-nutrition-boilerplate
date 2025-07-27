import { Main } from "#components/layout/main";
import { api } from "#lib/api.js";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ProductCard } from "./components/product-card";
import { Product } from "./data/mock-products";

export default function Products() {
  const mainCategory = useMemo(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('main_category');
    }
    return null;
  }, []);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.categories.get();
      return response.data;
    },
    enabled: false, // API'ye istek atma, sadece cache'den oku
  });

  const { data } = useQuery({
    queryKey: ["products", mainCategory],
    queryFn: async () => {
      const queryParams = mainCategory 
        ? { main_category: mainCategory } 
        : {};
        
      const response = await api.products.get({ 
        query: queryParams 
      });
      return response.data;
    },
  });

  const getCategoryTitle = (categoryId?: string | null) => {
    if (!categoryId) return "TÜM ÜRÜNLER";
    
    const category = categoriesData?.data?.find((cat: any) => cat.id === categoryId);
    return category?.name || "KATEGORİ ÜRÜNLERİ";
  };

  return (
    <Main>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold">
          {getCategoryTitle(mainCategory)}
        </h1>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {data?.data?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Main>
  );
}